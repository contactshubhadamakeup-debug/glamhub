// src/payments/payments.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService, PaymentStatus } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.service';

export interface CreatePaymentDto {
  invoiceId: string;
  gateway: string;
  gatewayPaymentId: string;
  amount: number;
  currency?: string;
  gatewayResponse?: any;
}

export interface WebhookPaymentDto {
  gateway: string;
  gatewayPaymentId: string;
  status: PaymentStatus;
  amount: number;
  gatewayResponse?: any;
}

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async getPayments(user: AuthenticatedUser, page = 1, limit = 20) {
    let where: any = { deletedAt: null };

    if (user.role === 'PROFESSIONAL' || user.role === 'STUDIO_OWNER') {
      const profile = await this.prisma.professionalProfile.findUnique({
        where: { userId: user.id },
      });
      if (!profile) {
        throw new NotFoundException('Professional profile not found');
      }
      where.professionalId = profile.id;
    } else if (user.role === 'CLIENT') {
      const client = await this.prisma.client.findUnique({
        where: { userId: user.id },
      });
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      where.clientId = client.id;
    } else if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Insufficient permissions');
    }

    const [payments, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          invoice: true,
          booking: true,
          client: {
            select: { name: true, email: true },
          },
          professional: {
            select: { businessName: true },
          },
        },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { payments, total, page, limit };
  }

  async getPayment(user: AuthenticatedUser, paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        invoice: true,
        booking: true,
        client: true,
        professional: true,
      },
    });

    if (!payment || payment.deletedAt) {
      throw new NotFoundException('Payment not found');
    }

    if (user.role === 'PROFESSIONAL' || user.role === 'STUDIO_OWNER') {
      const profile = await this.prisma.professionalProfile.findUnique({
        where: { userId: user.id },
      });
      if (payment.professionalId !== profile?.id) {
        throw new ForbiddenException('You can only access your own payments');
      }
    } else if (user.role === 'CLIENT') {
      const client = await this.prisma.client.findUnique({
        where: { userId: user.id },
      });
      if (payment.clientId !== client?.id) {
        throw new ForbiddenException('You can only access your own payments');
      }
    }

    return payment;
  }

  async createPayment(user: AuthenticatedUser, dto: CreatePaymentDto) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.userId !== user.id) {
      throw new ForbiddenException('You can only create payments for your own profile');
    }

    const invoice = await this.prisma.invoice.findUnique({
      where: { id: dto.invoiceId },
    });

    if (!invoice || invoice.professionalId !== profile.id) {
      throw new NotFoundException('Invoice not found');
    }

    const existing = await this.prisma.payment.findUnique({
      where: { gatewayPaymentId: dto.gatewayPaymentId },
    });

    if (existing) {
      throw new BadRequestException('Payment already exists (idempotent check)');
    }

    const payment = await this.prisma.payment.create({
      data: {
        ...dto,
        professionalId: profile.id,
        clientId: invoice.clientId,
        currency: dto.currency || 'INR',
        status: PaymentStatus.PENDING,
      },
      include: {
        invoice: true,
      },
    });

    return payment;
  }

  async processWebhook(dto: WebhookPaymentDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { gatewayPaymentId: dto.gatewayPaymentId },
      include: {
        invoice: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status === PaymentStatus.SUCCEEDED) {
      return payment; // Idempotent: already processed
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: dto.status,
        gatewayResponse: dto.gatewayResponse,
      },
    });

    if (dto.status === PaymentStatus.SUCCEEDED && payment.invoiceId) {
      await this.prisma.invoice.update({
        where: { id: payment.invoiceId },
        data: {
          status: 'paid',
          paidAt: new Date(),
        },
      });
    }

    return updatedPayment;
  }

  async getAllPayments(user: AuthenticatedUser, page = 1, limit = 20) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can view all payments');
    }

    const [payments, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { name: true, email: true } },
          professional: { select: { businessName: true } },
          invoice: true,
        },
      }),
      this.prisma.payment.count({ where: { deletedAt: null } }),
    ]);

    return { payments, total, page, limit };
  }
}