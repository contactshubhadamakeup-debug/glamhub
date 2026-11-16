# Phase 4: Plans, Subscriptions, Coupons & Super Admin Panel

## User Stories

### Plans & Subscriptions
**PM-401** As a professional, I want to subscribe to a plan so that I can access premium features.
- [ ] View available subscription plans (Free, Starter, Professional, Premium)
- [ ] Subscribe to a plan (test mode only)
- [ ] Trial period applied if plan has trial days
- [ ] Plan limits enforced (client limit, photo limit)
- [ ] Upgrade/downgrade between plans
- [ ] Cancel subscription

### Coupons
**PM-402** As a professional, I want to apply a coupon code so that I can get a discount on my subscription.
- [ ] Coupon code validation
- [ ] Percentage or fixed discount
- [ ] Max uses and expiry date
- [ ] One-time use per user

### Super Admin Panel
**PM-403** As a Super Admin, I want to manage professionals so that I can approve, suspend, or verify them.
- [ ] List all professionals with status (pending, approved, suspended)
- [ ] Approve/reject professional applications
- [ ] Suspend/verify professionals
- [ ] Audit log of all admin actions

**PM-404** As a Super Admin, I want to manage plans and subscriptions so that I can control pricing.
- [ ] Create/edit/deactivate subscription plans
- [ ] View all active subscriptions
- [ ] Price changes require confirmation

**PM-405** As a Super Admin, I want to manage offers, coupons, and promotions so that I can run marketing campaigns.
- [ ] Create/edit coupons
- [ ] Create/edit promotions with date ranges
- [ ] Featured slots for professionals

**PM-406** As a Super Admin, I want to moderate reviews and handle disputes so that I can maintain platform quality.
- [ ] List all reviews with moderation status
- [ ] Approve/reject reviews
- [ ] View and resolve disputes
- [ ] Process refunds

**PM-407** As a Super Admin, I want to view payments and payouts so that I can monitor platform revenue.
- [ ] List all payments with status
- [ ] View payout history
- [ ] Export payment data

**PM-408** As a Super Admin, I want to manage categories, staff roles, and view audit log so that I can administer the platform.
- [ ] Create/edit categories
- [ ] Manage staff roles and permissions
- [ ] View complete audit log (who, what, when, before/after)

## Acceptance Criteria Summary
- Payment test mode only (no live payments)
- All admin actions audited with before/after values
- Risky actions (suspend, refund, price change) require confirmation
- Role-based permissions within admin (support staff cannot edit plans)
- Tables searchable, filterable, paginated, exportable

## Definition of Done
- All Phase 4 endpoints match API contract
- Frontend screens match designs
- QA tests pass
- Code reviewer approves
- Security reviewer approves (admin panel is security-critical)