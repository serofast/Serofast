# SeroFast Admin Dashboard — Phase 4 Architecture

This package completes the Phase 4 frontend architecture for the SeroFast Admin Dashboard using the existing React 18 + Vite 6 + Tailwind CSS v4 stack.

## Framework preserved

- React 18
- Vite 6
- Tailwind CSS v4 with `@tailwindcss/vite`
- React Router already used by the project
- lucide-react
- No new styling framework
- No component-scoped CSS
- Existing SeroFast design tokens are reused: `brandRed`, `brandRedDark`, `primaryLight`, `lightBackground`, `lightSurface`, `lightBorder`, `promoHighlight`, `textPrimary`, `textSecondary`, `textMuted`, `rounded-bento*`, `shadow-*`, and `font-sansation`.

## Integration

Copy this folder into:

```text
src/components/admin/
```

Then add:

```jsx
import AdminRoutes from './components/admin/AdminRoutes';

<Route path="/admin/*" element={<AdminRoutes />} />
```

## Architecture

Every major business domain has its own page/component/hook/service boundary. The current services use local demo data only; replace their implementations with Supabase/API calls in Phase 5.

The architecture intentionally separates:

```text
Route page
  -> domain components
  -> domain hook
  -> domain service
  -> backend later
```

## Phase 4 scope

The frontend phase includes:
- Admin layout and responsive navigation
- Dashboard and analytics views
- Shops and shop approval
- Customers
- Products and product approval
- Categories
- Orders and order details
- Inventory
- Returns and return details
- Reviews
- Delivery and shipment details
- Transactions, commissions, withdrawals, refunds
- Coupons, campaigns, banners, homepage CMS
- Support, notifications, risk/fraud
- Reports and search analytics
- Admin users
- Roles and permission matrix
- Audit logs
- Settings

## Important

Phase 4 does not claim production backend capabilities. Real authentication, authorization, Supabase persistence, payment providers, delivery partners, notifications, GST/tax rules, and audit persistence belong to later integration phases.
