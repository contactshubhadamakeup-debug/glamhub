// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';
import { WebhookVerificationMiddleware } from './common/middleware/webhook-verification.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.enableCors();
  
  // Apply rate limiting to all routes
  app.use(new RateLimitMiddleware().use.bind(new RateLimitMiddleware()));
  
  // Apply webhook verification to payment webhook routes
  app.use('/payments/webhook', new WebhookVerificationMiddleware().use.bind(new WebhookVerificationMiddleware()));
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();