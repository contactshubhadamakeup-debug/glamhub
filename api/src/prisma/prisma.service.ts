// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Role, BookingStatus, PaymentStatus, ReviewStatus, PlanInterval } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// Re-export Prisma enums for use in other modules
export { Role, BookingStatus, PaymentStatus, ReviewStatus, PlanInterval };