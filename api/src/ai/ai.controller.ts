// src/ai/ai.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { DraftReplyDto } from './ai.service';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('draft-reply')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  draftReply(
    @Request() req: { user: any },
    @Body() dto: DraftReplyDto,
  ) {
    return this.aiService.draftReply(req.user, dto);
  }

  @Post('leads/:id/score')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  scoreLead(
    @Request() req: { user: any },
    @Param('id') leadId: string,
  ) {
    return this.aiService.scoreLead(req.user, leadId);
  }

  @Post('follow-up-suggestions')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  getFollowUpSuggestions(@Request() req: { user: any }) {
    return this.aiService.getFollowUpSuggestions(req.user);
  }

  @Get('analytics/insights')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  getAnalyticsInsights(@Request() req: { user: any }) {
    return this.aiService.getAnalyticsInsights(req.user);
  }
}