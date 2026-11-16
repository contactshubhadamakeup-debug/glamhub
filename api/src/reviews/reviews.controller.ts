// src/reviews/reviews.controller.ts
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
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateReviewDto, CreateReviewReplyDto } from './reviews.service';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @Roles(Role.CLIENT)
  createReview(
    @Request() req: { user: any },
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(req.user, dto);
  }

  @Get('professional/:professionalId')
  getProfessionalReviews(
    @Param('professionalId') professionalId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.getProfessionalReviews(
      professionalId,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  @Get('pending')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  getPendingReviews(
    @Request() req: { user: any },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reviewsService.getPendingReviews(
      req.user,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  @Put(':id/approve')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  approveReview(
    @Request() req: { user: any },
    @Param('id') reviewId: string,
    @Body() body: { approve: boolean },
  ) {
    return this.reviewsService.approveReview(req.user, reviewId, body.approve);
  }

  @Post(':id/reply')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  replyToReview(
    @Request() req: { user: any },
    @Param('id') reviewId: string,
    @Body() dto: CreateReviewReplyDto,
  ) {
    return this.reviewsService.replyToReview(req.user, reviewId, dto);
  }
}