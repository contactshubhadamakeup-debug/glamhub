// src/coupons/coupons.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateCouponDto, UpdateCouponDto, ApplyCouponDto } from './coupons.service';

@Controller('coupons')
@UseGuards(JwtAuthGuard)
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Get()
  async getCoupons(
    @Request() req: { user: any },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.couponsService.getCoupons(
      req.user,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  @Get(':id')
  async getCoupon(@Param('id') id: string, @Request() req: { user: any }) {
    return this.couponsService.getCoupon(id, req.user);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN)
  createCoupon(@Request() req: { user: any }, @Body() dto: CreateCouponDto) {
    return this.couponsService.createCoupon(req.user, dto);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN)
  updateCoupon(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() dto: UpdateCouponDto,
  ) {
    return this.couponsService.updateCoupon(req.user, id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  deactivateCoupon(@Request() req: { user: any }, @Param('id') id: string) {
    return this.couponsService.deactivateCoupon(req.user, id);
  }

  @Post('apply')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER, Role.CLIENT)
  applyCoupon(@Request() req: { user: any }, @Body() dto: ApplyCouponDto) {
    return this.couponsService.applyCoupon(req.user, dto);
  }
}