// src/quotes/quotes.controller.ts
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
import { QuotesService } from './quotes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateQuoteDto, UpdateQuoteStatusDto } from './quotes.service';

@Controller('quotes')
@UseGuards(JwtAuthGuard)
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @Post()
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  createQuote(@Request() req: { user: any }, @Body() dto: CreateQuoteDto) {
    return this.quotesService.createQuote(req.user, dto);
  }

  @Get()
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  getQuotes(
    @Request() req: { user: any },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.quotesService.getQuotes(
      req.user,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  @Get(':id')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  getQuote(@Request() req: { user: any }, @Param('id') id: string) {
    return this.quotesService.getQuote(req.user, id);
  }

  @Put(':id/status')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  updateQuoteStatus(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() dto: UpdateQuoteStatusDto,
  ) {
    return this.quotesService.updateQuoteStatus(req.user, id, dto);
  }
}