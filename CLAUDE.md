# GlamHub project brief

## PRODUCT
GlamHub is a subscription CRM plus public marketplace for the glam industry: makeup artists, hair stylists, nail artists, models, influencers, photographers and similar professionals.
- Professionals pay a subscription to manage their own clients, leads, bookings, quotes, invoices, reviews and a public portfolio page.
- Clients browse portfolios for free, send enquiries, book, pay and leave reviews. Reviews are allowed only after a completed booking.
- One Super Admin panel controls professionals (approve, suspend), subscription plans, offers and coupons, promotions and featured slots, reviews moderation, disputes, payments and payouts, categories, staff roles and an audit log.

## DESIGN
- Palette for trust and growth: deep navy (#0B2545) for trust, emerald (#047857) for growth and primary actions, warm gold (#F2B134) for premium accents, soft white backgrounds.
- Fonts: Plus Jakarta Sans for headings, Inter for body.
- Friendly, clean, mobile-first, accessible (text contrast 4.5:1 minimum, touch targets 44px minimum).
- Reference designs: https://claude.ai/artifact/TF8h9HrtmfebWmbLfCaCMt
- Reference plan, stack and GCP guide: https://claude.ai/artifact/5BSpRvwKiaTrWWYqmu5LdF

## TECH STACK (do not change without owner approval)
- Frontend: Next.js (React) + TypeScript + Tailwind CSS + shadcn/ui, installable web app (PWA).
- Backend: Node.js + NestJS + TypeScript, Prisma ORM, PostgreSQL.
- Auth: Firebase Authentication (email, phone OTP, Google).
- Payments: Razorpay or Stripe hosted checkout and recurring subscriptions (owner decides). Never store card data.
- Files: Cloud Storage with signed URLs for private files; CDN for public images.
- Email: Resend or SendGrid. WhatsApp: WhatsApp Business Cloud API. AI features: Claude API.
- Hosting on Google Cloud: Cloud Run, Cloud SQL, Secret Manager, Artifact Registry, Cloud Build, Cloud Logging and Monitoring.
- Three environments: development, staging (glamhub-staging), production (glamhub-prod).

## ROLES
super_admin, admin_staff, professional, studio_owner, client

## NON-NEGOTIABLE RULES
1. Never hard-code secrets. Use Secret Manager.
2. Never store card data. Use hosted checkout only.
3. Every professional-owned table must carry the owner professional ID and be indexed on it.
4. A review must link to a completed booking.
5. Use soft deletes where history matters. Support account deletion and data export for privacy.
6. Every schema change is a reversible migration. Never edit a migration that was already applied.
7. Never run destructive SQL on staging or production. Ask the owner.
8. Never enable live payments without the owner's explicit written approval.
9. Never delete cloud resources, change billing, rotate production secrets or deploy to production without the owner's approval.
10. Never print secret values.
11. AI only suggests. A human professional reviews and sends. Never auto-send without an explicit setting turned on by the professional.
12. Send the model only the minimum data needed. Never send ID documents, payment data or secrets.
13. Access control: a professional can only access their own data; admin routes need admin roles.
14. Validate every input. Return clear errors.
15. Use pagination, rate limiting on public and login endpoints, and structured logs without personal data or secrets.
16. Make webhooks secure (signature verification) and idempotent (safe if received twice).
17. Keep an immutable record of payments and every admin billing action.
18. Log every admin action with who, what, when and the before and after values.
19. Require confirmation for risky actions such as suspension, refund and price changes.
20. Test with the gateway's test mode only. Real keys are added by the owner into Secret Manager.
21. Work phase by phase in the order defined in CLAUDE.md. Do not start the next phase until the owner approves the current phase demo.
22. Prefer the smallest change that works. Avoid inventing features beyond the approved scope.
23. Record decisions in docs/decisions/ with the date, the options considered and why one was chosen.