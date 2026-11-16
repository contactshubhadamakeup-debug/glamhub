# Phase 5: AI Assistant, WhatsApp & Email Notifications, Analytics, PWA Polish

## User Stories

### AI Reply Drafts
**PM-501** As a professional, I want AI to draft replies to client enquiries so that I can respond faster.
- [ ] AI suggests reply drafts based on enquiry message
- [ ] Professional reviews and edits before sending
- [ ] AI never auto-sends without explicit professional action
- [ ] Minimum data sent to AI (no ID docs, payment data, secrets)

### Lead Scoring
**PM-502** As a professional, I want AI to score my leads so that I can prioritize high-value opportunities.
- [ ] AI assigns score (0-100) to each lead
- [ ] Score based on enquiry details, service interest, message content
- [ ] Score visible in lead pipeline

### Follow-up Suggestions
**PM-503** As a professional, I want AI to suggest follow-ups for quiet quotes so that I don't lose potential clients.
- [ ] AI identifies quotes with no response after X days
- [ ] AI suggests follow-up message
- [ ] Professional approves before sending

### Analytics Insights
**PM-504** As a professional, I want simple analytics insights so that I can understand my business performance.
- [ ] Booking trends over time
- [ ] Revenue by service/category
- [ ] Client retention rate
- [ ] Lead conversion rate

### Email Notifications
**PM-505** As a user, I want email notifications for key events so that I stay informed.
- [ ] Booking confirmation email to client and professional
- [ ] Enquiry notification email to professional
- [ ] Invoice payment reminder
- [ ] Subscription renewal notice

### WhatsApp Notifications
**PM-506** As a user, I want WhatsApp notifications for key events so that I get instant updates.
- [ ] Booking confirmation via WhatsApp
- [ ] Enquiry alert via WhatsApp
- [ ] Payment received via WhatsApp
- [ ] Opt-in/opt-out for WhatsApp notifications

### PWA Polish
**PM-507** As a user, I want the app to be installable and work offline so that I can use it like a native app.
- [ ] PWA manifest with app name, icons, colors
- [ ] Service worker for offline caching
- [ ] Install prompt on supported browsers
- [ ] Offline fallback for core pages

## Acceptance Criteria Summary
- AI only suggests, never auto-sends (explicit professional setting required)
- Minimum data sent to AI (no sensitive data)
- AI features have fallback when AI is unavailable
- Notifications use test/sandbox mode unless owner approves live
- PWA installable and works offline
- All features have unit and integration tests

## Definition of Done
- All Phase 5 endpoints match API contract
- Frontend screens match designs
- QA tests pass
- Code reviewer approves
- AI features tested for tone, accuracy, safety