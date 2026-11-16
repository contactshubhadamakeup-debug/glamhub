// src/notifications/notifications.security-checklist.md
# Notifications Security Checklist

## Test Mode
- [x] Email notifications in test mode (logged, not sent)
- [x] WhatsApp notifications in test mode (logged, not sent)
- [x] Real API keys added by owner into Secret Manager only
- [x] No live WhatsApp or email sending without owner approval

## Data Protection
- [x] No payment data in notification content
- [x] No ID documents in notification content
- [x] Minimum personal data in messages (name, booking reference only)

## Opt-in/Opt-out
- [x] WhatsApp notifications default off (user must opt in)
- [x] Email notifications default on (user can opt out)
- [x] Notification preferences stored per user

## Rate Limiting
- [ ] Rate limiting on notification endpoints (to be implemented)
- [ ] Prevent notification spam

## Open High-Severity Items
- [ ] Rate limiting middleware for notification endpoints
- [ ] WhatsApp template approval process (WhatsApp Business requirement)

**Status:** 2 open items