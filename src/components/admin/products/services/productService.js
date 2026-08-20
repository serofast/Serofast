import { localAdminRepository } from "../../shared/localAdminRepository.js";
import { validateProduct } from "../validation/productValidation.js";

const cleanTags = (tags) => [
  ...new Set((tags ?? []).map((tag) => String(tag).trim().toLowerCase()).filter(Boolean)),
];

const cloneVariants = (variants, productId) =>
  (variants ?? []).map((variant) => ({
    ...variant,
    id: variant.id || localAdminRepository.createId("VAR"),
    productId,
    attributes: Object.fromEntries(
      Object.entries(variant.attributes ?? {}).filter(([, value]) => String(value).trim()),
    ),
    sku: variant.sku.trim().toUpperCase(),
    price: Number(variant.price),
    discountPrice:
      variant.discountPrice === "" || variant.discountPrice == null
        ? null
        : Number(variant.discountPrice),
    stock: Number(variant.stock),
    lowStockThreshold: Number(variant.lowStockThreshold),
  }));

function normalizeProduct(values, current, categories) {
  const id = current?.id ?? localAdminRepository.createId("PRD");
  const category = categories.find((item) => item.id === values.categoryId);
  const variants = cloneVariants(values.variants, id);
  const images = (values.images ?? []).map((image, index) => ({
    ...image,
    id: image.id || localAdminRepository.createId("IMG"),
    position: index,
    isPrimary: values.images.some((item) => item.isPrimary)
      ? Boolean(image.isPrimary)
      : index === 0,
  }));

  return {
    ...current,
    ...values,
    id,
    name: values.name.trim(),
    slug: localAdminRepository.slugify(values.slug || values.name),
    categoryName: category.name,
    sku: values.sku.trim().toUpperCase(),
    price: Number(values.price),
    discountPrice:
      values.discountPrice === "" || values.discountPrice == null
        ? null
        : Number(values.discountPrice),
    stock: variants.length
      ? variants.reduce((sum, variant) => sum + variant.stock, 0)
      : Number(values.stock),
    lowStockThreshold: Number(values.lowStockThreshold),
    tags: cleanTags(values.tags),
    images,
    variants,
    updatedAt: localAdminRepository.nowIso(),
    createdAt: current?.createdAt ?? localAdminRepository.nowIso(),
  };
}

function syncProductInventory(state, product) {
  const retained = state.inventory.filter((record) => record.productId !== product.id);
  const records = product.variants.length
    ? product.variants.map((variant) => ({
        id: `INV-${variant.id}`,
        shopId: product.shopId,
        shopName: product.shopName,
        productId: product.id,
        productName: product.name,
        variantId: variant.id,
        variantLabel: Object.values(variant.attributes).join(" / ") || "Variant",
        sku: variant.sku,
        quantity: variant.stock,
        lowStockThreshold: variant.lowStockThreshold,
        updatedAt: product.updatedAt,
      }))
    : [
        {
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
        },
      ];
  return [...retained, ...records];
}

export function list() {
  return localAdminRepository.getState().products;
}

export function getById(id) {
  return list().find((product) => product.id === id) ?? null;
}

export function save(values, currentId = null) {
  const state = localAdminRepository.getState();
  const errors = validateProduct(values, state.products, currentId);
  if (Object.keys(errors).length) return { data: null, errors };

  const current = currentId
    ? state.products.find((product) => product.id === currentId)
    : null;
  const product = normalizeProduct(values, current, state.categories);
  localAdminRepository.update((existing) => ({
    ...existing,
    products: current
      ? existing.products.map((item) => (item.id === currentId ? product : item))
      : [product, ...existing.products],
    inventory: syncProductInventory(existing, product),
  }));
  return { data: product, errors: {} };
}

export function create(values) {
  return save(values);
}

export function update(id, values) {
  return save(values, id);
}

export function archive(id) {
  updateMany([id], {
    status: "Archived",
    archivedAt: localAdminRepository.nowIso(),
  });
}

export function updateMany(ids, patch) {
  const selected = new Set(ids);
  localAdminRepository.update((state) => ({
    ...state,
    products: state.products.map((product) =>
      selected.has(product.id)
        ? { ...product, ...patch, updatedAt: localAdminRepository.nowIso() }
        : product,
    ),
  }));
}

export function submitForApproval(ids) {
  const selected = new Set(ids);
  const reviewedAt = localAdminRepository.nowIso();
  localAdminRepository.update((state) => {
    const submitted = state.products.filter(
      (product) =>
        selected.has(product.id) &&
        ["Draft", "Rejected"].includes(product.approvalStatus),
    );
    return {
      ...state,
      products: state.products.map((product) =>
        submitted.some((item) => item.id === product.id)
          ? {
              ...product,
              approvalStatus: "Pending Approval",
              status: "Pending Approval",
              rejectionReason: "",
              updatedAt: reviewedAt,
            }
          : product,
      ),
      approvalHistory: [
        ...state.approvalHistory,
        ...submitted.map((product) => ({
          id: localAdminRepository.createId("APH"),
          productId: product.id,
          action: "Submitted",
          previousStatus: product.approvalStatus,
          newStatus: "Pending Approval",
          reason: "",
          reviewedBy: "SeroFast Admin",
          reviewedAt,
        })),
      ],
    };
  });
}

export function review(id, action, reason = "") {
  const state = localAdminRepository.getState();
  const product = state.products.find((item) => item.id === id);
  if (!product) throw new Error("Product not found.");
  if (product.approvalStatus !== "Pending Approval") {
    throw new Error("Only pending products can be reviewed.");
  }
  if (action === "Rejected" && !reason.trim()) {
    throw new Error("A rejection reason is required.");
  }
  const newApproval = action === "Approved" ? "Approved" : "Rejected";
  const reviewedAt = localAdminRepository.nowIso();
  localAdminRepository.update((current) => ({
    ...current,
    products: current.products.map((item) =>
      item.id === id
        ? {
            ...item,
            approvalStatus: newApproval,
            status: action === "Approved" ? "Active" : "Rejected",
            rejectionReason: reason.trim(),
            updatedAt: reviewedAt,
          }
        : item,
    ),
    approvalHistory: [
      ...current.approvalHistory,
      {
        id: localAdminRepository.createId("APH"),
        productId: id,
        action,
        previousStatus: product.approvalStatus,
        newStatus: newApproval,
        reason: reason.trim(),
        reviewedBy: "SeroFast Admin",
        reviewedAt,
      },
    ],
  }));
}

export function approvalHistory(productId) {
  return localAdminRepository
    .getState()
    .approvalHistory.filter((item) => item.productId === productId)
    .sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt));
}

export const productService = {
  list,
  getById,
  save,
  create,
  update,
  archive,
  updateMany,
  submitForApproval,
  review,
  approvalHistory,
};
