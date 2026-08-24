import { useEffect, useState, useMemo } from "react";
import {
  fetchAdminWarehouseCatalog,
  fetchAdminCategoriesList,
  subscribeAdminRealtime,
} from "../../../../services/adminSupabaseService";

export function useProducts(productId = null) {
  const [dbProducts, setDbProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const [prods, cats] = await Promise.all([
        fetchAdminWarehouseCatalog(),
        fetchAdminCategoriesList(),
      ]);

      if (Array.isArray(prods)) {
        setDbProducts(
          prods.map((p) => ({
            id: p.id,
            name: p.title || "Product",
            slug: (p.title || "product").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            categoryName: p.category || "General",
            categoryId: p.category,
            shopName: "Central Warehouse",
            price: Number(p.retail_price || p.base_price) || 0,
            base_price: Number(p.base_price) || 0,
            retail_price: Number(p.retail_price) || 0,
            discountPrice: null,
            stock: Number(p.warehouse_stock) || 0,
            warehouse_stock: Number(p.warehouse_stock) || 0,
            lowStockThreshold: 5,
            sku: p.sku || `SF-${p.id ? p.id.slice(0, 6) : "PROD"}`,
            status: "Active",
            approvalStatus: "Approved",
            description: p.description || "",
            images: [
              {
                id: `IMG-${p.id}`,
                url: p.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
                isPrimary: true,
              },
            ],
            variants: [],
            tags: [p.category?.toLowerCase() || "general"],
            createdAt: p.created_at || new Date().toISOString(),
            updatedAt: p.created_at || new Date().toISOString(),
          }))
        );
      } else {
        setDbProducts([]);
      }

      if (Array.isArray(cats)) {
        setDbCategories(cats);
      } else {
        setDbCategories([]);
      }
    } catch (e) {
      setDbProducts([]);
      setDbCategories([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const unsubProds = subscribeAdminRealtime("warehouse_products", () => loadData());
    const unsubCats = subscribeAdminRealtime("categories", () => loadData());
    return () => {
      unsubProds();
      unsubCats();
    };
  }, []);

  const product = useMemo(
    () => dbProducts.find((item) => String(item.id) === String(productId)) ?? null,
    [productId, dbProducts]
  );

  return {
    products: dbProducts,
    product,
    categories: dbCategories,
    approvalHistory: [],
    loading,
    error: null,
    reload: loadData,
  };
}
