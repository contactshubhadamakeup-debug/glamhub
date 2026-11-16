// src/clients/clients.controller.ts
import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateClientDto } from './clients.service';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  getClients(
    @Request() req: { user: any },
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.clientsService.getClients(
      req.user,
      parseInt(page) || 1,
      parseInt(limit) || 20,
    );
  }

  @Get(':id')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  getClient(@Request() req: { user: any }, @Param('id') id: string) {
    return this.clientsService.getClient(req.user, id);
  }

  @Put(':id')
  @Roles(Role.PROFESSIONAL, Role.STUDIO_OWNER)
  updateClient(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientsService.updateClient(req.user, id, dto);
  }
}