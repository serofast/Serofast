# SeroFast Admin Dashboard — Master Feature & Architecture Reference

> **Purpose:** This README is the feature and architecture source of truth for the SeroFast Admin Dashboard. Use it when implementing, extending, fixing, routing, or integrating Admin features in VS Code/Codex.

## 1. Product context

SeroFast is a local e-commerce marketplace connecting customers, local shops/shop owners, marketplace products, orders, payments, delivery, returns/refunds, marketing, analytics, and platform operations.

The Admin Dashboard is the **central marketplace control center**. Shop owners manage their own shops; Admin manages the marketplace as a whole.

```text
SEROFAST
├── Customer Marketplace
├── Authentication
├── Create Shop / Seller Onboarding
├── Shop Owner Dashboard
└── Admin Marketplace Control Center
```

## 2. Current framework — do not change

```text
React 18
Vite 6
JavaScript / JSX
Tailwind CSS v4
@tailwindcss/vite
react-router-dom
lucide-react
```

Do not introduce Bootstrap, Material UI, another CSS framework, CSS Modules, styled-components, or a Tailwind v3 configuration. Keep the existing Tailwind v4 CSS-first architecture.

## 3. SeroFast design system — source of truth

Use the existing SeroFast tokens throughout Admin. Do not create a new brand palette.

```text
brandRed         #D32F2F
brandRedDark     #B71C1C
primaryLight     #EF4444
lightBackground  #FAF8F5
lightSurface     #FFFFFF
lightBorder      #F3F4F6
promoHighlight   #FFF1F2
textPrimary      #111827
textSecondary    #6B7280
textMuted        #9CA3AF
```

Typography: **Sansation**.

Common utilities include `bg-brandRed`, `bg-brandRedDark`, `text-textPrimary`, `text-textSecondary`, `border-lightBorder`, `rounded-bento`, `shadow-bento`, `shadow-float`, and `font-sansation` when already defined by the project.

Core Admin UI should feel like the same SeroFast product as the public landing page and Create Shop flow.

## 4. Admin design principles

Admin should be:

- clear and professional
- data-dense but readable
- responsive
- accessible
- scalable
- maintainable
- prepared for real backend integration

Do not build the Admin as one huge file or one generic page containing every business rule.

Preferred flow:

```text
Page
↓
Domain Components
↓
Hook / State
↓
Service
↓
Backend / Supabase / API
```

## 5. Recommended Admin architecture

```text
src/components/admin/
├── AdminRoutes.jsx
├── index.js
├── layout/
├── shared/
├── dashboard/
├── shops/
├── customers/
├── products/
├── categories/
├── orders/
├── inventory/
├── returns/
├── reviews/
├── delivery/
├── finance/
├── marketing/
│   ├── coupons/
│   ├── campaigns/
│   ├── banners/
│   └── homepage/
├── analytics/
├── support/
├── notifications/
├── risk/
├── reports/
└── system/
    ├── admins/
    ├── roles/
    ├── audit/
    └── settings/
```

For most domains:

```text
domain/
├── pages/
├── components/
├── hooks/
├── services/
├── validation/
└── constants.js
```

Do not force unnecessary files into simple domains, but do not collapse major domains into a single generic file.

## 6. Admin route map

### Dashboard

```text
/admin
```

### Marketplace

```text
/admin/shops
/admin/shops/approvals
/admin/shops/:shopId
/admin/shops/:shopId/analytics
/admin/shops/:shopId/withdrawals
/admin/customers
/admin/customers/:customerId
/admin/products
/admin/products/:productId
/admin/products/:productId/edit
/admin/products/approvals
/admin/categories
```

### Commerce

```text
/admin/orders
/admin/orders/:orderId
/admin/inventory
/admin/returns
/admin/returns/:returnId
/admin/reviews
/admin/delivery
/admin/delivery/:shipmentId
```

### Finance

```text
/admin/finance/transactions
/admin/finance/commissions
/admin/finance/withdrawals
/admin/finance/withdrawals/:withdrawalId
/admin/finance/refunds
/admin/finance/refunds/:refundId
/admin/finance/reports
```

### Marketing

```text
/admin/marketing/coupons
/admin/marketing/coupons/new
/admin/marketing/coupons/:couponId/edit
/admin/marketing/campaigns
/admin/marketing/campaigns/new
/admin/marketing/campaigns/:campaignId/edit
/admin/marketing/banners
/admin/marketing/banners/new
/admin/marketing/banners/:bannerId/edit
/admin/marketing/homepage
```

### Analytics / Operations / System

```text
/admin/analytics
/admin/analytics/search
/admin/support
/admin/support/:ticketId
/admin/notifications
/admin/risk
/admin/reports
/admin/admin-users
/admin/admin-users/:adminId
/admin/roles
/admin/roles/:roleId
/admin/audit-logs
/admin/settings
```

## 7. Dashboard

Purpose: answer **“What is happening on SeroFast right now?”**

### KPIs

```text
Total Sales
Today's Orders
Active Shops
Registered Customers
Pending Orders
Pending Shop Approvals
Pending Returns
Pending Refunds
Pending Withdrawals
Low Stock Products
Support Tickets
Fraud / Risk Alerts
```

### Sales overview

Filters:

```text
Today
7 Days
30 Days
3 Months
6 Months
1 Year
Custom
```

Metrics:

```text
Gross Sales
Net Sales
Orders
Average Order Value
Refunds
Platform Commission
```

### Order overview

```text
Pending
Processing
Shipped
Delivered
Cancelled
Returned
```

### Shop activity

```text
New Shops
Active Shops
Inactive Shops
Suspended Shops
Approval Queue
```

### Recent activity

Examples: shop registration, order placement, withdrawal request, refund request, product submission, shop approval.

## 8. Shop management

### Routes

```text
/admin/shops
/admin/shops/approvals
/admin/shops/:shopId
/admin/shops/:shopId/analytics
/admin/shops/:shopId/withdrawals
```

### Shop list columns

```text
Shop
Owner
Category
Products
Orders
Revenue
Rating
Status
Joined
Actions
```

### Shop statuses

```text
Pending
Active
Suspended
Rejected
Archived
```

### Admin actions

```text
View
Edit
Approve
Reject
Request Changes
Suspend
Reactivate
Change Category
Feature
Verify
Mark Trusted Seller
Restrict Products
View Analytics
View Orders
View Earnings
View Withdrawals
Contact Seller
```

### Verification

Track:

```text
Identity
Business
Bank
Phone
Email
```

Statuses:

```text
Verified
Pending
Rejected
```

## 9. Shop approval workflow

Approval detail should show:

```text
Shop Information
Owner Information
Business Information
Documents
Category
Contact Details
Bank Details
```

Actions:

```text
Approve
Reject
Request Changes
Suspend
```

Typical rejection reasons:

```text
Incomplete business information
Invalid document
Duplicate shop
Category not allowed
Verification failed
```

An approval action must create a real status transition in the frontend state now and a persisted backend transition later.

## 10. Product management

### Routes

```text
/admin/products
/admin/products/:productId
/admin/products/:productId/edit
/admin/products/approvals
```

### Product states

```text
Draft
Pending Review
Active
Rejected
Hidden
Out of Stock
Flagged
```

### Table

```text
Image
Product
Shop
Category
Price
Stock
Status
Rating
Created
Actions
```

### Admin actions

```text
View
Edit
Approve
Reject
Hide
Delete
Feature
Change Category
Assign Tags
Manage Images
Manage Attributes
Create Badge
Flag Product
```

## 11. Category management

Route:

```text
/admin/categories
```

Functions:

```text
Create Category
Rename Category
Create Subcategory
Deactivate Category
Reorder Categories
Assign Category Image
Configure Featured Category
```

Category changes should eventually flow into marketplace navigation, product classification, filters, seller configuration, and Homepage CMS.

## 12. Customer management

### Routes

```text
/admin/customers
/admin/customers/:customerId
```

### Customer profile

```text
Name
Email
Phone
Orders
Total Spent
Average Order Value
Wishlist
Reviews
Returns
Refunds
Wallet
Addresses
Account Status
```

### Admin actions

```text
View
Block
Unblock
Reset Account
View Orders
View Returns
View Support Tickets
Inspect Suspicious Activity
```

## 13. Order management

### Routes

```text
/admin/orders
/admin/orders/:orderId
```

### Status lifecycle

```text
New
→ Processing
→ Packed
→ Shipped
→ Out for Delivery
→ Delivered
```

Also support:

```text
Cancelled
Returned
Refunded
```

### Order detail

```text
Customer Information
Shop Information
Products
Payment
Shipping Address
Delivery
Order Timeline
Refund Information
```

### Marketplace order relationship

Never assume a customer order belongs to one shop. Support:

```text
Customer Order
├── Shop Order A
│   ├── Product A
│   └── Product B
└── Shop Order B
    ├── Product C
    └── Product D
```

This structure is necessary for marketplace delivery, seller earnings, returns, refunds, and commissions.

## 14. Inventory

Route:

```text
/admin/inventory
```

Monitor:

```text
Low Stock
Out of Stock
Fast Moving
Slow Moving
Stock Alerts
```

Inventory record:

```text
Product
Shop
Current Stock
Threshold
Velocity
Status
```

## 15. Returns

Routes:

```text
/admin/returns
/admin/returns/:returnId
```

States:

```text
Requested
Approved
Pickup
Received
Refunded
Rejected
```

Actions:

```text
Approve
Reject
Request Evidence
Process Refund
Contact Seller
Contact Customer
```

## 16. Reviews

Route:

```text
/admin/reviews
```

Statuses:

```text
Published
Pending
Reported
Hidden
Removed
```

Actions:

```text
Inspect Review
Inspect Customer
Inspect Product
Inspect Shop
Hide
Remove
Handle Report
Moderate Abuse
```

## 17. Delivery

Routes:

```text
/admin/delivery
/admin/delivery/:shipmentId
```

Statuses:

```text
Pending Pickup
In Transit
Out for Delivery
Delivered
Failed
Delayed
```

Data:

```text
Order
Shop
Customer
Courier
Tracking ID
Status
Expected Delivery
```

The first implementation can use local/mock shipment data; real courier integration belongs to later backend work.

## 18. Finance

Finance is a separate domain:

```text
/admin/finance/transactions
/admin/finance/commissions
/admin/finance/withdrawals
/admin/finance/withdrawals/:withdrawalId
/admin/finance/refunds
/admin/finance/refunds/:refundId
/admin/finance/reports
```

### Transactions

Track order payments, withdrawals, refunds, fees, payment failures, and net amounts.

### Commission system

Support:

```text
Default Commission
Category Commission
Shop-Specific Commission
Promotional Commission
```

Conceptually:

```text
Order Amount
− Discount
= Net Order Amount

Net Order Amount
− Platform Commission
= Seller Earnings
```

### Withdrawals

Statuses:

```text
Pending
Approved
Processing
Completed
Rejected
```

Actions:

```text
Approve
Reject
View Transaction
View Bank Details
Export
```

### Entry fee

Support Admin-controlled:

```text
Standard Shop Entry Fee
Promotional Fee
Free Registration Period
Start Date
End Date
```

## 19. Marketing

### Coupons

Support:

```text
Percentage discount
Fixed discount
Minimum order
Maximum discount
Usage limit
Expiration
Specific shop
Specific product
Specific category
New customers
All customers
```

### Campaigns

```text
Campaign Name
Audience
Budget
Start Date
End Date
Reach
Status
```

### Banners

```text
Hero Banner
Promotion Banner
Category Banner
Homepage Banner
Priority
Scheduling
Enable / Disable
```

## 20. Homepage CMS

Route:

```text
/admin/marketing/homepage
```

Admin should eventually control public homepage content without editing React source.

Manage:

```text
Hero Slides
Featured Categories
Featured Shops
Trending Products
Popular Products
Promotion Banners
Homepage Section Ordering
```

Actions:

```text
Add
Edit
Delete
Reorder
Enable
Disable
Schedule
```

## 21. Analytics

Routes:

```text
/admin/analytics
/admin/analytics/search
```

### Sales analytics

```text
Gross Sales
Net Sales
Platform Revenue
Seller Revenue
Commissions
Refunds
Discounts
```

### Customer analytics

```text
New Customers
Returning Customers
Active Users
Retention
Average Order Value
Customer Lifetime Value
```

### Shop analytics

```text
New Shops
Active Shops
Shop Revenue
Average Orders / Shop
Top Sellers
Low Performing Sellers
```

### Search analytics

```text
Top Searches
Search Volume
Search Trends
Zero-Result Searches
```

## 22. Support

Routes:

```text
/admin/support
/admin/support/:ticketId
```

Ticket data:

```text
Ticket ID
Requester
Customer / Seller
Subject
Priority
Status
Order
Assigned Admin
Updated
```

Statuses:

```text
Open
In Progress
Waiting
Escalated
Resolved
Closed
```

Actions:

```text
Assign
Reply
Escalate
Close
Refund
```

## 23. Notifications

Route:

```text
/admin/notifications
```

Channels:

```text
Push
Email
SMS
In-App
```

Templates:

```text
Order Confirmed
Order Shipped
Order Delivered
Refund Processed
New Shop Approved
Withdrawal Completed
Promotion Started
```

## 24. Risk & Fraud

Route:

```text
/admin/risk
```

Review signals such as:

```text
Failed payments
Unusual refunds
Multiple accounts
Suspicious orders
Abnormal seller activity
Fake reviews
Coupon abuse
Repeated chargebacks
```

Risk levels:

```text
Low
Medium
High
Critical
```

Actions:

```text
Investigate
Dismiss
Block
Escalate
```

The actual detection engine belongs to backend/security phases.

## 25. Reports

Route:

```text
/admin/reports
```

Reports:

```text
Sales
Orders
Customers
Shops
Products
Commissions
Withdrawals
Refunds
Tax
```

Filters:

```text
Date
Shop
Category
Status
Payment
Customer
```

Formats:

```text
CSV
Excel
PDF
```

Frontend export is only a UI capability until real backend reporting is connected.

## 26. Admin user management

Routes:

```text
/admin/admin-users
/admin/admin-users/:adminId
```

Roles:

```text
Super Admin
Operations Admin
Finance Admin
Support Admin
Marketing Admin
Catalog Admin
```

Functions:

```text
Create Admin
Edit Admin
Disable Admin
Reset Access
Change Role
View Activity
```

## 27. Roles & permissions / RBAC

Routes:

```text
/admin/roles
/admin/roles/:roleId
```

Example permissions:

```text
shops.view
shops.approve
shops.suspend
products.view
products.edit
products.approve
orders.view
orders.cancel
orders.refund
payments.view
payments.approve
marketing.manage
users.manage
```

Frontend permission gates are for UX. The backend must enforce authorization.

## 28. Audit logs

Route:

```text
/admin/audit-logs
```

Eventually record:

```text
Actor
Action
Entity
Entity ID
Timestamp
IP Address
User Agent
Previous Value
New Value
```

Sensitive Admin actions must create auditable records in the production backend.

## 29. Settings

Route:

```text
/admin/settings
```

Groups:

```text
General
Marketplace
Payments
Orders
Delivery
Taxes
Commission
Notifications
Security
Integrations
```

Marketplace settings may include:

```text
Platform Name
Currency
Commission
Registration Fee
Minimum Order
Return Policy
```

## 30. Core backend entities

Plan for these entities/tables over the later phases:

```text
users
admin_users
admin_roles
admin_permissions
admin_role_permissions

shops
shop_owners
shop_documents
shop_verifications
shop_settings

categories

products
product_images
product_attributes
product_variants
inventory

carts
cart_items
wishlists

orders
order_items
shop_orders
order_status_history

payments
payment_transactions
commissions
seller_earnings
withdrawals

returns
return_items
refunds

shipments
shipment_events

reviews
review_reports

coupons
coupon_usages
campaigns
banners
homepage_sections

notifications
notification_templates

support_tickets
support_messages

risk_alerts
audit_logs
settings
```

The exact database design is a Phase 5 concern and must be finalized before production data operations are implemented.

## 31. Service architecture

Never put database/API calls directly into page JSX.

Preferred pattern:

```text
Page
↓
Hook
↓
Service
↓
API / Supabase
↓
Database
```

Example:

```text
shops/pages/ShopsPage.jsx
        ↓
shops/hooks/useShops.js
        ↓
shops/services/shopService.js
        ↓
Supabase / API
```

Service functions may later include:

```text
getShops()
getShop(shopId)
createShop()
updateShop()
approveShop()
rejectShop()
suspendShop()
reactivateShop()
verifyShop()
```

## 32. Common shared Admin components

Build once and reuse:

```text
AdminLayout
AdminSidebar
AdminHeader
Breadcrumbs
PageHeader
SearchBar
Filters
DataTable
Pagination
Drawer
Modal
ConfirmDialog
StatusBadge
StatCard
Tabs
DateRangePicker
EmptyState
LoadingState
ErrorState
Toast
PermissionGate
```

Do not duplicate these inside every domain unless the interaction is genuinely domain-specific.

## 33. Interaction rules

Important controls must actually work.

```text
Approve       → status transition
Reject        → rejection reason
Suspend       → status transition
Search        → filtered results
Filter        → filtered dataset
Pagination    → visible page changes
Edit          → editable form/detail
Save          → state change / later persistence
Delete        → confirmation + deletion state
Export        → real download or clearly marked frontend demo
```

A visually active button that does nothing is not considered complete.

## 34. Responsive rules

Test at:

```text
1920 × 1080
1440 × 900
1366 × 768
1280 × 720
1024 × 768
820 × 1180
768 × 1024
430 × 932
390 × 844
375 × 667
```

Desktop:

- persistent sidebar
- full tables where possible
- multi-column dashboard
- clear hierarchy

Tablet:

- compact sidebar / drawer
- responsive cards
- adaptive tables

Mobile:

- slide-out sidebar
- stacked cards
- horizontal table scroll only where necessary
- large touch targets
- no page-level horizontal overflow
- readable text

## 35. Accessibility

Every Admin feature should provide:

```text
Keyboard navigation
Visible focus
Accessible labels
Meaningful button text
ARIA labels for icon-only controls
Field error association
Readable contrast
Touch-friendly controls
```

## 36. Loading / empty / error states

All data-driven Admin pages should handle:

```text
Loading
Success
Empty
Error
Retry
```

Never leave a data page blank because a request failed or returned zero results.

## 37. Security rules

Do not put secrets in frontend code.

Do not trust frontend-only permission checks.

Do not expose payment-provider secret keys.

Backend must enforce:

```text
Authentication
Authorization
Role permissions
Sensitive financial operations
Audit logging
```

## 38. Overall development phases

### Phase 0 — Foundation & Architecture

Status: **Established**

Scope:

```text
React
Vite
Tailwind v4
Router
Design tokens
Reusable UI system
Project architecture
Environment structure
```

### Phase 1 — Public Website / Landing Page

Status: **Implemented / refinement ongoing**

Scope:

```text
Header
Hero
Shops
Products
Why SeroFast
Mobile navigation
Responsive behavior
```

### Phase 2 — Authentication

Status: **Frontend implemented; backend pending**

Scope:

```text
Admin login
Shop Owner login
Signup flows
Role handling
Password recovery
Email verification
Session management
Protected routes
```

Customer role is not part of the current Admin/Shop Owner authentication design.

### Phase 3 — Create Shop / Seller Onboarding

Status: **Frontend implemented; backend pending**

Scope:

```text
Why Join
Shop Details
Business information
Logo / cover upload
Product selection
Review & Launch
Entry fee
Validation
Shop preview
Admin approval integration
```

Routes:

```text
/create-shop
/create-shop/details
/create-shop/products
/create-shop/launch
```

### Phase 4 — Admin Dashboard UI & Architecture

Status: **Current frontend architecture phase — complete after build validation**

Scope:

```text
Admin layout
Sidebar
Header
Dashboard
Shops
Approvals
Customers
Products
Categories
Orders
Inventory
Returns
Reviews
Delivery
Finance
Marketing
Analytics
Support
Notifications
Risk
Reports
Admin Users
Roles
Permissions
Audit Logs
Settings
Responsive UI
Domain architecture
```

Phase 4 is about building a strong frontend/application architecture. It does not mean that real database/backend operations are complete.

### Phase 5 — Database & Backend Foundation

Next major phase.

Scope:

```text
Database schema
Authentication persistence
Admin users
Roles
Permissions
Shops
Products
Categories
Inventory
Customers
Orders
Shop Orders
Payments
Transactions
Commissions
Withdrawals
Returns
Refunds
Reviews
Coupons
Campaigns
Banners
Notifications
Support
Audit Logs
Settings
File storage
RLS / authorization
Backend validation
API/service layer
```

### Phase 6 — Real Admin Marketplace Management

Connect the Admin frontend to real data and mutations:

```text
Shops
Shop approval
Products
Categories
Customers
Orders
Inventory
Returns
Reviews
Delivery
```

Replace mock/local data with real backend operations.

### Phase 7 — Shop Owner Dashboard

Build:

```text
Seller Dashboard
Products
Inventory
Orders
Customers
Reviews
Analytics
Earnings
Withdrawals
Shop Settings
Promotions
```

Seller access must be restricted to the seller's own shop/data.

### Phase 8 — Customer Marketplace

Build functional:

```text
Search
Category pages
Shop pages
Product pages
Wishlist
Cart
Checkout
Profile
Addresses
Orders
Reviews
Returns
```

### Phase 9 — Orders / Payments / Delivery

Implement:

```text
Order lifecycle
Payment provider
Payment verification
Multi-shop order splitting
Shipment creation
Tracking
Delivery events
```

### Phase 10 — Finance / Returns / Refunds

Implement:

```text
Commission calculation
Seller earnings
Withdrawals
Refunds
Payment failures
Entry fees
Financial reporting
```

### Phase 11 — Marketing / CMS / Promotions

Implement:

```text
Coupons
Campaigns
Banners
Featured Shops
Featured Products
Homepage CMS
Scheduling
Promotion rules
```

### Phase 12 — Analytics / Reports / Search Intelligence

Implement:

```text
Sales analytics
Customer analytics
Shop analytics
Product analytics
Revenue analytics
Conversion analytics
Search analytics
Zero-result search analysis
Reports
Exports
```

### Phase 13 — Support / Notifications / Risk

Implement:

```text
Support tickets
Seller support
Customer support
Notifications
Email
Push
SMS
In-app
Risk detection
Fraud workflows
```

### Phase 14 — Security / RBAC / Audit

Implement production security:

```text
Admin authentication
Role-based access
Permission enforcement
Session security
Sensitive-operation protection
Audit logs
```

### Phase 15 — Production Hardening

Final quality phase:

```text
Testing
Accessibility
Performance
Security review
Error monitoring
Analytics monitoring
Image optimization
Code splitting
SEO
PWA checks
Backups
Staging
Production deployment
```

## 39. Phase status board

```text
PHASE 0   Foundation             COMPLETE / ESTABLISHED
PHASE 1   Landing                COMPLETE / REFINEMENT
PHASE 2   Authentication         FRONTEND COMPLETE
PHASE 3   Create Shop            FRONTEND COMPLETE
PHASE 4   Admin Dashboard        FRONTEND ARCHITECTURE COMPLETE
PHASE 5   Backend / Database     NEXT
PHASE 6   Real Admin Operations  FUTURE
PHASE 7   Shop Owner             FUTURE
PHASE 8   Customer Marketplace   FUTURE
PHASE 9   Orders / Payments      FUTURE
PHASE 10  Finance / Returns      FUTURE
PHASE 11  Marketing / CMS        FUTURE
PHASE 12  Analytics              FUTURE
PHASE 13  Support / Risk         FUTURE
PHASE 14  Security / RBAC        FUTURE
PHASE 15  Production             FUTURE
```

## 40. Definition of Done for an Admin feature

A feature is not complete only because its screen renders.

### Frontend requirements

```text
[ ] Correct domain
[ ] Correct route
[ ] Dedicated page when appropriate
[ ] Reusable components
[ ] Hook/state logic when needed
[ ] Service boundary
[ ] Validation
[ ] Search/filter when applicable
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Responsive layout
[ ] Accessibility
[ ] SeroFast design tokens
[ ] No duplicate components
[ ] No new styling system
[ ] npm run build succeeds
```

### Backend-connected requirements

```text
[ ] Database operation
[ ] Authorization
[ ] Persistence
[ ] Backend validation
[ ] Error handling
[ ] Audit logging when sensitive
[ ] Security controls
```

## 41. Codex / VS Code feature implementation rules

When a new feature is requested, the agent should follow this sequence:

```text
1. Read this README.
2. Identify the phase.
3. Identify the correct domain.
4. Inspect current files before editing.
5. Reuse existing shared components.
6. Create or update the domain page.
7. Add domain components if needed.
8. Add/update hook/state logic.
9. Add/update service boundary.
10. Add validation/business rules.
11. Add route if required.
12. Preserve SeroFast design tokens.
13. Handle loading/empty/error states.
14. Test responsive behavior.
15. Run npm run build.
16. Fix all errors before declaring completion.
```

### Do not

```text
Do not redesign unrelated screens.
Do not add random colors.
Do not introduce another framework.
Do not create giant files.
Do not compress production JSX into one-line code.
Do not duplicate shared UI.
Do not put API/database calls inside page JSX.
Do not claim mock functionality is production functionality.
Do not bypass backend authorization.
```

## 42. Final product architecture

The completed SeroFast platform should eventually have:

```text
SEROFAST
│
├── PUBLIC MARKETPLACE
│   ├── Landing
│   ├── Shops
│   ├── Products
│   ├── Cart
│   ├── Checkout
│   └── Customer Account
│
├── AUTHENTICATION
│   ├── Admin
│   └── Shop Owner
│
├── CREATE SHOP
│   ├── Why Join
│   ├── Shop Details
│   ├── Products
│   └── Launch
│
├── SHOP OWNER
│   ├── Dashboard
│   ├── Products
│   ├── Inventory
│   ├── Orders
│   ├── Customers
│   ├── Reviews
│   ├── Analytics
│   ├── Earnings
│   └── Settings
│
└── ADMIN
    ├── Dashboard
    ├── Marketplace
    ├── Commerce
    ├── Finance
    ├── Marketing
    ├── Analytics
    ├── Operations
    └── System
```

## 43. Master rule

This README is the **Admin feature reference**, not a replacement for implementation details.

When the agent needs to implement a feature, it should inspect the actual repository first and follow the existing code structure. This document defines the intended responsibilities, routes, feature scope, architecture boundaries, design system, and phase roadmap.

If a requested feature is not listed here, first determine which existing Admin domain it belongs to. Extend that domain with the smallest maintainable architecture instead of creating a new top-level pattern.
