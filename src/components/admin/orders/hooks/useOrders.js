import { useMemo, useSyncExternalStore } from "react";
import { getAdminState, subscribeAdminState } from "../../shared/localAdminRepository";

export function useOrders(orderId = null) {
  const state = useSyncExternalStore(subscribeAdminState, getAdminState, getAdminState);
  const order = useMemo(() => state.orders.find((item) => item.id === orderId) ?? null, [orderId, state.orders]);
  return { orders: state.orders, order, loading: false, error: null };
}
