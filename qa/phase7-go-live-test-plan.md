# Phase 7: Go-Live Test Plan

## Overview
Final verification before production launch. All tests must pass before owner approves go-live.

**⚠️ Owner approval required before any production action.**

## Pre-Launch Verification Checklist

### Infrastructure
| Check | Command/Method | Expected | Status |
|-------|----------------|----------|--------|
| Production GCP project created | `gcloud projects list` | glamhub-prod exists | [ ] |
| Billing linked | `gcloud beta billing projects list` | glamhub-prod linked | [ ] |
| APIs enabled | `gcloud services list --project=glamhub-prod` | All required APIs | [ ] |
| Artifact Registry created | `gcloud artifacts repositories list` | glamhub-repo exists | [ ] |
| Cloud SQL instance running | `gcloud sql instances list` | glamhub-prod-db RUNNABLE | [ ] |
| Cloud SQL database created | `gcloud sql databases list` | glamhub exists | [ ] |
| Secrets configured | `gcloud secrets list` | All prod secrets present | [ ] |
| Budget alerts active | `gcloud billing budgets list` | Production budget set | [ ] |

### Deployment
| Check | Method | Expected | Status |
|-------|--------|----------|--------|
| API container deployed | `gcloud run services list --platform=managed --region=asia-south1` | api-prod exists | [ ] |
| Web container deployed | `gcloud run services list` | web-prod exists | [ ] |
| Custom domains mapped | `gcloud run domain-mappings list` | api.glamhub, www.glamhub | [ ] |
| SSL certificates active | Browser check | Green lock icon | [ ] |
| Min instances = 1 | Cloud Run console | min-instances: 1 | [ ] |
| Max instances = 10 | Cloud Run console | max-instances: 10 | [ ] |

### Database
| Check | Method | Expected | Status |
|-------|--------|----------|--------|
| Migrations applied | `npx prisma migrate status` | All applied | [ ] |
| Seed data loaded | `SELECT count(*) FROM "Category"` | 6 categories | [ ] |
| Seed data loaded | `SELECT count(*) FROM "Plan"` | 4 plans | [ ] |
| Super admin exists | `SELECT * FROM "User" WHERE role='SUPER_ADMIN'` | 1 record | [ ] |
| Automated backups enabled | Cloud SQL console | Daily backups ON | [ ] |
| Point-in-time recovery enabled | Cloud SQL console | Binary logging ON | [ ] |

### Security
| Check | Method | Expected | Status |
|-------|--------|----------|--------|
| Webhook signature verification | Code review | Implemented | [ ] |
| Rate limiting active | Test with load tool | 429 after threshold | [ ] |
| Security headers present | `curl -I https://api.glamhub` | CSP, HSTS, X-Frame-Options | [ ] |
| JWT expiration configured | Code review | 15min access, 7d refresh | [ ] |
| No secrets in code | `grep -r "sk_live\|pk_live"` | No matches | [ ] |
| CORS origins restricted | Code review | Only allowed domains | [ ] |
| Audit logging active | Check audit_log table | Entries on admin actions | [ ] |

### Payments (Test Mode Until Owner Approves Live)
| Check | Method | Expected | Status |
|-------|--------|----------|--------|
| Razorpay/Stripe test keys | Secret Manager | Test keys only | [ ] |
| Test payment flow works | Create test payment | Status = test_mode | [ ] |
| Webhook idempotency | Send duplicate webhook | No duplicate payment | [ ] |
| Invoice marked paid on success | Test webhook | Invoice status = paid | [ ] |
| Owner approval for live mode | Written approval | Documented | [ ] |

### Monitoring
| Check | Method | Expected | Status |
|-------|--------|----------|--------|
| Uptime checks configured | Cloud Monitoring | API + web endpoints | [ ] |
| Alert policies active | Cloud Monitoring | 5xx, latency, downtime | [ ] |
| Log-based metrics | Cloud Logging | Error rate, latency | [ ] |
| Dashboard created | Cloud Monitoring | Key metrics visible | [ ] |
| Notification channels | Cloud Monitoring | Email + Slack/PagerDuty | [ ] |

### Functional Smoke Tests (Run in Production)

#### TC-GO-001: Professional Signup Flow
1. Visit https://www.glamhub.example.com
2. Click "Join as Professional"
3. Register with email/password
4. Verify email
5. Complete profile, services, portfolio
6. Submit for admin approval
**Expected:** Account created, profile pending approval

#### TC-GO-002: Client Signup & Browse
1. Register as client
2. Search portfolios by category+city
3. View portfolio detail
4. Send enquiry
**Expected:** All steps work without errors

#### TC-GO-003: Admin Approve Professional
1. Login as super admin
2. Navigate to admin/professionals
3. Approve a pending professional
3. Verify professional can now login and access dashboard
**Expected:** Professional approved, can access dashboard

#### TC-GO-004: Booking Flow
1. Client books approved professional's service
2. Professional confirms booking
3. Professional marks booking complete
4. Client leaves review
**Expected:** Full booking → complete → review flow works

#### TC-GO-005: Subscription Flow
1. Professional views plans
2. Subscribes to Starter plan (test mode)
3. Views subscription in dashboard
**Expected:** Subscription created, trial applied if applicable

#### TC-GO-006: Payment Webhook (Test Mode)
1. Create test payment record
2. Send test webhook (SUCCEEDED)
3. Verify payment status updated
4. Verify invoice marked paid
**Expected:** Idempotent processing, invoice paid

#### TC-GO-007: Admin Panel Functions
1. Admin views all professionals
2. Admin suspends a professional
3. Admin creates a coupon
4. Admin views audit log
**Expected:** All admin functions work, audit log entries created

#### TC-GO-008: Notifications (Test Mode)
1. Trigger booking confirmation email
2. Trigger WhatsApp notification
3. Verify logged in test mode
**Expected:** Emails/WhatsApp logged, not actually sent

#### TC-GO-009: PWA Features
1. Visit site on mobile
2. Verify install prompt appears
3. Install app
4. Verify offline page loads
**Expected:** PWA installable, offline works

#### TC-GO-010: Search & SEO
1. Search for professionals by category+city
2. View portfolio page
3. Check meta tags (title, description, OG tags)
4. Check structured data (Schema.org)
**Expected:** Results returned, SEO tags present

## Rollback Verification
| Check | Method | Expected | Status |
|-------|--------|----------|--------|
| Previous revision exists | `gcloud run revisions list` | At least 1 previous | [ ] |
| Rollback command tested | `gcloud run deploy --revision=PREV` | Rolls back in <5 min | [ ] |
| Database rollback plan | Documented | Point-in-time recovery steps | [ ] |

## Go-Live Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| QA Lead | | | |
| Security Reviewer | | | |
| DevOps Engineer | | | |
| Product Owner | | | |

**All checks must be [ ] before owner approves go-live.**

## Post-Launch (First 24 Hours)
- [ ] Monitor error rates (target: < 0.1%)
- [ ] Monitor latency (target: p95 < 500ms)
- [ ] Monitor payment success rate
- [ ] Check support ticket volume
- [ ] Verify backup completed
- [ ] Daily standup with team

**Prepared by:** qa-test-engineer
**Date:** 2026-11-16
**Status:** Ready for execution