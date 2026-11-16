// src/coupons/coupons.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.service';

export interface CreateCouponDto {
  planId?: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxUses?: number;
  expiresAt?: Date;
  isActive?: boolean;
}

export interface UpdateCouponDto {
  code?: string;
  discountType?: string;
  discountValue?: number;
  maxUses?: number;
  expiresAt?: Date;
  isActive?: boolean;
}

export interface ApplyCouponDto {
  code: string;
  planId: string;
}

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async getCoupons(user: AuthenticatedUser, page = 1, limit = 20) {
    const where: any = { deletedAt: null };

    if (user.role !== 'SUPER_ADMIN') {
      where.isActive = true;
      where.expiresAt = { gt: new Date() };
    }

    const [coupons, total] = await this.prisma.$transaction([
      this.prisma.coupon.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          plan: {
            select: { name: true, price: true },
          },
        },
      }),
      this.prisma.coupon.count({ where }),
    ]);

    return { coupons, total, page, limit };
  }

  async getCoupon(id: string, user: AuthenticatedUser) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: {
        plan: true,
      },
    });

    if (!coupon || coupon.deletedAt) {
      throw new NotFoundException('Coupon not found');
    }

    if (user.role !== 'SUPER_ADMIN' && (!coupon.isActive || coupon.expiresAt < new Date())) {
      throw new NotFoundException('Coupon not found');
    }

    return coupon;
  }

  async createCoupon(user: AuthenticatedUser, dto: CreateCouponDto) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can create coupons');
    }

    const existing = await this.prisma.coupon.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new BadRequestException('Coupon code already exists');
    }

    return this.prisma.coupon.create({
      data: {
        ...dto,
        discountType: dto.discountType || 'percentage',
        usedCount: 0,
      },
    });
  }

  async updateCoupon(user: AuthenticatedUser, id: string, dto: UpdateCouponDto) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can update coupons');
    }

    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!coupon || coupon.deletedAt) {
      throw new NotFoundException('Coupon not found');
    }

    return this.prisma.coupon.update({
      where: { id },
      data: dto,
    });
  }

  async deactivateCoupon(user: AuthenticatedUser, id: string) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can deactivate coupons');
    }

    return this.prisma.coupon.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });
  }

  async applyCoupon(user: AuthenticatedUser, dto: ApplyCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: dto.code },
      include: {
        plan: true,
      },
    });

    if (!coupon || coupon.deletedAt || !coupon.isActive) {
      throw new NotFoundException('Invalid coupon code');
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestException('Coupon has expired');
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    if (coupon.planId !== dto.planId) {
      throw new BadRequestException('Coupon is not valid for this plan');
    }

    const plan = coupon.plan;
    let discountAmount = 0;

    if (coupon.discountType === 'percentage') {
      discountAmount = (plan.price * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    const finalPrice = Math.max(0, plan.price - discountAmount);

    return {
      coupon,
      plan,
      discountAmount,
      finalPrice,
    };
  }

  async recordCouponUsage(couponId: string, userId: string) {
    await this.prisma.couponUsage.create({
      data: {
        couponId,
        userId,
      },
    });

    await this.prisma.coupon.update({
      where: { id: couponId },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });
  }
}