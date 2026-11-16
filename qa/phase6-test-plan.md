# Phase 6: Full Testing, Security Review, Backup Restore & Private Beta QA Plan

## End-to-End Test Suite

### TC-E2E-001: Professional Sign-up & Onboarding
**Flow:** Register → Verify email → Complete profile → Add services → Add portfolio items → Submit onboarding
**Expected:** Professional profile created, services and portfolio saved, status = pending approval
**Steps:**
1. Register as professional with email/password
2. Verify email
3. Complete professional profile (business name, category, city, bio)
4. Add at least one service
5. Add at least one portfolio item
6. Submit onboarding
7. Verify profile shows isApproved = false (pending admin)

### TC-E2E-002: Client Sign-up & Browse
**Flow:** Register as client → Browse portfolios → Search by category/city → View portfolio detail
**Expected:** Client can register, search, filter, and view public portfolios without issues
**Steps:**
1. Register as client
2. Browse public portfolios
3. Filter by category and city
4. Click on a portfolio to view detail
5. Verify portfolio shows services, reviews, contact info

### TC-E2E-003: Enquiry & Lead Creation
**Flow:** Client sends enquiry → Professional receives lead → Professional updates lead status
**Expected:** Enquiry creates lead, professional can view and update lead
**Steps:**
1. Client sends enquiry from portfolio page
2. Professional views lead in pipeline
3. Professional updates lead status to "contacted"
4. Verify lead status updated

### TC-E2E-004: Booking Flow
**Flow:** Client books service → Professional confirms → Booking completed
**Expected:** Booking created with PENDING status, professional can confirm, status transitions work
**Steps:**
1. Client books a service from portfolio
2. Booking created with status PENDING
3. Professional views booking
4. Professional confirms booking (status → CONFIRMED)
5. Professional marks booking complete (status → COMPLETED)

### TC-E2E-005: Quote & Invoice Flow
**Flow:** Professional creates quote → Client accepts → Invoice created → Payment recorded
**Expected:** Quote → Invoice → Payment workflow works end-to-end
**Steps:**
1. Professional creates quote for a lead/client
2. Quote status = draft → sent
3. Professional converts quote to invoice
4. Payment recorded against invoice
5. Invoice status → paid

### TC-E2E-006: Review Flow
**Flow:** Booking completed → Client creates review → Professional approves → Professional replies
**Expected:** Review only after completed booking, professional can approve and reply
**Steps:**
1. Booking status = COMPLETED
2. Client creates review (rating + comment)
3. Review status = PENDING
4. Professional approves review
5. Professional replies to review
6. Review visible publicly with reply

### TC-E2E-007: Subscription Flow
**Flow:** Professional views plans → Subscribes → Views subscription → Cancels
**Expected:** Subscription created, active, cancellable
**Steps:**
1. Professional views available plans
2. Professional subscribes to a plan
3. Subscription created with trial (if applicable)
4. Professional views subscription details
5. Professional cancels subscription

### TC-E2E-008: Admin Panel Flow
**Flow:** Admin logs in → Views professionals → Approves one → Suspends one → Views audit log
**Expected:** Admin can manage professionals, all actions audited
**Steps:**
1. Super admin logs in
2. Views professionals list with filters
3. Approves a pending professional
4. Suspends an approved professional
5. Views audit log with both actions recorded

### TC-E2E-009: Payment Webhook (Test Mode)
**Flow:** Test webhook received → Payment status updated → Invoice marked paid
**Expected:** Webhook processed idempotently, invoice updated
**Steps:**
1. Create payment with PENDING status
2. Send test webhook with SUCCEEDED status
3. Verify payment status → SUCCEEDED
4. Verify invoice status → paid

### TC-E2E-010: Search & Portfolio Browse
**Flow:** Search by category+city → View results → Click portfolio → View detail
**Expected:** Search returns filtered results, portfolio detail loads
**Steps:**
1. Search for "makeup-artist" in "mumbai"
2. View filtered results
3. Click on a portfolio
4. Verify portfolio detail page loads with services and reviews

## Security Test Suite

### TC-SEC-001: Cross-User Data Access Prevention
**Given** professional A and professional B
**When** professional A accesses professional B's data
**Then** 403 Forbidden or 404 Not Found
**Affected endpoints:** /professional/*, /leads/*, /clients/*, /bookings/*, /quotes/*, /invoices/*, /payments/*

### TC-SEC-002: Authentication Required
**Given** no JWT token
**When** accessing any protected endpoint
**Then** 401 Unauthorized

### TC-SEC-003: Role-Based Access Control
**Given** admin_staff user
**When** accessing super_admin-only endpoints (plan price, staff roles)
**Then** 403 Forbidden

### TC-SEC-004: Input Validation
**Given** invalid input (bad email, negative price, etc.)
**When** submitting to any endpoint
**Then** 400 Bad Request with validation errors

### TC-SEC-005: Rate Limiting
**Given** 100+ requests from same IP in short time
**When** accessing public endpoints
**Then** 429 Too Many Requests

### TC-SEC-006: No Secrets in Logs
**Given** any API request/response
**When** logs are reviewed
**Then** no passwords, tokens, API keys, or payment data in logs

### TC-SEC-007: Webhook Signature Verification
**Given** webhook with invalid signature
**When** POST /api/payments/webhook/*
**Then** 400 Bad Request (signature verification middleware)

### TC-SEC-008: SQL Injection Protection
**Given** malicious SQL in input fields
**When** submitting to any endpoint
**Then** Query executed safely (Prisma parameterized queries), no data leakage

## Performance Tests

### TC-PERF-001: Page Load Time
**Given** portfolio detail page
**When** page loads
**Then** Loads in < 3 seconds on 3G network

### TC-PERF-002: API Response Time
**Given** GET /api/portfolios with pagination
**When** requesting page 1 with 20 items
**Then** Response in < 500ms

### TC-PERF-003: Concurrent Users
**Given** 50 concurrent users
**When** accessing the platform
**Then** No errors, response times remain acceptable

## Accessibility Tests

### TC-A11Y-001: Keyboard Navigation
**Given** keyboard-only user
**When** navigating the site
**Then** All interactive elements reachable via Tab

### TC-A11Y-002: Color Contrast
**Given** text on colored backgrounds
**When** contrast is checked
**Then** Minimum 4.5:1 contrast ratio

### TC-A11Y-003: Touch Targets
**Given** touch interface
**When** interactive elements are checked
**Then** Minimum 44px x 44px touch targets

### TC-A11Y-004: ARIA Labels
**Given** screen reader user
**When** navigating forms and buttons
**Then** All elements have appropriate ARIA labels

## Mobile Tests

### TC-MOB-001: Responsive Layout
**Given** mobile device (375px width)
**When** viewing any page
**Then** Layout adapts, no horizontal scrolling

### TC-MOB-002: Touch Interactions
**Given** mobile device
**When** tapping buttons and forms
**Then** All interactions work correctly

## Definition of Done
- All E2E tests pass
- All security tests pass (no open high-severity items)
- Performance within thresholds
- Accessibility requirements met
- Mobile layouts verified
- QA signs off on release candidate