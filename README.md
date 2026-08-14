# SeroFast Landing Page

A clean, responsive e-commerce marketplace landing page for **SeroFast** — shop from your favorite local shops. Built with **React 18 + Vite 6** and styled with **Tailwind CSS v4** using a shared SeroFast design system.

## Tech stack

| Area       | Choice                                            |
| ---------- | ------------------------------------------------- |
| Framework  | React 18 (`react`, `react-dom`)                   |
| Build tool | Vite 6 (`@vitejs/plugin-react`)                   |
| Language   | JavaScript (JSX)                                  |
| Icons      | `lucide-react`                                    |
| Styling    | Tailwind CSS v4 (`@tailwindcss/vite`)             |
| Router     | None — single landing page with anchor navigation |

## Getting started

Requires Node.js 20+ (Vite 6 / Tailwind v4).

```bash
npm install     # install dependencies
npm run dev     # start the dev server (default http://localhost:5173)
```

Production build and preview:

```bash
npm run build     # build to dist/ (validates the app compiles)
npm run preview   # serve the production build locally
```

## Project structure

```text
serofast-landing-recreated/
├── index.html                 # Vite entry HTML (root mount point)
├── package.json
├── package-lock.json
├── vite.config.js             # Vite config (React + Tailwind plugins)
└── src/
    ├── main.jsx               # React entry — mounts <App /> into #root
    ├── App.jsx                # Landing page composition (all sections)
    ├── index.css              # Tailwind entry: theme tokens, variants, base styles
    ├── data/
    │   └── landing.js         # Editable content: categories, shops, products
    └── components/
        ├── reusable/          # Landing page UI building blocks
        │   ├── Header.jsx             # Sticky header + category bar
        │   ├── HeroBanner.jsx         # First-screen hero (copy + image + service strip)
        │   ├── ServiceStrip.jsx       # Delivery/returns/payment/support strip
        │   ├── SectionHeader.jsx      # Section title + "view all" action
        │   ├── ShopCard.jsx           # Marketplace shop card
        │   ├── ProductCard.jsx        # Product card with wishlist/cart actions
        │   ├── MobileBottomNav.jsx    # Fixed bottom nav (mobile only)
        │   └── index.js               # Barrel export for the components
        └── create-shop/       # "Create Shop" onboarding flow (Tailwind-based)
            ├── CreateShopPage.jsx     # Multi-step wizard controller
            ├── OnboardingHeader.jsx   # Wizard header (varies by step)
            ├── ProgressSteps.jsx      # Step indicator (1–4)
            ├── BenefitCard.jsx        # "Why join" benefit card
            ├── ShopDetailsStep.jsx    # Step 2: shop information form
            ├── ProductSelectionStep.jsx  # Step 3: catalog product picker
            ├── LaunchReviewStep.jsx   # Step 4: review & launch
            ├── data.js                # Benefits, categories, products
            └── index.js               # Barrel export
```

## Page sections

The landing page is composed in `src/App.jsx` and follows this rhythm:

1. **Header** — sticky header with search, account actions, and category bar
2. **Hero** — `HeroBanner`, the main selling point (headline, benefits, CTAs, image, service strip)
3. **Top Rated Shops** — `ShopCard` grid fed from `shops` in `src/data/landing.js`
4. **Popular Products** — `ProductCard` grid fed from `products` in `src/data/landing.js`
5. **Why SeroFast** — value proposition card with service points
6. **Mobile bottom navigation** — fixed 5-item nav on small screens

## Styling system (Tailwind CSS v4)

Tailwind is configured **CSS-first** — there is no `tailwind.config.js`. Everything lives in `src/index.css`:

- `@import "tailwindcss"` — Tailwind entry (v4 requires the `@tailwindcss/vite` plugin, registered in `vite.config.js`).
- `@theme` — the SeroFast design system as Tailwind theme tokens, exposed as utilities (e.g. `bg-brandRed`, `text-textSecondary`, `rounded-bento`, `shadow-float`).
- `@custom-variant max-1100 / max-800 / max-560 / max-380` — desktop-first breakpoints matching the original stylesheet (`@media (max-width: …)`), used like `max-800:hidden`.
- `@layer base` — minimal global resets (scroll-behavior, body font/color/background, link and button resets).

### Design tokens

| Token            | Utility prefix    | Value       | Purpose                      |
| ---------------- | ----------------- | ----------- | ---------------------------- |
| `brandRed`       | `bg/text/border-` | `#D32F2F`   | Primary brand color / CTAs   |
| `brandRedDark`   | `bg-`             | `#B71C1C`   | Hover/dark state             |
| `primaryLight`   | `bg-`             | `#E8494C`   | Light red (e.g. hero dot)    |
| `lightBackground`| `bg-`             | `#FEFEFE`   | Page background              |
| `lightSurface`   | `bg-`             | `#FFFFFF`   | Card/header surfaces         |
| `lightBorder`    | `border-`         | `#F3F4F6`   | Soft borders                 |
| `promoHighlight` | `bg-`             | `#FFF1F1`   | Promo/highlight surfaces     |
| `textPrimary`    | `text-`           | `#000000`   | Primary text                 |
| `textSecondary`  | `text-`           | `#4F4A4A`   | Secondary text               |
| `textMuted`      | `text-`           | `#8B8282`   | Muted text                   |
| `bento` (radius) | `rounded-`        | `24 / 16 / 32px` | Bento-style corner radii (`rounded-bento`, `-sm`, `-lg`) |
| `bento`/`float`/`hover` (shadow) | `shadow-` | —           | Subtle elevation shadows (`shadow-bento`, `shadow-float`, `shadow-hover`) |
| `brand` (gradient) | `bg-gradient-`  | `135deg #D32F2F → #B71C1C` | Primary brand gradient |

The font is **Sansation** (`font-sansation`), loaded from Google Fonts and applied globally to `body`. Google Fonts currently serves weights 400 and 700; heavier requests (500–800) fall back to the nearest available weight.

### Class naming

All component styles are expressed as Tailwind utility classes directly in the JSX — there is no legacy component CSS. Recurring patterns (e.g. the content container) are kept as small shared class strings (see `pageContainer` in `App.jsx`). Where a value is design-specific (13px radius, 111px shop image, etc.), arbitrary values like `rounded-[13px]` or `h-[111px]` are used.

## Editing content

Landing-page content (categories, shops, products) is kept out of the components in one editable file:

```
src/data/landing.js
```

- `categories` — strings shown in the header category bar
- `shops` — objects with `name`, `tagline`, `description`, `rating`, `reviews`, `followers`, `image`, `avatar`
- `products` — objects with `name`, `price`, `image`

Image URLs are remote demo assets (Unsplash / pravatar), so the UI runs without a bundled asset directory. Replace them with SeroFast-owned assets when available.

## Create Shop flow

`src/components/create-shop/` contains a separate Tailwind-based onboarding wizard (`CreateShopPage`) with four steps: Why Join → Shop Details → Product Selection → Launch. It is exported from its barrel (`index.js`) but is not yet routed from the landing page. It shares the same Tailwind pipeline, though it uses its own inline palette (e.g. `#D22125`).

## Conventions

- **Reusable components only** — shared landing UI lives in `src/components/reusable/` and is re-exported from its `index.js` barrel.
- **One styling system** — Tailwind utilities in JSX, design tokens in `@theme`, and nothing else. Don't reintroduce component-scoped plain CSS.
- **Lightweight interactions only** — anchor scrolling, hover states, and visual wishlist/cart actions. No state management or routing.
- **`npm run build` as a sanity check** — run it after structural changes to catch import, JSX, or Tailwind class errors.
