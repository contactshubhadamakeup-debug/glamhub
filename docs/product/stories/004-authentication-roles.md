# Feature Story: Authentication & Roles

**As a** user, **I want** to sign up and log in with email, phone OTP, or Google, **so that** I can access the platform as a professional or client.

**Acceptance Criteria:**
- [ ] Email login with password reset and email verification
- [ ] Phone OTP login
- [ ] Google OAuth login
- [ ] Role-based access: super_admin, admin_staff, professional, studio_owner, client
- [ ] Professionals can only access their own data; admin routes need admin roles
- [ ] Access control tests prove users cannot read each other's data

**Definition of Done:** Auth-security engineer confirms access control tests pass with no open high-severity items.