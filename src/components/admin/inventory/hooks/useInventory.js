import { useEffect, useState } from "react";
import {
  fetchAdminWarehouseCatalog,
  fetchAdminInventoryMovements,
  subscribeAdminRealtime,
} from "../../../../services/adminSupabaseService";
import { stockStatus } from "../services/inventoryService";

export function useInventory() {
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const [prods, moves] = await Promise.all([
        fetchAdminWarehouseCatalog(),
        fetchAdminInventoryMovements(),
      ]);

      if (prods && prods.length > 0) {
        const mapped = prods.map((p) => {
          const item = {
            id: p.id,
            productId: p.id,
            productName: p.title || "Product",
            variantId: null,
            variantLabel: "Standard",
            shopId: "SHOP-CENTRAL",
            shopName: "Central Warehouse",
            sku: p.sku || `SF-${p.id.slice(0, 6)}`,
            quantity: Number(p.warehouse_stock) || 0,
            lowStockThreshold: 10,
            updatedAt: p.created_at || new Date().toISOString(),
          };
          return {
            ...item,
            status: stockStatus(item),
          };
        });
        setInventory(mapped);
      }

      if (moves && moves.length > 0) {
        const mappedMoves = moves.map((m) => ({
          id: m.id,
          productId: m.product_id,
          productName: m.warehouse_products?.title || "Warehouse Item",
          variantLabel: "Standard",
          shopName: "Central Warehouse",
          sku: m.warehouse_products?.sku || `SKU-${m.product_id.slice(0, 6)}`,
          type: m.type,
          quantity: m.quantity,
          previousQuantity: m.previous_stock,
          newQuantity: m.new_stock,
          reason: m.reason || "Inventory Adjustment",
          reference: m.reference_id || "Direct Operation",
          performedBy: m.performed_by || "Admin",
          createdAt: m.created_at,
        }));
        setMovements(mappedMoves);
      }
    } catch (e) {
      console.warn("Inventory hook error:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const unsubProds = subscribeAdminRealtime("warehouse_products", () => loadData());
    const unsubMoves = subscribeAdminRealtime("inventory_movements", () => loadData());
    return () => {
      unsubProds();
      unsubMoves();
    };
  }, []);

  return { inventory, movements, loading, reload: loadData };
}
