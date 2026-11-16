// src/admin/admin.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.service';

export interface ApproveProfessionalDto {
  approve: boolean;
}

export interface SuspendProfessionalDto {
  suspend: boolean;
}

export interface CreatePromotionDto {
  title: string;
  description?: string;
  discountType: string;
  discountValue: number;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
}

export interface UpdatePromotionDto {
  title?: string;
  description?: string;
  discountType?: string;
  discountValue?: number;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}

export interface AuditLogEntry {
  actorId: string;
  ownerId?: string;
  action: string;
  entity: string;
  entityId: string;
  beforeValues?: any;
  afterValues?: any;
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // --- Professionals Management ---

  async getAllProfessionals(page = 1, limit = 20, search?: string, status?: string) {
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status === 'pending') {
      where.isApproved = false;
      where.isSuspended = false;
    } else if (status === 'approved') {
      where.isApproved = true;
      where.isSuspended = false;
    } else if (status === 'suspended') {
      where.isSuspended = true;
    }

    const [professionals, total] = await this.prisma.$transaction([
      this.prisma.professionalProfile.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { email: true, role: true },
          },
          _count: {
            select: { bookings: true, reviews: true },
          },
        },
      }),
      this.prisma.professionalProfile.count({ where }),
    ]);

    return { professionals, total, page, limit };
  }

  async approveProfessional(user: AuthenticatedUser, id: string, dto: ApproveProfessionalDto) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can approve professionals');
    }

    const profile = await this.prisma.professionalProfile.findUnique({
      where: { id },
    });

    if (!profile || profile.deletedAt) {
      throw new NotFoundException('Professional not found');
    }

    await this.logAction(user, profile.id, 'professional', id, 'approve', {
      isApproved: profile.isApproved,
    }, { isApproved: dto.approve });

    return this.prisma.professionalProfile.update({
      where: { id },
      data: { isApproved: dto.approve },
    });
  }

  async suspendProfessional(user: AuthenticatedUser, id: string, dto: SuspendProfessionalDto) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can suspend professionals');
    }

    const profile = await this.prisma.professionalProfile.findUnique({
      where: { id },
    });

    if (!profile || profile.deletedAt) {
      throw new NotFoundException('Professional not found');
    }

    await this.logAction(user, profile.id, 'professional', id, 'suspend', {
      isSuspended: profile.isSuspended,
    }, { isSuspended: dto.suspend });

    return this.prisma.professionalProfile.update({
      where: { id },
      data: { isSuspended: dto.suspend },
    });
  }

  async verifyProfessional(user: AuthenticatedUser, id: string) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can verify professionals');
    }

    const profile = await this.prisma.professionalProfile.findUnique({
      where: { id },
    });

    if (!profile || profile.deletedAt) {
      throw new NotFoundException('Professional not found');
    }

    return this.prisma.professionalProfile.update({
      where: { id },
      data: { isVerified: true },
    });
  }

  // --- Plans Management ---

  async getAllPlans(page = 1, limit = 20) {
    const [plans, total] = await this.prisma.$transaction([
      this.prisma.plan.findMany({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { price: 'asc' },
        include: {
          _count: {
            select: { subscriptions: true },
          },
        },
      }),
      this.prisma.plan.count({ where: { deletedAt: null } }),
    ]);

    return { plans, total, page, limit };
  }

  async updatePlanPrice(user: AuthenticatedUser, id: string, price: number) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can change plan prices');
    }

    const plan = await this.prisma.plan.findUnique({
      where: { id },
    });

    if (!plan || plan.deletedAt) {
      throw new NotFoundException('Plan not found');
    }

    await this.logAction(user, plan.id, 'plan', id, 'price_change', {
      price: plan.price,
    }, { price });

    return this.prisma.plan.update({
      where: { id },
      data: { price },
    });
  }

  // --- Coupons Management ---

  async getAllCoupons(page = 1, limit = 20) {
    const [coupons, total] = await this.prisma.$transaction([
      this.prisma.coupon.findMany({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          plan: {
            select: { name: true, price: true },
          },
        },
      }),
      this.prisma.coupon.count({ where: { deletedAt: null } }),
    ]);

    return { coupons, total, page, limit };
  }

  // --- Promotions ---

  async getPromotions(page = 1, limit = 20) {
    const [promotions, total] = await this.prisma.$transaction([
      this.prisma.promotion.findMany({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startDate: 'desc' },
      }),
      this.prisma.promotion.count({ where: { deletedAt: null } }),
    ]);

    return { promotions, total, page, limit };
  }

  async createPromotion(user: AuthenticatedUser, dto: CreatePromotionDto) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can create promotions');
    }

    return this.prisma.promotion.create({
      data: dto,
    });
  }

  async updatePromotion(user: AuthenticatedUser, id: string, dto: UpdatePromotionDto) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can update promotions');
    }

    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion || promotion.deletedAt) {
      throw new NotFoundException('Promotion not found');
    }

    return this.prisma.promotion.update({
      where: { id },
      data: dto,
    });
  }

  // --- Reviews Moderation ---

  async getAllReviewsForModeration(page = 1, limit = 20, status?: string) {
    const where: any = { deletedAt: null };

    if (status) {
      where.status = status;
    }

    const [reviews, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          professional: {
            select: { businessName: true },
          },
          client: {
            select: { name: true },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return { reviews, total, page, limit };
  }

  async moderateReview(user: AuthenticatedUser, reviewId: string, action: 'approve' | 'reject') {
    if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN_STAFF') {
      throw new ForbiddenException('Insufficient permissions for review moderation');
    }

    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.deletedAt) {
      throw new NotFoundException('Review not found');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
      },
    });
  }

  // --- Disputes ---

  async getDisputes(page = 1, limit = 20, status?: string) {
    const where: any = { deletedAt: null };

    if (status) {
      where.status = status;
    }

    const [disputes, total] = await this.prisma.$transaction([
      this.prisma.dispute.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          booking: true,
          professional: {
            select: { businessName: true },
          },
          client: {
            select: { name: true },
          },
        },
      }),
      this.prisma.dispute.count({ where }),
    ]);

    return { disputes, total, page, limit };
  }

  async resolveDispute(user: AuthenticatedUser, disputeId: string, resolution: string, status: 'resolved' | 'rejected') {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can resolve disputes');
    }

    const dispute = await this.prisma.dispute.findUnique({
      where: { id: disputeId },
    });

    if (!dispute || dispute.deletedAt) {
      throw new NotFoundException('Dispute not found');
    }

    return this.prisma.dispute.update({
      where: { id: disputeId },
      data: {
        resolution,
        status,
      },
    });
  }

  // --- Payments & Payouts ---

  async getAllPayments(page = 1, limit = 20) {
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

  // --- Categories ---

  async getCategories() {
    return this.prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(user: AuthenticatedUser, name: string, slug: string, description?: string) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can create categories');
    }

    return this.prisma.category.create({
      data: { name, slug, description },
    });
  }

  // --- Staff Roles ---

  async getStaffRoles() {
    return this.prisma.roleAssignment.findMany({
      include: {
        user: {
          select: { email: true, role: true },
        },
      },
    });
  }

  async assignRole(user: AuthenticatedUser, targetUserId: string, role: string) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can assign roles');
    }

    return this.prisma.roleAssignment.create({
      data: {
        userId: targetUserId,
        role: role as any,
      },
    });
  }

  // --- Audit Log ---

  async getAuditLog(page = 1, limit = 20, entity?: string, actorId?: string) {
    const where: any = {};

    if (entity) {
      where.entity = entity;
    }

    if (actorId) {
      where.actorId = actorId;
    }

    const [logs, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: { email: true, role: true },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { logs, total, page, limit };
  }

  async logAction(
    actor: AuthenticatedUser,
    ownerId: string | undefined,
    action: string,
    entity: string,
    entityId: string,
    beforeValues?: any,
    afterValues?: any,
  ) {
    return this.prisma.auditLog.create({
      data: {
        actorId: actor.id,
        ownerId,
        action,
        entity,
        entityId,
        beforeValues,
        afterValues,
      },
    });
  }

  // --- Dashboard Metrics ---

  async getDashboardMetrics() {
    const [
      totalProfessionals,
      pendingProfessionals,
      suspendedProfessionals,
      totalBookings,
      totalRevenue,
      activeSubscriptions,
      totalReviews,
      pendingReviews,
    ] = await Promise.all([
      this.prisma.professionalProfile.count({ where: { deletedAt: null } }),
      this.prisma.professionalProfile.count({
        where: { deletedAt: null, isApproved: false, isSuspended: false },
      }),
      this.prisma.professionalProfile.count({
        where: { deletedAt: null, isSuspended: true },
      }),
      this.prisma.booking.count({ where: { deletedAt: null } }),
      this.prisma.payment.aggregate({
        where: { deletedAt: null, status: 'SUCCEEDED' },
        _sum: { amount: true },
      }),
      this.prisma.subscription.count({
        where: { deletedAt: null, status: 'active' },
      }),
      this.prisma.review.count({ where: { deletedAt: null, status: 'APPROVED' } }),
      this.prisma.review.count({ where: { deletedAt: null, status: 'PENDING' } }),
    ]);

    return {
      totalProfessionals,
      pendingProfessionals,
      suspendedProfessionals,
      totalBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
      activeSubscriptions,
      totalReviews,
      pendingReviews,
    };
  }
}