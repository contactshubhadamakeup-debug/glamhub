// src/notifications/notifications.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { SendEmailDto, SendWhatsAppDto, NotificationPreferences } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('email')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER, Role.CLIENT, Role.ADMIN_STAFF, Role.SUPER_ADMIN)
  sendEmail(@Body() dto: SendEmailDto) {
    return this.notificationsService.sendEmail(dto);
  }

  @Post('whatsapp')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER, Role.CLIENT, Role.ADMIN_STAFF, Role.SUPER_ADMIN)
  sendWhatsApp(@Body() dto: SendWhatsAppDto) {
    return this.notificationsService.sendWhatsApp(dto);
  }

  @Post('booking-confirmation/:bookingId')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  sendBookingConfirmation(
    @Request() req: { user: any },
    @Param('bookingId') bookingId: string,
  ) {
    return this.notificationsService.sendBookingConfirmation(req.user, bookingId);
  }

  @Post('enquiry-notification/:leadId')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  sendEnquiryNotification(
    @Request() req: { user: any },
    @Param('leadId') leadId: string,
  ) {
    return this.notificationsService.sendEnquiryNotification(req.user, leadId);
  }

  @Post('invoice-reminder/:invoiceId')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  sendInvoiceReminder(
    @Request() req: { user: any },
    @Param('invoiceId') invoiceId: string,
  ) {
    return this.notificationsService.sendInvoiceReminder(req.user, invoiceId);
  }

  @Get('preferences')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER, Role.CLIENT)
  getPreferences(@Request() req: { user: any }) {
    return this.notificationsService.getNotificationPreferences(req.user);
  }

  @Put('preferences')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER, Role.CLIENT)
  updatePreferences(
    @Request() req: { user: any },
    @Body() prefs: NotificationPreferences,
  ) {
    return this.notificationsService.updateNotificationPreferences(req.user, prefs);
  }
}