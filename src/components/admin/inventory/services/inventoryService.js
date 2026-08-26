import {
  adjustInventoryStock,
} from "../../../../services/adminSupabaseService";

export const INVENTORY_TYPES = ["Stock In", "Stock Out", "Adjustment", "Sale", "Return", "Damage", "Other"];

export function stockStatus(record) {
  if (Number(record.quantity) === 0) return "Out of Stock";
  if (Number(record.quantity) <= Number(record.lowStockThreshold)) return "Low Stock";
  return "In Stock";
}

export async function applyOperation({
  inventoryId,
  type,
  quantity,
  actualCount,
  reason,
  reference = "",
  performedBy = "Admin",
}) {
  if (!reason?.trim()) throw new Error("A reason is required for every stock operation.");
  
  let change = 0;
  if (type === "Adjustment") {
    // For adjustment, calculate delta or apply actual count
    change = Number(actualCount);
  } else {
    const entered = Number(quantity);
    if (!Number.isInteger(entered) || entered <= 0) {
      throw new Error("Quantity must be a positive whole number.");
    }
    const addsStock = type === "Stock In" || type === "Return";
    change = addsStock ? entered : -entered;
  }

  await adjustInventoryStock(inventoryId, change, reason, type, performedBy);
  return true;
}

export async function bulkUpdate(ids, { mode, value, reason }) {
  if (!reason?.trim()) throw new Error("A reason is required for a bulk stock update.");
  const amount = Number(value);
  if (!Number.isInteger(amount) || (mode === "add" && amount <= 0) || (mode === "set" && amount < 0)) {
    throw new Error("Enter a valid whole-number stock value.");
  }

  for (const id of ids) {
    await adjustInventoryStock(id, amount, reason, "Adjustment", "Admin");
  }
  return true;
}

export const inventoryService = { applyOperation, bulkUpdate, stockStatus };
