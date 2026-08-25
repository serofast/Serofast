const asNumber = (value) => Number(value);

export function validateProduct(values, products = [], currentId = null) {
  const errors = {};
  const price = asNumber(values.price);
  const discountPrice = values.discountPrice === "" || values.discountPrice == null
    ? null
    : asNumber(values.discountPrice);
  const stock = values.stock === "" || values.stock == null ? 1 : asNumber(values.stock);

  if (!values.name?.trim()) errors.name = "Product name is required.";
  if (!values.categoryId) errors.categoryId = "Select a product category.";
  if (!Number.isFinite(price) || price <= 0) errors.price = "Price must be greater than zero.";
  if (discountPrice !== null && (!Number.isFinite(discountPrice) || discountPrice < 0 || discountPrice >= price)) {
    errors.discountPrice = "Discount price must be lower than the regular price.";
  }
  if (!Number.isInteger(stock) || stock < 0) errors.stock = "Stock must be a whole number of zero or greater.";

  return errors;
}

export function discountPercentage(price, discountPrice) {
  const regular = Number(price);
  const discount = Number(discountPrice);
  if (!regular || !Number.isFinite(discount) || discount >= regular) return 0;
  return Math.round(((regular - discount) / regular) * 100);
}
