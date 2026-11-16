// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  professionalProfileId?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateFirebaseUser(firebaseUid: string, email: string): Promise<AuthenticatedUser> {
    let user = await this.prisma.user.findUnique({ where: { firebaseUid } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          firebaseUid,
          role: Role.CLIENT,
        },
      });
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const roleAssignment = await this.prisma.roleAssignment.findFirst({
      where: { userId: user.id },
    });

    let professionalProfileId: string | undefined;
    if (user.role === Role.PROFESSIONAL || user.role === Role.STUDIO_OWNER) {
      const profile = await this.prisma.professionalProfile.findUnique({
        where: { userId: user.id },
      });
      professionalProfileId = profile?.id;
    }

    return {
      id: user.id,
      email: user.email,
      role: roleAssignment?.role || user.role,
      professionalProfileId,
    };
  }

  async generateToken(user: AuthenticatedUser): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      professionalProfileId: user.professionalProfileId,
    };
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<AuthenticatedUser> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.deletedAt) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      return {
        id: user.id,
        email: user.email,
        role: payload.role as Role,
        professionalProfileId: payload.professionalProfileId as string | undefined,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async checkOwnership(userId: string, professionalProfileId: string): Promise<boolean> {
    const profile = await this.prisma.professionalProfile.findUnique({
      where: { id: professionalProfileId },
    });
    return profile?.userId === userId;
  }
}