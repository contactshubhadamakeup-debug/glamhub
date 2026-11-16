# Feature Story: Staging Deployment

**As a** product owner, **I want** the first version deployed to GCP staging, **so that** we can test the platform in a cloud environment before production.

**Acceptance Criteria:**
- [ ] Separate GCP staging project created
- [ ] Cloud Run, Cloud SQL, Secret Manager, Artifact Registry configured
- [ ] Budget alerts set up
- [ ] Automatic builds from GitHub main branch to staging
- [ ] Service accounts use least privilege
- [ ] Infrastructure steps documented in `docs/deploy/`

**Definition of Done:** Staging deploys automatically from the main branch.