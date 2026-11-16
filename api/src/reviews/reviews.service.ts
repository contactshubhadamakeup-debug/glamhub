// src/reviews/reviews.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService, ReviewStatus } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.service';

export interface CreateReviewDto {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}

export interface CreateReviewReplyDto {
  reply: string;
}

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(user: AuthenticatedUser, dto: CreateReviewDto) {
    const client = await this.prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { reviews: true },
    });

    if (!booking || booking.deletedAt) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.clientId !== client.id) {
      throw new ForbiddenException('You can only review your own bookings');
    }

    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException('Reviews are only allowed after completed bookings');
    }

    if (booking.reviews && booking.reviews.length > 0) {
      throw new BadRequestException('A review already exists for this booking');
    }

    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const review = await this.prisma.review.create({
      data: {
        professionalId: booking.professionalId,
        clientId: client.id,
        bookingId: dto.bookingId,
        rating: dto.rating,
        comment: dto.comment,
        status: 'PENDING',
      },
      include: {
        client: {
          select: { name: true },
        },
      },
    });

    return review;
  }

  async getProfessionalReviews(
    professionalId: string,
    page = 1,
    limit = 20,
  ) {
    const [reviews, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where: {
          professionalId,
          status: 'APPROVED',
          deletedAt: null,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: { name: true },
          },
          replies: {
            include: {
              professional: {
                select: { businessName: true },
              },
            },
          },
        },
      }),
      this.prisma.review.count({
        where: {
          professionalId,
          status: 'APPROVED',
          deletedAt: null,
        },
      }),
    ]);

    return { reviews, total, page, limit };
  }

  async getPendingReviews(user: AuthenticatedUser, page = 1, limit = 20) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const [reviews, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where: {
          professionalId: profile.id,
          status: 'PENDING',
          deletedAt: null,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: { name: true },
          },
        },
      }),
      this.prisma.review.count({
        where: {
          professionalId: profile.id,
          status: 'PENDING',
          deletedAt: null,
        },
      }),
    ]);

    return { reviews, total, page, limit };
  }

  async approveReview(user: AuthenticatedUser, reviewId: string, approve: boolean) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.professionalId !== profile.id) {
      throw new NotFoundException('Review not found');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        status: approve ? 'APPROVED' : 'REJECTED',
      },
    });
  }

  async replyToReview(user: AuthenticatedUser, reviewId: string, dto: CreateReviewReplyDto) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.professionalId !== profile.id) {
      throw new NotFoundException('Review not found');
    }

    if (review.status !== 'APPROVED') {
      throw new BadRequestException('Can only reply to approved reviews');
    }

    const existingReply = await this.prisma.reviewReply.findUnique({
      where: { reviewId },
    });

    if (existingReply) {
      throw new BadRequestException('A reply already exists for this review');
    }

    return this.prisma.reviewReply.create({
      data: {
        reviewId,
        professionalId: profile.id,
        reply: dto.reply,
      },
    });
  }
}