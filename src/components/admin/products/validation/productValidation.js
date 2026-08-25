const asNumber = (value) => Number(value);

export function validateProduct(values, products = [], currentId = null) {
  const errors = {};
  const retailPrice = asNumber(values.retail_price ?? values.price);
  const basePrice = values.base_price === "" || values.base_price == null
    ? null
    : asNumber(values.base_price);
  const stock = values.stock === "" || values.stock == null ? 1 : asNumber(values.stock);

  if (!values.name?.trim()) errors.name = "Product name is required.";
  if (!values.categoryId) errors.categoryId = "Select a product category.";
  if (!Number.isFinite(retailPrice) || retailPrice <= 0) {
    errors.retail_price = "Retail price (selling price) must be greater than zero.";
  }
  if (basePrice !== null && basePrice > 0 && basePrice < retailPrice) {
    errors.base_price = "Base price (MRP) should be equal to or higher than retail price.";
  }
  if (!Number.isInteger(stock) || stock < 0) errors.stock = "Stock must be a whole number of zero or greater.";

  return errors;
}

export function discountPercentage(basePrice, retailPrice) {
  const base = Number(basePrice);
  const retail = Number(retailPrice);
  if (!base || !retail || retail >= base) return 0;
  return Math.round(((base - retail) / base) * 100);
}

