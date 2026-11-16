// src/plans/plans.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService, PlanInterval } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/auth.service';

export interface CreatePlanDto {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  interval?: PlanInterval;
  trialDays?: number;
  clientLimit?: number;
  photoLimit?: number;
  isActive?: boolean;
}

export interface UpdatePlanDto {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  interval?: PlanInterval;
  trialDays?: number;
  clientLimit?: number;
  photoLimit?: number;
  isActive?: boolean;
}

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async getPlans() {
    return this.prisma.plan.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  async getPlan(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
    });

    if (!plan || plan.deletedAt) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }

  async createPlan(user: AuthenticatedUser, dto: CreatePlanDto) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can create plans');
    }

    return this.prisma.plan.create({
      data: {
        ...dto,
        currency: dto.currency || 'INR',
        interval: dto.interval || PlanInterval.MONTH,
        trialDays: dto.trialDays || 0,
      },
    });
  }

  async updatePlan(user: AuthenticatedUser, id: string, dto: UpdatePlanDto) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can update plans');
    }

    const plan = await this.prisma.plan.findUnique({
      where: { id },
    });

    if (!plan || plan.deletedAt) {
      throw new NotFoundException('Plan not found');
    }

    return this.prisma.plan.update({
      where: { id },
      data: dto,
    });
  }

  async deactivatePlan(user: AuthenticatedUser, id: string) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can deactivate plans');
    }

    const plan = await this.prisma.plan.findUnique({
      where: { id },
    });

    if (!plan || plan.deletedAt) {
      throw new NotFoundException('Plan not found');
    }

    return this.prisma.plan.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });
  }

  async subscribe(user: AuthenticatedUser, planId: string) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.userId !== user.id) {
      throw new ForbiddenException('Only professionals can subscribe');
    }

    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan || plan.deletedAt || !plan.isActive) {
      throw new NotFoundException('Plan not found or inactive');
    }

    const existingSubscription = await this.prisma.subscription.findFirst({
      where: {
        professionalId: profile.id,
        deletedAt: null,
        status: { in: ['active', 'past_due'] },
      },
    });

    if (existingSubscription) {
      throw new BadRequestException('You already have an active subscription');
    }

    const now = new Date();
    const trialEnd = plan.trialDays > 0 ? new Date(now.getTime() + plan.trialDays * 24 * 60 * 60 * 1000) : null;
    const periodEnd = trialEnd || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return this.prisma.subscription.create({
      data: {
        professionalId: profile.id,
        planId,
        status: trialEnd ? 'active' : 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        trialStart: trialEnd ? now : null,
        trialEnd,
      },
      include: {
        plan: true,
      },
    });
  }

  async getSubscription(user: AuthenticatedUser) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    return this.prisma.subscription.findFirst({
      where: { professionalId: profile.id, deletedAt: null },
      include: {
        plan: true,
      },
    });
  }

  async cancelSubscription(user: AuthenticatedUser) {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Professional profile not found');
    }

    const subscription = await this.prisma.subscription.findFirst({
      where: { professionalId: profile.id, deletedAt: null },
    });

    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'cancelled',
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
      },
    });
  }

  async getAllSubscriptions(user: AuthenticatedUser, page = 1, limit = 20) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only super admins can view all subscriptions');
    }

    const [subscriptions, total] = await this.prisma.$transaction([
      this.prisma.subscription.findMany({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          professional: {
            select: { businessName: true, city: true },
          },
          plan: true,
        },
      }),
      this.prisma.subscription.count({ where: { deletedAt: null } }),
    ]);

    return { subscriptions, total, page, limit };
  }
}