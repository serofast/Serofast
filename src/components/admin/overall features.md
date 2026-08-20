# SeroFast Admin Dashboard — Overall Features

> Current implementation reference for `src/components/admin/`.
>
> This document describes features that exist in the source code now. It separates working frontend
> behavior from backend-ready placeholders so that planned functionality is not mistaken for completed
> production integration.

## 1. Current implementation status

The Admin Dashboard is a React/Vite frontend control center for marketplace operations. Most records
come from `shared/adminData.js` and most changes are stored in React component state or
`useResourceList` state.

- Search, filtering, sorting, pagination, selection, drawers, modals, confirmation dialogs, local
  record updates, and toast feedback work in the browser.
- Create, edit, status-change, delete, approval, and configuration actions are generally local-only.
- A full browser refresh restores the original seed data.
- Domain hooks and services provide a future integration boundary, but most current pages do not use
  them as their active data source.
- Supabase/API persistence, server authorization, immutable audit logging, realtime updates, and
  production file delivery are not completed by this Admin frontend.

## 2. Shared Admin shell

### Layout and navigation

`layout/AdminLayout.jsx` provides the shell for every Admin route.

- Fixed 272-pixel sidebar on desktop.
- Slide-in sidebar drawer and dimmed close overlay below the desktop breakpoint.
- Navigation groups: Overview, Marketplace, Commerce, Finance, Marketing, Analytics, Operations,
  and System.
- Active route highlighting with the SeroFast red pill treatment.
- Admin identity card displaying `Admin Panel` and `Super Admin`.
- Sidebar `Exit Admin` action redirects to `/`.
- Sticky top header.
- Desktop marketplace search redirects submitted queries to `/admin/analytics/search?q=...`.
- Notification bell redirects directly to `/admin/notifications`; it does not open an overlay.
- Profile avatar is display-only and does not open a dropdown.
- Mobile Admin bottom navigation is not mounted; navigation is handled by the sidebar drawer.
- Shared breadcrumbs are rendered above every route page.
- Unknown Admin paths redirect to `/admin`.

### Responsive behavior

- Page padding reduces on smaller screens.
- Shared filter controls stack vertically on narrow screens.
- Shared tables become mobile record cards below the `md` breakpoint.
- Desktop tables scroll horizontally inside their card instead of widening the whole page.
- Desktop drawers become bottom sheets on mobile.
- Tabs scroll horizontally when their labels do not fit.

## 3. Shared list and table features

The standard list system is composed of:

```text
ResourcePage
├── useResourceList
├── FilterBar
├── ResourceTable
├── ResourceForm inside Drawer
├── BulkActionBar
├── ConfirmDialog
└── Toast
```

### Search and filters

- Search checks every value in each record and is case-insensitive.
- Status filtering uses the branded `AdminSelect` control.
- Status options are derived from the current records.
- Clear filters resets search, status, quick filters, sorting, direction, and page number.
- Some Dashboard links provide a `?status=` query that `ResourcePage` applies automatically.
- Summary cards can apply a status filter or a custom quick-filter predicate.

### Tables and mobile cards

- Column definitions are supplied by each domain page.
- Every column header supports ascending and descending sorting.
- Desktop tables have sticky selection and action columns.
- Select-all affects the currently visible page.
- Long values are truncated with browser title text where appropriate.
- Status values use shared colored badges.
- Mobile cards show the primary identifying field, record ID, status, three supporting values, and
  primary/more actions.
- Loading, error/retry, empty, and clear-filter states are shared.
- Pagination supports First, Previous, Next, Last, and page sizes of 5, 10, or 20.

### Default row actions

Standard `ResourcePage` records expose:

- View Details — opens the shared manage drawer.
- Edit Record — opens the same manage drawer.
- Activate/Suspend — requests a confirmed status change.
- Row selection for bulk actions.

Standard bulk actions are Activate, Suspend, and Remove. Status changes and removal require a
confirmation dialog and then update only the current frontend session.

### Shared create/edit drawer

- The drawer title changes between `Create ...` and `Manage ...`.
- IDs and common created/joined/updated/date fields are excluded from editing.
- All remaining editable columns are shown; the form no longer stops after six fields.
- Required-field validation runs before saving.
- Description, reason, review, address, and subject fields use multiline controls.
- Numeric record values and known count fields use number inputs.
- Controlled values use the reusable branded selector instead of arbitrary text.
- The selector has a rounded menu, SeroFast shadows, selected highlighting, checkmark, animated
  chevron, outside-click close, and Escape close.

Examples of controlled values include:

- Shop status: Active, Pending, Suspended.
- Product status: Active, Suspended, Low Stock, Out of Stock.
- Order payment/status, inventory velocity/status, review rating/status, delivery courier/status,
  support type/priority/status, Admin role/status, coupon type/status, campaign audience/status, and
  banner placement/status.

## 4. Route index

| Area | Route | Page |
| --- | --- | --- |
| Overview | `/admin` | Dashboard |
| Marketplace | `/admin/shops` | Shops list |
| Marketplace | `/admin/shops/approvals` | Shop approval queue |
| Marketplace | `/admin/shops/:shopId` | Shop details |
| Marketplace | `/admin/customers` | Customers list |
| Marketplace | `/admin/customers/:customerId` | Customer details |
| Marketplace | `/admin/products` | Products list |
| Marketplace | `/admin/products/approvals` | Product approval queue |
| Marketplace | `/admin/products/:productId` | Product details |
| Marketplace | `/admin/products/:productId/edit` | Product editor |
| Marketplace | `/admin/categories` | Categories |
| Commerce | `/admin/orders` | Orders list |
| Commerce | `/admin/orders/:orderId` | Order details |
| Commerce | `/admin/inventory` | Inventory |
| Commerce | `/admin/returns` | Returns list |
| Commerce | `/admin/returns/:returnId` | Return details |
| Commerce | `/admin/reviews` | Reviews |
| Commerce | `/admin/delivery` | Delivery list |
| Commerce | `/admin/delivery/:shipmentId` | Shipment details |
| Finance | `/admin/finance/transactions` | Transactions |
| Finance | `/admin/finance/commissions` | Commissions |
| Finance | `/admin/finance/withdrawals` | Withdrawals |
| Finance | `/admin/finance/withdrawals/:withdrawalId` | Same Withdrawals page |
| Finance | `/admin/finance/refunds` | Refunds |
| Finance | `/admin/finance/refunds/:refundId` | Same Refunds page |
| Marketing | `/admin/marketing/coupons` | Coupons list |
| Marketing | `/admin/marketing/coupons/new` | Create coupon |
| Marketing | `/admin/marketing/coupons/:couponId/edit` | Edit coupon |
| Marketing | `/admin/marketing/campaigns` | Campaigns list |
| Marketing | `/admin/marketing/campaigns/new` | Create campaign |
| Marketing | `/admin/marketing/campaigns/:campaignId/edit` | Edit campaign |
| Marketing | `/admin/marketing/banners` | Banners list |
| Marketing | `/admin/marketing/banners/new` | Create banner |
| Marketing | `/admin/marketing/banners/:bannerId/edit` | Edit banner |
| Marketing | `/admin/marketing/homepage` | Homepage CMS |
| Analytics | `/admin/analytics` | Marketplace analytics |
| Analytics | `/admin/analytics/search` | Search analytics |
| Analytics | `/admin/reports` | Reports |
| Operations | `/admin/support` | Support tickets |
| Operations | `/admin/support/:ticketId` | Ticket details |
| Operations | `/admin/notifications` | Notification templates |
| Operations | `/admin/risk` | Risk and safety |
| System | `/admin/admin-users` | Admin users |
| System | `/admin/admin-users/:adminId` | Same Admin Users page |
| System | `/admin/roles` | Roles and permissions |
| System | `/admin/roles/:roleId` | Roles page with selected role |
| System | `/admin/audit-logs` | Audit logs |
| System | `/admin/settings` | Settings |

## 5. Dashboard

**Route:** `/admin`

### Features

- Primary KPI cards for sales, orders, shops, customers, and pending work.
- Each KPI links to its corresponding operational page.
- Order Breakdown donut chart with Delivered, Shipped, Processing, and Pending segments.
- Fulfillment Efficiency gauges for on-time dispatch, verified shops, and revenue goal.
- Action-item cards for pending returns, refunds, payouts, low stock, support tickets, and risk
  alerts; cards navigate to the corresponding page and sometimes apply a status query.
- Gross-revenue bar chart with branded date-range selector: Today, 7 Days, 30 Days, 3 Months, and
  1 Year.
- Gross, Net, Orders, AOV, Refunds, and Commission summary values.
- Recent Orders cards link to individual order details.
- Recent Activity panel links to Audit Logs.

### Current limitation

Changing the date range changes the displayed selection/label, but the seeded chart and metric data
are not recalculated from a backend query.

## 6. Marketplace pages

### 6.1 Shops list

**Route:** `/admin/shops`

- Columns: Shop, Owner, Category, Products, Orders, Revenue, Rating, Status, Joined.
- Summary cards: Total Shops, Active, Pending Approval, Suspended.
- Shared search, status filter, sorting, selection, pagination, mobile cards, and bulk actions.
- Manage drawer edits shop/owner/category/counts/revenue/rating/status values.
- Category and status are controlled branded dropdowns.
- Status choices include Active, Pending, and Suspended.

### 6.2 Shop approval queue

**Route:** `/admin/shops/approvals`

- Queue KPIs: Pending, Identity pending, Business pending, Bank pending, Ready for review.
- Each application shows shop, owner, category, verification state, submission date, and Pending badge.
- Review opens the related shop detail page.
- Request Changes and Reject require a written reason.
- Approve, Request Changes, and Reject use confirmation dialogs.
- Confirmed decisions remove the application from the local queue.
- Empty-state message appears when the queue is clear.

### 6.3 Shop details

**Route:** `/admin/shops/:shopId`

- Actions: Approve pending shop, Suspend, Reactivate, Mark Trusted, Remove Trusted.
- Suspension confirmation includes an optional internal-reason textarea.
- Metric cards: Products, Orders, Revenue, Verification.
- Tabs: Overview, Products, Orders, Customers, Analytics, Earnings, Withdrawals, Verification,
  Documents, Settings.
- Overview shows owner, category, joined date, rating, status, and estimated customer count.
- Verification shows Identity, Business, Bank, Phone, and Email states.
- Documents lists Identity proof, Business registration, and Bank proof with a local PDF-preview
  overlay.
- Other tabs currently show backend-ready explanatory placeholders.
- Unknown shop IDs fall back to the first seeded shop.

### 6.4 Customers list

**Route:** `/admin/customers`

- Columns: Name, Email, Orders, Total Spent, Average Order, Returns, Status, Joined.
- Summary cards: Total Customers, Active, High Value, Blocked.
- High Value means seeded spending of at least ₹40,000.
- Shared list controls and manage drawer.
- Customer status is a controlled selector: Active, Blocked, or Suspended.

### 6.5 Customer details

**Route:** `/admin/customers/:customerId`

- Block Customer and Unblock actions with confirmation.
- Reset Access produces frontend feedback for a future backend request.
- Tabs: Overview, Orders, Returns, Reviews, Wishlist, Addresses, Support, Activity.
- Overview shows email, order count, total spent, status, calculated average order, returns, masked
  phone, and joined date.
- Non-overview tabs are service-layer placeholders.
- Unknown customer IDs fall back to the first seeded customer.

### 6.6 Products list

**Route:** `/admin/products`

- Columns: Product, Shop, Category, Price, Stock, Status, Rating, Created.
- Summary cards: Total Products, Active, Low Stock, Out of Stock.
- Shared list controls and manage drawer.
- Shop, category, and status use controlled selectors.
- Product status choices include Active, Suspended, Low Stock, and Out of Stock.

### 6.7 Product details and editor

**Routes:** `/admin/products/:productId`, `/admin/products/:productId/edit`

- Detail actions: Approve, Hide/Publish, and Flag Product with confirmation.
- Tabs: Overview, Images, Pricing, Inventory, Attributes, Shop, Reviews, Sales, Moderation.
- Overview shows shop, category, price, stock, rating, created date, and status.
- Moderation tab provides review checkboxes for information, images, category, price, and prohibited
  content.
- Other tabs currently show backend-ready placeholders.
- Edit mode supports product name, controlled shop, controlled category, price, and non-negative stock.
- Saving returns to the detail route and updates local component state.
- Unknown product IDs fall back to the first seeded product.

### 6.8 Product approval queue

**Route:** `/admin/products/approvals`

- Shows product, shop, category, price, submitted date, and Pending status.
- Approve and Reject actions use confirmation dialogs.
- Rejection requires a reason.
- A confirmed decision removes the item from the local queue.
- Empty state appears after all submissions are processed.

### 6.9 Categories

**Route:** `/admin/categories`

- Columns: Category, Parent, Subcategories, Shops, Products, Status.
- Search, branded status filter, sorting, selection, pagination, desktop table, and mobile cards.
- Add Category validates a required unique name and creates a Draft category.
- View modal shows ID, status, parent, subcategory count, associated shops, and products.
- Edit modal changes category name and parent; parent uses the branded selector and excludes the
  current category.
- Move Up and Move Down reorder local records.
- Activate/Deactivate requires confirmation.
- Delete requires confirmation.
- Bulk actions: Activate, Deactivate, Delete.

## 7. Commerce pages

### 7.1 Orders list

**Route:** `/admin/orders`

- Columns: ID, Customer, Shop, Items, Amount, Payment, Status, Date.
- Summary cards: All Orders, Processing, Shipped, Delivered, Returned.
- Shared list controls and manage drawer.
- Customer/shop relationships, payment state, and order status use controlled selectors.
- Status choices support Processing, Shipped, Delivered, Returned, and Cancelled.

### 7.2 Order details

**Route:** `/admin/orders/:orderId`

- Customer-order summary: customer, item count, date, status, payment, amount, shop-order count, and
  delivery state.
- Demonstrates marketplace fulfillment by splitting one customer order into one or more shop orders.
- Timeline: New, Processing, Packed, Shipped, Delivered.
- Review Items opens a drawer grouped by shop order.
- Open Shipment links to the matching shipment when available.
- Manage Refund links to Refunds with the order query.
- Mark Next Status advances through the lifecycle after confirmation.
- Unknown order IDs fall back to the first seeded order.

### 7.3 Inventory

**Route:** `/admin/inventory`

- Columns: ID, Product, Shop, Stock, Threshold, Velocity, Status.
- Summary cards: Tracked Items, Low Stock, Out of Stock, Fast Moving, Slow Moving.
- Shared list controls and manage drawer.
- Product, shop, velocity, and stock status are controlled choices.
- Stock and threshold use numeric inputs.

### 7.4 Returns list

**Route:** `/admin/returns`

- Columns: ID, Order, Customer, Shop, Product, Reason, Refund, Status.
- Summary cards: Requested, Approved, Refund Value.
- Shared list controls and manage drawer.
- Related order/customer/shop/product and return status use controlled selectors.
- Reason uses a multiline editor.
- Status choices: Requested, Approved, Rejected, Completed.

### 7.5 Return details

**Route:** `/admin/returns/:returnId`

- Read-only operational detail card generated from every field in the selected return.
- Status is shown as a shared badge.
- Unknown IDs fall back to the first seeded return.

### 7.6 Reviews

**Route:** `/admin/reviews`

- Columns: ID, Rating, Review, Customer, Product, Shop, Status.
- Summary cards: Total Reviews, Published, Reported, Average Rating.
- Shared list controls and manage drawer.
- Rating is restricted to 1–5.
- Customer, product, shop, and status use controlled selectors.
- Review content uses a multiline editor.
- Status choices: Published, Reported, Hidden.

### 7.7 Delivery list

**Route:** `/admin/delivery`

- Columns: ID, Order, Shop, Customer, Courier, Tracking, Status.
- Summary cards: All Shipments, Processing, Shipped, Delayed.
- Shared list controls and manage drawer.
- Order/shop/customer, courier, and shipment status use controlled selectors.
- Courier choices include SeroFast Express, Delhivery, Blue Dart, and India Post.

### 7.8 Shipment details

**Route:** `/admin/delivery/:shipmentId`

- Read-only operational detail card generated from every shipment field.
- Status is shown as a shared badge.
- Unknown IDs fall back to the first seeded shipment.

## 8. Finance pages

### 8.1 Transactions

**Route:** `/admin/finance/transactions`

- Columns: ID, Type, Order, User, Amount, Fee, Net, Status.
- Summary cards: All Transactions, Completed, Pending, Gross Value.
- Shared list controls and manage drawer.
- Type, linked order/user, and status use controlled selectors.
- Transaction types include Order Payment, Withdrawal, Refund, and Commission.

### 8.2 Commissions

**Route:** `/admin/finance/commissions`

- KPI cards: Gross Marketplace Sales, Platform Commission, Seller Earnings.
- Editable default commission percentage.
- Validation restricts commission to 0–100%.
- Live ₹1,000 seller-earnings example based on the entered default rate.
- Category, shop, and promotion override rules.
- Override rates update on blur after validation.
- Save/update operations show local toast feedback.

### 8.3 Withdrawals

**Routes:** `/admin/finance/withdrawals`, `/admin/finance/withdrawals/:withdrawalId`

- Status summary cards: Pending, Approved, Processing, Completed, Rejected.
- Columns: Request, Shop, Owner, Amount, Method, Status, Requested.
- Search, status filtering, sorting, selection, pagination, and responsive table/cards.
- Actions: Review, Approve, Reject, View Shop, View Bank Details, View History.
- Approval and rejection use confirmation dialogs.
- Rejection requires a reason.
- Review drawer shows all request data and action controls.
- Bank drawer shows masked, frontend-demo bank information.
- History drawer shows submission and current status events.
- Linked shop navigation resolves the shop from seed data.
- The parameterized withdrawal route renders the same page; it does not automatically open the
  requested withdrawal.

### 8.4 Refunds

**Routes:** `/admin/finance/refunds`, `/admin/finance/refunds/:refundId`

- Columns: ID, Order, Customer, Shop, Amount, Reason, Status.
- Summary cards: All Refunds, Pending, Processed, Refund Value.
- Shared list controls and manage drawer.
- Order/customer/shop and refund status use controlled selectors.
- Reason uses a multiline editor.
- The parameterized refund route renders the same list page; it does not automatically select the
  requested refund.

## 9. Marketing pages

### 9.1 Coupons list

**Route:** `/admin/marketing/coupons`

- Columns: ID, Code, Type, Value, Minimum Order, Usage, Status, Expires.
- Shared search, status filter, sorting, selection, pagination, edit drawer, status actions, and bulk
  actions.
- Add New opens the dedicated create route.

### 9.2 Coupon create/edit form

**Routes:** `/admin/marketing/coupons/new`, `/admin/marketing/coupons/:couponId/edit`

- Fields: Code, Discount Type, Discount Value, Minimum Order, Maximum Discount, Usage Limit,
  Audience, Applies To, Start Date, End Date, Status.
- Branded selectors for type, audience, scope, and status.
- Code is converted to uppercase and validated to 3–20 supported characters.
- Positive discount validation; percent discounts cannot exceed 100%.
- Non-negative minimum order and maximum discount.
- Positive whole-number usage limit.
- Required date range with end after start.
- Existing seeded coupon values are loaded in edit mode when found.
- Save currently shows local feedback and does not persist the coupon list.

### 9.3 Campaigns list

**Route:** `/admin/marketing/campaigns`

- Columns: ID, Name, Audience, Budget, Reach, Status, Starts, Ends.
- Shared list and manage-drawer functionality.
- Audience and status are controlled selectors.
- Add New opens the dedicated create route.

### 9.4 Campaign create/edit form

**Routes:** `/admin/marketing/campaigns/new`, `/admin/marketing/campaigns/:campaignId/edit`

- Fields: Campaign Name, Audience, Budget, Start Date, End Date, Status.
- Controlled audience and status selectors.
- Required name, positive budget, required dates, and chronological date validation.
- Save provides local feedback.
- The current edit route changes the page title but does not preload a seeded campaign record.

### 9.5 Banners list

**Route:** `/admin/marketing/banners`

- Columns: ID, Title, Placement, Status, Priority, Start, End.
- Shared list and manage-drawer functionality.
- Placement and status are controlled selectors; priority is numeric.
- Add New opens the dedicated create route.

### 9.6 Banner create/edit form

**Routes:** `/admin/marketing/banners/new`, `/admin/marketing/banners/:bannerId/edit`

- Fields: Title, Placement, Priority, CTA Label, Target URL, Start Date, End Date, Image, Status.
- Branded placement and status selectors.
- Local image selection and object-URL preview.
- Required title, positive whole-number priority, required CTA, valid internal `/path` or HTTP(S)
  target, required new-banner image, and chronological date validation.
- Save provides local feedback.
- Edit mode does not currently preload a seeded banner record.

### 9.7 Homepage CMS

**Route:** `/admin/marketing/homepage`

- Lists homepage sections with priority, ID, and status.
- Enable/Disable toggles section visibility locally.
- Move Up/Move Down changes order and recalculates priority.
- Add Section opens a modal.
- Section name is required.
- New sections are added as Disabled.

## 10. Analytics and reports

### 10.1 Marketplace Analytics

**Route:** `/admin/analytics`

- Filters: date range, shop, and category using branded selectors.
- KPI cards: Revenue, Orders, Customers, AOV, Conversion, Refund Rate.
- Category Share donut chart.
- Retention & Growth gauges: Repeat Orders, Shop Growth, App Uptime.
- Revenue trend chart.
- Customer metrics: new, returning, active, retention, average order, lifetime value.
- Shop metrics: new shops, active shops, revenue, orders/shop, top sellers, low performers.
- Current filters update visible labels, but the seeded metric/chart values are not recalculated.

### 10.2 Search Analytics

**Route:** `/admin/analytics/search`

- Initializes its query from the `q` URL parameter used by global Admin search.
- Responsive search field filters top-search terms.
- Top searches show count, estimated clicks, estimated conversions, and proportional bars.
- No-result searches show counts and a `Review catalog gap` action.
- Catalog-gap actions navigate to `/admin/products?search=...`; the current Products list does not
  consume that `search` query automatically.

### 10.3 Reports

**Route:** `/admin/reports`

- Filters: date range, status, and export format.
- Searchable/sortable report table covering Sales, Seller Performance, Returns, Orders, Customers,
  Products, Commissions, Withdrawals, and Refunds.
- Per-report export action.
- CSV selection produces a small demo CSV file.
- Excel or PDF selection currently produces a JSON demo payload with a `.json` extension; it is not
  a real Excel or PDF generator.
- Export payload records the selected range/status and identifies itself as a frontend demo.

## 11. Operations pages

### 11.1 Support tickets list

**Route:** `/admin/support`

- Columns: ID, Subject, Requester, Type, Priority, Status, Updated.
- Summary cards: All Tickets, Open, In Progress, High Priority.
- Shared list controls and manage drawer.
- Requester, requester type, priority, and status are controlled choices.
- Subject uses a multiline editor.

### 11.2 Ticket details

**Route:** `/admin/support/:ticketId`

- Conversation thread with separate requester/Admin message styling.
- Send Reply appends a local Admin message and marks the ticket In Progress.
- Internal notes are kept separately from the conversation.
- Assigned Admin branded selector: Unassigned, Rohan Support, Operations Admin, Finance Admin.
- Status controls: Escalate, Resolve, Close Ticket.
- Status changes require confirmation.
- Unknown ticket IDs fall back to the first seeded ticket.

### 11.3 Notification templates

**Route:** `/admin/notifications`

- Columns: Template ID, Template, Channels, Audience, Status.
- Search, status filtering, sorting, selection, pagination, responsive table/cards.
- Edit Template opens a modal for Subject and Body.
- Shows the supported `{{name}}` template-variable example.
- Enable/Disable individual templates.
- Bulk Enable/Disable selected templates.
- Saves update local resource state.
- The header bell links directly here without an intermediate popup.

### 11.4 Risk and Safety

**Route:** `/admin/risk`

- Marketplace safety score and Low Risk/Attention Required state.
- Shield state and active-threat count.
- KPI cards: Open Alerts, High Risk, Critical, Investigating, Blocked.
- Columns: Alert ID, Risk Type, Entity, Risk Level, Status, Detected.
- Search, status filter, sorting, selection, pagination, responsive table/cards.
- Actions: View Alert, Investigate Alert, Dismiss Alert, Block Entity.
- View opens a detail drawer.
- Dismiss and Block require confirmation.
- Changes update local alert state.

## 12. System pages

### 12.1 Admin Users

**Routes:** `/admin/admin-users`, `/admin/admin-users/:adminId`

- Columns: ID, Name, Email, Role, Status, Last Login.
- Summary cards: Total Admins, Active, Inactive, Recently Active.
- Shared list controls, Add New action, manage drawer, status actions, and bulk actions.
- Role and status use controlled selectors.
- Available roles include Super, Operations, Finance, Support, Marketing, and Catalog Admin.
- The parameterized route renders the same page and does not automatically select the Admin ID.

### 12.2 Roles and Permissions

**Routes:** `/admin/roles`, `/admin/roles/:roleId`

- Horizontal role selector on smaller screens and full-width role buttons on desktop.
- Permission groups: Shops, Products, Orders, Payments, Platform.
- Individual checkbox permissions such as view, approve, suspend, edit, cancel, refund, and manage.
- Route parameter selects the matching initial role when present.
- Save Changes produces local confirmation feedback.
- This UI is not backend security; production authorization must still be enforced server-side.

### 12.3 Audit Logs

**Route:** `/admin/audit-logs`

- Columns: ID, Actor, Action, Target, Module, Time.
- Shared search, status-capable filter system, sorting, selection, pagination, mobile cards, and manage
  drawer.
- Module uses a controlled selector in the generated editor.
- Current audit records are mutable local seed data; there is no immutable backend audit trail yet.

### 12.4 Settings

**Route:** `/admin/settings`

- Tabs: General, Marketplace, Payments, Orders, Delivery, Taxes, Commission, Notifications,
  Security, Integrations.
- General: platform name and currency.
- Marketplace: maintenance mode and shop registration fee.
- Payments: automatic seller payouts.
- Orders: return window.
- Delivery: default delivery SLA.
- Taxes: tax-inclusive pricing toggle.
- Commission: default percentage.
- Notifications: operational Admin alerts.
- Security: required two-factor authentication toggle.
- Integrations: integration-mode text.
- Toggle controls use accessible switch semantics.
- Text fields are required; number values must be non-negative; commission cannot exceed 100%.
- Save applies only to local component state and shows a toast.

## 13. Shared UI features

`shared/ui.jsx` provides the reusable visual and interaction system:

- `AdminSelect` — branded controlled selector.
- `Card` — SeroFast surface, border, radius, and shadow.
- `PageHeader` — page title, description, and optional action.
- `StatusBadge` — consistent status colors.
- `Kpi`, `StatGrid`, `StatusCard` — metric and operational summary layouts.
- `DonutChart`, `ProgressCircle` — lightweight frontend visualizations.
- `SearchBar`, `FilterBar` — responsive search/filter controls.
- `Pagination` — range, page-size selector, and navigation.
- `Drawer` — mobile bottom sheet/desktop side drawer.
- `Modal`, `ConfirmDialog` — overlays and confirmed mutations.
- `Toast` — temporary action feedback.
- `Tabs` — responsive tab navigation.
- `LoadingState`, `ErrorState`, `EmptyState` — standard page states.
- `PermissionGate` — conditional rendering helper only; not a security boundary.

## 14. Data, hooks, services, and persistence

### Active data path

```text
shared/adminData.js
        ↓
page state / useResourceList
        ↓
shared or dedicated UI
```

### `useResourceList`

Owns local rows, global record search, status and quick filters, sorting, paging, selected IDs,
create/update/bulk update/remove/reorder operations, and temporary loading/error state.

### Domain hooks and services

Domain folders contain hooks such as `useShops`, `useOrders`, and `useSettings`, plus service files
with list/get/update-shaped boundaries. These mostly remain scaffolding for future Supabase/API work
and are not the active path for the current pages.

### Backend work still required

- Persist all mutations and configuration changes.
- Protect `/admin/*` with authenticated Admin routing.
- Enforce roles and permissions server-side.
- Validate sensitive status transitions on the server.
- Create immutable audit records.
- Add server-side filtering, sorting, and pagination for large datasets.
- Secure bank details, seller documents, and file access.
- Connect actual notification delivery, report generation, courier data, payments, and refunds.
- Replace route-ID fallback behavior with proper not-found handling.
- Replace placeholder tabs and seeded charts with domain-service data.

## 15. Correct ownership for future changes

| Change | Primary file or area |
| --- | --- |
| Sidebar, header, responsive shell | `layout/AdminLayout.jsx` |
| Breadcrumbs | `layout/AdminBreadcrumbs.jsx` |
| Routes | `AdminRoutes.jsx` |
| Sidebar navigation groups | `data.js` / shared navigation data |
| Shared controls and overlays | `shared/ui.jsx` |
| Standard list-page orchestration and editor rules | `shared/resource/ResourcePage.jsx` |
| Desktop table and mobile cards | `shared/resource/ResourceTable.jsx` |
| Search/filter/sort/page/selection state | `shared/resource/useResourceList.js` |
| Current seed records | `shared/adminData.js` |
| Unique domain workflows | Corresponding domain `pages/` file |
| Future backend calls | Domain `hooks/` and `services/` |

---

This document reflects the Admin implementation at the time it was generated. When features become
backend-connected, update the affected page section and the implementation-status section together.
