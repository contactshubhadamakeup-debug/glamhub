// src/auth/decorators/roles.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Role } from '@prisma/client';

export const Roles = (...roles: Role[]) =>
  applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    // Role metadata set via RolesGuard reflection
  );