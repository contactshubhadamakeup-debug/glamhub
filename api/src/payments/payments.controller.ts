// src/payments/payments.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreatePaymentDto, WebhookPaymentDto } from './payments.service';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  async getPayments(
    @Request() req: { user: any },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.paymentsService.getPayments(
      req.user,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  @Get(':id')
  async getPayment(@Request() req: { user: any }, @Param('id') id: string) {
    return this.paymentsService.getPayment(req.user, id);
  }

  @Post()
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  createPayment(
    @Request() req: { user: any },
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentsService.createPayment(req.user, dto);
  }

  @Post('webhook/:gateway')
  async processWebhook(
    @Param('gateway') gateway: string,
    @Body() dto: WebhookPaymentDto,
  ) {
    // Webhook signature verification should be done in middleware
    return this.paymentsService.processWebhook({
      ...dto,
      gateway,
    });
  }

  @Get('admin/all')
  @Roles(Role.SUPER_ADMIN)
  getAllPayments(
    @Request() req: { user: any },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.paymentsService.getAllPayments(
      req.user,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }
}