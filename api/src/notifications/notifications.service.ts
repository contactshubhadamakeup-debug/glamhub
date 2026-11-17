// src/notifications/notifications.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.service';

export interface SendEmailDto {
  to: string;
  subject: string;
  body: string;
  template?: string;
  templateData?: any;
}

export interface SendWhatsAppDto {
  to: string;
  message: string;
  template?: string;
  templateData?: any;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  whatsappNotifications: boolean;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async sendEmail(dto: SendEmailDto) {
    // In production, this integrates with Resend or SendGrid
    // Test mode: log the email instead of sending
    console.log(`[EMAIL TEST MODE] To: ${dto.to} | Subject: ${dto.subject} | Body: ${dto.body}`);

    // Store notification record
    return {
      id: `email_${Date.now()}`,
      to: dto.to,
      subject: dto.subject,
      status: 'sent_test_mode',
      sentAt: new Date(),
    };
  }

  async sendWhatsApp(dto: SendWhatsAppDto) {
    // In production, this integrates with WhatsApp Business Cloud API
    // Test mode: log the message instead of sending
    console.log(`[WHATSAPP TEST MODE] To: ${dto.to} | Message: ${dto.message}`);

    return {
      id: `whatsapp_${Date.now()}`,
      to: dto.to,
      message: dto.message,
      status: 'sent_test_mode',
      sentAt: new Date(),
    };
  }

  async sendBookingConfirmation(
    user: AuthenticatedUser,
    bookingId: string,
  ) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.userId !== user.id) {
      throw new ForbiddenException('You can only send notifications for your own bookings');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: true,
        service: true,
      },
    });

    if (!booking || booking.professionalId !== profile.id) {
      throw new NotFoundException('Booking not found');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: booking.clientId },
      include: { user: true },
    });

    // Email to professional
    await this.sendEmail({
      to: profile.userId ? '' : '', // Would get email from user table
      subject: `New Booking: ${booking.service?.name}`,
      body: `You have a new booking from ${client?.name} for ${booking.service?.name} on ${booking.startTime}`,
    });

    // WhatsApp to professional (if opted in)
    await this.sendWhatsApp({
      to: profile.phone || '',
      message: `New booking: ${booking.service?.name} on ${booking.startTime} from ${client?.name}`,
    });

    return { success: true, bookingId };
  }

  async sendEnquiryNotification(
    user: AuthenticatedUser,
    leadId: string,
  ) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.userId !== user.id) {
      throw new ForbiddenException('You can only send notifications for your own leads');
    }

    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead || lead.professionalId !== profile.id) {
      throw new NotFoundException('Lead not found');
    }

    await this.sendEmail({
      to: '', // Professional email
      subject: `New Enquiry from ${lead.clientName}`,
      body: `You have a new enquiry from ${lead.clientName} (${lead.clientEmail}) regarding ${lead.serviceInterest || 'services'}.`,
    });

    await this.sendWhatsApp({
      to: profile.phone || '',
      message: `New enquiry from ${lead.clientName}: ${lead.message}`,
    });

    return { success: true, leadId };
  }

  async sendInvoiceReminder(
    user: AuthenticatedUser,
    invoiceId: string,
  ) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.userId !== user.id) {
      throw new ForbiddenException('You can only send notifications for your own invoices');
    }

    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { client: true },
    });

    if (!invoice || invoice.professionalId !== profile.id) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status !== 'unpaid') {
      throw new BadRequestException('Invoice is not unpaid');
    }

    await this.sendEmail({
      to: invoice.client.email,
      subject: `Invoice Reminder: ${invoice.amount} due`,
      body: `Your invoice for ${invoice.amount} ${invoice.currency} is due on ${invoice.dueDate}. Please pay to avoid service interruption.`,
    });

    await this.sendWhatsApp({
      to: invoice.client.phone || '',
      message: `Invoice reminder: ${invoice.amount} ${invoice.currency} due on ${invoice.dueDate}.`,
    });

    return { success: true, invoiceId };
  }

  async getNotificationPreferences(user: AuthenticatedUser): Promise<NotificationPreferences> {
    // In production, this would be stored in a preferences table
    // For now, return defaults
    return {
      emailNotifications: true,
      whatsappNotifications: false, // Default off, user must opt in
    };
  }

  async updateNotificationPreferences(
    user: AuthenticatedUser,
    prefs: NotificationPreferences,
  ): Promise<NotificationPreferences> {
    // In production, save to preferences table
    return prefs;
  }
}