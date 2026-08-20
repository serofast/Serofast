import { localAdminRepository } from "../../shared/localAdminRepository.js";

export const INVENTORY_TYPES = ["Stock In", "Stock Out", "Adjustment", "Sale", "Return", "Damage", "Other"];

export function stockStatus(record) {
  if (Number(record.quantity) === 0) return "Out of Stock";
  if (Number(record.quantity) <= Number(record.lowStockThreshold)) return "Low Stock";
  return "In Stock";
}

export function list() {
  return localAdminRepository.getState().inventory.map((record) => ({ ...record, status: stockStatus(record) }));
}

export function movements() {
  return [...localAdminRepository.getState().inventoryMovements].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function syncProductStock(state, record, newQuantity) {
  return state.products.map((product) => {
    if (product.id !== record.productId) return product;
    if (record.variantId) {
      const variants = product.variants.map((variant) => variant.id === record.variantId ? { ...variant, stock: newQuantity } : variant);
      return { ...product, variants, stock: variants.reduce((sum, variant) => sum + Number(variant.stock), 0), updatedAt: localAdminRepository.nowIso() };
    }
    return { ...product, stock: newQuantity, updatedAt: localAdminRepository.nowIso() };
  });
}

export function applyOperation({ inventoryId, type, quantity, actualCount, reason, reference = "", performedBy = "SeroFast Admin" }) {
  const state = localAdminRepository.getState();
  const record = state.inventory.find((item) => item.id === inventoryId);
  if (!record) throw new Error("Inventory record not found.");
  if (!reason?.trim()) throw new Error("A reason is required for every stock operation.");
  const previousQuantity = Number(record.quantity);
  const entered = Number(quantity);
  let newQuantity;
  let movementQuantity;

  if (type === "Adjustment") {
    newQuantity = Number(actualCount);
    if (!Number.isInteger(newQuantity) || newQuantity < 0) throw new Error("Actual count must be a whole number of zero or greater.");
    movementQuantity = newQuantity - previousQuantity;
  } else {
    if (!Number.isInteger(entered) || entered <= 0) throw new Error("Quantity must be a positive whole number.");
    const addsStock = type === "Stock In" || type === "Return";
    newQuantity = previousQuantity + (addsStock ? entered : -entered);
    movementQuantity = addsStock ? entered : -entered;
  }
  if (newQuantity < 0) throw new Error(`Only ${previousQuantity} units are available. Stock cannot become negative.`);

  const createdAt = localAdminRepository.nowIso();
  const movement = { id: localAdminRepository.createId("MOV"), inventoryId, productId: record.productId, productName: record.productName, variantId: record.variantId, variantLabel: record.variantLabel, shopId: record.shopId, shopName: record.shopName, sku: record.sku, type, quantity: movementQuantity, previousQuantity, newQuantity, reason: reason.trim(), reference: reference.trim(), performedBy, createdAt };
  localAdminRepository.update((current) => ({ ...current, inventory: current.inventory.map((item) => item.id === inventoryId ? { ...item, quantity: newQuantity, updatedAt: createdAt } : item), products: syncProductStock(current, record, newQuantity), inventoryMovements: [...current.inventoryMovements, movement] }));
  return movement;
}

export function bulkUpdate(ids, { mode, value, reason }) {
  if (!reason?.trim()) throw new Error("A reason is required for a bulk stock update.");
  const state = localAdminRepository.getState();
  const selected = state.inventory.filter((item) => ids.includes(item.id));
  if (!selected.length) throw new Error("Select at least one inventory record.");
  const amount = Number(value);
  if (!Number.isInteger(amount) || (mode === "add" && amount <= 0) || (mode === "set" && amount < 0)) throw new Error("Enter a valid whole-number stock value.");
  const changes = selected.map((record) => ({ record, newQuantity: mode === "add" ? Number(record.quantity) + amount : amount }));
  const createdAt = localAdminRepository.nowIso();
  localAdminRepository.update((current) => {
    let products = current.products;
    const movementsToAdd = changes.map(({ record, newQuantity }) => {
      products = syncProductStock({ ...current, products }, record, newQuantity);
      return { id: localAdminRepository.createId("MOV"), inventoryId: record.id, productId: record.productId, productName: record.productName, variantId: record.variantId, variantLabel: record.variantLabel, shopId: record.shopId, shopName: record.shopName, sku: record.sku, type: "Adjustment", quantity: newQuantity - Number(record.quantity), previousQuantity: Number(record.quantity), newQuantity, reason: reason.trim(), reference: "Bulk stock update", performedBy: "SeroFast Admin", createdAt };
    });
    const quantities = new Map(changes.map(({ record, newQuantity }) => [record.id, newQuantity]));
    return { ...current, products, inventory: current.inventory.map((item) => quantities.has(item.id) ? { ...item, quantity: quantities.get(item.id), updatedAt: createdAt } : item), inventoryMovements: [...current.inventoryMovements, ...movementsToAdd] };
  });
  return changes;
}

export const inventoryService = { list, movements, applyOperation, bulkUpdate, stockStatus };
