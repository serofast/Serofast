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
            sections: p.sections || (p.tags?.length ? p.tags : ["Explore Products"]),
            material: p.material || "",
            fit: p.fit || "",
            care: p.care || "",
            sizes: Array.isArray(p.sizes) ? p.sizes : [],
            store_price: Number(p.store_price ?? p.retail_price ?? p.base_price ?? p.price) || 0,
            cut_price: Number(p["Price(will be cutted)"] ?? p.cut_price ?? p.base_price ?? p.retail_price) || 0,
            "Price(will be cutted)": Number(p["Price(will be cutted)"] ?? p.cut_price ?? p.base_price ?? p.retail_price) || 0,
            price: Number(p.store_price ?? p.retail_price ?? p.base_price ?? p.price) || 0,
            base_price: Number(p["Price(will be cutted)"] ?? p.cut_price ?? p.base_price ?? p.retail_price) || 0,
            retail_price: Number(p.store_price ?? p.retail_price ?? p.base_price ?? p.price) || 0,
            discountPrice: p.discount_price ? Number(p.discount_price) : null,
            stock: Number(p.warehouse_stock ?? p.stock) >= 0 ? Number(p.warehouse_stock ?? p.stock) : 1,
            warehouse_stock: Number(p.warehouse_stock ?? p.stock) >= 0 ? Number(p.warehouse_stock ?? p.stock) : 1,
            status: p.status || (Number(p.warehouse_stock) === 0 ? "Out of Stock" : "Active"),
            approvalStatus: "Approved",
            description: p.description || "",
            images: Array.isArray(p.images) && p.images.length
              ? p.images
              : [
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
