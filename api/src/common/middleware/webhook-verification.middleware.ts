// src/common/middleware/webhook-verification.middleware.ts
import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class WebhookVerificationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Only apply to webhook endpoints
    if (!req.path.startsWith('/payments/webhook/')) {
      return next();
    }

    const gateway = req.path.split('/payments/webhook/')[1];
    
    try {
      switch (gateway) {
        case 'razorpay':
          this.verifyRazorpay(req);
          break;
        case 'stripe':
          this.verifyStripe(req);
          break;
        default:
          throw new BadRequestException('Unknown payment gateway');
      }
      next();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Webhook verification failed');
    }
  }

  private verifyRazorpay(req: Request) {
    const signature = req.headers['x-razorpay-signature'] as string;
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      throw new BadRequestException('Missing Razorpay signature or secret');
    }

    // Razorpay sends the raw body as JSON string
    const body = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (!this.timingSafeEqual(signature, expectedSignature)) {
      throw new BadRequestException('Invalid Razorpay signature');
    }
  }

  private verifyStripe(req: Request) {
    const signature = req.headers['stripe-signature'] as string;
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !secret) {
      throw new BadRequestException('Missing Stripe signature or secret');
    }

    // Stripe signature format: t=timestamp,v1=signature
    const elements = signature.split(',');
    const timestamp = elements.find(e => e.startsWith('t='))?.split('=')[1];
    const v1 = elements.find(e => e.startsWith('v1='))?.split('=')[1];

    if (!timestamp || !v1) {
      throw new BadRequestException('Invalid Stripe signature format');
    }

    // Check timestamp tolerance (5 minutes)
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(timestamp, 10)) > 300) {
      throw new BadRequestException('Stripe timestamp too old');
    }

    const payload = `${timestamp}.${JSON.stringify(req.body)}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (!this.timingSafeEqual(v1, expectedSignature)) {
      throw new BadRequestException('Invalid Stripe signature');
    }
  }

  private timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }
}