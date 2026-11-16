// src/leads/leads.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateLeadDto, UpdateLeadDto } from './leads.service';

@Controller('leads')
@UseGuards(JwtAuthGuard)
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Post()
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  createLead(@Request() req: { user: any }, @Body() dto: CreateLeadDto) {
    return this.leadsService.createLead(req.user, dto);
  }

  @Get()
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  getLeads(
    @Request() req: { user: any },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.leadsService.getLeads(
      req.user,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  @Get(':id')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  getLead(@Request() req: { user: any }, @Param('id') id: string) {
    return this.leadsService.getLead(req.user, id);
  }

  @Put(':id')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  updateLead(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
  ) {
    return this.leadsService.updateLead(req.user, id, dto);
  }
}