# Phase 4 QA Test Plan

## Plans & Subscriptions Tests

### TC-PLAN-001: View All Plans
**Given** no authentication required
**When** GET /api/plans
**Then** 200 OK with list of active plans sorted by price

### TC-PLAN-002: Subscribe to Plan (Professional)
**Given** a logged-in professional without an active subscription
**When** POST /api/plans/subscribe with valid planId
**Then** 201 Created with subscription including trial period if applicable

### TC-PLAN-003: Duplicate Subscription Prevention
**Given** a professional with an active subscription
**When** attempting to subscribe again
**Then** 400 Bad Request: "You already have an active subscription"

### TC-PLAN-004: View Own Subscription
**Given** a logged-in professional with a subscription
**When** GET /api/plans/me/subscription
**Then** 200 OK with subscription details and plan info

### TC-PLAN-005: Cancel Subscription
**Given** a professional with an active subscription
**When** POST /api/plans/me/subscription/cancel
**Then** subscription status changes to "cancelled" with cancelAtPeriodEnd

### TC-PLAN-006: Create Plan (Super Admin Only)
**Given** a super admin
**When** POST /api/plans with valid plan data
**Then** 201 Created with new plan

### TC-PLAN-007: Create Plan Authorization
**Given** a professional (not super admin)
**When** POST /api/plans
**Then** 403 Forbidden

### TC-PLAN-008: Update Plan Price
**Given** a super admin
**When** PUT /api/plans/{id}/price with new price
**Then** plan price updated
**And** audit log entry created with before/after values

### TC-PLAN-009: Deactivate Plan
**Given** a super admin
**When** DELETE /api/plans/{id}
**Then** plan is soft deleted (deletedAt set, isActive false)

## Coupons Tests

### TC-COUPON-001: View All Coupons (Super Admin)
**Given** a super admin
**When** GET /api/coupons
**Then** 200 OK with all coupons including inactive ones

### TC-COUPON-002: View Active Coupons (Professional)
**Given** a professional
**When** GET /api/coupons
**Then** only active, non-expired coupons returned

### TC-COUPON-003: Create Coupon
**Given** a super admin
**When** POST /api/coupons with unique code
**Then** 201 Created with new coupon

### TC-COUPON-004: Duplicate Coupon Code
**Given** a coupon code that already exists
**When** POST /api/coupons with same code
**Then** 400 Bad Request: "Coupon code already exists"

### TC-COUPON-005: Apply Coupon to Plan
**Given** a valid coupon code and plan ID
**When** POST /api/coupons/apply
**Then** 200 OK with discount amount and final price

### TC-COUPON-006: Expired Coupon
**Given** an expired coupon code
**When** POST /api/coupons/apply
**Then** 400 Bad Request: "Coupon has expired"

### TC-COUPON-007: Coupon Usage Limit
**Given** a coupon at max uses
**When** attempting to apply
**Then** 400 Bad Request: "Coupon usage limit reached"

## Admin Panel Tests

### TC-ADMIN-001: Dashboard Metrics
**Given** a super admin
**When** GET /admin/metrics
**Then** 200 OK with total professionals, pending, suspended, bookings, revenue, subscriptions, reviews

### TC-ADMIN-002: List Professionals with Filters
**Given** a super admin
**When** GET /admin/professionals?status=pending&search=makeup
**Then** filtered list of pending makeup professionals with pagination

### TC-ADMIN-003: Approve Professional
**Given** a super admin and a pending professional
**When** POST /admin/professionals/{id}/approve with approve=true
**Then** professional isApproved set to true
**And** audit log entry created

### TC-ADMIN-004: Suspend Professional (Risky Action)
**Given** a super admin and an approved professional
**When** POST /admin/professionals/{id}/suspend with suspend=true
**Then** professional isSuspended set to true
**And** audit log entry created with before/after values

### TC-ADMIN-005: Verify Professional
**Given** a super admin
**When** POST /admin/professionals/{id}/verify
**Then** professional isVerified set to true

### TC-ADMIN-006: Staff Cannot Edit Plans
**Given** an admin_staff user
**When** PUT /api/plans/{id}/price
**Then** 403 Forbidden (support staff cannot edit plans)

### TC-ADMIN-007: Create Promotion
**Given** a super admin
**When** POST /admin/promotions with valid data
**Then** 201 Created with new promotion

### TC-ADMIN-008: Moderate Review
**Given** an admin_staff or super admin
**When** POST /admin/reviews/{id}/moderate with action=approve
**Then** review status changed to APPROVED

### TC-ADMIN-009: Resolve Dispute
**Given** a super admin
**When** POST /admin/disputes/{id}/resolve with resolution and status
**Then** dispute updated with resolution and status

### TC-ADMIN-010: View Audit Log
**Given** a super admin
**When** GET /admin/audit-log
**Then** paginated list of all admin actions with actor, action, entity, before/after values

### TC-ADMIN-011: View All Payments (Admin)
**Given** a super admin
**When** GET /admin/payments
**Then** paginated list of all payments across all professionals

### TC-ADMIN-012: Manage Categories
**Given** a super admin
**When** POST /admin/categories with name and slug
**Then** 201 Created with new category

### TC-ADMIN-013: Assign Staff Role
**Given** a super admin
**When** POST /admin/staff/roles with userId and role
**Then** role assignment created

### TC-ADMIN-014: Export Data
**Given** a super admin on any admin table page
**When** export action is triggered
**Then** CSV file generated with table data

## Payments Tests (Test Mode Only)

### TC-PAY-001: Create Payment Record
**Given** a professional and an unpaid invoice
**When** POST /api/payments with test gateway data
**Then** 201 Created with payment status PENDING

### TC-PAY-002: Idempotent Webhook
**Given** a webhook with a gatewayPaymentId that already exists
**When** POST /api/payments/webhook/razorpay
**Then** payment not duplicated (idempotent)

### TC-PAY-003: Webhook Marks Invoice Paid
**Given** a webhook with status SUCCEEDED for an unpaid invoice
**When** POST /api/payments/webhook/razorpay
**Then** payment status SUCCEEDED and invoice status changed to paid

### TC-PAY-004: No Live Payment Keys
**Given** any payment code
**When** code is reviewed
**Then** no live Razorpay/Stripe keys present (test mode only)

### TC-PAY-005: Payment Authorization
**Given** professional A
**When** accessing payment belonging to professional B
**Then** 403 Forbidden

## Security Tests

### TC-SEC-001: Admin Endpoints Require Authentication
**Given** no JWT token
**When** accessing any /admin/* endpoint
**Then** 401 Unauthorized

### TC-SEC-002: Super Admin Only Endpoints
**Given** an admin_staff user
**When** accessing /admin/plans/:id/price or /admin/staff/roles
**Then** 403 Forbidden

### TC-SEC-003: Audit Log for All Admin Actions
**Given** any admin action
**When** action is performed
**Then** audit log entry created with actor, action, entity, before/after values

### TC-SEC-004: No Secrets in Logs
**Given** any payment or admin request
**When** logs are reviewed
**Then** no payment gateway secrets or API keys in logs

## Definition of Done
- All test cases pass
- No critical or high-severity bugs open
- Payment test mode only (no live keys)
- All admin actions audited
- Role-based permissions enforced within admin