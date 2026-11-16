// src/ai/ai.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.service';

export interface DraftReplyDto {
  enquiryId: string;
  clientMessage: string;
  serviceInterest?: string;
}

export interface DraftReplyResult {
  suggestedReply: string;
  confidence: number;
  fallback: boolean;
}

export interface LeadScoreResult {
  leadId: string;
  score: number;
  factors: string[];
}

export interface FollowUpSuggestion {
  quoteId: string;
  clientName: string;
  daysSinceQuote: number;
  suggestedMessage: string;
}

export interface AnalyticsInsights {
  bookingTrends: Array<{ date: string; count: number }>;
  revenueByService: Array<{ service: string; revenue: number }>;
  clientRetentionRate: number;
  leadConversionRate: number;
  totalBookings: number;
  totalRevenue: number;
}

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async draftReply(
    user: AuthenticatedUser,
    dto: DraftReplyDto,
  ): Promise<DraftReplyResult> {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.userId !== user.id) {
      throw new ForbiddenException('You can only draft replies for your own enquiries');
    }

    const lead = await this.prisma.lead.findUnique({
      where: { id: dto.enquiryId },
    });

    if (!lead || lead.professionalId !== profile.id) {
      throw new NotFoundException('Enquiry not found');
    }

    // AI only suggests - never auto-sends
    // In production, this would call Claude API with minimum data
    // For now, return a template-based suggestion with fallback
    const suggestedReply = this.generateTemplateReply(dto, lead);
    const confidence = 0.7;
    const fallback = true; // Set to false when Claude API is integrated

    return {
      suggestedReply,
      confidence,
      fallback,
    };
  }

  private generateTemplateReply(dto: DraftReplyDto, lead: any): string {
    const serviceRef = dto.serviceInterest ? ` for ${dto.serviceInterest}` : '';
    return `Hello ${lead.clientName},\n\nThank you for your enquiry${serviceRef}. I've received your message and will get back to you shortly with more details.\n\nBest regards,\n${lead.professionalId ? 'Your Professional' : 'The Team'}`;
  }

  async scoreLead(
    user: AuthenticatedUser,
    leadId: string,
  ): Promise<LeadScoreResult> {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.userId !== user.id) {
      throw new ForbiddenException('You can only score leads for your own profile');
    }

    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead || lead.professionalId !== profile.id) {
      throw new NotFoundException('Lead not found');
    }

    // Simple heuristic scoring (AI enhancement later)
    let score = 50;
    const factors: string[] = [];

    if (lead.serviceInterest) {
      score += 15;
      factors.push('Service interest specified');
    }

    if (lead.clientPhone) {
      score += 10;
      factors.push('Phone number provided');
    }

    if (lead.message && lead.message.length > 50) {
      score += 15;
      factors.push('Detailed message provided');
    }

    if (lead.clientEmail) {
      score += 10;
      factors.push('Email provided');
    }

    score = Math.min(100, Math.max(0, score));

    // Update lead score in DB
    await this.prisma.lead.update({
      where: { id: leadId },
      data: { score },
    });

    return { leadId, score, factors };
  }

  async getFollowUpSuggestions(
    user: AuthenticatedUser,
  ): Promise<FollowUpSuggestion[]> {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.userId !== user.id) {
      throw new ForbiddenException('You can only view follow-ups for your own profile');
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const quotes = await this.prisma.quote.findMany({
      where: {
        professionalId: profile.id,
        status: 'sent',
        createdAt: { lt: sevenDaysAgo },
        deletedAt: null,
      },
      include: {
        client: true,
      },
    });

    return quotes.map((q) => {
      const daysSinceQuote = Math.floor(
        (Date.now() - q.createdAt.getTime()) / (1000 * 60 * 60 * 24),
      );

      return {
        quoteId: q.id,
        clientName: q.client.name,
        daysSinceQuote,
        suggestedMessage: `Hi ${q.client.name}, I'm following up on the quote I sent you ${daysSinceQuote} days ago. Do you have any questions or would you like to proceed?`,
      };
    });
  }

  async getAnalyticsInsights(
    user: AuthenticatedUser,
  ): Promise<AnalyticsInsights> {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.userId !== user.id) {
      throw new ForbiddenException('You can only view analytics for your own profile');
    }

    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const bookings = await this.prisma.booking.findMany({
      where: {
        professionalId: profile.id,
        deletedAt: null,
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const payments = await this.prisma.payment.findMany({
      where: {
        professionalId: profile.id,
        deletedAt: null,
        status: 'SUCCEEDED',
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const leads = await this.prisma.lead.findMany({
      where: {
        professionalId: profile.id,
        deletedAt: null,
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const totalBookings = bookings.length;
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const convertedLeads = leads.filter((l) => l.status === 'booked').length;
    const leadConversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0;

    // Client retention: clients with more than one booking
    const clientBookingCounts = new Map<string, number>();
    bookings.forEach((b) => {
      clientBookingCounts.set(b.clientId, (clientBookingCounts.get(b.clientId) || 0) + 1);
    });
    const repeatClients = Array.from(clientBookingCounts.values()).filter((c) => c > 1).length;
    const totalClients = clientBookingCounts.size;
    const clientRetentionRate = totalClients > 0 ? (repeatClients / totalClients) * 100 : 0;

    // Booking trends (last 7 days)
    const bookingTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = bookings.filter(
        (b) => b.createdAt.toISOString().split('T')[0] === dateStr,
      ).length;
      bookingTrends.push({ date: dateStr, count });
    }

    // Revenue by service
    const serviceRevenue = new Map<string, number>();
    const bookingsWithServices = await this.prisma.booking.findMany({
      where: {
        professionalId: profile.id,
        deletedAt: null,
        status: 'COMPLETED',
      },
      include: { service: true },
    });
    bookingsWithServices.forEach((b) => {
      if (b.service) {
        serviceRevenue.set(
          b.service.name,
          (serviceRevenue.get(b.service.name) || 0) + b.totalAmount,
        );
      }
    });

    const revenueByService = Array.from(serviceRevenue.entries()).map(
      ([service, revenue]) => ({ service, revenue }),
    );

    return {
      bookingTrends,
      revenueByService,
      clientRetentionRate: Math.round(clientRetentionRate * 100) / 100,
      leadConversionRate: Math.round(leadConversionRate * 100) / 100,
      totalBookings,
      totalRevenue,
    };
  }
}