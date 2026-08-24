import { useEffect, useState, useMemo } from "react";
import {
  fetchAdminWarehouseCatalog,
  fetchAdminCategoriesList,
  subscribeAdminRealtime,
} from "../../../../services/adminSupabaseService";
import { products as seedProducts, categories as seedCategories } from "../../shared/adminData";

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

      if (prods && prods.length > 0) {
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
            sku: p.sku || `SF-${p.id.slice(0, 6)}`,
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
        // Seed fallback
        setDbProducts(
          seedProducts.map((p, idx) => ({
            id: p.id,
            name: p.product,
            slug: p.product.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            categoryName: p.category,
            categoryId: p.category,
            shopName: p.shop,
            price: Number(String(p.price).replace(/\D/g, "")) || 499,
            stock: Number(p.stock) || 20,
            lowStockThreshold: 5,
            sku: `SF-${p.category.slice(0, 3).toUpperCase()}-${4011 + idx}`,
            status: "Active",
            approvalStatus: idx === 4 ? "Pending Approval" : "Approved",
            description: `${p.product} supplied by ${p.shop}`,
            images: [
              {
                id: `IMG-${p.id}`,
                url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
                isPrimary: true,
              },
            ],
            variants: [],
            tags: [p.category.toLowerCase()],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }))
        );
      }

      if (cats && cats.length > 0) {
        setDbCategories(cats);
      } else {
        setDbCategories(seedCategories);
      }
    } catch (e) {
      console.warn("Products hook fallback:", e);
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
