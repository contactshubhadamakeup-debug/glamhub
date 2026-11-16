// src/search/search.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SearchResult {
  id: string;
  businessName: string;
  category: string;
  city: string;
  rating: number;
  totalReviews: number;
  imageUrl?: string;
}

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchProfessionals(
    category?: string,
    city?: string,
    page = 1,
    limit = 20,
  ) {
    const where: any = {
      deletedAt: null,
      isApproved: true,
      isSuspended: false,
    };

    if (category) {
      where.category = category;
    }

    if (city) {
      where.city = city;
    }

    const [professionals, total] = await this.prisma.$transaction([
      this.prisma.professionalProfile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ rating: 'desc' }, { totalReviews: 'desc' }],
        include: {
          portfolioItems: {
            where: { deletedAt: null, isFeatured: true },
            take: 1,
            select: { imageUrl: true },
          },
          category: true,
        },
      }),
      this.prisma.professionalProfile.count({ where }),
    ]);

    const results: SearchResult[] = professionals.map((p) => ({
      id: p.id,
      businessName: p.businessName,
      category: p.category,
      city: p.city,
      rating: p.rating,
      totalReviews: p.totalReviews,
      imageUrl: p.portfolioItems[0]?.imageUrl,
    }));

    return { results: results, total, page, limit };
  }

  async getCategories() {
    return this.prisma.category.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getCities() {
    const cities = await this.prisma.professionalProfile.findMany({
      where: { deletedAt: null, isApproved: true, isSuspended: false },
      select: { city: true },
      distinct: ['city'],
    });
    return cities.map((c) => c.city).sort();
  }
}