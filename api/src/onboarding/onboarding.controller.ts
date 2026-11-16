// src/onboarding/onboarding.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  UpdateProfessionalProfileDto,
  CreateServiceDto,
  CreatePortfolioItemDto,
} from './onboarding.service';

@Controller('professional')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}

  @Get('profile')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  getProfile(@Request() req: { user: any }) {
    return this.onboardingService.getProfessionalProfile(req.user);
  }

  @Put('profile')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  updateProfile(
    @Request() req: { user: any },
    @Body() dto: UpdateProfessionalProfileDto,
  ) {
    return this.onboardingService.updateProfessionalProfile(req.user, dto);
  }

  @Post('services')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  createService(
    @Request() req: { user: any },
    @Body() dto: CreateServiceDto,
  ) {
    return this.onboardingService.createService(req.user, dto);
  }

  @Get('services')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  getServices(@Request() req: { user: any }) {
    return this.onboardingService.getServices(req.user);
  }

  @Post('portfolio')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  createPortfolioItem(
    @Request() req: { user: any },
    @Body() dto: CreatePortfolioItemDto,
  ) {
    return this.onboardingService.createPortfolioItem(req.user, dto);
  }

  @Get('portfolio')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  getPortfolioItems(@Request() req: { user: any }) {
    return this.onboardingService.getPortfolioItems(req.user);
  }

  @Post('onboarding/complete')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  completeOnboarding(@Request() req: { user: any }) {
    return this.onboardingService.completeOnboarding(req.user);
  }
}