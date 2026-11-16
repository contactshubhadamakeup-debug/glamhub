# GlamHub Compliance & Privacy Drafts

## Disclaimer
**These are drafts for lawyer review only. I am not a lawyer. These must be reviewed by a qualified lawyer before use.**

## Applicable Regulations (Based on India Operations)

### Primary
- **Information Technology Act, 2000** (IT Act) - Data protection, cybersecurity
- **IT Rules, 2011** (Reasonable Security Practices) - Sensitive personal data
- **Consumer Protection Act, 2019** - Consumer rights, unfair trade practices
- **Digital Personal Data Protection Act, 2023 (DPDP Act)** - Data processing, consent, rights

### Secondary
- **Payment and Settlement Systems Act, 2007** - Payment gateway compliance
- **GST Act, 2017** - Tax invoicing for subscriptions/services
- **Advertising Standards Council of India (ASCI) Code** - Reviews, testimonials

---

## 1. Privacy Policy Draft

### Data Controller
GlamHub Technologies Pvt. Ltd. (to be incorporated)

### Data Collected

| Category | Personal Data | Purpose | Lawful Basis |
|----------|---------------|---------|--------------|
| Account | Name, email, phone, password hash | Authentication, communication | Contract, Legitimate Interest |
| Professional Profile | Business name, category, city, bio, social links | Marketplace listing, matching | Contract |
| Portfolio | Images, service descriptions, pricing | Public showcase | Contract, Consent |
| Client Data | Name, email, phone, booking history | Booking management | Contract |
| Payments | Transaction IDs, amounts, dates (no card data) | Billing, receipts | Contract, Legal Obligation |
| Communications | Enquiries, messages, reviews | Platform functionality | Contract |
| Analytics | Usage data, device info, IP (anonymized) | Improvement, security | Legitimate Interest |

### Data Not Collected
- Credit/debit card numbers (hosted checkout only)
- Government ID numbers (unless KYC required by law)
- Biometric data
- Health data

### Data Sharing
- **Payment gateways:** Razorpay/Stripe (transaction data only, per their privacy policies)
- **Firebase Authentication:** Email, phone for auth (Google Cloud)
- **Email/WhatsApp providers:** Resend/SendGrid, WhatsApp Business API (contact info for notifications)
- **Cloud infrastructure:** Google Cloud (processed per DPA)
- **Legal authorities:** When required by law

### User Rights (per DPDP Act)
- **Access:** Request copy of personal data
- **Correction:** Update inaccurate data
- **Erasure:** Delete account and data (with exceptions for legal holds)
- **Portability:** Export data in machine-readable format
- **Objection:** Opt-out of marketing communications
- **Grievance:** Contact Data Protection Officer

### Data Retention
| Data Type | Retention Period |
|-----------|------------------|
| Account data | Until account deletion + 30 days |
| Booking/invoice/payment records | 7 years (tax compliance) |
| Reviews | Until professional account deletion |
| Analytics (anonymized) | 2 years |
| Audit logs | 7 years |
| Support tickets | 2 years |

### International Transfers
Data processed in India (Google Cloud Mumbai region). No transfers outside India without adequate safeguards.

### Security Measures
- Encryption at rest (Cloud SQL, Cloud Storage)
- Encryption in transit (TLS 1.2+)
- Access controls (role-based, least privilege)
- Regular security reviews
- Incident response plan

### Contact
Data Protection Officer: dpo@glamhub.example.com

---

## 2. Terms of Service Draft

### Acceptance
By creating an account, you agree to these Terms.

### User Types
- **Professional:** Pays subscription, manages clients/bookings, lists on marketplace
- **Client:** Browses free, books services, leaves reviews
- **Admin:** Platform operators

### Professional Obligations
- Provide accurate business information
- Maintain valid licenses/certifications (where required by law)
- Honor confirmed bookings
- Respond to enquiries within 24 hours
- Pay subscription fees on time
- No fake reviews or manipulated ratings

### Client Obligations
- Provide accurate contact information
- Honor booked appointments
- Pay for services as agreed
- Leave honest reviews based on actual experience

### Platform Rules
- No illegal services or content
- No harassment, discrimination, or abuse
- No spam or unsolicited commercial messages
- No scraping, reverse engineering, or unauthorized access
- No circumvention of payment system

### Fees & Payments
- Subscription fees as per selected plan (shown before purchase)
- Payment via hosted checkout (Razorpay/Stripe)
- No refunds for partial subscription periods (except as required by law)
- Platform not party to professional-client payment disputes

### Intellectual Property
- Professionals own their portfolio content
- Platform gets license to display for marketplace purposes
- Platform owns all platform code, design, trademarks

### Disclaimers
- Platform is a marketplace, not a service provider
- No guarantee of bookings, income, or client satisfaction
- Professionals are independent contractors, not employees

### Limitation of Liability
- Platform liability limited to fees paid in last 12 months
- No liability for indirect, consequential, or punitive damages
- Professional liable for their services

### Termination
- User may delete account anytime
- Platform may suspend/terminate for Terms violation
- Data retained per retention schedule

### Governing Law & Disputes
- Governed by Indian law
- Exclusive jurisdiction: Courts of [City, State]
- Mandatory arbitration for disputes < ₹10 lakh

### Changes to Terms
- 30 days notice for material changes
- Continued use = acceptance

---

## 3. Refund & Cancellation Policy Draft

### Subscription Cancellation
- Cancel anytime from dashboard
- Access continues until end of current billing period
- No prorated refunds for partial periods
- Data retained 30 days after cancellation, then deleted

### Booking Cancellation
- **By client:** Up to 24 hours before booking → full refund
- **By professional:** Anytime → full refund + notification
- **No-show by client:** Professional keeps payment
- **No-show by professional:** Full refund + platform credit to client

### Payment Refunds
- Processed via original payment method
- 5-7 business days to reflect
- Disputes handled per payment gateway policy

### Platform-Initiated Refunds
- Service not delivered as described
- Professional suspended/banned
- Platform error (double charge, wrong amount)

---

## 4. Review & Content Guidelines Draft

### Allowed Reviews
- Only after completed booking (verified by platform)
- Honest, first-hand experience
- Relevant to service quality
- No promotional content

### Prohibited Content
- Fake, incentivized, or manipulated reviews
- Reviews by friends/family without disclosure
- Hate speech, harassment, discrimination
- Personal information (addresses, phones)
- Defamatory or libelous statements
- Off-topic content (politics, unrelated complaints)

### Moderation
- All reviews moderated before publication
- Professionals can reply once per review
- Platform may remove violating content
- Appeal process available

### Professional Responses
- Professional, courteous tone
- Address specific concerns
- No offers to remove negative reviews
- No disclosure of client private info

---

## 5. Consent Flows Required

### At Signup
- [ ] Terms of Service acceptance
- [ ] Privacy Policy acceptance
- [ ] Marketing communications opt-in (separate, unchecked by default)

### At First Booking (Client)
- [ ] Share contact info with professional (required for booking)
- [ ] Receive booking notifications via email/WhatsApp

### At Portfolio Publication (Professional)
- [ ] Publish portfolio publicly
- [ ] Appear in search results
- [ ] Allow client reviews

### For Marketing
- [ ] Email newsletter (double opt-in)
- [ ] WhatsApp notifications (explicit opt-in)
- [ ] Promotional emails (separate opt-in)

### Age Verification
- Minimum age: 18 years
- Self-declaration at signup
- Professional licenses imply age verification

---

## 5. Features Required for Compliance

### Must Implement
- [ ] Account deletion (with data export)
- [ ] Data export (JSON/CSV)
- [ ] Consent checkboxes (granular, unchecked defaults)
- [ ] Cookie consent banner (if tracking beyond essential)
- [ ] Age gate (18+)
- [ ] Content takedown request form
- [ ] Data Protection Officer contact
- [ ] Grievance redressal mechanism

### Should Implement
- [ ] Data processing agreements with vendors
- [ ] Regular data protection impact assessments
- [ ] Breach notification procedure (72 hours per DPDP)
- [ ] Data protection training for staff

---

## Next Steps
1. **Owner reviews drafts**
2. **Engage qualified lawyer** (Indian law, tech/privacy specialization)
3. **Lawyer marks up drafts**
4. **Implement required features**
5. **Lawyer final review**
5. **Publish before public launch**

**Prepared by:** compliance-privacy-advisor
**Date:** 2026-11-16
**Status:** Draft — Requires lawyer review