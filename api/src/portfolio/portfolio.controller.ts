// src/portfolio/portfolio.controller.ts
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
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreatePortfolioItemDto, UpdatePortfolioItemDto } from './portfolio.service';

@Controller('portfolios')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get()
  async getPublicPortfolios(
    @Query('category') category?: string,
    @Query('city') city?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.portfolioService.getPublicPortfolios(
      category,
      city,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  @Get(':id')
  async getPublicPortfolio(@Param('id') id: string) {
    return this.portfolioService.getPublicPortfolio(id);
  }

  @Get('me/items')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  getProfessionalPortfolio(
    @Request() req: { user: any },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.portfolioService.getProfessionalPortfolio(
      req.user,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  createPortfolioItem(
    @Request() req: { user: any },
    @Body() dto: CreatePortfolioItemDto,
  ) {
    return this.portfolioService.createPortfolioItem(req.user, dto);
  }

  @Put('items/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  updatePortfolioItem(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() dto: UpdatePortfolioItemDto,
  ) {
    return this.portfolioService.updatePortfolioItem(req.user, id, dto);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  deletePortfolioItem(
    @Request() req: { user: any },
    @Param('id') id: string,
  ) {
    return this.portfolioService.deletePortfolioItem(req.user, id);
  }
}