import { useEffect, useState } from "react";
import {
  fetchAdminCategoriesList,
  saveAdminCategory,
  deleteAdminCategory,
  subscribeAdminRealtime,
} from "../../../../services/adminSupabaseService";
import { categories as seedCategories } from "../../shared/adminData";

export function useCategories() {
  const [categories, setCategories] = useState(() =>
    seedCategories.map((cat, idx) => ({
      id: cat.id || `CAT-${idx + 1}`,
      name: cat.name,
      slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      parent: cat.parent || "—",
      children: cat.children || 0,
      shops: cat.shops || 0,
      products: cat.products || 0,
      status: cat.status || "Active",
      position: idx,
    }))
  );
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const dbCategories = await fetchAdminCategoriesList();
      if (dbCategories && dbCategories.length > 0) {
        const mapped = dbCategories.map((c, idx) => ({
          id: c.id,
          name: c.name,
          slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          parent: c.group_name || "—",
          children: 0,
          shops: 0,
          products: Number(String(c.items_count || "").replace(/\D/g, "")) || 0,
          status: "Active",
          position: idx,
          image_url: c.image_url,
          bg_color: c.bg_color,
        }));
        setCategories(mapped);
      }
    } catch (err) {
      console.warn("Categories fetch fallback:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const unsub = subscribeAdminRealtime("categories", () => {
      loadData();
    });
    return () => unsub();
  }, []);

  return { categories, loading, reload: loadData };
}
