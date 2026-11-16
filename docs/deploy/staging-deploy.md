# GlamHub Deployment Guide — Staging

## Overview
This document explains how to deploy GlamHub to Google Cloud staging. Each command is explained in plain language before running.

**⚠️ Approval gate:** Do not create cloud resources, change billing, or deploy without the owner's explicit approval.

---

## Prerequisites
- Google Cloud account with billing enabled
- `gcloud` CLI installed and authenticated
- Docker installed
- GitHub repository connected to Cloud Build

---

## Step 1: Create GCP Projects (Run once)

```bash
# Set your project ID
export PROJECT_ID=glamhub-staging

# Create the staging project
gcloud projects create $PROJECT_ID --name="GlamHub Staging"

# Link billing account (REQUIRES OWNER APPROVAL - this creates costs)
gcloud beta billing projects link $PROJECT_ID --billing-account=YOUR_BILLING_ACCOUNT_ID
```

**What this does:** Creates a dedicated GCP project for staging. Linking billing allows Google to charge for resources used.

---

## Step 2: Enable Required APIs

```bash
gcloud services enable \
  cloudrun.googleapis.com \
  cloudbuild.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com \
  --project=$PROJECT_ID
```

**What this does:** Turns on the Google Cloud services we need: Cloud Run (hosting), Cloud Build (CI/CD), Cloud SQL (database), Secret Manager (secrets), Artifact Registry (container images).

---

## Step 3: Create Artifact Registry Repository

```bash
gcloud artifacts repositories create glamhub-repo \
  --repository-format=docker \
  --location=asia-south1 \
  --project=$PROJECT_ID
```

**What this does:** Creates a private Docker registry in the Mumbai region (asia-south1) to store our container images.

---

## Step 4: Create Cloud SQL Instance (PostgreSQL)

```bash
gcloud sql instances create glamhub-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-south1 \
  --project=$PROJECT_ID
```

**What this does:** Creates a small PostgreSQL 15 database instance. `db-f1-micro` is the smallest tier suitable for staging.

**⚠️ Cost:** This instance runs continuously and incurs charges. Delete it when not needed.

---

## Step 5: Create Cloud SQL Database

```bash
gcloud sql databases create glamhub \
  --instance=glamhub-db \
  --project=$PROJECT_ID
```

**What this does:** Creates the `glamhub` database inside the Cloud SQL instance.

---

## Step 6: Set Up Secret Manager

```bash
# Create secrets (REPLACE placeholder values with actual secrets)
echo -n "your-jwt-secret-here" | gcloud secrets create JWT_SECRET --data-file=- --project=$PROJECT_ID
echo -n "your-firebase-service-account-json" | gcloud secrets create FIREBASE_SERVICE_ACCOUNT --data-file=- --project=$PROJECT_ID
echo -n "your-razorpay-key-secret" | gcloud secrets create RAZORPAY_KEY_SECRET --data-file=- --project=$PROJECT_ID
```

**What this does:** Stores sensitive values (JWT secret, Firebase credentials, Razorpay key) in Secret Manager instead of in code.

**⚠️ Never print secret values.** Never commit secrets to GitHub.

---

## Step 7: Configure Cloud Build (CI/CD)

Create `cloudbuild.yaml` in the repo root:

```yaml
steps:
  # Build API container
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', '$_REGION-docker.pkg.dev/$PROJECT_ID/glamhub-repo/api:$COMMIT_SHA', './api']
  
  # Push API container
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', '$_REGION-docker.pkg.dev/$PROJECT_ID/glamhub-repo/api:$COMMIT_SHA']
  
  # Deploy API to Cloud Run
  - name: 'gcr.io/google/cloud-cli'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'api'
      - '--image'
      - '$_REGION-docker.pkg.dev/$PROJECT_ID/glamhub-repo/api:$COMMIT_SHA'
      - '--platform'
      - 'managed'
      - '--region'
      - '$_REGION'
      - '--allow-unauthenticated'
      - '--set-env-vars'
      - 'DATABASE_URL=$ _DATABASE_URL,JWT_SECRET=$ _JWT_SECRET'
      - '--project'
      - '$PROJECT_ID'

substitutions:
  _REGION: asia-south1
  _DATABASE_URL: ''
  _JWT_SECRET: ''
```

**What this does:** Automatically builds and deploys the API whenever code is pushed to GitHub.

---

## Step 8: Set Up Budget Alerts (FIRST - before any resources)

```bash
# Create a budget alert for $5/month on staging
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT_ID \
  --display-name="GlamHub Staging Budget" \
  --budget-amount=5 \
  --currency=INR \
  --threshold-rules=0.5,0.9,1.0
```

**What this does:** Sends an email alert when spending reaches 50%, 90%, and 100% of $5. **Set this up before creating any cloud resources.**

---

## Step 9: Deploy to Cloud Run

```bash
# Build and deploy API
gcloud builds submit --config=cloudbuild.yaml --project=$PROJECT_ID

# Deploy web (Next.js)
gcloud run deploy web \
  --image=$REGION-docker.pkg.dev/$PROJECT_ID/glamhub-repo/web:latest \
  --platform=managed \
  --region=asia-south1 \
  --allow-unauthenticated \
  --project=$PROJECT_ID
```

**What this does:** Deploys the API and web services to Cloud Run, making them accessible via HTTPS URLs.

---

## Step 10: Run Database Migrations

```bash
# Get Cloud SQL connection name
gcloud sql instances describe glamhub-db --project=$PROJECT_ID --format="value(connectionName)"

# Run migrations (connect via Cloud SQL proxy or directly)
npx prisma migrate deploy --schema=prisma/schema.prisma

# Load seed data
npx prisma db seed --schema=prisma/schema.prisma
```

**What this does:** Applies the database schema and loads initial seed data (categories, plans, super admin).

---

## Step 11: Verify Deployment

1. Open the Cloud Run service URL in your browser
2. Test: `GET /auth/me` (should return 401 without token)
3. Test: `GET /portfolios` (should return empty list)
4. Check Cloud Logging for errors

---

## Cost Control for Staging
- Use `db-f1-micro` (smallest Cloud SQL tier)
- Enable scale-to-zero on Cloud Run services
- Set budget alerts at $5
- Delete resources when testing is complete

---

## Rollback
To rollback to a previous deployment:
```bash
gcloud run deploy api --revision=PREVIOUS_REVISION_NAME --project=$PROJECT_ID
```

---

## Next Steps After Staging
1. Owner approves staging demo
2. Set up production project (glamhub-prod)
3. Configure custom domains
4. Set up monitoring and uptime checks