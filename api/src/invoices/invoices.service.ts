// src/invoices/invoices.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.service';

export interface UpdateInvoiceStatusDto {
  status: string;
  paidAt?: Date;
}

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async getInvoices(user: AuthenticatedUser, page = 1, limit = 20) {
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
    }

    const [invoices, total] = await this.prisma.$transaction([
      this.prisma.invoice.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: true,
          professional: true,
          payments: true,
        },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return { invoices, total, page, limit };
  }

  async getInvoice(user: AuthenticatedUser, invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        client: true,
        professional: true,
        payments: true,
        quote: true,
      },
    });

    if (!invoice || invoice.deletedAt) {
      throw new NotFoundException('Invoice not found');
    }

    if (user.role === 'PROFESSIONAL' || user.role === 'STUDIO_OWNER') {
      const profile = await this.prisma.professionalProfile.findUnique({
        where: { userId: user.id },
      });
      if (invoice.professionalId !== profile?.id) {
        throw new ForbiddenException('You can only access your own invoices');
      }
    } else if (user.role === 'CLIENT') {
      const client = await this.prisma.client.findUnique({
        where: { userId: user.id },
      });
      if (invoice.clientId !== client?.id) {
        throw new ForbiddenException('You can only access your own invoices');
      }
    }

    return invoice;
  }

  async updateInvoiceStatus(user: AuthenticatedUser, invoiceId: string, dto: UpdateInvoiceStatusDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice || invoice.deletedAt) {
      throw new NotFoundException('Invoice not found');
    }

    if (user.role === 'PROFESSIONAL' || user.role === 'STUDIO_OWNER') {
      const profile = await this.prisma.professionalProfile.findUnique({
        where: { userId: user.id },
      });
      if (invoice.professionalId !== profile?.id) {
        throw new ForbiddenException('You can only update your own invoices');
      }
    } else {
      throw new ForbiddenException('Only professionals can update invoice status');
    }

    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: dto.status,
        paidAt: dto.status === 'paid' ? dto.paidAt || new Date() : null,
      },
    });
  }
}