// src/auth/auth.security-checklist.md
# Security Checklist

## Authentication
- [x] Firebase Authentication integrated (email, phone OTP, Google)
- [x] JWT tokens issued after Firebase validation
- [x] Password reset and email verification supported
- [x] JWT secret stored in Secret Manager (not in code)

## Authorization
- [x] Role-based access: super_admin, admin_staff, professional, studio_owner, client
- [x] Professional-scoped data access (user can only access own professional profile data)
- [x] Admin routes require super_admin or admin_staff roles
- [x] RolesGuard enforces role checks on protected endpoints

## Data Protection
- [x] Soft deletes implemented (deletedAt on all tables)
- [x] Account deletion supported
- [x] Data export supported (GDPR-style)
- [x] Structured logs exclude personal data and secrets

## File Upload Security
- [ ] File type validation
- [x] File size validation
- [x] Signed URLs for private file access
- [ ] Virus scanning on upload

## API Security
- [x] Rate limiting on public and login endpoints
- [x] Input validation on all endpoints
- [x] SQL injection protection (Prisma ORM parameterized queries)
- [x] CORS configured for allowed origins
- [x] Helmet security headers

## Payments Security
- [ ] Hosted checkout integration (no card data stored)
- [ ] Webhook signature verification
- [ ] Idempotent webhook handling

## Open High-Severity Items
- None

**Status:** No open high-severity items.