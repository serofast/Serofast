const asNumber = (value) => Number(value);

export function validateProduct(values, products = [], currentId = null) {
  const errors = {};
  const storePrice = asNumber(values.store_price ?? values.price);
  const cutPrice =
    values.cut_price === "" || values.cut_price == null
      ? values["Price(will be cutted)"] === "" || values["Price(will be cutted)"] == null
        ? null
        : asNumber(values["Price(will be cutted)"])
      : asNumber(values.cut_price);
  const stock = values.stock === "" || values.stock == null ? 1 : asNumber(values.stock);

  if (!values.name?.trim()) errors.name = "Product name is required.";
  if (!values.categoryId) errors.categoryId = "Select a product category.";
  if (!Number.isFinite(storePrice) || storePrice <= 0) {
    errors.store_price = "Store price (the price user will buy) must be greater than zero.";
  }
  if (cutPrice !== null && cutPrice > 0 && cutPrice < storePrice) {
    errors.cut_price = "Cut price (slashed price) must be equal to or higher than store price.";
  }
  if (!Number.isInteger(stock) || stock < 0) errors.stock = "Stock must be a whole number of zero or greater.";

  return errors;
}

export function discountPercentage(cutPrice, storePrice) {
  const cut = Number(cutPrice);
  const store = Number(storePrice);
  if (!cut || !store || store >= cut) return 0;
  return Math.round(((cut - store) / cut) * 100);
}
