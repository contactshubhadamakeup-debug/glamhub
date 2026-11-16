# GlamHub Support Process

## Overview
This document describes the support process for GlamHub after launch.

## Support Channels

| Channel | Contact | Hours | Response SLA |
|---------|---------|-------|--------------|
| Email | support@glamhub.example.com | 24/7 | Normal: 24h, Critical: 4h |
| WhatsApp | +91-XXXXXXXXXX | Business hours (9 AM - 6 PM IST) | Normal: 4h, Critical: 1h |
| In-app Help | Help Centre | Self-service | Instant |

## Support Tiers

### Tier 1: General Support
- **Handled by:** Support team (can be trained customer service)
- **Scope:** Password resets, how-to questions, billing inquiries, booking issues
- **Tools:** Support ticket system, FAQ, user guides
- **Escalation:** If unresolved in 24 hours → Tier 2

### Tier 2: Technical Support
- **Handled by:** Engineering team / senior support
- **Scope:** Bugs, API issues, payment failures, data issues, complex account problems
- **Tools:** Cloud Logging, database access (read-only), admin panel
- **Escalation:** If critical production issue → Tier 3

### Tier 3: Engineering / Critical
- **Handled by:** Lead engineers / on-call
- **Scope:** Production outages, security incidents, data corruption, payment gateway issues
- **Tools:** Full infrastructure access, deployment rollback
- **Response:** Immediate (on-call rotation)

## Ticket Classification

| Priority | Definition | Response SLA | Resolution SLA |
|----------|------------|--------------|----------------|
| P1 - Critical | Production down, data loss, security breach, payment failures | 30 minutes | 4 hours |
| P2 - High | Major feature broken, many users affected, data inconsistency | 2 hours | 24 hours |
| P3 - Normal | Single user issue, minor bug, usability question | 8 hours | 72 hours |
| P4 - Low | Feature request, documentation improvement, cosmetic | 24 hours | Next release |

## Common Issues & Resolution

### Account & Login
| Issue | Resolution |
|-------|------------|
| Forgot password | Use "Forgot Password" on login page → email reset link |
| Didn't receive OTP | Check spam, resend OTP, verify phone number format |
| Google login failed | Clear browser cache, try incognito, check Google account |
| Account locked | Contact support for manual unlock |

### Booking Issues
| Issue | Resolution |
|-------|------------|
| Booking not confirmed | Professional must confirm within 24h; else auto-expires |
| Double booking | System prevents; if occurs, cancel one, notify client |
| Time slot unavailable | Client must select available slot; professional manages calendar |
| Booking cancellation | Professional: cancel in dashboard; Client: request via support |

### Payment Issues
| Issue | Resolution |
|-------|------------|
| Payment failed | Check card details, try different payment method, retry |
| Refund request | Admin processes via dashboard; 5-7 business days |
| Invoice not marked paid | Check payment webhook logs; manual mark if test mode |
| Subscription charge failed | Grace period 7 days; then downgrade to Free plan |

### Professional Profile
| Issue | Resolution |
|-------|------------|
| Profile not approved | Wait for admin review (24-48h); check email for rejection reason |
| Suspended account | Contact support; admin reviews and unsuspends if appropriate |
| Can't add services | Check plan limits (client/photo limits per plan) |
| Portfolio images not loading | Check image URL, size < 5MB, format JPG/PNG/WebP |

## Support Tools

### Admin Panel Access
- **Super Admin:** Full access (professionals, plans, reviews, disputes, payments, audit log)
- **Admin Staff:** Limited (professionals, reviews, disputes, payments view)
- **Support Staff:** Read-only access to user profiles, bookings, payments

### Database Access
- **Read-only:** Support team for debugging (via Cloud SQL proxy)
- **Write:** Engineering only (with audit log)

### Logging
- **Cloud Logging:** All API requests, errors, warnings
- **Structured logs:** No PII, no secrets
- **Retention:** 30 days default, 1 year for audit logs

## Escalation Process

```
P1 Critical → On-call engineer paged → 30 min response
  ↓
If not resolved in 2h → Engineering lead notified
  ↓
If not resolved in 4h → CTO / Owner notified
```

## Communication Templates

### Acknowledgment (Auto-reply)
> Thank you for contacting GlamHub Support. Your ticket #[TICKET_ID] has been received.
> We aim to respond within [SLA] hours. For urgent issues, reply "URGENT" to this email.

### Status Update
> Hi [Name],
> 
> Update on your ticket #[TICKET_ID]: [Status description].
> Expected resolution: [Timeframe].
> 
> We'll update you again by [Time].
> 
> Thanks,
> GlamHub Support

### Resolution
> Hi [Name],
> 
> Your ticket #[TICKET_ID] has been resolved.
> 
> What was done: [Description]
> 
> If the issue persists, reply to this email to reopen.
> 
> Thanks,
> GlamHub Support

## Support Metrics (Tracked Weekly)

| Metric | Target |
|--------|--------|
| First response time (P1) | < 30 min |
| First response time (P2) | < 2 hours |
| Resolution rate (72h) | > 80% |
| Customer satisfaction (CSAT) | > 4.5/5 |
| Tickets per 1000 users | < 50 |
| Reopen rate | < 10% |

## On-Call Rotation

- **Primary:** Lead backend engineer
- **Secondary:** Lead frontend engineer
- **Escalation:** CTO / Technical owner
- **Schedule:** Weekly rotation, published in shared calendar

## Knowledge Base Maintenance

- Update FAQ after every release
- Document new common issues monthly
- Review and archive outdated articles quarterly
- Link help centre articles in support replies

**Prepared by:** technical-writer
**Date:** 2026-11-16
**Status:** Ready for owner review