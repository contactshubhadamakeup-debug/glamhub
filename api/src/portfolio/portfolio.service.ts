// src/portfolio/portfolio.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.service';

export interface CreatePortfolioItemDto {
  title: string;
  description?: string;
  imageUrl: string;
  imageThumbUrl?: string;
  price?: number;
  durationMinutes?: number;
  categoryId: string;
}

export interface UpdatePortfolioItemDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageThumbUrl?: string;
  price?: number;
  durationMinutes?: number;
  categoryId?: string;
  isFeatured?: boolean;
}

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async getPublicPortfolios(category?: string, city?: string, page = 1, limit = 20) {
    const where: any = {
      deletedAt: null,
      isFeatured: false,
      professional: {
        deletedAt: null,
        isApproved: true,
        isSuspended: false,
      },
    };

    if (category) {
      where.categoryId = category;
    }

    if (city) {
      where.professional.city = city;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.portfolioItem.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          professional: {
            include: {
              user: true,
              services: {
                where: { deletedAt: null, isActive: true },
                take: 5,
              },
            },
          },
          category: true,
        },
      }),
      this.prisma.portfolioItem.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async getPublicPortfolio(id: string) {
    const item = await this.prisma.portfolioItem.findUnique({
      where: { id },
      include: {
        professional: {
          include: {
            user: true,
            services: {
              where: { deletedAt: null, isActive: true },
            },
            reviews: {
              where: { status: 'APPROVED', deletedAt: null },
              include: {
                client: {
                  select: { name: true },
                },
              },
              orderBy: { createdAt: 'desc' },
              take: 10,
            },
          },
          category: true,
        },
      },
    });

    if (!item || item.deletedAt || !item.professional.isApproved || item.professional.isSuspended) {
      throw new NotFoundException('Portfolio not found');
    }

    return item;
  }

  async getProfessionalPortfolio(user: AuthenticatedUser, page = 1, limit = 20) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.portfolioItem.findMany({
        where: { professionalId: profile.id, deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.portfolioItem.count({
        where: { professionalId: profile.id, deletedAt: null },
      }),
    ]);

    return { items, total, page, limit };
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

  async updatePortfolioItem(user: AuthenticatedUser, id: string, dto: UpdatePortfolioItemDto) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const item = await this.prisma.portfolioItem.findUnique({
      where: { id },
    });

    if (!item || item.professionalId !== profile.id) {
      throw new NotFoundException('Portfolio item not found');
    }

    return this.prisma.portfolioItem.update({
      where: { id },
      data: dto,
    });
  }

  async deletePortfolioItem(user: AuthenticatedUser, id: string) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const item = await this.prisma.portfolioItem.findUnique({
      where: { id },
    });

    if (!item || item.professionalId !== profile.id) {
      throw new NotFoundException('Portfolio item not found');
    }

    return this.prisma.portfolioItem.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}