// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedUser } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('firebase')
  async firebaseLogin(@Body() body: { firebaseUid: string; email: string }) {
    const user = await this.authService.validateFirebaseUser(body.firebaseUid, body.email);
    const token = await this.authService.generateToken(user);
    return { user, token };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Request() req: { user: AuthenticatedUser }) {
    return req.user;
  }
}