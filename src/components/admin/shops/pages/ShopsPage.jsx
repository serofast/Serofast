import { useState, useEffect } from "react";
import ResourcePage from "../../shared/resource/ResourcePage";
import { fetchAdminShops, subscribeToAdminTableChanges } from "../../../../lib/supabase";

const columns = [
  { key: "shop", label: "Shop" },
  { key: "owner", label: "Owner" },
  { key: "category", label: "Category" },
  { key: "orders", label: "Orders" },
  { key: "revenue", label: "Revenue" },
  { key: "rating", label: "Rating" },
  { key: "status", label: "Status" },
  { key: "joined", label: "Joined" },
];

export default function ShopsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadDbShops() {
    try {
      const dbShops = await fetchAdminShops();
      if (Array.isArray(dbShops)) {
        const mapped = dbShops.map((s) => ({
          id: s.id,
          shop: s.name || "Untitled Shop",
          owner: s.owner_name || s.shop_owners?.full_name || "Shop Owner",
          category: s.category_id || "Campus Vendor",
          orders: 0,
          revenue: "₹0",
          rating: s.rating ? `${s.rating} / 5.0` : "4.8 / 5.0",
          status: s.status === "active" ? "Active" : s.status === "pending_review" ? "Pending" : "Active",
          joined: new Date(s.created_at || Date.now()).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        }));
        setRows(mapped);
      } else {
        setRows([]);
      }
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDbShops();
    const unsubscribe = subscribeToAdminTableChanges("shops", () => {
      loadDbShops();
    });
    return () => unsubscribe();
  }, []);

  return (
    <ResourcePage
      title="Campus Shops & Sellers"
      description="Live registered shops, onboarding verification, and performance from Supabase."
      seed={rows}
      columns={columns}
      viewPath={(row) => `/admin/shops/${encodeURIComponent(row.id)}`}
      emptyTitle={loading ? "Loading shops..." : "No shops registered yet"}
      emptyDescription="When sellers register on SeroFast, their shops will appear here for verification and oversight."
    />
  );
}
