// src/admin/admin.controller.ts
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
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  ApproveProfessionalDto,
  SuspendProfessionalDto,
  CreatePromotionDto,
  UpdatePromotionDto,
} from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // --- Dashboard ---

  @Get('metrics')
  @Roles(Role.SUPER_ADMIN)
  getDashboardMetrics() {
    return this.adminService.getDashboardMetrics();
  }

  // --- Professionals ---

  @Get('professionals')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  getAllProfessionals(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllProfessionals(
      parseInt(page) || 1,
      parseInt(limit) || 20,
      search,
      status,
    );
  }

  @Post('professionals/:id/approve')
  @Roles(Role.SUPER_ADMIN)
  approveProfessional(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() dto: ApproveProfessionalDto,
  ) {
    return this.adminService.approveProfessional(req.user, id, dto);
  }

  @Post('professionals/:id/suspend')
  @Roles(Role.SUPER_ADMIN)
  suspendProfessional(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() dto: SuspendProfessionalDto,
  ) {
    return this.adminService.suspendProfessional(req.user, id, dto);
  }

  @Post('professionals/:id/verify')
  @Roles(Role.SUPER_ADMIN)
  verifyProfessional(@Request() req: { user: any }, @Param('id') id: string) {
    return this.adminService.verifyProfessional(req.user, id);
  }

  // --- Plans ---

  @Get('plans')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  getAllPlans(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllPlans(
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  @Put('plans/:id/price')
  @Roles(Role.SUPER_ADMIN)
  updatePlanPrice(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: { price: number },
  ) {
    return this.adminService.updatePlanPrice(req.user, id, body.price);
  }

  // --- Coupons ---

  @Get('coupons')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  getAllCoupons(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllCoupons(
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  // --- Promotions ---

  @Get('promotions')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  getPromotions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getPromotions(
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  @Post('promotions')
  @Roles(Role.SUPER_ADMIN)
  createPromotion(@Request() req: { user: any }, @Body() dto: CreatePromotionDto) {
    return this.adminService.createPromotion(req.user, dto);
  }

  @Put('promotions/:id')
  @Roles(Role.SUPER_ADMIN)
  updatePromotion(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() dto: UpdatePromotionDto,
  ) {
    return this.adminService.updatePromotion(req.user, id, dto);
  }

  // --- Reviews Moderation ---

  @Get('reviews')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  getAllReviewsForModeration(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAllReviewsForModeration(
      parseInt(page) || 1,
      parseInt(limit) || 20,
      status,
    );
  }

  @Post('reviews/:id/moderate')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  moderateReview(
    @Request() req: { user: any },
    @Param('id') reviewId: string,
    @Body() body: { action: 'approve' | 'reject' },
  ) {
    return this.adminService.moderateReview(req.user, reviewId, body.action);
  }

  // --- Disputes ---

  @Get('disputes')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  getDisputes(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getDisputes(
      parseInt(page) || 1,
      parseInt(limit) || 20,
      status,
    );
  }

  @Post('disputes/:id/resolve')
  @Roles(Role.SUPER_ADMIN)
  resolveDispute(
    @Request() req: { user: any },
    @Param('id') disputeId: string,
    @Body() body: { resolution: string; status: 'resolved' | 'rejected' },
  ) {
    return this.adminService.resolveDispute(req.user, disputeId, body.resolution, body.status);
  }

  // --- Payments & Payouts ---

  @Get('payments')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  getAllPayments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllPayments(
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  // --- Categories ---

  @Get('categories')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  getCategories() {
    return this.adminService.getCategories();
  }

  @Post('categories')
  @Roles(Role.SUPER_ADMIN)
  createCategory(
    @Request() req: { user: any },
    @Body() body: { name: string; slug: string; description?: string },
  ) {
    return this.adminService.createCategory(req.user, body.name, body.slug, body.description);
  }

  // --- Staff Roles ---

  @Get('staff/roles')
  @Roles(Role.SUPER_ADMIN)
  getStaffRoles() {
    return this.adminService.getStaffRoles();
  }

  @Post('staff/roles')
  @Roles(Role.SUPER_ADMIN)
  assignRole(
    @Request() req: { user: any },
    @Body() body: { userId: string; role: string },
  ) {
    return this.adminService.assignRole(req.user, body.userId, body.role);
  }

  // --- Audit Log ---

  @Get('audit-log')
  @Roles(Role.SUPER_ADMIN)
  getAuditLog(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('entity') entity?: string,
    @Query('actorId') actorId?: string,
  ) {
    return this.adminService.getAuditLog(
      parseInt(page) || 1,
      parseInt(limit) || 20,
      entity,
      actorId,
    );
  }
}