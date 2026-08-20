# SeroFast Admin — Phase 0 Repository Audit

**Audit date:** 20 August 2026  
**Branch:** `main`  
**Scope:** Static audit of the repository, Admin UI, routing, shared components, local data, Supabase schema/client code, authentication flow, backend folder, build, and package security.  
**Implementation status:** Audit only. No application feature was rewritten in this phase.

> [!IMPORTANT]
> The current Admin experience is a polished Phase 4 frontend prototype, not a production Admin system. Its records, metrics, mutations, permissions, reports, and audit history are local/demo behavior. The two release blockers are the absence of real authentication/authorization and unsafe database policies in the checked-in schema.

## Executive summary

The repository already contains a broad and visually consistent Admin application. It has 40 Admin page components, 49 registered Admin route patterns (including the index and fallback), shared responsive table/card rendering, reusable overlays and form controls, and domain-oriented folders. This is a strong UI foundation and should be evolved instead of replaced.

However, the Admin application is not connected to Supabase or another API. Its 23 service files are placeholders, its 23 domain hooks only hold a local `loading` boolean, and its pages use seed data from `shared/adminData.js`. Saves and actions generally update component memory and disappear on refresh. Dashboard figures, charts, permissions, notifications, exports, audit logs, and operational workflows are simulations.

The public `/admin/*` route has no authentication guard. Shop-owner login does not verify the supplied password with Supabase Auth; it searches `shop_owners` by email and creates a local fallback identity when a record or connection is unavailable. The checked-in SQL also grants unrestricted anonymous mutation access to several operational tables. These issues must be corrected before connecting Admin write operations to real records.

The baseline production build succeeds. `npm audit --omit=dev` reports zero known production dependency vulnerabilities. Vite warns that the single generated JavaScript chunk is approximately 835 KB before gzip, so route-level code splitting is recommended during hardening.

## Audit boundaries and evidence

This audit examined:

- root application routing and entry points;
- all file paths under `src/components/admin`;
- Admin route registrations, pages, shared controls, tables, local data, hooks, and services;
- authentication forms and `src/lib/supabase.js`;
- the `backend` folder and its Supabase client/services;
- `supabase_schema.sql`, including tables, keys, RLS activation, and policies;
- package scripts/dependencies, Vite/Tailwind configuration, Git state, and production build output;
- existing Admin documentation, including `overall features.md`.

The audit did **not** connect to or alter a live Supabase project. Therefore, the checked-in SQL is evidence of repository intent, not proof that the deployed database has exactly the same schema or policies. Before any migration, the live schema, policies, functions, triggers, storage rules, and Auth configuration must be exported and compared.

## 1. Existing architecture

### Application architecture

- React 18 single-page application built with Vite 6.
- JavaScript and JSX; no TypeScript layer.
- React Router provides landing, authentication, shop creation, shop-owner, and Admin routes.
- Tailwind CSS 4 is configured through the Vite plugin and CSS-first theme tokens.
- Supabase JS is instantiated directly in the browser for the current shop-owner/shop flow.
- A separate `backend` directory contains service modules, but no server entry point, HTTP framework, route handlers, deployment configuration, or package runtime was found.

### Admin architecture

The Admin area is organized by domain:

```text
src/components/admin/
├── AdminRoutes.jsx
├── layout/
├── shared/
│   ├── adminData.js
│   ├── adminNavigation.js
│   ├── ui.jsx
│   └── resource/
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
├── analytics/
├── reports/
├── support/
├── notifications/
├── risk/
└── system/
```

Each domain generally has `pages`, `hooks`, `services`, and `components` folders. The separation is currently structural rather than functional: the pages use local seed data directly, while service and hook layers are mostly unused scaffolding.

### Reusable Admin foundation

The reusable foundation is one of the healthiest parts of the codebase:

- `AdminLayout.jsx` provides the desktop sidebar, mobile header/drawer, global header search, notifications navigation, profile button, and content shell.
- `adminNavigation.js` is the primary sidebar navigation definition.
- `ui.jsx` provides cards, KPI components, search/filter controls, the branded `AdminSelect`, dialogs, drawers, toasts, tabs, charts, loaders, and a presentational `PermissionGate`.
- `ResourcePage.jsx` provides common list-page behavior: metrics, search, status filters, sorting, selection, local create/edit/status/delete flows, confirmation UI, and feedback.
- `ResourceTable.jsx` renders a desktop data table and responsive mobile record cards from the same column configuration.
- `useResourceList.js` centralizes local filtering, sorting, pagination, selection, mutation, and simulated refresh state.

This shared system should remain the presentation/controller layer while real query and command adapters are added underneath it.

## 2. Existing features

The complete page-by-page UI inventory is maintained in [`overall features.md`](./overall%20features.md). At a system level, the Admin currently presents:

- dashboard KPIs, charts, activity, and operational summaries;
- shops, approval review, and shop details;
- customers and customer details;
- products, product approval, product details/edit route, and categories;
- orders and order details;
- inventory, returns/details, reviews, and delivery/details;
- transactions, commissions, withdrawals/details, and refunds;
- coupons, campaigns, banners, and homepage CMS;
- analytics, search analytics, and reports;
- support tickets/details, notification templates, and risk alerts;
- Admin users, roles and permissions, audit logs, and settings.

### What currently works in the browser

- All registered Admin routes render and unknown Admin URLs redirect to the Admin dashboard.
- Navigation, responsive layout, mobile cards, desktop tables, search, filters, sorting, pagination, row selection, drawers, modals, confirmations, and toasts operate as frontend interactions.
- Branded custom selects are available for controlled options instead of basic browser dropdowns.
- Dedicated detail/form pages exist for several domains.
- The production build completes successfully.

### What is only local or simulated

- Admin records come from `shared/adminData.js` or page-local arrays.
- Resource edits, creates, deletes, status changes, approval decisions, settings, and role changes are stored only in React state.
- Refresh uses a fixed 250 ms timer rather than refetching a data source.
- Dashboard and analytics values are static seed calculations rather than verified database aggregates.
- Admin notification counts/templates are local and do not represent a delivery system.
- Audit logs are seeded data and are not append-only records of real actions.
- Reports are demo exports; CSV is generated from local rows while PDF/Excel paths are not official document/workbook generation.
- UI permissions do not protect routes, API operations, or database access.

## 3. Existing design system

The visual language is consistent enough to preserve:

- primary brand red and darker-red interactive states;
- warm off-white application background and white surfaces;
- slate text hierarchy and light gray borders;
- rounded cards, pills, inputs, tables, drawers, and modal surfaces;
- soft red-tinted shadows for major controls and data containers;
- Lucide icons through a legacy name-to-icon adapter;
- responsive desktop tables and mobile cards;
- custom max-width breakpoints and mobile-specific layout behavior;
- reusable focus, disabled, status badge, and feedback treatments.

### Design-system issues

- Tokens live partly in CSS theme declarations and partly as repeated literal Tailwind color/shadow values.
- `legacyIcon.jsx`, `AdminIcons.jsx`, and `layout/Icon.jsx` form overlapping adapters; only the legacy adapter is actively used in core Admin UI.
- `AdminBottomNav.jsx` remains in the repository after the mobile Admin bottom navigation was removed from the active layout.
- `src/components/admin/data.js` re-exports the shared seed while also containing a second navigation definition; `src/data/adminData.js` contains an older unrelated Admin dataset with encoding artifacts.
- Accessibility primitives exist, but there is no automated accessibility test coverage.

These are cleanup opportunities, not reasons to redesign the interface.

## 4. Existing backend and database integration

### Browser Supabase client

`src/lib/supabase.js` reads:

- `VITE_SUPABASE_URL`;
- `VITE_SUPABASE_ANON_KEY`;
- optional `VITE_SUPABASE_STORAGE_BUCKET`.

It currently implements direct browser operations for shop-owner records, shops, warehouse products, shop-product links, and storage uploads. It does not provide Admin data access.

When Supabase is unavailable or an operation fails, several functions silently create or return local fallback data. This makes the UI continue working, but it also converts configuration, validation, policy, network, and database failures into apparent success. Production workflows must return explicit typed errors and must not fabricate authenticated identities or persisted records.

### Backend folder

The backend files describe server-side Supabase usage, but they are not an executable backend in the current repository. Additional problems include:

- the service-role configuration falls back to the anonymous key, weakening the stated boundary;
- `shopService.js` references `window` in server-targeted code;
- the shop payload contains columns not declared in the checked-in `shops` table;
- fallback mode returns successful fake records;
- no authentication endpoint, authorization middleware, validation layer, audit middleware, or deployment target exists;
- the frontend does not call these services through a server API.

The project must choose and document a real trusted command boundary: a deployed API, Supabase Edge Functions, and/or tightly controlled database RPCs. Merely keeping service-role code in a `backend` folder is not a security boundary.

### Checked-in schema

`supabase_schema.sql` declares 15 tables:

- categories;
- shop owners and shops;
- warehouse products, shop products, and products;
- profiles;
- orders and order items;
- cart items, wishlists, reviews, and user addresses;
- banners and coupons.

The schema does not currently model most Admin domains, including Admin identities, roles, granular permissions, role assignments, audit logs, payments/transactions, commissions, withdrawals, refunds, return cases, shipment events, support tickets, campaigns, notification templates/deliveries, risk cases, inventory movements, report jobs, or platform settings.

There are also contract inconsistencies to resolve before integration:

- `orders` has both `order_status` and `status`;
- `orders` has both structured `shipping_address` and free-text `address`;
- identifiers are a mixture of UUID and text types;
- the backend shop payload includes business, banking, delivery, and policy columns absent from the checked-in `shops` definition;
- Admin seed shapes do not map directly to the SQL tables.

## 5. Existing authentication and authorization

### Current authentication behavior

- `/admin/*` renders `AdminRoutes` directly and is publicly accessible.
- `/shop-owner/*` is also not guarded by a trusted authenticated session.
- Registration validates a password in the UI but inserts only profile fields into `shop_owners`; it does not create a Supabase Auth user.
- Login validates password length but never verifies the password. It selects a shop owner by email.
- If login cannot find a record or reach Supabase, it creates a fallback owner and treats the flow as successful.
- Current owner and active shop objects are trusted from `localStorage`.
- Logout clears local storage but does not invalidate a server session.

### Current authorization behavior

- No Admin user identity or server-issued session exists.
- No protected-route component enforces authentication.
- No route-level or command-level role check exists.
- The role editor and `PermissionGate` are frontend presentation only.
- No server-side permission check or immutable audit entry is attached to sensitive actions.

### RLS and policy risks in the checked-in SQL

RLS is enabled for only 8 of the 15 declared tables. It is not explicitly enabled in this script for categories, cart items, wishlists, reviews, user addresses, banners, or coupons.

More critically, the script grants `FOR ALL USING (true) WITH CHECK (true)` policies on `shop_owners`, `shops`, and `orders`. With a browser anonymous client, these policies permit untrusted clients to mutate operational data without ownership or Admin checks. Public read access for catalog tables may be intentional, but public write access to identities, shops, and orders is a release blocker.

## 6. Missing functionality

### Production foundations

- Supabase Auth registration, login, logout, session restoration, and password recovery.
- Admin membership linked to `auth.users`.
- protected Admin and shop-owner routes.
- server-enforced RBAC with least-privilege permissions.
- ownership-based RLS for shop owners and customers.
- trusted server/RPC boundary for sensitive Admin and financial commands.
- append-only audit logging containing actor, action, entity, before/after data, request metadata, and timestamp.
- schema migrations and a repeatable deployment process.
- centralized validation, error mapping, loading, empty, retry, and permission-denied states.

### Domain functionality

- real queries, server pagination, filtering, sorting, and aggregates for every Admin module;
- lifecycle rules and allowed transitions for shops, products, orders, returns, refunds, withdrawals, shipments, tickets, and risk cases;
- inventory ledger/reservation rules instead of editing a derived stock number;
- payment-provider reconciliation, idempotency, and immutable financial records;
- notification provider integration, delivery status, retry, and template versioning;
- real PDF/XLSX reporting and server-generated datasets;
- upload validation and private/signed access where assets are sensitive;
- searchable audit/history views backed by real events;
- conflict handling, optimistic concurrency, and unsaved-change protection.

### Engineering functionality

- lint, unit-test, integration-test, end-to-end-test, and accessibility-test commands;
- test data/factories and a separate non-production environment;
- error boundary and monitoring/telemetry;
- route-level lazy loading and chunking;
- CI checks for build, tests, lint, schema migrations, and secret scanning;
- documented environment validation and deployment procedures.

## 7. Technical problems and risk register

| Severity | Finding | Impact | Required response |
|---|---|---|---|
| Critical | Public Admin routes | Anyone who can load the application can open the Admin UI | Add trusted authentication and protected routes before real Admin data |
| Critical | Password is never authenticated | Any email can be treated as a shop owner; failures create fake sessions | Replace with Supabase Auth and remove identity fallbacks |
| Critical | Unrestricted `FOR ALL` RLS policies | Anonymous clients may mutate identities, shops, and orders | Replace with ownership/RBAC policies and test them |
| Critical | No trusted authorization boundary | Hiding buttons cannot protect sensitive mutations | Enforce permissions in server/RPC and database layers |
| High | Admin is entirely seed/local state | UI can imply success while no data is persisted | Integrate read-only queries first, then controlled commands |
| High | No real audit log | Sensitive actions are not attributable or reviewable | Add append-only server-generated audit events |
| High | Financial domains have no real model | Refund/withdrawal/commission actions cannot be made safely | Design ledgers, state machines, approvals, and idempotency |
| High | Silent fallback-on-error behavior | Production faults are hidden and fake data is trusted | Fail explicitly with actionable user feedback |
| High | Backend folder is not an executable server | Service-role claims can create a false sense of security | Implement and deploy a real boundary or remove the claim |
| High | Generic status toggle is domain-agnostic | Non-product records may be forced between `Active` and `Suspended` | Replace with per-domain state machines |
| High | Generic edit can expose derived/system fields | Counts, timestamps, IDs, and audit records can appear editable | Define per-domain editable schemas and read-only fields |
| Medium | Schema and UI contracts diverge | Queries/mutations will fail or corrupt semantics | Establish canonical domain models and migrations |
| Medium | No tests or lint scripts | Regressions and policy mistakes are difficult to catch | Add layered automated checks |
| Medium | Single large JS chunk | Slower initial Admin/public load | Lazy-load route groups and split vendor/domain chunks |
| Medium | Duplicate/dead Admin artifacts | Future edits can target the wrong source | Confirm imports, then remove or consolidate safely |
| Medium | Root/docs contain stale Phase 4 statements | Developers may misunderstand current behavior | Update documentation alongside each implementation phase |
| Low | External fonts and demo image URLs | Availability/privacy/performance depend on third parties | Self-host or formalize approved asset sources |

## 8. Recommended implementation phases

### Phase 1 — Security and identity foundation

1. Export and inspect the live Supabase schema, policies, functions, triggers, storage policies, and Auth settings.
2. Define Admin and shop-owner identity relationships to `auth.users`.
3. Implement Supabase Auth session management and protected routes.
4. Introduce server-enforced roles and granular permissions.
5. replace permissive RLS with tested least-privilege policies.
6. Remove fake authenticated-user fallbacks and surface configuration/auth errors.
7. Add an append-only audit event path for privileged commands.

No real Admin mutation should ship before this phase passes negative authorization tests.

### Phase 2 — Data contracts and access layer

1. Choose the trusted command architecture: API, Edge Functions, RPCs, or a documented combination.
2. Create additive versioned migrations; do not overwrite the live database blindly with `supabase_schema.sql`.
3. Define canonical entities, statuses, transitions, money handling, identifiers, and timestamps.
4. Replace placeholder services with query/command adapters returning consistent data/error results.
5. Turn domain hooks into real loading/error/query state and add cache invalidation.
6. Add centralized validation, error presentation, and observability.

### Phase 3 — Read-only Admin integration

Connect real, paginated, permission-filtered reads in this order:

1. shops and customers;
2. products, categories, and inventory;
3. orders, returns, reviews, and delivery;
4. dashboard and analytics aggregates.

Keep the current UI and shared table system, but make all counts and details come from the same authoritative queries.

### Phase 4 — Catalog and marketplace commands

- shop/product approval with reasons and audit events;
- controlled shop/product/category updates;
- inventory movements and reconciliation;
- per-domain forms, validation, allowed states, and concurrency checks.

### Phase 5 — Commerce and operations workflows

- order state machine and fulfillment events;
- returns and shipment workflows;
- customer/support cases, internal notes, and assignment;
- review moderation and risk case management.

### Phase 6 — Finance

- payment transactions and reconciliation;
- commission rules and immutable calculations;
- withdrawal approval/execution;
- refund authorization and provider integration;
- idempotency, dual control for high-risk actions, and financial audit trails.

### Phase 7 — Marketing and communication

- coupons, campaigns, banners, and homepage publishing;
- notification templates, versioning, provider delivery, retry, and opt-out rules;
- scheduled activation and safe preview/rollback.

### Phase 8 — Staff administration

- Admin invitations and lifecycle;
- role/permission management with protection against self-lockout and privilege escalation;
- settings separated by scope and sensitivity;
- real, searchable, read-only audit history.

### Phase 9 — Reporting and hardening

- verified server-side report datasets and genuine CSV/PDF/XLSX outputs;
- unit, integration, RLS, end-to-end, and accessibility tests;
- error monitoring, performance metrics, CI, backups, recovery, and runbooks;
- lazy routes, bundle splitting, query optimization, and responsive/a11y polish.

## 9. Files and areas to modify

The following are expected modification targets, in controlled phases rather than one large rewrite.

### Security and routing

- `src/App.jsx`
- new authentication/session provider and protected-route components
- `src/components/auth/**`
- `src/lib/supabase.js`, preferably split into focused client/auth/domain modules
- `src/components/shop-owner/**` where local-storage identity is trusted
- `src/components/admin/AdminRoutes.jsx`
- `src/components/admin/layout/AdminLayout.jsx` for authenticated identity/permissions, not visual replacement

### Admin data layer

- all `src/components/admin/*/services/*.js` placeholder services
- all `src/components/admin/*/hooks/*.js` placeholder hooks
- `src/components/admin/shared/resource/ResourcePage.jsx`
- `src/components/admin/shared/resource/useResourceList.js`
- individual Admin pages as each domain gains real contracts
- `src/components/admin/shared/adminData.js`, retained only as explicit demo/test fixtures or removed after migration

### Database and trusted backend

- new versioned migration files in a dedicated migrations directory
- a real backend/Edge Function/RPC implementation and its deployment configuration
- backend validation, authorization, audit, and error middleware
- storage policies and upload validation
- environment example and runtime validation files

### Quality and operations

- `package.json` scripts and the corresponding lint/test configurations
- Vite route/chunk configuration where necessary
- CI configuration
- root and Admin documentation after behavior becomes real

### Cleanup candidates after import verification

- `src/components/admin/layout/AdminBottomNav.jsx`
- `src/components/admin/layout/Icon.jsx`
- `src/components/admin/shared/AdminIcons.jsx`
- duplicate navigation/data in `src/components/admin/data.js`
- obsolete `src/data/adminData.js`

These candidates should not be deleted until repository-wide imports and intended consumers are confirmed in the cleanup phase.

## 10. Files and areas to leave untouched initially

To reduce regression risk during the security and data-foundation phases, leave these areas unchanged unless a verified dependency requires a small adjustment:

- landing-page presentation and content components;
- create-shop visual flow and shared public design primitives;
- the established Admin visual language;
- `ResourceTable.jsx` desktop/mobile rendering contract;
- `AdminSelect` and the shared overlay primitives;
- public/shop-owner page styling unrelated to authentication;
- `dist/` and `node_modules/` as generated/vendor output;
- the checked-in base schema as historical reference—use additive migrations after comparing the live database;
- unrelated user assets and content.

## Acceptance gates before calling the Admin production-ready

- Unauthenticated users cannot enter Admin or shop-owner protected routes.
- A valid password/session is required; local storage cannot establish identity.
- Every privileged read and write is denied by default and allowed only by tested permission/ownership rules.
- Anonymous users cannot mutate operational or identity tables.
- All Admin pages use real authoritative data and expose honest loading, empty, error, retry, and permission states.
- All state transitions are domain-specific, validated, audited, and concurrency-safe.
- Financial commands are server-side, idempotent, reconciled, and auditable.
- Reports contain verified data and use their declared file formats.
- Responsive behavior and keyboard/screen-reader flows are covered by tests.
- Build, lint, tests, RLS tests, migrations, and secret checks pass in CI.
- Monitoring, backups, rollback, and operational runbooks exist.

## Phase 0 verification result

| Check | Result |
|---|---|
| Git branch | `main` |
| Working tree before audit | Clean |
| Production build | Passed |
| Production dependency audit | Passed, 0 known vulnerabilities reported |
| Build warning | One JavaScript chunk approximately 835 KB before gzip |
| Admin network/database calls | None found |
| Admin services/hooks | Placeholder scaffolding |
| Admin authentication | Missing |
| Shop-owner password authentication | Missing |
| Server-enforced RBAC | Missing |
| Safe checked-in RLS posture | Failed; critical permissive policies found |
| Live database verification | Not performed; required before migration |

Phase 0 is complete as a repository audit. Phase 1 must begin with live-environment verification and the security/identity foundation; feature expansion or real Admin mutations before that point would increase production risk.
