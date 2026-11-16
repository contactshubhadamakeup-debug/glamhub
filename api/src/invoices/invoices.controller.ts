// src/invoices/invoices.controller.ts
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
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateInvoiceStatusDto } from './invoices.service';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private invoicesService: InvoicesService) {}

  @Get()
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER, Role.CLIENT)
  getInvoices(
    @Request() req: { user: any },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.invoicesService.getInvoices(
      req.user,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  @Get(':id')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER, Role.CLIENT)
  getInvoice(@Request() req: { user: any }, @Param('id') id: string) {
    return this.invoicesService.getInvoice(req.user, id);
  }

  @Put(':id/status')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  updateInvoiceStatus(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceStatusDto,
  ) {
    return this.invoicesService.updateInvoiceStatus(req.user, id, dto);
  }
}