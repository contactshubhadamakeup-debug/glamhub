# GlamHub Backup & Restore Test Plan

## Overview
This document describes the backup strategy and restore test procedure for GlamHub staging environment.

**⚠️ Approval gate:** Do not create cloud resources, change billing, or deploy without the owner's explicit approval.

## Backup Strategy

### Database Backups (Cloud SQL)
- **Automated backups:** Enabled by Cloud SQL (daily, 7-day retention)
- **Point-in-time recovery:** Enabled (binary logging)
- **On-demand backups:** Created before major changes

### File Backups (Cloud Storage)
- **Versioning:** Enabled on Cloud Storage buckets
- **Lifecycle rules:** Old versions deleted after 30 days

### Secret Backups (Secret Manager)
- **Versioning:** Automatic versioning on secret updates
- **Replication:** Automatic across regions

## Backup Schedule

| Resource | Frequency | Retention |
|----------|-----------|-----------|
| Cloud SQL automated backup | Daily | 7 days |
| Cloud SQL on-demand backup | Before major changes | Until deleted |
| Cloud Storage versioning | Continuous | 30 days |
| Secret Manager versions | On change | Until deleted |

## Restore Test Procedure

### Step 1: Create a Test Backup

```bash
# Set project
export PROJECT_ID=glamhub-staging

# Create on-demand backup of Cloud SQL
gcloud sql backups create \
  --instance=glamhub-db \
  --project=$PROJECT_ID

# Note the backup ID from the output
```

**What this does:** Creates an immediate backup of the staging database before any destructive test.

### Step 2: Simulate Data Loss

```bash
# Connect to the database and delete test data
gcloud sql connect glamhub-db --user=postgres --project=$PROJECT_ID

# In the SQL prompt:
DELETE FROM "User" WHERE email LIKE 'test-%@example.com';
DELETE FROM "ProfessionalProfile" WHERE businessName LIKE 'Test-%';
```

**What this does:** Simulates accidental data deletion to test restore capability.

### Step 3: Restore from Backup

```bash
# List available backups
gcloud sql backups list \
  --instance=glamhub-db \
  --project=$PROJECT_ID

# Restore to a new instance (point-in-time recovery)
gcloud sql instances restore-backup glamhub-db-restore \
  --backup-id=BACKUP_ID \
  --instance=glamhub-db \
  --project=$PROJECT_ID
```

**What this does:** Restores the database to the state at the time of the backup.

### Step 4: Verify Data Integrity

```bash
# Connect to restored instance
gcloud sql connect glamhub-db-restore --user=postgres --project=$PROJECT_ID

# Verify restored data
SELECT count(*) FROM "User";
SELECT count(*) FROM "ProfessionalProfile";
SELECT count(*) FROM "Booking";
SELECT count(*) FROM "Payment";
```

**Expected:** All counts match the pre-deletion state.

### Step 5: Document Restore Time

| Metric | Value |
|--------|-------|
| Backup creation time | ____ minutes |
| Restore time | ____ minutes |
| Data verified | Yes/No |
| Test passed | Yes/No |

## Restore Test Checklist

- [ ] Backup created successfully
- # Data loss simulated
- # Database restored from backup
- # Data integrity verified (counts match)
- # Application connects to restored database
- # Restore time documented
- # Test results documented in docs/decisions/

## Disaster Recovery Runbook

### Scenario: Accidental Data Deletion
1. Identify the time of deletion
2. Use point-in-time recovery to restore to just before deletion
3. Verify data integrity
4. Update application to point to restored instance

### Scenario: Database Corruption
1. Fail over to backup instance
2. Verify data integrity
3. Update DNS/load balancer to point to backup instance
4. Notify users of any data loss window

### Scenario: Complete Region Failure
1. Restore from cross-region backup (if configured)
2. Deploy application to secondary region
3. Update DNS to secondary region
4. Notify users

## Cost Control
- Use smallest instance for restore testing
- Delete restore test instance after testing
- Monitor budget alerts during testing

**Next:** After restore test passes, document results in docs/decisions/003-backup-restore-test.md