# Phase 3: Public Portfolios, Search, Enquiries, Bookings & Verified Reviews

## User Stories

### Public Portfolios
**PM-301** As a client, I want to browse public portfolios so that I can discover professionals.
- [ ] Public portfolio pages accessible without authentication
- [ ] Portfolio shows professional info, services, gallery, reviews
- [ ] Portfolio pages have SEO meta tags and structured data
- [ ] Mobile-responsive layout

### Search
**PM-302** As a client, I want to search professionals by category and city so that I can find local services.
- [ ] Search by category (makeup, hair, nails, etc.)
- [ ] Search by city
- [ ] Combined category + city filter
- [ ] Paginated results
- [ ] Search results sorted by rating/relevance

### Enquiries
**PM-303** As a client, I want to send an enquiry to a professional so that I can ask about services before booking.
- [ ] Enquiry form on portfolio page
- [ ] Enquiry creates a lead for the professional
- [ ] Client receives confirmation
- [ ] Professional notified of new enquiry

### Bookings (Public-facing)
**PM-304** As a client, I want to book a service from a public portfolio so that I can schedule an appointment.
- [ ] Book button on portfolio page
- [ ] Client can select date/time slot
- [ ] Booking creates pending status
- [ ] Client receives booking confirmation

### Verified Reviews
**PM-305** As a client, I want to leave a review after a completed booking so that I can share my experience.
- [ ] Review only allowed after completed booking
- [ ] One review per booking
- [ ] Rating 1-5 stars + comment
- [ ] Review pending until approved by professional/admin
- [ ] Professional can reply to reviews

## Acceptance Criteria Summary
- All public endpoints rate-limited
- Portfolio pages server-rendered for SEO
- Reviews linked to completed bookings (enforced in DB)
- Professional cannot see client data without booking
- All states: empty, loading, error, success

## Definition of Done
- All Phase 3 endpoints match API contract
- Frontend screens match designs
- QA tests pass
- Code reviewer approves