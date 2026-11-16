// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { LeadsModule } from './leads/leads.module';
import { ClientsModule } from './clients/clients.module';
import { BookingsModule } from './bookings/bookings.module';
import { QuotesModule } from './quotes/quotes.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    OnboardingModule,
    LeadsModule,
    ClientsModule,
    BookingsModule,
    QuotesModule,
    InvoicesModule,
  ],
})
export class AppModule {}