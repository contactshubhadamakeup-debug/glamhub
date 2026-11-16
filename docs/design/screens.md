# GlamHub Screen Specifications

## 1. Landing Page (Public)
**URL:** `/`
**Layout:** Mobile-first, responsive desktop
**Sections:**
- Hero: Navy background, emerald CTA button ("Join as Professional"), gold accent text
- Value props: 3 cards (Manage clients, Get bookings, Build portfolio)
- How it works: 3 steps (Sign up, Create portfolio, Get booked)
- Featured professionals: Horizontal scroll of portfolio cards
- Footer: Links, contact, legal

**States:** Empty, loading, error, success
**Accessibility:** Alt text on images, ARIA labels, keyboard navigation

---

## 2. Professional Signup (Public)
**URL:** `/signup/professional`
**Fields:** Email, password, confirm password, phone, category, business name, city
**Validation:** Email format, password strength, phone format, required fields
**States:** Loading, error (invalid email/weak password), success (redirect to onboarding)
**Accessibility:** Labels on all inputs, error announcements, focus order

---

## 3. Client Signup (Public)
**URL:** `/signup/client`
**Fields:** Email, password, name, phone
**Validation:** Email format, password strength, required fields
**States:** Loading, error, success (redirect to browse portfolios)
**Accessibility:** Labels, error announcements, focus order

---

## 4. Login (Public)
**URL:** `/login`
**Fields:** Email/phone, password
**Options:** Forgot password, Google login, phone OTP toggle
**States:** Loading, error (invalid credentials), success (redirect to dashboard)
**Accessibility:** Labels, error announcements, focus order

---

## 5. Professional Dashboard (Authenticated)
**URL:** `/professional/dashboard`
**Sections:**
- Overview metrics: Total clients, pending leads, upcoming bookings, monthly revenue
- Recent leads list with status badges
- Upcoming bookings calendar mini-view
- Quick actions: Create quote, Add client, Edit portfolio
**States:** Empty (no clients yet), loading, error, success
**Accessibility:** Table headers, focus order, ARIA labels on metrics

---

## 6. Professional Onboarding (Authenticated)
**URL:** `/professional/onboarding`
**Steps:** Profile details → Services offered → Portfolio upload → Subscription plan
**States:** Step progress indicator, loading, error, success (complete)
**Accessibility:** Step announcements, form labels, keyboard navigation

---

## 7. Client Portfolio Browse (Public)
**URL:** `/portfolio/[category]/[city]`
**Sections:**
- Search bar with category and city filters
- Grid of professional portfolio cards
- Each card: Photo, name, category, rating, price range, "Book" button
**States:** Empty (no results), loading, error, success
**Accessibility:** ARIA labels on cards, keyboard-navigable grid, alt text on photos

---

## 8. Professional Portfolio Detail (Public)
**URL:** `/portfolio/[professional-id]`
**Sections:**
- Hero: Professional photo, name, category, city, rating
- About section
- Services list with prices
- Portfolio gallery (image grid)
- Reviews (only from completed bookings)
- Book/Enquiry CTA button
**States:** Empty (no portfolio items), loading, error, success
**Accessibility:** Image alt text, heading hierarchy, keyboard navigation

---

## 9. Client Booking (Authenticated)
**URL:** `/bookings/new`
**Fields:** Select professional, select service, date picker, time picker, notes
**Validation:** Date not in past, time within business hours, required fields
**States:** Loading, error (unavailable slot), success (booking created)
**Accessibility:** Date picker keyboard support, form labels, error announcements

---

## 10. Client Enquiry (Public/Authenticated)
**URL:** `/enquiry/[professional-id]`
**Fields:** Name, email, phone, message, service interest
**Validation:** Required fields, email format, message length
**States:** Loading, error, success (enquiry sent)
**Accessibility:** Form labels, error announcements, focus order

---

## 11. Professional Clients List (Authenticated)
**URL:** `/professional/clients`
**Sections:** Searchable, filterable, paginated table of clients
**Columns:** Name, email, phone, total bookings, total spent, last booking date
**Actions:** View client, Edit client, Delete client
**States:** Empty, loading, error, success
**Accessibility:** Table headers, sortable columns, keyboard navigation

---

## 12. Professional Leads Pipeline (Authenticated)
**URL:** `/professional/leads`
**Sections:** Kanban or list view of leads by status (new, contacted, quoted, booked, lost)
**Actions:** Convert lead to client, Send quote, Add note, Change status
**States:** Empty, loading, error, success
**Accessibility:** Status badges with aria-label, keyboard navigation

---

## 13. Professional Quotes & Invoices (Authenticated)
**URL:** `/professional/quotes` and `/professional/invoices`
**Sections:** List of quotes/invoices with status (draft, sent, paid, overdue)
**Actions:** Create quote, Send quote, Mark paid, Download PDF
**States:** Empty, loading, error, success
**Accessibility:** Status badges, keyboard navigation

---

## 14. Professional Reviews (Authenticated)
**URL:** `/professional/reviews`
**Sections:** List of reviews with client name, rating, comment, booking date
**Actions:** Reply to review, Flag review
**Constraint:** Reviews only shown for completed bookings
**States:** Empty, loading, error, success
**Accessibility:** Star ratings with aria-label, keyboard navigation

---

## 15. Super Admin Dashboard (Authenticated, super_admin only)
**URL:** `/admin/dashboard`
**Sections:**
- Overview metrics: Total professionals, pending approvals, total revenue, active subscriptions
- Professionals awaiting approval list
- Recent disputes
- Quick actions: Approve professional, View disputes, Manage plans
**States:** Empty, loading, error, success
**Accessibility:** Table headers, ARIA labels, keyboard navigation

---

## 16. Admin Professionals Management (Authenticated, super_admin/admin_staff)
**URL:** `/admin/professionals`
**Sections:** Searchable, filterable, paginated table
**Columns:** Name, email, category, status (pending/approved/suspended), subscription, joined date
**Actions:** Approve, Reject, Suspend, Verify, View details
**Confirmation:** Required for suspension
**States:** Empty, loading, error, success
**Accessibility:** Table headers, keyboard navigation, confirmation dialogs

---

## 17. Admin Plans & Subscriptions (Authenticated, super_admin only)
**URL:** `/admin/plans`
**Sections:** List of subscription plans with price, features, limits
**Actions:** Create plan, Edit plan, Deactivate plan
**Confirmation:** Required for price changes
**States:** Empty, loading, error, success
**Accessibility:** Table headers, keyboard navigation

---

## 18. Admin Reviews Moderation (Authenticated, super_admin/admin_staff)
**URL:** `/admin/reviews`
**Sections:** List of all reviews with flag status
**Actions:** Approve, Remove, Flag, View booking
**States:** Empty, loading, error, success
**Accessibility:** Table headers, keyboard navigation

---

## 19. Admin Audit Log (Authenticated, super_admin only)
**URL:** `/admin/audit-log`
**Sections:** Searchable, filterable, paginated log
**Columns:** Admin user, action, entity, before values, after values, timestamp
**Actions:** Export CSV
**States:** Empty, loading, error, success
**Accessibility:** Table headers, keyboard navigation

---

## 20. Settings / Profile (Authenticated)
**URL:** `/settings`
**Sections:** Profile details, change password, notification preferences, delete account
**Actions:** Save changes, Delete account (with confirmation)
**States:** Loading, error, success
**Accessibility:** Form labels, confirmation dialogs, keyboard navigation

---

## Mobile Layouts
All screens above have mobile layouts:
- Single column stack
- Bottom navigation for main sections
- Hamburger menu for secondary navigation
- Touch targets minimum 44px
- Readable text without zoom

## States Reference
Every screen must design: **empty, loading, error, success, and permission denied**