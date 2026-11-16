// src/bookings/bookings.controller.ts
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
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateBookingDto, UpdateBookingStatusDto } from './bookings.service';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER, Role.CLIENT)
  createBooking(@Request() req: { user: any }, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user, dto);
  }

  @Get()
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER, Role.CLIENT)
  getBookings(
    @Request() req: { user: any },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bookingsService.getBookings(
      req.user,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  @Get(':id')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER, Role.CLIENT)
  getBooking(@Request() req: { user: any }, @Param('id') id: string) {
    return this.bookingsService.getBooking(req.user, id);
  }

  @Put(':id/status')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  updateBookingStatus(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateBookingStatus(req.user, id, dto);
  }
}