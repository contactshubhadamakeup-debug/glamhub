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
import { PortfolioModule } from './portfolio/portfolio.module';
import { SearchModule } from './search/search.module';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PlansModule } from './plans/plans.module';
import { CouponsModule } from './coupons/coupons.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';

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
    PortfolioModule,
    SearchModule,
    EnquiriesModule,
    ReviewsModule,
    PlansModule,
    CouponsModule,
    PaymentsModule,
    AdminModule,
  ],
})
export class AppModule {}