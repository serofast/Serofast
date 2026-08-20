import { useMemo, useSyncExternalStore } from "react";
import { getAdminState, subscribeAdminState } from "../../shared/localAdminRepository";

export function useCategories() {
  const state = useSyncExternalStore(subscribeAdminState, getAdminState, getAdminState);
  const categories = useMemo(
    () => state.categories.map((category) => {
      const products = state.products.filter(
        (product) => product.categoryId === category.id && product.status !== "Archived",
      );
      return {
        ...category,
        products: products.length,
        shops: new Set(products.map((product) => product.shopId)).size,
        children: state.categories.filter((item) => item.parent === category.name).length,
      };
    }),
    [state.categories, state.products],
  );
  return { categories, loading: false, error: null };
}
