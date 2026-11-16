# Payments Security Checklist

## Payment Gateway
- **Selected:** Razorpay (India-first, UPI/netbanking/wallets, T+2 settlement)

## Test Mode
- [x] All payment integrations use test mode only
- [x] No live payment keys in code or config
- [x] Real keys added by owner into Secret Manager only

## Webhook Security
- [x] Webhook signature verification required (implemented in middleware)
- [x] Idempotent webhook handling (gatewayPaymentId unique constraint)
- [x] Webhook returns 200 even on error to prevent retries

## Data Protection
- [x] No card data stored (hosted checkout only)
- [x] Payment amounts validated server-side
- [x] Immutable payment records (no editing after creation)
- [x] Professional-scoped payment access

## Admin Actions
- [x] All admin billing actions logged in audit_log
- [x] Refund requires confirmation
- [x] Price change requires confirmation

## Open High-Severity Items
- [ ] Razorpay SDK integration needs completion (hosted checkout, webhooks, subscriptions)

**Status:** 1 open item (Razorpay SDK integration)