# GlamHub Production Deployment Plan

## Overview
This document describes the production deployment process for GlamHub.

**⚠️ APPROVAL GATES (owner approval required before any step):**
1. Create production GCP project (glamhub-prod)
2. Link billing account to production project
3. Deploy to production
4. Switch payments from test mode to live mode
5. Enable custom domains / go live

---

## Prerequisites
- Staging environment stable for 72 hours
- All Phase 0-6 tests passed
- Security review complete (no open high-severity items)
- Backup restore test passed
- Owner written approval obtained

---

## Step 1: Create Production GCP Project

```bash
export PROD_PROJECT_ID=glamhub-prod

# Create production project
gcloud projects create $PROD_PROJECT_ID --name="GlamHub Production"

# Link billing (OWNER APPROVAL REQUIRED - creates costs)
gcloud beta billing projects link $PROD_PROJECT_ID \
  --billing-account=YOUR_BILLING_ACCOUNT_ID

# Enable required APIs
gcloud services enable \
  cloudrun.googleapis.com \
  cloudbuild.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com \
  --project=$PROD_PROJECT_ID
```

**What this does:** Creates a separate, isolated GCP project for production. Billing linkage enables charges for production resources.

---

## Step 2: Create Production Artifact Registry

```bash
gcloud artifacts repositories create glamhub-repo \
  --repository-format=docker \
  --location=asia-south1 \
  --project=$PROD_PROJECT_ID
```

**What this does:** Creates a production Docker registry for container images.

---

## Step 3: Create Production Cloud SQL

```bash
gcloud sql instances create glamhub-prod-db \
  --database-version=POSTGRES_15 \
  --tier=db-g1-small \
  --region=asia-south1 \
  --project=$PROD_PROJECT_ID \
  --backup-configuration=enabled \
  --binary-log-enabled=enabled

gcloud sql databases create glamhub \
  --instance=glamhub-prod-db \
  --project=$PROD_PROJECT_ID
```

**What this does:** Creates a production PostgreSQL instance with automated backups and point-in-time recovery. `db-g1-small` is a small production tier; scale up based on usage.

**⚠️ Cost:** Production instance runs continuously. Monitor budget alerts.

---

## Step 4: Configure Production Secrets

```bash
# Create production secrets (REPLACE with actual production values)
echo -n "PRODUCTION_JWT_SECRET" | gcloud secrets create JWT_SECRET --data-file=- --project=$PROD_PROJECT_ID
echo -n "PRODUCTION_FIREBASE_SA_JSON" | gcloud secrets create FIREBASE_SERVICE_ACCOUNT --data-file=- --project=$PROD_PROJECT_ID
echo -n "PRODUCTION_RAZORPAY_KEY_SECRET" | gcloud secrets create RAZORPAY_KEY_SECRET --data-file=- --project=$PROD_PROJECT_ID
echo -n "PRODUCTION_RESEND_API_KEY" | gcloud secrets create RESEND_API_KEY --data-file=- --project=$PROD_PROJECT_ID
```

**⚠️ Never print secret values.** Never commit secrets to GitHub.

**⚠️ Owner approval required** before adding live payment keys. Use test mode keys until owner approves live mode.

---

## Step 5: Set Up Production Budget Alerts (BEFORE any resources)

```bash
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT_ID \
  --display-name="GlamHub Production Budget" \
  --budget-amount=100 \
  --currency=INR \
  --threshold-rules=0.5,0.8,1.0
```

**What this does:** Alerts at 50%, 80%, and 100% of ₹100/month production budget. Set this BEFORE creating resources.

---

## Step 6: Deploy to Production

```bash
# Build and push API container to production registry
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_PROJECT_ID=$PROD_PROJECT_ID,_REGION=asia-south1 \
  --project=$PROD_PROJECT_ID

# Deploy API to Cloud Run (production)
gcloud run deploy api-prod \
  --image=asia-south1-docker.pkg.dev/$PROD_PROJECT_ID/glamhub-repo/api:latest \
  --platform=managed \
  --region=asia-south1 \
  --allow-unauthenticated \
  --min-instances=1 \
  --max-instances=10 \
  --set-env-vars=DATABASE_URL=$PROD_DATABASE_URL,JWT_SECRET=$PROD_JWT_SECRET \
  --project=$PROD_PROJECT_ID

# Deploy web to Cloud Run (production)
gcloud run deploy web-prod \
  --image=asia-south1-docker.pkg.dev/$PROD_PROJECT_ID/glamhub-repo/web:latest \
  --platform=managed \
  --region=asia-south1 \
  --allow-unauthenticated \
  --min-instances=1 \
  --max-instances=10 \
  --project=$PROD_PROJECT_ID
```

**What this does:** Deploys production API and web services to Cloud Run with min-instances=1 (no scale-to-zero for production).

---

## Step 7: Run Production Migrations

```bash
# Get Cloud SQL connection name
gcloud sql instances describe glamhub-prod-db \
  --project=$PROD_PROJECT_ID \
  --format="value(connectionName)"

# Run migrations
npx prisma migrate deploy --schema=prisma/schema.prisma

# Load seed data (categories, plans, super admin)
npx prisma db seed --schema=prisma/schema.prisma
```

**⚠️ Never run destructive SQL on production.** Migrations are reversible only.

---

## Step 8: Configure Custom Domains

```bash
# Map custom domain to Cloud Run service
gcloud run deploy api-prod --update-labels=serving=prod \
  --platform=managed \
  --region=asia-south1 \
  --project=$PROD_PROJECT_ID

# SSL certificates are automatically managed by Google Cloud
```

**DNS configuration:** Point `api.glamhub.example.com` and `www.glamhub.example.com` to the Cloud Run service URLs.

---

## Step 9: Post-Deployment Verification

| Check | Command | Expected Result |
|-------|---------|-----------------|
| API health | `curl https://api.glamhub.example.com/api/portfolios` | 200 OK |
| Web health | `curl https://www.glamhub.example.com` | 200 OK |
| Database connection | Check Cloud Logging | No connection errors |
| Auth flow | Test login via Firebase | Token returned |
| Payment test mode | Process test payment | Success in test mode |

---

## Step 10: Rollback Plan

If production deployment fails:

```bash
# Rollback API to previous revision
gcloud run deploy api-prod \
  --revision=PREVIOUS_REVISION_NAME \
  --project=$PROD_PROJECT_ID

# Rollback web to previous revision
gcloud run deploy web-prod \
  --revision=PREVIOUS_REVISION_NAME \
  --project=$PROD_PROJECT_ID
```

**Rollback time:** < 5 minutes (Cloud Run revision rollback)

---

## Step 11: Monitoring & Alerts

- **Uptime checks:** Configured for API and web endpoints
- **Alerting:** Email alerts on 5xx errors, high latency, downtime
- **Logging:** Cloud Logging with structured logs (no PII)
- **Dashboard:** Cloud Monitoring dashboard for key metrics

---

## Production vs Staging Comparison

| Component | Staging | Production |
|-----------|---------|------------|
| Project ID | glamhub-staging | glamhub-prod |
| Cloud SQL tier | db-f1-micro | db-g1-small |
| Cloud Run min-instances | 0 (scale-to-zero) | 1 |
| Cloud Run max-instances | 5 | 10 |
| Budget alert | ₹5/month | ₹100/month |
| Payment mode | Test only | Test until owner approves live |
| Secrets | Test keys | Production keys |

---

## Deployment Runbook Summary

1. Owner approves production deployment
2. Create production GCP project + billing
3. Enable APIs, create Artifact Registry
4. Create production Cloud SQL + database
5. Set up budget alerts (first!)
6. Configure production secrets
7. Deploy containers to Cloud Run
8. Run migrations + seed data
9. Configure custom domains + SSL
10. Verify deployment (health checks, auth, payments)
11. Owner approves go-live
12. (Optional) Owner approves live payment mode

**Prepared by:** devops-gcp-engineer
**Status:** Ready for owner approval