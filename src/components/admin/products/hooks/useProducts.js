import { useMemo, useSyncExternalStore } from "react";
import { getAdminState, subscribeAdminState } from "../../shared/localAdminRepository";

export function useProducts(productId = null) {
  const state = useSyncExternalStore(subscribeAdminState, getAdminState, getAdminState);
  const product = useMemo(
    () => state.products.find((item) => item.id === productId) ?? null,
    [productId, state.products],
  );
  return {
    products: state.products,
    product,
    categories: state.categories,
    approvalHistory: state.approvalHistory,
    loading: false,
    error: null,
  };
}
