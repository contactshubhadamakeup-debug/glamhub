# Phase 5 QA Test Plan

## AI Reply Drafts Tests

### TC-AI-001: Generate Reply Draft
**Given** a logged-in professional with an enquiry
**When** POST /api/ai/draft-reply with valid enquiry data
**Then** 200 OK with suggestedReply, confidence, and fallback fields
**And** suggestedReply is a non-empty string

### TC-AI-002: AI Never Auto-Sends
**Given** a draft reply has been generated
**When** reviewing the draft
**Then** the professional must explicitly click "Send" — no automatic sending

### TC-AI-003: Minimum Data to AI
**Given** any AI request
**When** data is prepared for the AI model
**Then** no ID documents, payment data, or secrets are included

### TC-AI-004: Fallback When AI Unavailable
**Given** AI service is unavailable
**When** generating a reply draft
**Then** fallback is true and a template-based reply is returned

### TC-AI-005: Draft Reply Authorization
**Given** professional A
**When** attempting to draft a reply for professional B's enquiry
**Then** 403 Forbidden

## Lead Scoring Tests

### TC-AI-006: Score a Lead
**Given** a logged-in professional with leads
**When** POST /api/ai/leads/{id}/score
**Then** 200 OK with score (0-100) and factors array
**And** lead score is updated in database

### TC-AI-007: Score Range
**Given** any lead
**When** scored
**Then** score is between 0 and 100

## Follow-up Suggestions Tests

### TC-AI-008: Get Follow-up Suggestions
**Given** a logged-in professional with quotes older than 7 days
**When** POST /api/ai/follow-up-suggestions
**Then** 200 OK with array of follow-up suggestions
**And** each suggestion includes quoteId, clientName, daysSinceQuote, suggestedMessage

### TC-AI-009: Only Unresponsive Quotes
**Given** quotes with various statuses
**When** requesting follow-up suggestions
**Then** only quotes with status "sent" and older than 7 days are included

## Analytics Insights Tests

### TC-AI-010: Get Analytics Insights
**Given** a logged-in professional with bookings
**When** GET /api/ai/analytics/insights
**Then** 200 OK with bookingTrends, revenueByService, clientRetentionRate, leadConversionRate, totalBookings, totalRevenue

### TC-AI-011: Booking Trends Date Range
**Given** analytics request
**When** response is returned
**Then** bookingTrends covers the last 7 days

### TC-AI-012: Analytics Authorization
**Given** professional A
**When** accessing analytics for professional B
**Then** 403 Forbidden

## Email Notification Tests

### TC-NOT-001: Send Email (Test Mode)
**Given** valid email data
**When** POST /api/notifications/email
**Then** 200 OK with status "sent_test_mode"

### TC-NOT-002: Booking Confirmation Email
**Given** a professional with a new booking
**When** POST /api/notifications/booking-confirmation/{id}
**Then** email sent to professional and client (test mode)

### TC-NOT-003: Email Test Mode Indicator
**Given** any email notification
**When** checking the response
**Then** status indicates test mode (not live)

## WhatsApp Notification Tests

### TC-NOT-004: Send WhatsApp (Test Mode)
**Given** valid WhatsApp data
**When** POST /api/notifications/whatsapp
**Then** 200 OK with status "sent_test_mode"

### TC-NOT-005: WhatsApp Opt-in Default
**Given** a new user
**When** checking notification preferences
**Then** whatsappNotifications defaults to false

## Notification Preferences Tests

### TC-NOT-006: Get Preferences
**Given** a logged-in user
**When** GET /api/notifications/preferences
**Then** 200 OK with emailNotifications and whatsappNotifications

### TC-NOT-007: Update Preferences
**Given** a logged-in user
**When** PUT /api/notifications/preferences with new values
**Then** preferences are updated and returned

## PWA Tests

### TC-PWA-001: Manifest Exists
**Given** GET /manifest.json
**Then** 200 OK with valid web app manifest
**And** manifest includes name, start_url, display, icons

### TC-PWA-002: Service Worker Exists
**Given** GET /sw.js
**Then** 200 OK with service worker script
**And** service worker registers and caches static assets

### TC-PWA-003: Install Prompt
**Given** a supported browser
**When** visiting the site
**Then** install prompt is shown (or can be triggered)

### TC-PWA-004: Offline Fallback
**Given** no network connection
**When** visiting a cached page
**Then** page loads from cache

## Security Tests

### TC-SEC-001: AI Endpoints Require Authentication
**Given** no JWT token
**When** accessing any /api/ai/* endpoint
**Then** 401 Unauthorized

### TC-SEC-002: No Secrets in AI Requests
**Given** any AI request
**When** reviewing the code
**Then** no API keys or secrets are sent to the AI model

### TC-SEC-003: No Secrets in Notification Logs
**Given** any notification sent
**When** logs are reviewed
**Then** no payment data or secrets appear in logs

## Definition of Done
- All test cases pass
- No critical or high-severity bugs open
- AI features have fallback when AI unavailable
- Notifications in test mode only
- PWA installable and works offline