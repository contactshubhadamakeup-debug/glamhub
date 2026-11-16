// src/clients/clients.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.service';

export interface UpdateClientDto {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
}

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async getClients(user: AuthenticatedUser, page = 1, limit = 20) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const [clients, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        where: { professionalId: profile.id, deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { bookings: true },
          },
        },
      }),
      this.prisma.client.count({
        where: { professionalId: profile.id, deletedAt: null },
      }),
    ]);

    return { clients, total, page, limit };
  }

  async getClient(user: AuthenticatedUser, clientId: string) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!client || client.professionalId !== profile.id) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async updateClient(user: AuthenticatedUser, clientId: string, dto: UpdateClientDto) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client || client.professionalId !== profile.id) {
      throw new NotFoundException('Client not found');
    }

    return this.prisma.client.update({
      where: { id: clientId },
      data: dto,
    });
  }
}