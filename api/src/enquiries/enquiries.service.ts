// src/enquiries/enquiries.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.service';

export interface CreateEnquiryDto {
  professionalId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceInterest?: string;
  message: string;
}

@Injectable()
export class EnquiriesService {
  constructor(private prisma: PrismaService) {}

  async createEnquiry(dto: CreateEnquiryDto, user?: AuthenticatedUser) {
    const professional = await this.prisma.professionalProfile.findUnique({
      where: { id: dto.professionalId },
    });

    if (!professional || professional.deletedAt || !professional.isApproved) {
      throw new NotFoundException('Professional not found');
    }

    let clientId: string | undefined;

    if (user && user.role === 'CLIENT') {
      const client = await this.prisma.client.findUnique({
        where: { userId: user.id },
      });
      clientId = client?.id;
    }

    const enquiry = await this.prisma.lead.create({
      data: {
        professionalId: dto.professionalId,
        clientName: dto.clientName,
        clientEmail: dto.clientEmail,
        clientPhone: dto.clientPhone,
        serviceInterest: dto.serviceInterest,
        message: dto.message,
        status: 'new',
        score: 0,
      },
      include: {
        professional: {
          select: { businessName: true, email: true },
        },
      },
    });

    return enquiry;
  }

  async getEnquiries(user: AuthenticatedUser, page = 1, limit = 20) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const [enquiries, total] = await this.prisma.$transaction([
      this.prisma.lead.findMany({
        where: { professionalId: profile.id, deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lead.count({
        where: { professionalId: profile.id, deletedAt: null },
      }),
    ]);

    return { enquiries, total, page, limit };
  }
}