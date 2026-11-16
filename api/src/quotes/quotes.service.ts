// src/quotes/quotes.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.service';

export interface CreateQuoteDto {
  title: string;
  description?: string;
  amount: number;
  clientId: string;
  leadId?: string;
  validUntil?: Date;
}

export interface UpdateQuoteStatusDto {
  status: string;
}

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async createQuote(user: AuthenticatedUser, dto: CreateQuoteDto) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.userId !== user.id) {
      throw new ForbiddenException('You can only create quotes for your own profile');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId },
    });

    if (!client || client.professionalId !== profile.id) {
      throw new NotFoundException('Client not found');
    }

    return this.prisma.quote.create({
      data: {
        ...dto,
        professionalId: profile.id,
        status: 'draft',
      },
    });
  }

  async getQuotes(user: AuthenticatedUser, page = 1, limit = 20) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const [quotes, total] = await this.prisma.$transaction([
      this.prisma.quote.findMany({
        where: { professionalId: profile.id, deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: true,
          lead: true,
        },
      }),
      this.prisma.quote.count({
        where: { professionalId: profile.id, deletedAt: null },
      }),
    ]);

    return { quotes, total, page, limit };
  }

  async getQuote(user: AuthenticatedUser, quoteId: string) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const quote = await this.prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        client: true,
        lead: true,
        invoices: true,
      },
    });

    if (!quote || quote.professionalId !== profile.id) {
      throw new NotFoundException('Quote not found');
    }

    return quote;
  }

  async updateQuoteStatus(user: AuthenticatedUser, quoteId: string, dto: UpdateQuoteStatusDto) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const quote = await this.prisma.quote.findUnique({
      where: { id: quoteId },
    });

    if (!quote || quote.professionalId !== profile.id) {
      throw new NotFoundException('Quote not found');
    }

    return this.prisma.quote.update({
      where: { id: quoteId },
      data: { status: dto.status },
    });
  }
}