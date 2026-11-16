# GlamHub System Architecture

## Overview
Two Cloud Run services (web + api), Cloud SQL (PostgreSQL), Cloud Storage. Three environments: development, staging (glamhub-staging), production (glamhub-prod).

## Services
| Service | Responsibility | Tech Stack |
|---------|---------------|------------|
| web | Next.js frontend (PWA), server-side rendering | Next.js + TypeScript + Tailwind + shadcn/ui |
| api | NestJS backend REST API | Node.js + NestJS + TypeScript + Prisma ORM |

## Infrastructure
| Component | Purpose |
|-----------|---------|
| Cloud Run | Hosts web and api services (scale-to-zero for staging) |
| Cloud SQL | PostgreSQL database (one per environment) |
| Cloud Storage | Private files (signed URLs) + CDN for public images |
| Secret Manager | API keys, database credentials, payment secrets |
| Artifact Registry | Container images |
| Cloud Build | CI/CD pipelines from GitHub |
| Cloud Logging & Monitoring | Logs, uptime checks, alerts |
| Firebase Authentication | Auth (separate GCP service) |

## Module Boundaries
| Module | Owner | Responsibility |
|--------|-------|----------------|
| auth | auth-security-engineer | Firebase integration, sessions, roles, permissions |
| profiles | backend-engineer | Professional and client profile management |
| portfolio | backend-engineer | Portfolio items, services, public portfolio pages |
| leads | backend-engineer | Lead pipeline, lead scoring, follow-ups |
| bookings | backend-engineer | Calendar, bookings, availability |
| billing | payments-subscriptions-engineer | Plans, subscriptions, invoices, payments, coupons |
| reviews | backend-engineer | Reviews, review replies, moderation |
| admin | admin-panel-engineer | Super admin panel, audit log, disputes, payouts |
| notifications | backend-engineer | Email (Resend/SendGrid), WhatsApp, in-app notifications |
| ai | ai-features-engineer | Claude API integration, reply drafts, insights |

## Data Flow
1. Client → web → api → Cloud SQL (reads/writes)
2. Professional → web → api → Cloud SQL (owns data scoped by professional ID)
3. Admin → web → api → Cloud SQL (cross-professional access)
4. File uploads → Cloud Storage (signed URLs) → api metadata in Cloud SQL
5. Payments → hosted checkout → webhook → api → Cloud SQL (immutable record)
6. Notifications → api → Resend/SendGrid/WhatsApp API

## Security Boundaries
- Secrets never in code; stored in Secret Manager
- Card data never stored; hosted checkout only
- Professional-scoped queries: every professional-owned table filtered by professional ID
- Role-based access: super_admin, admin_staff, professional, studio_owner, client
- Webhook signature verification for payments
- Rate limiting on public and login endpoints
- Structured logs without personal data or secrets

## Scaling Plan
- Pagination on all list endpoints
- Database indexes on professional ID and frequently queried columns
- Caching layer added later (Redis/Memorystore)
- Background jobs for slow work (email batches, report generation)
- Scale-to-zero for staging to control costs

## Environments
| Environment | Purpose | Size |
|-------------|---------|------|
| development | Local development | Local PostgreSQL / Docker |
| staging | QA and stakeholder review | Smallest GCP sizes, scale-to-zero |
| production | Live users | Owner-approved sizing |

## Decision Record: Monorepo vs Polyrepo
**Decision:** Monorepo (single repository)
**Options considered:**
1. Monorepo: Single repo with `web/` and `api/` packages
2. Polyrepo: Separate repos for web and api

**Trade-offs:**
- Monorepo: Easier atomic changes, shared types, simpler CI. Slightly more complex repo.
- Polyrepo: Clearer separation. More repos to manage, harder to keep API contract in sync.

**Why monorepo:** Team is small; shared types between frontend and backend prevent contract drift; simpler for one owner to manage.