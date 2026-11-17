// src/common/middleware/rate-limit.middleware.ts
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: { count: number; resetAt: number };
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private store: Record<string, { count: number; resetAt: number }> = {};
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor() {
    this.windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
    this.maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const key = this.getKey(req);
    const now = Date.now();

    if (!this.store[key] || this.store[key].resetAt < now) {
      this.store[key] = { count: 1, resetAt: now + this.windowMs };
    } else {
      this.store[key].count++;
    }

    const remaining = Math.max(0, this.maxRequests - this.store[key].count);
    const resetAt = this.store[key].resetAt;

    res.setHeader('X-RateLimit-Limit', this.maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', new Date(resetAt).toISOString());

    if (this.store[key].count > this.maxRequests) {
      throw new HttpException({
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil((resetAt - now) / 1000),
      }, HttpStatus.TOO_MANY_REQUESTS);
    }

    next();
  }

  private getKey(req: Request): string {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    return `${ip}:${req.path}`;
  }

  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetAt < now) {
        delete this.store[key];
      }
    });
  }
}