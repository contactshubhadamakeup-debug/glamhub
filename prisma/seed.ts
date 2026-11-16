// prisma/seed.ts
import { PrismaClient, Role, BookingStatus, PaymentStatus, ReviewStatus, PlanInterval } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Categories
  await prisma.category.createMany({
    data: [
      { name: 'Makeup Artist', slug: 'makeup-artist', description: 'Bridal, party, and event makeup artists', isActive: true },
      { name: 'Hair Stylist', slug: 'hair-stylist', description: 'Hair cutting, styling, and treatments', isActive: true },
      { name: 'Nail Artist', slug: 'nail-artist', description: 'Manicure, pedicure, and nail art', isActive: true },
      { name: 'Model', slug: 'model', description: 'Fashion, commercial, and portfolio models', isActive: true },
      { name: 'Photographer', slug: 'photographer', description: 'Event, portrait, and product photographers', isActive: true },
      { name: 'Influencer', slug: 'influencer', description: 'Social media influencers and content creators', isActive: true },
    ],
  });

  // Plans
  await prisma.plan.createMany({
    data: [
      { name: 'Free', description: 'Basic profile with limited features', price: 0, currency: 'INR', interval: PlanInterval.MONTH, trialDays: 0, clientLimit: 5, photoLimit: 10, isActive: true },
      { name: 'Starter', description: 'For new professionals getting started', price: 499, currency: 'INR', interval: PlanInterval.MONTH, trialDays: 14, clientLimit: 50, photoLimit: 50, isActive: true },
      { name: 'Professional', description: 'For growing professionals', price: 999, currency: 'INR', interval: PlanInterval.MONTH, trialDays: 14, clientLimit: 200, photoLimit: 200, isActive: true },
      { name: 'Premium', description: 'For established professionals', price: 1999, currency: 'INR', interval: PlanInterval.MONTH, trialDays: 14, clientLimit: null, photoLimit: null, isActive: true },
    ],
  });

  // Super admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'superadmin@glamhub.example.com',
      role: Role.SUPER_ADMIN,
      isEmailVerified: true,
    },
  });

  await prisma.roleAssignment.create({
    data: {
      userId: adminUser.id,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log('Seed data loaded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });