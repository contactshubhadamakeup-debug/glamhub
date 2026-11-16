// src/leads/leads.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.service';

export interface CreateLeadDto {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceInterest?: string;
  message?: string;
}

export interface UpdateLeadDto {
  status?: string;
  notes?: string;
}

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async createLead(user: AuthenticatedUser, dto: CreateLeadDto) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.userId !== user.id) {
      throw new ForbiddenException('You can only create leads for your own profile');
    }

    return this.prisma.lead.create({
      data: {
        ...dto,
        professionalId: profile.id,
        status: 'new',
        score: 0,
      },
    });
  }

  async getLeads(user: AuthenticatedUser, page = 1, limit = 20) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const [leads, total] = await this.prisma.$transaction([
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

    return { leads, total, page, limit };
  }

  async getLead(user: AuthenticatedUser, leadId: string) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead || lead.professionalId !== profile.id) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async updateLead(user: AuthenticatedUser, leadId: string, dto: UpdateLeadDto) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead || lead.professionalId !== profile.id) {
      throw new NotFoundException('Lead not found');
    }

    return this.prisma.lead.update({
      where: { id: leadId },
      data: dto,
    });
  }
}