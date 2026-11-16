# Feature Story: System Architecture & API Contract

**As a** product owner, **I want** a documented system architecture and API contract, **so that** frontend and backend teams can build in sync without conflicts.

**Acceptance Criteria:**
- [ ] Architecture documented: two Cloud Run services (web + api), Cloud SQL, Cloud Storage
- [ ] Module boundaries defined: auth, profiles, portfolio, leads, bookings, billing, reviews, admin, notifications, ai
- [ ] OpenAPI contract published before any frontend/backend implementation
- [ ] Decision record written in `docs/decisions/`

**Definition of Done:** Orchestrator confirms every agent can start from the documented contract and structure.