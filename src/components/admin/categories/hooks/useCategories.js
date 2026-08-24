import { useEffect, useState } from "react";
import {
  fetchAdminCategoriesList,
  subscribeAdminRealtime,
} from "../../../../services/adminSupabaseService";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const dbCategories = await fetchAdminCategoriesList();
      if (Array.isArray(dbCategories)) {
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
      } else {
        setCategories([]);
      }
    } catch (err) {
      setCategories([]);
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
