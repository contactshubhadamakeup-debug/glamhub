# Phase 3 QA Test Plan

## Public Portfolios Tests

### TC-PORT-001: Browse Public Portfolios
**Given** no authentication
**When** GET /api/portfolios?category=makeup-artist&city=mumbai
**Then** 200 OK with paginated portfolio items
**And** only approved, non-suspended professionals are returned

### TC-PORT-002: Public Portfolio Detail
**Given** a valid portfolio ID
**When** GET /api/portfolios/{id}
**Then** 200 OK with professional details, services, reviews, portfolio items
**And** 404 if portfolio doesn't exist or professional is not approved

### TC-PORT-003: Professional Own Portfolio (Authenticated)
**Given** a logged-in professional
**When** GET /api/portfolios/me/items
**Then** 200 OK with only their portfolio items
**And** 401 if not authenticated

### TC-PORT-004: Create Portfolio Item
**Given** a logged-in professional
**When** POST /api/portfolios/items with valid data
**Then** 201 Created with portfolio item linked to their profile
**And** 403 if accessing another professional's items

### TC-PORT-005: Delete Portfolio Item (Soft Delete)
**Given** a portfolio item owned by the professional
**When** DELETE /api/portfolios/items/{id}
**Then** deletedAt is set (soft delete)
**And** item no longer appears in public listings

## Search Tests

### TC-SEARCH-001: Search by Category
**Given** category filter
**When** GET /api/search/professionals?category=makeup-artist
**Then** only makeup artists are returned

### TC-SEARCH-002: Search by City
**Given** city filter
**When** GET /api/search/professionals?city=mumbai
**Then** only professionals in Mumbai are returned

### TC-SEARCH-003: Combined Category + City
**Given** both filters
**When** GET /api/search/professionals?category=hair-stylist&city=delhi
**Then** only hair stylists in Delhi are returned

### TC-SEARCH-004: Search Pagination
**Given** 50 matching professionals
**When** page=1, limit=10
**Then** 10 results returned with total=50

### TC-SEARCH-005: Results Sorted by Rating
**Given** multiple professionals
**When** search is executed
**Then** results ordered by rating descending, then total reviews

### TC-SEARCH-006: Get Categories
**Given** GET /api/search/categories
**Then** 200 OK with active categories list

### TC-SEARCH-007: Get Cities
**Given** GET /api/search/cities
**Then** 200 OK with distinct cities from approved professionals

## Enquiries Tests

### TC-ENQ-001: Create Enquiry (Public)
**Given** no authentication (public)
**When** POST /api/enquiries with valid enquiry data
**Then** 201 Created with lead created
**And** lead status is "new"

### TC-ENQ-002: Create Enquiry (Authenticated Client)
**Given** a logged-in client
**When** POST /api/enquiries
**Then** lead is created linked to professional

### TC-ENQ-003: Enquiry to Non-Existent Professional
**Given** invalid professionalId
**When** POST /api/enquiries
**Then** 404 Not Found

### TC-ENQ-004: Professional Views Their Enquiries
**Given** a logged-in professional
**When** GET /api/enquiries
**Then** 200 OK with only their leads (from enquiries)
**And** 403 if not professional role

## Reviews Tests

### TC-REV-001: Create Review After Completed Booking
**Given** a logged-in client with a COMPLETED booking
**When** POST /api/reviews with valid rating and comment
**Then** 201 Created with review status PENDING
**And** review linked to booking and client

### TC-REV-002: Review Only After Completed Booking
**Given** a booking with status PENDING
**When** client tries to create review
**Then** 400 Bad Request: "Reviews are only allowed after completed bookings"

### TC-REV-003: One Review Per Booking
**Given** a booking that already has a review
**When** client tries to create another review
**Then** 400 Bad Request: "A review already exists for this booking"

### TC-REV-004: Rating Validation
**Given** rating 0 or 6
**When** creating review
**Then** 400 Bad Request: "Rating must be between 1 and 5"

### TC-REV-005: Review Authorization
**Given** client A
**When** client A tries to review booking belonging to client B
**Then** 403 Forbidden

### TC-REV-006: Get Approved Reviews
**Given** GET /api/reviews/professional/{id}
**Then** only APPROVED reviews are returned
**And** reviews include client name and professional replies

### TC-REV-007: Professional Approves/Rejects Review
**Given** a PENDING review for the professional
**When** PUT /api/reviews/{id}/approve with approve=true
**Then** review status changes to APPROVED
**And** review becomes visible publicly

### TC-REV-008: Professional Replies to Approved Review
**Given** an APPROVED review without a reply
**When** POST /api/reviews/{id}/reply with reply text
**Then** 201 Created with review reply
**And** 400 if review not approved or reply already exists

### TC-REV-009: Professional Cannot Reply to Other's Review
**Given** professional A
**When** professional A replies to review for professional B
**Then** 404 Not Found

## Security Tests

### TC-SEC-001: Public Endpoints Rate Limited
**Given** repeated requests to /api/portfolios
**When** rate limit exceeded
**Then** 429 Too Many Requests

### TC-SEC-002: No Personal Data in Public Responses
**Given** GET /api/portfolios/{id}
**Then** response does not include client contact info, email, or phone

### TC-SEC-003: Review Data Isolation
**Given** professional A
**When** accessing pending reviews
**Then** only reviews for professional A are returned

## Definition of Done
- All test cases pass
- No critical or high-severity bugs open
- Public endpoints rate-limited
- Review booking-completion rule enforced in database