# SeroFast Admin Layout and Component Structure

This document describes the Admin frontend as it currently exists in `src/components/admin`.
It explains the layout, routes, shared components, page-specific components, data-table strategy,
state management, service scaffolding, and the correct way to extend the Admin area.

> Current implementation note: the Admin is a Phase 4 frontend implementation. Most records come
> from `shared/adminData.js` and mutations are stored in React state for the current browser session.
> The domain service files are prepared for a later API/Supabase integration but are not currently
> the main data source used by the pages.

## 1. High-level application flow

```text
src/App.jsx
  └─ /admin/*
      └─ AdminRoutes
          └─ AdminLayout
              ├─ Desktop/mobile sidebar
              ├─ Admin header
              ├─ Breadcrumbs
              ├─ Current routed page
              └─ Mobile bottom navigation
```

The important entry points are:

| File | Responsibility |
| --- | --- |
| `src/App.jsx` | Mounts the Admin feature at `/admin/*`. |
| `admin/index.js` | Exports `AdminRoutes` to the rest of the application. |
| `AdminRoutes.jsx` | Maps every Admin URL to its page component. |
| `layout/AdminLayout.jsx` | Provides the shared Admin shell around every routed page. |
| `data.js` | Re-exports Admin mock data and supplies the sidebar navigation configuration used by `AdminLayout`. |
| `shared/adminData.js` | Contains the current frontend seed/mock records and summary data. |
| `manifest.json` | Lists the expected framework, Admin modules, and route inventory. It is documentation metadata, not runtime routing. |

## 2. Admin directory structure

```text
admin/
├─ AdminRoutes.jsx                 # Route definitions
├─ index.js                        # Public Admin export
├─ data.js                         # Navigation plus data re-exports
├─ manifest.json                   # Module/route metadata
├─ README.md                       # Product and feature reference
├─ admin document.md               # This implementation/structure reference
├─ layout/                         # Shared shell and navigation
├─ shared/                         # Reusable UI, data, icons, and resource-list system
├─ dashboard/                      # Dashboard page
├─ shops/                          # Shop list, approval, details, hooks/services
├─ customers/                      # Customer list and details
├─ products/                       # Product list, approval, details, validation
├─ categories/                     # Category hierarchy management
├─ orders/                         # Order list and details
├─ inventory/                      # Inventory list
├─ returns/                        # Return list and details
├─ reviews/                        # Review list
├─ delivery/                       # Shipment list and details
├─ finance/                        # Transactions, commissions, withdrawals, refunds
├─ marketing/                      # Coupons, campaigns, banners, homepage CMS
├─ analytics/                      # Marketplace and search analytics
├─ support/                        # Ticket list and details
├─ notifications/                  # Notification templates
├─ risk/                           # Risk and fraud dashboard
├─ reports/                        # Report generation UI
└─ system/                         # Admin users, RBAC, audit logs, settings
```

Most domain folders follow this intended structure:

```text
domain/
├─ pages/          # Route-level React components
├─ components/     # Domain-only reusable components (currently mostly empty barrels)
├─ hooks/          # Domain state/data hooks prepared for future integration
├─ services/       # API/Supabase boundary prepared for future integration
└─ validation/     # Domain validation where required
```

## 3. Shared Admin layout

### `layout/AdminLayout.jsx`

`AdminLayout` is reused by every route in `AdminRoutes.jsx`. A page should not create another
sidebar, global header, breadcrumb wrapper, or outer page-width container.

It owns:

- The fixed 272px desktop sidebar.
- The slide-in mobile sidebar and overlay.
- Grouped sidebar links from `data.js`.
- The Admin identity card and Exit Admin action.
- The sticky full-workspace header.
- Global marketplace search, which navigates to `/admin/analytics/search?q=...`.
- Notification and profile dropdowns.
- The full-width responsive `<main>` workspace.
- `AdminBreadcrumbs` above every page.
- `AdminBottomNav` on screens below the desktop breakpoint.

The main workspace deliberately uses `w-full min-w-0` with small responsive edge padding. Tables
may scroll inside their own containers, but the Admin page itself is protected from horizontal
overflow.

### `layout/AdminBreadcrumbs.jsx`

This component reads the current URL with `useLocation`, converts route segments to readable
labels, and renders navigable breadcrumb links. It is automatically included by `AdminLayout`.

### `layout/AdminBottomNav.jsx`

This is the compact mobile navigation for Overview, Shops, Products, Orders, and Settings. It is
separate from the desktop sidebar because it has a different mobile interaction and visual design.

Current maintenance note: the Settings item points to `/admin/system/settings`, while the route in
`AdminRoutes.jsx` is `/admin/settings`. These should be kept consistent when that navigation is
next edited.

### Icons and navigation sources

- `layout/Icon.jsx`, `shared/legacyIcon.jsx`, and `shared/AdminIcons.jsx` provide icon compatibility.
- Most page-specific icons are imported directly from `lucide-react`.
- `data.js` supplies the navigation array currently consumed by `AdminLayout`.
- `shared/adminNavigation.js` contains a second Lucide-based navigation definition, but it is not
  currently imported by `AdminLayout`. Avoid maintaining two sources indefinitely; `data.js` is the
  active source today.

## 4. Routing structure

All routes below render inside the same `AdminLayout`.

| Area | List/dashboard route | Additional routes |
| --- | --- | --- |
| Dashboard | `/admin` | — |
| Shops | `/admin/shops` | `/admin/shops/approvals`, `/admin/shops/:shopId` |
| Customers | `/admin/customers` | `/admin/customers/:customerId` |
| Products | `/admin/products` | `/admin/products/approvals`, `/admin/products/:productId`, `/admin/products/:productId/edit` |
| Categories | `/admin/categories` | — |
| Orders | `/admin/orders` | `/admin/orders/:orderId` |
| Inventory | `/admin/inventory` | — |
| Returns | `/admin/returns` | `/admin/returns/:returnId` |
| Reviews | `/admin/reviews` | — |
| Delivery | `/admin/delivery` | `/admin/delivery/:shipmentId` |
| Transactions | `/admin/finance/transactions` | — |
| Commissions | `/admin/finance/commissions` | — |
| Withdrawals | `/admin/finance/withdrawals` | `/admin/finance/withdrawals/:withdrawalId` uses the same page |
| Refunds | `/admin/finance/refunds` | `/admin/finance/refunds/:refundId` uses the same page |
| Coupons | `/admin/marketing/coupons` | `/new`, `/:couponId/edit` |
| Campaigns | `/admin/marketing/campaigns` | `/new`, `/:campaignId/edit` |
| Banners | `/admin/marketing/banners` | `/new`, `/:bannerId/edit` |
| Homepage CMS | `/admin/marketing/homepage` | — |
| Analytics | `/admin/analytics` | `/admin/analytics/search` |
| Support | `/admin/support` | `/admin/support/:ticketId` |
| Notifications | `/admin/notifications` | — |
| Risk | `/admin/risk` | — |
| Reports | `/admin/reports` | — |
| Admin users | `/admin/admin-users` | `/admin/admin-users/:adminId` uses the same page |
| Roles | `/admin/roles` | `/admin/roles/:roleId` uses the same page |
| Audit logs | `/admin/audit-logs` | — |
| Settings | `/admin/settings` | — |

Unknown Admin routes are redirected to `/admin`.

## 5. Shared UI component library

The main reusable UI library is `shared/ui.jsx`.

| Component | Purpose | Typical reuse |
| --- | --- | --- |
| `Card` | Standard SeroFast bordered surface and shadow. | Dashboards, details, forms, analytics, custom modules. |
| `Header` / `PageHeader` | Page title, supporting text, and optional primary action. | Most route pages and shared `ResourcePage`. |
| `Badge` / `StatusBadge` | Maps a record status to a consistent pill style. | Tables, mobile record cards, detail pages, workflows. |
| `ProgressCircle` | Circular progress/percentage visualization. | Dashboard and analytics-style metrics. |
| `DonutChart` | Donut visualization with labels/legend data. | Dashboard and analytics pages. |
| `Kpi` | Equal-height KPI card with label, value, change, and tone. | Dashboard, analytics, finance summaries. |
| `StatGrid` | Responsive equal-height grid for KPI/status cards. | Dashboard, analytics, operational summaries. |
| `StatusCard` | Actionable or read-only operational count card. | `ResourcePage` summaries and dashboard attention cards. |
| `SearchBar` | Standard search input. | Filter bars and search analytics. |
| `FilterBar` | Search, status select, and clear-filter action. | Shared `ResourcePage`. |
| `Pagination` | Record range, page size, First/Previous/Next/Last controls. | Shared resource tables. |
| `Drawer` | Responsive mobile bottom sheet / desktop side drawer. | Shared create/edit flow and page-specific management flows. |
| `Modal` | Accessible overlay dialog. | Category editing, notifications, and other custom workflows. |
| `ConfirmDialog` | Confirmation modal with success/danger action tone. | Status changes, deletion, approvals, rejection. |
| `Toast` | Temporary success/status notification. | Shared and dedicated mutation workflows. |
| `Tabs` | Horizontally scrollable responsive tabs. | Settings and detail views. |
| `EmptyState` | No-record or no-results presentation. | Tables and custom lists. |
| `LoadingState` | Shared loading indicator. | Resource loading boundary. |
| `ErrorState` | Shared error state with optional retry. | Resource error boundary. |
| `Actions` | Compact view/approve/reject icon controls. | Available to approval/custom workflows. |
| `PermissionGate` | Conditionally renders content based on a supplied permission result. | Prepared for RBAC-aware UI. Backend authorization is still required. |

These shared components preserve the SeroFast palette, rounded surfaces, typography, button sizing,
and responsive behavior. Pages should use them before creating a visually duplicate local component.

## 6. Data-table architecture: reusable or separate?

### Short answer

The main Admin data table is reusable. It is **not copied into every list page**.

The reusable flow is:

```text
Domain list page
  └─ ResourcePage
      ├─ useResourceList
      ├─ shared summary/status cards
      ├─ FilterBar
      ├─ ResourceTable
      │   ├─ desktop table
      │   └─ mobile record cards
      ├─ Pagination
      ├─ create/edit Drawer + ResourceForm
      ├─ bulk action controls
      ├─ ConfirmDialog
      └─ Toast
```

### `shared/resource/ResourceTable.jsx`

This is the primary reusable table for data-heavy list pages. It receives records and column
configuration through props rather than knowing about Shops, Orders, Products, or another domain.

It provides:

- Configurable columns with optional custom `render`, `minWidth`, `cellClassName`, `mobile`, and
  `mobileLabel` values.
- Automatic column width defaults based on keys such as date, amount, status, name, or description.
- Sortable headers.
- Select-all and per-row checkboxes.
- Sticky selection and action columns on desktop.
- View/edit, status-toggle, and optional delete actions.
- Horizontal scrolling inside the table container where required.
- A dedicated mobile card/list representation below the `md` breakpoint.
- Truncated long text with browser title tooltips.
- Shared pagination and empty state.

### `shared/resource/ResourcePage.jsx`

This is the reusable page controller around `ResourceTable`. Each simple domain page passes:

- `title`
- `description`
- `seed`
- `columns`
- optional `createLabel`
- optional `searchPlaceholder`
- optional `summaryCards`

It handles shared behavior:

- Search and status filtering.
- URL-based `?status=` filters used by Dashboard links.
- Operational summary cards and quick filters.
- Sorting and pagination.
- Row selection and bulk Activate, Suspend, and Remove actions.
- Create/edit drawer state.
- Generic form creation from editable column definitions.
- Required-field validation for the generated form.
- Confirmation dialogs and success toasts.
- Loading, error, retry, and empty states.
- Local creation, update, status change, and deletion for the current session.

### `shared/resource/useResourceList.js`

This hook owns reusable list state and operations:

- `rows`, `filteredRows`, and `visibleRows`
- search and status state
- quick-filter predicates
- sorting key and direction
- page and page size
- selected record IDs
- create, update, bulk update, and remove functions
- clear filters, retry, loading, and error state

### Pages currently using the reusable resource table

| Page | Domain column configuration |
| --- | --- |
| `shops/pages/ShopsPage.jsx` | Shop, owner, category, products, orders, revenue, rating, status, joined. |
| `customers/pages/CustomersPage.jsx` | Name, email, orders, spending, average order, returns, status, joined. |
| `products/pages/ProductsPage.jsx` | Product, shop, category, price, stock, status, rating, created. |
| `orders/pages/OrdersPage.jsx` | ID, customer, shop, items, amount, payment, status, date. |
| `inventory/pages/InventoryPage.jsx` | ID, product, shop, stock, threshold, velocity, status. |
| `returns/pages/ReturnsPage.jsx` | ID, order, customer, shop, product, reason, refund, status. |
| `reviews/pages/ReviewsPage.jsx` | ID, rating, review, customer, product, shop, status. |
| `delivery/pages/ShipmentsPage.jsx` | ID, order, shop, customer, courier, tracking, status. |
| `finance/pages/TransactionsPage.jsx` | ID, type, order, user, amount, fee, net, status. |
| `finance/pages/RefundsPage.jsx` | ID, order, customer, shop, amount, reason, status. |
| `marketing/coupons/pages/CouponsPage.jsx` | Coupon ID/code/type/value/minimum order/usage/status/expiry. |
| `marketing/campaigns/pages/CampaignsPage.jsx` | Campaign ID/name/audience/budget/reach/status/start/end. |
| `marketing/banners/pages/BannersPage.jsx` | Banner ID/title/placement/status/priority/start/end. |
| `support/pages/SupportTicketsPage.jsx` | ID, subject, requester, type, priority, status, updated. |
| `system/admins/pages/AdminUsersPage.jsx` | ID, name, email, role, status, last login. |
| `system/audit/pages/AuditLogsPage.jsx` | ID, actor, action, target, module, time. |
| `categories/pages/CategoriesPage.jsx` | Category, parent, subcategories, shops, products, and status, with domain reorder/edit actions. |
| `finance/pages/WithdrawalsPage.jsx` | Request, shop, owner, amount, method, status, and requested date, with finance review actions. |
| `notifications/pages/NotificationsPage.jsx` | Template ID/name, channels, audience, and enabled status. |
| `risk/pages/RiskDashboardPage.jsx` | Alert ID/type, entity, risk level, status, and detection time. |
| `reports/pages/ReportsPage.jsx` | Report ID/name, description, and selected export format. |

For these pages, the page file defines only domain-specific columns and seed data. The actual table,
mobile cards, filter controls, bulk actions, drawer, form, confirmation, and pagination are shared.

### Specialized tables and interfaces

Categories, Withdrawals, Notifications, Risk, and Reports now use `ResourceTable` for their record
presentation while supplying domain-specific `rowActions`. Their surrounding forms, dashboards,
drawers, approval dialogs, and business rules remain inside their domain pages.

The remaining raw table inside a dedicated page is:

| Page | Why it is separate |
| --- | --- |
| `shops/pages/ShopDetailsPage.jsx` | Domain-specific detail tabs and related-record presentation, including a local detail table. |

Approval queues currently use specialized card/review interfaces rather than raw HTML tables. A
normal record table should use `ResourceTable`; a non-table workflow may remain specialized. Do not
copy `ResourceTable` merely to change columns or actions—pass configuration and `rowActions`.

## 7. Page implementation categories

### Shared resource-list pages

These are thin domain wrappers around `ResourcePage`: Shops, Customers, Products, Orders,
Inventory, Returns, Reviews, Delivery, Transactions, Refunds, Coupons, Campaigns, Banners,
Support, Admin Users, and Audit Logs.

### Dedicated dashboards and operational pages

- `dashboard/pages/DashboardPage.jsx`: KPI links, attention cards, charts, order overview, recent
  orders, and Admin activity.
- `analytics/pages/AnalyticsPage.jsx`: filters, KPIs, charts, customer metrics, and shop metrics.
- `analytics/pages/SearchAnalyticsPage.jsx`: query-driven search analytics and product navigation.
- `risk/pages/RiskDashboardPage.jsx`: safety score and risk investigation/blocking workflow.
- `reports/pages/ReportsPage.jsx`: shared report table and frontend report-generation feedback.
- `finance/pages/CommissionsPage.jsx`: commission configuration and summary UI.
- `finance/pages/WithdrawalsPage.jsx`: seller payout review workflow.

### Dedicated configuration/CMS pages

- `categories/pages/CategoriesPage.jsx`: taxonomy and ordering.
- `marketing/homepage/pages/HomepageCMSPage.jsx`: homepage section creation and ordering.
- `notifications/pages/NotificationsPage.jsx`: notification templates and edit modal.
- `system/roles/pages/RolesPage.jsx`: role selection and permission editing.
- `system/settings/pages/SettingsPage.jsx`: tabbed marketplace settings.

### Dedicated form pages

- `marketing/coupons/pages/CouponFormPage.jsx`
- `marketing/campaigns/pages/CampaignFormPage.jsx`
- `marketing/banners/pages/BannerFormPage.jsx`

These use route parameters to distinguish create and edit modes. They use shared `Card`,
`PageHeader`, and `Toast`, but their fields and validation remain domain-specific.

### Dedicated detail pages

- `shops/pages/ShopDetailsPage.jsx`
- `customers/pages/CustomerDetailsPage.jsx`
- `products/pages/ProductDetailsPage.jsx`
- `orders/pages/OrderDetailsPage.jsx`
- `returns/pages/ReturnDetailsPage.jsx`
- `delivery/pages/ShipmentDetailsPage.jsx`
- `support/pages/TicketDetailsPage.jsx`

Detail pages are separate because they combine related records, timelines, tabs, notes, moderation,
or status workflows that cannot be represented by a generic generated form.

## 8. Data and state management

### Current active data source

`shared/adminData.js` is the active source for dashboard statistics and most domain seed records.
`data.js` re-exports this data and adds the active sidebar navigation configuration.

Current changes made through Admin controls usually update component or `useResourceList` state.
They do not persist after a full refresh unless a page explicitly connects to another source.

### Domain hooks

Files such as `shops/hooks/useShops.js`, `orders/hooks/useOrders.js`, and
`system/settings/hooks/useSettings.js` currently expose minimal loading state. The current pages do
not import these domain hooks. They are structural placeholders for the backend phase.

### Domain services

Files such as `shopService.js`, `orderService.js`, and `financeService.js` expose a consistent
frontend service boundary:

```js
list(params)
getById(id)
update(id, payload)
```

These currently return placeholder responses and are not the active source used by the pages.
When Supabase/API work begins, pages or domain hooks should call these services instead of importing
the Supabase client directly throughout the UI.

### Domain component barrels

Most `components/index.js` and `pages/index.js` files are currently empty. They reserve the intended
folder structure but do not export active components. The root `admin/index.js` is active and exports
`AdminRoutes`.

### Validation

- `products/validation/productValidation.js` contains product-specific validation.
- `shops/validation/shopValidation.js` contains shop-application validation.
- Generic `ResourcePage` forms perform basic required-field validation based on column definitions.
- Complex forms keep additional validation inside their domain page until it is valuable to extract.

## 9. Responsive behavior

The layout and table system use these broad strategies:

- Desktop: fixed sidebar plus full-width Admin workspace.
- Tablet: smaller page padding; data tables scroll within their card when required.
- Mobile: sidebar becomes a drawer, bottom navigation appears, filters stack, drawers become bottom
  sheets, and shared resource tables become record cards.
- The page workspace uses `min-w-0` and guards against page-level horizontal overflow.
- Internal component padding remains separate from outer page padding.

When adding a custom table, place horizontal overflow on the table wrapper, not the entire page.
When possible, also provide a mobile record-card representation like `ResourceTable`.

## 10. How to add a normal data-list page

Use the shared resource system when the feature needs ordinary search/filter/sort/pagination and
CRUD-like actions.

```jsx
import ResourcePage from "../../shared/resource/ResourcePage";
import { records as seed } from "../../shared/adminData";

const columns = [
  { key: "id", label: "ID", minWidth: 125 },
  { key: "name", label: "Name", mobileLabel: "Record" },
  { key: "status", label: "Status" },
];

export default function ExamplePage() {
  return (
    <ResourcePage
      title="Examples"
      description="Manage example records."
      seed={seed}
      columns={columns}
      createLabel="Add Example"
    />
  );
}
```

Then register the route in `AdminRoutes.jsx` and add navigation in the active `data.js` navigation
array if the page needs a sidebar entry.

Do not create another generic table, filter bar, pagination component, drawer form, confirmation
dialog, or mobile list for this pattern.

## 11. When a separate page implementation is appropriate

Create a dedicated page-level implementation when the feature requires one or more of these:

- Hierarchical or reorderable records.
- A multi-step approval/rejection workflow.
- Domain-specific evidence or document review.
- Financial confirmation and rejection-reason requirements.
- Timelines, conversations, notes, or related-entity panels.
- A form whose fields or validation cannot be safely generated from table columns.
- A dashboard/chart composition instead of a record list.

Even on a dedicated page, continue reusing `Card`, `PageHeader`, `StatusBadge`, `Modal`, `Drawer`,
`ConfirmDialog`, `Toast`, `Tabs`, and other shared primitives where appropriate.

## 12. Design-system ownership

Admin pages use the existing SeroFast Tailwind tokens and visual rules, including:

- `brandRed` and `brandRedDark`
- `lightBackground`, `lightSurface`, and `lightBorder`
- `promoHighlight`
- text color tokens and the Sansation font
- rounded cards, pills, and SeroFast shadow styles

Do not hard-code a new visual system inside one page. If a repeated visual behavior changes, update
the shared component. If the behavior is unique to one business workflow, keep it inside that domain.

## 13. Practical ownership guide

| Change required | Correct location |
| --- | --- |
| Sidebar/header/workspace width | `layout/AdminLayout.jsx` |
| Breadcrumb behavior | `layout/AdminBreadcrumbs.jsx` |
| Mobile primary navigation | `layout/AdminBottomNav.jsx` |
| Route creation or mapping | `AdminRoutes.jsx` |
| Sidebar navigation item | Active navigation array in `data.js` |
| Shared card, badge, modal, drawer, tabs, KPI | `shared/ui.jsx` |
| Standard list behavior | `shared/resource/ResourcePage.jsx` |
| Standard desktop table/mobile list rendering | `shared/resource/ResourceTable.jsx` |
| Search/filter/sort/page/selection state | `shared/resource/useResourceList.js` |
| Temporary frontend records | `shared/adminData.js` |
| Domain API call | Domain `services/*Service.js` during backend integration |
| Domain data orchestration | Domain `hooks/use*.js` during backend integration |
| Domain-only validation | Domain `validation/` or dedicated form page |
| Unique approval/detail/CMS workflow | Corresponding domain page/component |

## 14. Backend integration work remaining

The current frontend architecture is ready for, but does not itself complete:

- Supabase/API persistence for create, update, delete, and bulk actions.
- Server-side pagination, search, sorting, and filtering.
- Authentication and route protection for `/admin/*`.
- Backend-enforced RBAC; `PermissionGate` alone is not security.
- Secure approval, suspension, refund, withdrawal, and fraud actions.
- Immutable audit-log creation.
- Realtime updates and notification delivery.
- File/document storage and signed access.
- Production loading/error mapping in the domain hooks.

The intended backend path is:

```text
Page
  └─ domain hook
      └─ domain service
          └─ Supabase/API
```

Keep Supabase queries out of presentational table/card components. `ResourceTable` should continue
to receive data and callbacks through props rather than owning backend access.

## 15. Summary

- The Admin shell, navigation, header, breadcrumbs, and mobile navigation are shared.
- The primary data table is reusable through `ResourcePage` + `ResourceTable` + `useResourceList`.
- Twenty-one Admin record-list surfaces currently use the shared `ResourceTable` system, either
  through `ResourcePage` or directly when the surrounding workflow is domain-specific.
- Complex approvals, financial reviews, hierarchy management, CMS, forms, dashboards, and details
  use dedicated pages while still reusing shared UI primitives.
- Domain hooks, services, and component barrels mostly represent the planned backend architecture;
  they are not yet the active data path.
- `shared/adminData.js` and local React state currently power most Admin behavior.
- Future changes should be made at the narrowest correct shared or domain boundary, avoiding copied
  tables and duplicated layout wrappers.
