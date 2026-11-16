# Phase 2 QA Test Plan

## Onboarding Tests

### TC-ONB-001: Professional Profile Creation
**Given** a logged-in professional user
**When** they submit valid profile details (business name, category, city, bio)
**Then** the profile is created and stored with their user ID
**And** a 200 response is returned with the profile data

### TC-ONB-002: Profile Authorization
**Given** a professional user
**When** they attempt to update another professional's profile
**Then** a 403 Forbidden is returned

### TC-ONB-003: Service Creation
**Given** a logged-in professional with a profile
**When** they create a service with valid name, price, duration, category
**Then** the service is linked to their professional profile
**And** the service appears in their services list

### TC-ONB-004: Portfolio Item Creation
**Given** a logged-in professional
**When** they upload a portfolio item with image URL and details
**Then** the portfolio item is linked to their profile
**And** it appears in their portfolio list

### TC-ONB-005: Onboarding Completion
**Given** a professional with completed profile, services, and portfolio
**When** they submit onboarding completion
**Then** their profile is marked as pending admin approval

## Leads Tests

### TC-LEAD-001: Lead Creation from Enquiry
**Given** a client submits an enquiry
**When** the enquiry is received
**Then** a lead is created with status "new" and score 0

### TC-LEAD-002: Lead Status Update
**Given** a lead in "new" status
**When** the professional updates status to "contacted"
**Then** the lead status is updated
**And** the change is audited

### TC-LEAD-003: Lead Authorization
**Given** professional A
**When** professional A accesses lead belonging to professional B
**Then** 404 Not Found is returned

### TC-LEAD-004: Lead Pagination
**Given** 25 leads for a professional
**When** page=1, limit=10 is requested
**Then** 10 leads are returned with total=25

## Clients Tests

### TC-CLIENT-001: Client Auto-Creation
**Given** a booking is completed
**When** the client does not exist
**Then** a client record is created automatically

### TC-CLIENT-002: Client List with Booking Count
**Given** a professional with clients who have bookings
**When** the client list is requested
**Then** each client shows total bookings and total spent

### TC-CLIENT-003: Client Search and Filter
**Given** multiple clients
**When** searching by name
**Then** only matching clients are returned

## Bookings Tests

### TC-BOOK-001: Create Booking
**Given** a client and a service with available time slot
**When** the client books the service
**Then** a booking with status "PENDING" is created
**And** the total amount matches the service price

### TC-BOOK-002: Double Booking Prevention
**Given** a service has a confirmed booking from 10:00-11:00
**When** another client tries to book 10:30-11:30
**Then** a 400 Bad Request is returned with "Time slot is already booked"

### TC-BOOK-003: Booking Status Update by Professional
**Given** a pending booking
**When** the professional confirms it
**Then** the status changes to "CONFIRMED"

### TC-BOOK-004: Client Cannot Update Booking Status
**Given** a booking
**When** the client attempts to change status
**Then** 403 Forbidden is returned

### TC-BOOK-005: Booking Authorization
**Given** professional A
**When** professional A accesses booking belonging to professional B
**Then** 403 Forbidden is returned

## Quotes Tests

### TC-QUOTE-001: Create Quote
**Given** a professional and a client
**When** the professional creates a quote
**Then** the quote is created with status "draft"
**And** linked to the professional and client

### TC-QUOTE-002: Quote Status Update
**Given** a draft quote
**When** the professional updates status to "sent"
**Then** the quote status is updated

### TC-QUOTE-003: Quote Authorization
**Given** professional A
**When** professional A accesses quote belonging to professional B
**Then** 404 Not Found is returned

## Invoices Tests

### TC-INV-001: Invoice Creation from Quote
**Given** an accepted quote
**When** the quote is converted
**Then** an invoice is created with the quote amount
**And** status "unpaid"

### TC-INV-002: Mark Invoice as Paid
**Given** an unpaid invoice
**When** the professional marks it as paid
**Then** status changes to "paid"
**And** paidAt timestamp is set

### TC-INV-003: Client Views Their Invoices
**Given** a client with invoices
**When** the client requests their invoices
**Then** only their invoices are returned

### TC-INV-004: Only Professional Can Update Invoice
**Given** an invoice
**When** the client attempts to update status
**Then** 403 Forbidden is returned

## Security Tests

### TC-SEC-001: Unauthenticated Access
**Given** no authentication token
**When** accessing any Phase 2 endpoint
**Then** 401 Unauthorized is returned

### TC-SEC-002: Rate Limiting on Login
**Given** 10 failed login attempts from same IP
**When** the 11th attempt is made
**Then** rate limit is enforced

### TC-SEC-003: Input Validation
**Given** invalid email format in profile update
**When** the update is submitted
**Then** 400 Bad Request with validation errors

### TC-SEC-004: No Secrets in Logs
**Given** any API request
**When** logs are reviewed
**Then** no passwords, tokens, or secrets appear in logs

## Definition of Done
- All test cases pass
- No critical or high-severity bugs open
- Code coverage > 80% for Phase 2 endpoints