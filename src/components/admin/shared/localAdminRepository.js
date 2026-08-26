import {
  categories as categorySeed,
  orders as orderSeed,
  products as productSeed,
} from "./adminData.js";

const STORAGE_KEY = "serofast_admin_phase1_v1";
const listeners = new Set();

const nowIso = () => new Date().toISOString();
const createId = (prefix) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
const numberFrom = (value) =>
  Number(String(value ?? "").replace(/[^0-9.-]/g, "")) || 0;
const slugify = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const imageUrls = [
  "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80",
];

function initialCategories() {
  return categorySeed.map((category, index) => ({
    ...category,
    slug: slugify(category.name),
    position: index,
    createdAt: "2026-08-10T09:00:00.000Z",
    updatedAt: "2026-08-10T09:00:00.000Z",
  }));
}

function initialProducts(categories) {
  return productSeed.map((row, index) => {
    const category = categories.find((item) => item.name === row.category);
    const price = numberFrom(row.price);
    const sku = `SF-${row.category.slice(0, 3).toUpperCase()}-${4011 + index}`;
    const variants = index === 0
      ? [
          { id: "VAR-4011-S-BLK", productId: row.id, attributes: { Size: "S", Color: "Black" }, sku: `${sku}-S-BLK`, price, discountPrice: 899, stock: 8, lowStockThreshold: 3, imageId: `IMG-${row.id}-1`, status: "Active" },
          { id: "VAR-4011-M-WHT", productId: row.id, attributes: { Size: "M", Color: "White" }, sku: `${sku}-M-WHT`, price, discountPrice: 899, stock: 10, lowStockThreshold: 3, imageId: `IMG-${row.id}-1`, status: "Active" },
        ]
      : [];

    return {
      id: row.id,
      name: row.product,
      slug: slugify(row.product),
      description: `${row.product} supplied by ${row.shop}.`,
      shortDescription: `Marketplace listing for ${row.product}.`,
      categoryId: category?.id ?? categories[0]?.id,
      categoryName: row.category,
      shopId: `SHOP-${slugify(row.shop).toUpperCase()}`,
      shopName: row.shop,
      sku,
      price,
      discountPrice: index === 0 ? 899 : null,
      stock: variants.length ? variants.reduce((sum, variant) => sum + variant.stock, 0) : Number(row.stock),
      lowStockThreshold: index === 2 ? 8 : 5,
      status: index === 4 ? "Pending Approval" : "Active",
      featured: index === 0 || index === 4,
      tags: index === 0 ? ["bestseller", "fashion"] : [slugify(row.category)],
      images: [
        { id: `IMG-${row.id}-1`, url: imageUrls[index], alt: row.product, position: 0, isPrimary: true },
      ],
      variants,
      approvalStatus: index === 4 ? "Pending Approval" : "Approved",
      rejectionReason: "",
      rating: Number(row.rating),
      createdAt: new Date(`2026-08-${14 - index}T10:00:00.000Z`).toISOString(),
      updatedAt: new Date(`2026-08-${14 - index}T10:00:00.000Z`).toISOString(),
      archivedAt: null,
    };
  });
}

function initialInventory(products) {
  return products.flatMap((product) => {
    if (product.variants.length) {
      return product.variants.map((variant, index) => ({
        id: `INV-${product.id}-${index + 1}`,
        shopId: product.shopId,
        shopName: product.shopName,
        productId: product.id,
        productName: product.name,
        variantId: variant.id,
        variantLabel: Object.values(variant.attributes).join(" / "),
        sku: variant.sku,
        quantity: variant.stock,
        lowStockThreshold: variant.lowStockThreshold,
        updatedAt: product.updatedAt,
      }));
    }

    return [{
      id: `INV-${product.id}`,
      shopId: product.shopId,
      shopName: product.shopName,
      productId: product.id,
      productName: product.name,
      variantId: null,
      variantLabel: "Standard",
      sku: product.sku,
      quantity: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      updatedAt: product.updatedAt,
    }];
  });
}

const baseOrderStatuses = ["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Out for Delivery", "Delivered"];

function normalizeSeedOrder(row, index) {
  const mappedStatus = row.status === "Processing" ? "Processing" : row.status;
  const changedAt = new Date(`2026-08-${15 - Math.min(index, 1)}T${10 + index}:00:00.000Z`).toISOString();
  const reachedIndex = baseOrderStatuses.indexOf(mappedStatus);
  const statuses = mappedStatus === "Returned"
    ? [...baseOrderStatuses, "Returned"]
    : reachedIndex >= 0
      ? baseOrderStatuses.slice(0, reachedIndex + 1)
      : ["Pending", mappedStatus];
  return {
    id: row.id,
    customerName: row.customer,
    customerEmail: `${row.customer.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    shopId: `SHOP-${slugify(row.shop).toUpperCase()}`,
    shopName: row.shop,
    itemsCount: row.items,
    amount: numberFrom(row.amount),
    paymentStatus: row.payment,
    status: mappedStatus,
    fulfillmentState: mappedStatus,
    createdAt: changedAt,
    updatedAt: changedAt,
    lines: [{ id: `LINE-${index + 1}`, productId: productSeed[index % productSeed.length].id, productName: productSeed[index % productSeed.length].product, sku: `SF-${productSeed[index % productSeed.length].category.slice(0, 3).toUpperCase()}-${4011 + (index % productSeed.length)}`, quantity: row.items, unitPrice: Math.round(numberFrom(row.amount) / row.items) }],
    history: statuses.map((status, historyIndex) => ({
      id: `OH-${index + 1}-${historyIndex + 1}`,
      orderId: row.id,
      fromStatus: historyIndex === 0 ? null : statuses[historyIndex - 1],
      toStatus: status,
      note: historyIndex === 0 ? "Order created" : `Order marked ${status.toLowerCase()}`,
      changedBy: "SeroFast Admin",
      changedAt: new Date(new Date(changedAt).getTime() + historyIndex * 30 * 60 * 1000).toISOString(),
    })),
  };
}

function initialOrders() {
  const seeded = orderSeed.map(normalizeSeedOrder);
  const pendingAt = "2026-08-16T09:30:00.000Z";
  const makeExceptionOrder = (id, customerName, paymentStatus, status, offset) => ({
    id,
    customerName,
    customerEmail: `${customerName.toLowerCase()}@example.com`,
    shopId: "SHOP-URBAN-STYLES",
    shopName: "Urban Styles",
    itemsCount: 1,
    amount: 799 + offset,
    paymentStatus,
    status,
    fulfillmentState: status,
    createdAt: new Date(new Date(pendingAt).getTime() + offset * 1000).toISOString(),
    updatedAt: new Date(new Date(pendingAt).getTime() + offset * 1000).toISOString(),
    lines: [{ id: `LINE-${id}`, productId: "PRD-4011", productName: "Men's Casual Shirt", sku: "SF-FAS-4011", quantity: 1, unitPrice: 799 + offset }],
    history: [{ id: `OH-${id}-1`, orderId: id, fromStatus: null, toStatus: status, note: status === "Payment Failed" ? "Payment authorization failed" : "Order created", changedBy: "SeroFast Checkout", changedAt: new Date(new Date(pendingAt).getTime() + offset * 1000).toISOString() }],
  });
  return [
    ...seeded,
    makeExceptionOrder("#SF10295", "Kavin", "Pending", "Pending", 0),
    makeExceptionOrder("#SF10296", "Divya", "Failed", "Payment Failed", 60),
  ];
}

function buildInitialState() {
  return {
    version: 1,
    categories: initialCategories(),
    products: [],
    inventory: [],
    inventoryMovements: [],
    orders: [],
    approvalHistory: [],
  };
}

function loadState() {
  if (typeof window === "undefined") return buildInitialState();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (parsed?.version === 1 && Array.isArray(parsed.products) && Array.isArray(parsed.orders)) return parsed;
  } catch {
    // Fallback to clean state
  }
  return buildInitialState();
}

let state = loadState();

function persist() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

function emit() {
  persist();
  listeners.forEach((listener) => listener());
}

export function getAdminState() {
  return state;
}

export function subscribeAdminState(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function updateAdminState(updater) {
  const next = updater(state);
  state = { ...next, version: 1 };
  emit();
  return state;
}

export function resetAdminState() {
  state = buildInitialState();
  emit();
}

export const localAdminRepository = {
  getState: getAdminState,
  subscribe: subscribeAdminState,
  update: updateAdminState,
  createId,
  nowIso,
  slugify,
};
