// src/enquiries/enquiries.module.ts
import { Module } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { EnquiriesController } from './enquiries.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [EnquiriesService],
  controllers: [EnquiriesController],
})
export class EnquiriesModule {}