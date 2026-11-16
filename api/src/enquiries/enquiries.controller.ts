// src/enquiries/enquiries.controller.ts
import {
  Controller,
  Post,
  Get,
  Query,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateEnquiryDto } from './enquiries.service';

@Controller('enquiries')
export class EnquiriesController {
  constructor(private enquiriesService: EnquiriesService) {}

  @Post()
  async createEnquiry(
    @Body() dto: CreateEnquiryDto,
    @Request() req: { user?: any },
  ) {
    return this.enquiriesService.createEnquiry(dto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  getEnquiries(
    @Request() req: { user: any },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.enquiriesService.getEnquiries(
      req.user,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }
}