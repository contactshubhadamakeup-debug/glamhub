// src/onboarding/onboarding.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.service';

export interface UpdateProfessionalProfileDto {
  businessName?: string;
  category?: string;
  city?: string;
  bio?: string;
  phone?: string;
  website?: string;
  instagramHandle?: string;
}

export interface CreateServiceDto {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  categoryId: string;
}

export interface CreatePortfolioItemDto {
  title: string;
  description?: string;
  imageUrl: string;
  imageThumbUrl?: string;
  price?: number;
  durationMinutes?: number;
  categoryId: string;
}

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  async getProfessionalProfile(user: AuthenticatedUser) {
    if (user.role !== 'PROFESSIONAL' && user.role !== 'STUDIO_OWNER') {
      throw new ForbiddenException('Only professionals can access this endpoint');
    }

    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
      include: {
        services: true,
        portfolioItems: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    return profile;
  }

  async updateProfessionalProfile(user: AuthenticatedUser, dto: UpdateProfessionalProfileDto) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    if (profile.userId !== user.id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return this.prisma.professionalProfile.update({
      where: { id: profile.id },
      data: dto,
    });
  }

  async createService(user: AuthenticatedUser, dto: CreateServiceDto) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.userId !== user.id) {
      throw new ForbiddenException('You can only create services for your own profile');
    }

    return this.prisma.service.create({
      data: {
        ...dto,
        professionalId: profile.id,
      },
    });
  }

  async getServices(user: AuthenticatedUser) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    return this.prisma.service.findMany({
      where: { professionalId: profile.id, deletedAt: null },
    });
  }

  async createPortfolioItem(user: AuthenticatedUser, dto: CreatePortfolioItemDto) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.userId !== user.id) {
      throw new ForbiddenException('You can only create portfolio items for your own profile');
    }

    return this.prisma.portfolioItem.create({
      data: {
        ...dto,
        professionalId: profile.id,
      },
    });
  }

  async getPortfolioItems(user: AuthenticatedUser) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    return this.prisma.portfolioItem.findMany({
      where: { professionalId: profile.id, deletedAt: null },
    });
  }

  async completeOnboarding(user: AuthenticatedUser) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.userId !== user.id) {
      throw new ForbiddenException('You can only complete onboarding for your own profile');
    }

    return this.prisma.professionalProfile.update({
      where: { id: profile.id },
      data: { isApproved: false }, // Pending admin approval
    });
  }
}