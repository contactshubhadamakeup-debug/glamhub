# Feature Story: Database Schema & Prisma Models

**As a** product owner, **I want** a PostgreSQL schema with Prisma models and migrations, **so that** all data for professionals, clients, bookings, payments, and reviews is properly structured.

**Acceptance Criteria:**
- [ ] All 19 tables modeled: users, roles, professional_profiles, categories, portfolio_items, services, clients, leads, bookings, quotes, invoices, payments, reviews, review_replies, plans, subscriptions, coupons, promotions, disputes, notifications, audit_logs
- [ ] Every professional-owned table carries owner professional ID and is indexed on it
- [ ] A review links to a completed booking
- [ ] Soft deletes used where history matters
- [ ] Migrations are reversible; no already-applied migrations edited
- [ ] Realistic fake seed data loads (no real people's data)
- [ ] Migrations apply cleanly on an empty database

**Definition of Done:** Database engineer confirms migrations apply cleanly and seed data loads.