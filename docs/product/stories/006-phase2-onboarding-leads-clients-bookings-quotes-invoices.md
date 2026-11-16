# Phase 2: Onboarding, Leads, Clients, Calendar, Quotes & Invoices

## User Stories

### Onboarding
**PM-201** As a new professional, I want to complete onboarding (profile, services, portfolio) so that I can start receiving bookings.
- [ ] Professional can edit business name, category, city, bio
- [ ] Professional can add services with price and duration
- [ ] Professional can upload portfolio items with images
- [ ] Onboarding progress is tracked step-by-step
- [ ] Onboarding completion marks professional profile as complete

### Leads Pipeline
**PM-202** As a professional, I want to view and manage leads so that I can convert them into clients.
- [ ] Leads are created from client enquiries
- [ ] Lead status: new, contacted, quoted, booked, lost
- [ ] Professional can update lead status
- [ ] Professional can add notes to leads
- [ ] AI lead scoring (0-100) displayed

### Clients
**PM-203** As a professional, I want to manage my client list so that I can track relationships.
- [ ] Client created automatically on first booking
- [ ] Client list shows name, email, phone, total bookings, total spent
- [ ] Professional can search and filter clients
- [ ] Client detail shows booking history

### Calendar & Bookings
**PM-204** As a client, I want to book a service with a professional so that I can schedule an appointment.
- [ ] Client can view professional's available time slots
- [ ] Client can select date and time for booking
- [ ] Booking creates pending status awaiting confirmation
- [ ] Professional can confirm or cancel booking
- [ ] Booking status: pending, confirmed, completed, cancelled, refunded

### Quotes & Invoices
**PM-205** As a professional, I want to create quotes and invoices so that I can get paid for my services.
- [ ] Professional can create a quote from a lead or directly
- [ ] Quote can be converted to an invoice
- [ ] Invoice tracks payment status (unpaid, paid, overdue, cancelled)
- [ ] Professional can mark invoice as paid
- [ ] Client can view their invoices

## Acceptance Criteria Summary
- All endpoints have unit and integration tests
- Authorization enforced: professional can only access own data
- Rate limiting on public endpoints
- Pagination on all list endpoints
- Structured logging without personal data

## Definition of Done
- All Phase 2 endpoints match API contract
- Frontend screens match designs
- QA tests pass
- Code reviewer approves