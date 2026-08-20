const asNumber = (value) => Number(value);

export function validateProduct(values, products = [], currentId = null) {
  const errors = {};
  const price = asNumber(values.price);
  const discountPrice = values.discountPrice === "" || values.discountPrice == null
    ? null
    : asNumber(values.discountPrice);
  const stock = asNumber(values.stock);
  const threshold = asNumber(values.lowStockThreshold);
  const sku = values.sku?.trim().toLowerCase();

  if (!values.name?.trim()) errors.name = "Product name is required.";
  if (!values.categoryId) errors.categoryId = "Select an existing category.";
  if (!Number.isFinite(price) || price <= 0) errors.price = "Price must be greater than zero.";
  if (discountPrice !== null && (!Number.isFinite(discountPrice) || discountPrice < 0 || discountPrice >= price)) {
    errors.discountPrice = "Discount price must be zero or greater and lower than the regular price.";
  }
  if (!sku) errors.sku = "SKU is required.";
  if (sku && products.some((product) => product.id !== currentId && product.sku?.trim().toLowerCase() === sku)) {
    errors.sku = "This SKU is already used by another product.";
  }
  if (!Number.isInteger(stock) || stock < 0) errors.stock = "Stock must be a whole number of zero or greater.";
  if (!Number.isInteger(threshold) || threshold < 0) errors.lowStockThreshold = "Low-stock threshold must be zero or greater.";

  const variantSkus = new Set();
  for (const variant of values.variants ?? []) {
    const variantSku = variant.sku?.trim().toLowerCase();
    if (!variantSku) {
      errors.variants = "Every variant needs a SKU.";
      break;
    }
    const usedByProduct = products.some((product) =>
      product.id !== currentId &&
      (product.sku?.toLowerCase() === variantSku || product.variants?.some((item) => item.sku?.toLowerCase() === variantSku)),
    );
    if (variantSkus.has(variantSku) || usedByProduct) {
      errors.variants = `Variant SKU ${variant.sku} is already in use.`;
      break;
    }
    if (Number(variant.stock) < 0 || !Number.isInteger(Number(variant.stock))) {
      errors.variants = "Variant stock must be a whole number of zero or greater.";
      break;
    }
    variantSkus.add(variantSku);
  }

  return errors;
}

export function discountPercentage(price, discountPrice) {
  const regular = Number(price);
  const discount = Number(discountPrice);
  if (!regular || !Number.isFinite(discount) || discount >= regular) return 0;
  return Math.round(((regular - discount) / regular) * 100);
}
