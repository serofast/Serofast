import { useMemo, useSyncExternalStore } from "react";
import { getAdminState, subscribeAdminState } from "../../shared/localAdminRepository";
import { stockStatus } from "../services/inventoryService";

export function useInventory() {
  const state = useSyncExternalStore(subscribeAdminState, getAdminState, getAdminState);
  const inventory = useMemo(() => state.inventory.map((record) => ({ ...record, status: stockStatus(record) })), [state.inventory]);
  return { inventory, movements: state.inventoryMovements, loading: false, error: null };
}
