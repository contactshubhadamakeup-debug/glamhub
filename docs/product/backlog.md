# GlamHub Product Backlog

## MVP (Phase 0 — Foundation)

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| PM-001 | Set up project structure (CLAUDE.md, agent definitions, docs folders) | CLAUDE.md exists; 16 agent files exist in `.claude/agents/`; docs folders created |
| PM-002 | Define system architecture and API contract | OpenAPI contract published; folder structure documented; Orchestrator confirms agents can start |
| PM-003 | Design PostgreSQL schema and Prisma models | All 19 tables modeled; migrations apply cleanly on empty DB; seed data loads |
| PM-004 | Implement Firebase Auth (email, phone OTP, Google) + roles | Users can sign up/login; role-based access enforced |
| PM-005 | Deploy first version to GCP staging | staging deploys automatically from main branch |

## MVP (Phase 1 — Auth & Deployment)

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| PM-006 | Professional signup and onboarding | Professional can create profile, select category |
| PM-007 | Client browse portfolios | Clients can view public portfolio pages |
| PM-008 | Enquiries and bookings | Clients can send enquiry, book after viewing portfolio |
| PM-009 | Quotes and invoices | Professionals can create quotes; clients can pay invoices |
| PM-010 | Verified reviews (post-booking only) | Reviews only allowed after completed booking |

## MVP (Phase 2 — Marketplace Core)

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| PM-011 | Plans, subscriptions, coupons | Professionals can subscribe; coupons apply discounts |
| PM-012 | Super Admin panel | Admin can approve/suspend professionals, manage plans, view audit log |

## MVP (Phase 3 — Payments & Admin)

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| PM-013 | AI reply drafts + lead scoring | AI suggests replies/scores; human must approve before sending |
| PM-014 | WhatsApp + email notifications | Notifications sent for bookings, enquiries, payments |
| PM-015 | PWA polish | App installable; works offline |

## MVP (Phase 4 — AI & Notifications)

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| PM-016 | Full testing + security review | All critical tests pass; no high-severity security bugs |
| PM-017 | Backup restore test | Restore tested successfully |
| PM-018 | Private beta prep | Go-live checklist ready |

## LATER (Post-MVP)

- Studio owner role (multi-professional studios)
- Advanced analytics dashboard
- WhatsApp Business automation flows
- Multi-city landing pages

## Success Metrics
- Professional sign-ups
- Profile completion rate
- First booking completed
- Free-to-paid conversion
- Churn rate

## Risks & Open Questions
- Payment gateway: Razorpay vs Stripe (owner to decide)
- Pricing plans and commission structure
- Which countries/cities to launch in first