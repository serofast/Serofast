import { localAdminRepository } from "../../shared/localAdminRepository.js";

export const ORDER_STATUSES = ["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned", "Refund Requested", "Refunded", "Payment Failed"];

export const allowedTransitions = {
  Pending: ["Confirmed", "Cancelled", "Payment Failed"],
  Confirmed: ["Processing", "Cancelled"],
  Processing: ["Packed", "Cancelled"],
  Packed: ["Shipped"],
  Shipped: ["Out for Delivery"],
  "Out for Delivery": ["Delivered"],
  Delivered: ["Returned"],
  Returned: ["Refund Requested"],
  "Refund Requested": ["Refunded"],
  Cancelled: [],
  Refunded: [],
  "Payment Failed": [],
};

export function list() { return localAdminRepository.getState().orders; }
export function getById(id) { return list().find((order) => order.id === id) ?? null; }
export function nextStatuses(status) { return allowedTransitions[status] ?? []; }
export function canTransition(fromStatus, toStatus) { return nextStatuses(fromStatus).includes(toStatus); }

export function changeStatus(id, toStatus, { note = "", changedBy = "SeroFast Admin" } = {}) {
  const order = getById(id);
  if (!order) throw new Error("Order not found.");
  if (!canTransition(order.status, toStatus)) throw new Error(`${order.status} cannot move to ${toStatus}.`);
  if (toStatus === "Cancelled" && !note.trim()) throw new Error("A cancellation reason is required.");
  const changedAt = localAdminRepository.nowIso();
  const history = { id: localAdminRepository.createId("OH"), orderId: id, fromStatus: order.status, toStatus, note: note.trim() || `Order marked ${toStatus.toLowerCase()}`, changedBy, changedAt };
  localAdminRepository.update((state) => ({ ...state, orders: state.orders.map((item) => item.id === id ? { ...item, status: toStatus, fulfillmentState: toStatus, updatedAt: changedAt, history: [...item.history, history] } : item) }));
  return history;
}

export function bulkTransition(ids, toStatus) {
  const orders = list().filter((order) => ids.includes(order.id));
  const invalid = orders.filter((order) => !canTransition(order.status, toStatus));
  if (!orders.length) throw new Error("Select at least one order.");
  if (invalid.length) throw new Error(`${invalid.map((order) => order.id).join(", ")} cannot move to ${toStatus}.`);
  orders.forEach((order) => changeStatus(order.id, toStatus, { note: `Bulk operation: marked ${toStatus.toLowerCase()}` }));
}

export function exportOrders(orders) {
  const columns = ["Order ID", "Customer", "Email", "Shop", "Amount", "Payment", "Status", "Created"];
  const rows = orders.map((order) => [order.id, order.customerName, order.customerEmail, order.shopName, order.amount, order.paymentStatus, order.status, order.createdAt]);
  return [columns, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
}

export const orderService = { list, getById, nextStatuses, canTransition, changeStatus, bulkTransition, exportOrders };
