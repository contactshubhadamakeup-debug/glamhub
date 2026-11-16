// src/plans/plans.controller.ts
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
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreatePlanDto, UpdatePlanDto } from './plans.service';

@Controller('plans')
@UseGuards(JwtAuthGuard)
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Get()
  async getPlans() {
    return this.plansService.getPlans();
  }

  @Get(':id')
  async getPlan(@Param('id') id: string) {
    return this.plansService.getPlan(id);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN)
  createPlan(@Request() req: { user: any }, @Body() dto: CreatePlanDto) {
    return this.plansService.createPlan(req.user, dto);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN)
  updatePlan(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() dto: UpdatePlanDto,
  ) {
    return this.plansService.updatePlan(req.user, id, dto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  deactivatePlan(@Request() req: { user: any }, @Param('id') id: string) {
    return this.plansService.deactivatePlan(req.user, id);
  }

  @Post('subscribe')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  subscribe(@Request() req: { user: any }, @Body() body: { planId: string }) {
    return this.plansService.subscribe(req.user, body.planId);
  }

  @Get('me/subscription')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  getSubscription(@Request() req: { user: any }) {
    return this.plansService.getSubscription(req.user);
  }

  @Post('me/subscription/cancel')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  cancelSubscription(@Request() req: { user: any }) {
    return this.plansService.cancelSubscription(req.user);
  }

  @Get('admin/all')
  @Roles(Role.SUPER_ADMIN)
  getAllSubscriptions(
    @Request() req: { user: any },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.plansService.getAllSubscriptions(
      req.user,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }
}