# Cart Card - Behavior & Functionality Specification

> **Purpose:** Complete behavioral specification for implementing the cart card functionality in any web application. Copy this document to an AI agent to get an identical cart implementation.

---

## Table of Contents
1. [Data Model](#1-data-model)
2. [Cart State Management](#2-cart-state-management)
3. [Cart Sheet Container (Draggable Bottom Sheet)](#3-cart-sheet-container-draggable-bottom-sheet)
4. [Cart Item Tile](#4-cart-item-tile)
5. [Coupon System](#5-coupon-system)
6. [Bill Details Breakdown](#6-bill-details-breakdown)
7. [Checkout Bar (Bottom Sticky)](#7-checkout-bar-bottom-sticky)
8. [Empty State](#8-empty-state)
9. [Checkout View (In-Sheet)](#9-checkout-view-in-sheet)
10. [Delivery Address Card](#10-delivery-address-card)
11. [Payment Method Card](#11-payment-method-card)
12. [Place Order Bar](#12-place-order-bar)
13. [Backend Sync Behavior](#13-backend-sync-behavior)
14. [Price Calculation Logic](#14-price-calculation-logic)

---

## 1. Data Model

### ProductData
```typescript
interface ProductData {
  id: string;
  title: string;
  price: string;           // e.g. "₹999" (current/selling price)
  originalPrice: string;   // e.g. "₹1,999" (original/mrp price)
  rating: number;
  reviewCount: number;
  description: string;
  images: string[];        // Array of image URLs
  sizes: string[];         // e.g. ["S", "M", "L", "XL"]
  specs: Record<string, string>; // e.g. { "Material": "Cotton", "Fit": "Regular" }
}
```

### CartItem
```typescript
interface CartItem {
  product: ProductData;
  quantity: number;
  size: string;           // Selected size (e.g. "M")
  inWishlist: boolean;    // Whether user toggled wishlist for this item
}
```

---

## 2. Cart State Management

The cart maintains a central state object:

```typescript
interface CartState {
  items: CartItem[];    // All items in cart
  isOpen: boolean;      // Whether cart sheet is visible
}
```

### Required Actions

| Action | Behavior |
|--------|----------|
| `addItem(product, quantity?, size?, userId?)` | If product already exists in cart → increment its quantity by the given amount. Otherwise → add new CartItem. Optionally sync to backend. |
| `removeItem(productId, userId?)` | Remove the item with matching `product.id` from the items array. Optionally delete from backend. |
| `updateQuantity(productId, newQuantity, userId?)` | Set the item's quantity to `newQuantity`. Clamp between 1–99. Optionally sync to backend. |
| `toggleWishlist(productId)` | Toggle the `inWishlist` boolean on the matching item. |
| `clear(userId?)` | Set items array to empty. Optionally clear all from backend. |
| `openCart()` | Set `isOpen = true`. |
| `closeCart()` | Set `isOpen = false`. |
| `toggleCart()` | Flip `isOpen`. |
| `loadRemoteCart(userId)` | Fetch cart items from backend and replace local state if remote is non-empty. |

---

## 3. Cart Sheet Container (Draggable Bottom Sheet)

The cart is a **draggable bottom sheet** that overlays the current page.

### Behavior:
- **Opens in "peek mode"** — only the drag handle + header row ("My Cart (N)") is visible initially
- The sheet starts at ~71px height (just header)
- Maximum expansion: 92% of viewport height
- **Full-surface drag** — user can drag from anywhere on the sheet (not just the handle)
- **Snap points:** Two positions only — peek height and full height (no intermediate resting)
- **Fast upward fling** (velocity < -400) → snaps to full height
- **Fast downward fling** (velocity > 400) → snaps to peek height, then calls `onClose()`
- **Slow release** → snaps to nearest stop (midpoint logic)

### Header Row Layout:
```
┌─────────────────────────────────────┐
│          [Drag Handle Pill]         │  ← 36×4px rounded pill
├─────────────────────────────────────┤
│ 🛒  My Cart (N)              ✕     │  ← Cart icon + count + close button
├─────────────────────────────────────┤
│          [Divider line]            │
└─────────────────────────────────────┘
```

- Cart icon (brand red color) + title showing item count: `"My Cart (3)"`
- If cart is empty: shows `"My Cart"` (no count)
- Close button (✕) on the right → calls `onClose()`

### Visual:
- White background
- Rounded top corners (24px radius)
- Subtle shadow on top: `boxShadow: 0 -4px 20px rgba(0,0,0,0.26)`

---

## 4. Cart Item Tile

Each item in the cart is rendered as a tile with this layout:

```
┌──────────────────────────────────────────────┐
│ ┌────────┐  Product Title            ♡/♥    │
│ │        │  Material / Store Name           │
│ │ IMAGE  │  ₹999  ₹1,999 (strikethrough)   │
│ │ 78×96  │                                  │
│ └────────┘  [−]  2  [+]          [🗑 Delete]│
└──────────────────────────────────────────────┘
```

### Structure:
- **Container:** White background, 12px border-radius, subtle border (#EDEEF1), light box-shadow
- **Padding:** 14px all sides
- **Row layout:** Image (left) + Details (right)

### Image:
- 78×96px, rounded corners (9px)
- `object-fit: cover`
- Error fallback: gray placeholder with broken image icon

### Details Column (112px fixed height):

**Row 1:** Product title (14px, bold, max 1 line, ellipsis) + Wishlist heart icon (top right)
- Heart: filled if `inWishlist` is true, outline otherwise
- Heart color: brand red (#E53935 or similar)

**Row 2:** Subtitle text (11.5px, secondary color) — shows `specs['Material']` or fallback "Store Name"

**Row 3:** Price row
- Current price: 16.5px, extra bold, primary color
- Original price: 11.5px, secondary color, strikethrough decoration

**Row 4 (bottom):** Quantity controls + Delete button
- **Quantity stepper:** `[−] quantity [+]` 
  - Each button: 30×30px, gray background (#F3F4F6), 1px border (#E5E7EB), 8px border-radius
  - Quantity text: 14px, bold, centered between buttons with 14px horizontal padding
  - Min quantity: 1, Max quantity: 99
  - Clicking minus at quantity 1 → stays at 1 (clamped)
- **Delete button:** 36×36px circle, bottom-right of card
  - Soft red background (#FFF1F2), 1.5px red border
  - Delete/trash icon (red, 20px)
  - On tap → removes item from cart

---

## 5. Coupon System

Located below the list of cart items.

### Layout:
```
┌─────────────────────────────────────────┐
│ 🎫  Apply Coupon                   >   │  ← Always visible
├─────────────────────────────────────────┤
│ ┌─────────────────────────┐ ┌────────┐ │  ← Expanded state
│ │  Enter coupon code      │ │ Apply  │ │
│ └─────────────────────────┘ └────────┘ │
└─────────────────────────────────────────┘
```

### Behavior:
- **Collapsed:** Shows "Apply Coupon" with coupon icon and chevron-right
- **Tap to expand:** Shows text input field + "Apply" button
- **Apply button:** Brand red background, white text
- **On apply:** Collapses the coupon section, shows "Coupon applied!" text, shows snackbar: "Coupon applied! Extra 10% off at checkout."
- **Styling:** Light pink background (#FFF7F7), pink border (#F3E5E5), 12px border-radius

---

## 6. Bill Details Breakdown

Display area for price breakdown, always visible when cart has items.

### Layout:
```
┌─────────────────────────────────────┐
│ Item Total              ₹1,998     │
│ Discount              - ₹1,000  🟢 │  ← Green color
│ Delivery                   Free 🟢 │  ← Green if free
├─────────────────────────────────────┤
│ Total                  ₹1,047  🔴  │  ← Bold, brand red
└─────────────────────────────────────┘
```

### Behavior:
- White container, 12px border-radius, light border
- Each row: label (left, regular weight) + value (right, semibold)
- Discount row: value in green (#16A34A) with minus prefix
- Delivery row: Shows "Free" in green if total >= threshold, otherwise shows fee in primary color
- Divider line between delivery and total
- **Total row:** Bold label + bold red value (brand red color)

---

## 7. Checkout Bar (Bottom Sticky)

A sticky bar at the bottom of the cart sheet, only visible when there's enough space.

### Layout:
```
┌─────────────────────────────────────────┐
│ Total                                     │
│ ₹1,047              [🔒 Proceed to Checkout] │
└─────────────────────────────────────────┘
```

### Behavior:
- Shows total price (18px, extra bold)
- "Proceed to Checkout" button: brand red, white text, 14px rounded corners
- Clicking → closes cart sheet and navigates to checkout page
- Only visible when sheet height > 80px (calculated dynamically)

---

## 8. Empty State

Shown when cart has zero items.

### Layout:
```
┌─────────────────────────────────────────┐
│                                         │
│           🛒 (pink circle)             │
│                                         │
│     No products in your cart            │
│     Browse products and add them...     │
│                                         │
│       [ Outline Button: Explore Products ]│
│                                         │
└─────────────────────────────────────────┘
```

### Behavior:
- Centered vertically in available space
- Pink circle (80×80px, #FFEEF0) with cart icon (38px, brand red)
- Title: 16px, bold
- Subtitle: 13px, muted color, centered text
- "Explore Products" button: outlined, brand red border + text, rounded pill shape (20px radius)
- Clicking button → navigates to product catalog/categories page

---

## 9. Checkout View (In-Sheet)

When user clicks "Proceed to Checkout", the cart content **swaps in-place** to show the checkout form — no new page opens.

### Layout:
```
┌─────────────────────────────────────────┐
│ ← Checkout                      ✕      │  ← Back arrow replaces cart icon
├─────────────────────────────────────────┤
│  [Deliver To Card]                       │
│  [Payment Method Card]                   │
│  [Bill Details]                          │
├─────────────────────────────────────────┤
│ Payable Amount                           │
│ ₹1,047              [✓ Place Order]      │
└─────────────────────────────────────────┘
```

### Behavior:
- Header changes: Back arrow (←) + "Checkout" title
- Back arrow → returns to cart view (items list)
- Same drag handle and close button behavior
- Scrollable content with same snap behavior

---

## 10. Delivery Address Card

### Layout:
```
┌─────────────────────────────────────────┐
│ 📍  Deliver To              [Change]    │
│                                         │
│ Full Name                               │
│ Address line 1, City, State - PIN       │
│ Phone number                            │
└─────────────────────────────────────────┘
```

### Behavior:
- "Change" link (brand red) opens an address edit modal
- If no address saved: shows placeholder "No saved address yet. Add a location..."
- If loading: shows "Loading your saved address..."
- Address data comes from backend `user_addresses` table
- Edit address form saves to the same `user_addresses` table used by account settings

---

## 11. Payment Method Card

### Layout:
```
┌─────────────────────────────────────────┐
│ 💳  Payment Method                      │
│                                         │
│ [🟢] UPI                                │
│     sanjay@okaxis                       │
│     Instant payments · No extra charges │
│                           (radio: ○/●)  │
│                                         │
│ [🔵] Visa                               │
│     •••• •••• •••• 4242                 │
│     Expires 08/28 · Sanjay Kumar        │
│     ✏️                        (radio: ○/●)│
│                                         │
│ [🟡] Cash on Delivery                   │
│     Pay when your order arrives         │
│     Available on most orders            │
│                           (radio: ○/●)  │
│─────────────────────────────────────────│
│ + Add Payment Method                    │
└─────────────────────────────────────────┘
```

### Behavior:
- Radio button selection (single select)
- Each method shows: icon (colored background) + label + subtitle + detail + radio
- Card/UPI methods have an edit (✏️) icon → opens edit sheet pre-filled
- COD is a fixed system option (not editable)
- "Add Payment Method" → opens a bottom sheet with tabs: **Card** / **UPI**

### Add/Edit Payment Method Sheet:
- **Card tab:** Card Number, MM/YY, CVV, Name on Card
- **UPI tab:** UPI ID (e.g. name@bank)
- Save button → adds/updates the method in the list
- Card number is masked when displayed: `•••• •••• •••• 4242`
- Card brand auto-detected: starts with "4" → Visa, starts with "5[1-5]" → Mastercard

---

## 12. Place Order Bar

### Layout:
```
┌─────────────────────────────────────────┐
│ Payable Amount                           │
│ ₹1,047              [✓ Place Order]      │
└─────────────────────────────────────────┘
```

### Behavior:
- Shows "Payable Amount" label + grand total
- "Place Order" button: brand red, white text
- **Validation:** If no delivery address is saved → shows snackbar: "Please add a delivery address before placing your order" (does NOT place order)
- **On success:** Clears the cart, returns to cart view, shows snackbar: "Order placed successfully!"
- Only visible when sheet height > 80px

---

## 13. Backend Sync Behavior

Cart operations sync to a backend database (Supabase-style):

| Operation | Backend Action |
|-----------|---------------|
| Add item / Change quantity | `upsert` into `cart_items` table with `user_id`, `product_id`, `quantity`, `selected_size`, `unit_price`, `updated_at` |
| Remove item | `delete` from `cart_items` where `user_id` AND `product_id` match |
| Clear cart | `delete` from `cart_items` where `user_id` matches |
| Load cart on login | `select * from cart_items where user_id = X` → join with `products` table |

### Schema (cart_items table):
```
- user_id: string (foreign key to users)
- product_id: string (foreign key to products)
- quantity: integer
- selected_size: string
- unit_price: number
- updated_at: timestamp
```

**Note:** All backend operations are fire-and-forget — the local state updates immediately, and backend sync happens asynchronously. Errors are logged but don't block the UI.

---

## 14. Price Calculation Logic

```typescript
function parsePrice(price: string): number {
  // Remove all non-numeric characters except "."
  return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
}

function itemsTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => 
    sum + parsePrice(item.product.price) * item.quantity, 0
  );
}

function discount(items: CartItem[]): number {
  return items.reduce((sum, item) => 
    sum + (parsePrice(item.product.originalPrice) - parsePrice(item.product.price)) * item.quantity, 0
  );
}

function deliveryCharge(items: CartItem[]): number {
  const total = itemsTotal(items);
  if (items.length === 0 || total >= 499) return 0;  // Free delivery over ₹499
  return 49;  // ₹49 delivery fee
}

function grandTotal(items: CartItem[]): number {
  return itemsTotal(items) - discount(items) + deliveryCharge(items);
}
```

### Free Delivery Threshold: ₹499

---

## Quick Reference: Colors

| Element | Color |
|---------|-------|
| Brand Red (primary) | `#E53935` or similar red |
| Green (discount/free) | `#16A34A` |
| Text Primary | Dark gray/black |
| Text Secondary | Medium gray |
| Text Muted | Light gray |
| Background | White |
| Border | `#EDEEF1` or `#E8EAED` |
| Light Gray BG | `#F3F4F6` |
| Delete button bg | `#FFF1F2` |
| Coupon bg | `#FFF7F7` |

---

## Summary of User Interactions

1. **Open cart** → Sheet appears in peek mode (header only)
2. **Drag up** → Sheet expands to show items
3. **Add item from product page** → Cart opens automatically with new item
4. **Change quantity** → Use +/− buttons, state updates immediately
5. **Remove item** → Tap trash icon, item disappears
6. **Toggle wishlist** → Heart icon toggles, item stays in cart
7. **Apply coupon** → Expand section, enter code, tap Apply
8. **Proceed to checkout** → Sheet swaps to checkout view (no page navigation)
9. **Select delivery address** → Shows saved address or "Add location" prompt
10. **Select payment method** → Radio buttons, can add/edit methods
11. **Place order** → Validates address, clears cart, shows success
12. **Close cart** → Drag down or tap ✕

---

*Generated with Codebuff 🤖*
