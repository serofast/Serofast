import { useState, useEffect } from "react";
import ResourcePage from "../../../shared/resource/ResourcePage";
import { fetchAdminCoupons, subscribeToAdminTableChanges } from "../../../../../lib/supabase";

const columns = [
  "id",
  "code",
  "type",
  "value",
  "minOrder",
  "usage",
  "status",
  "expires",
].map((key) => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));

export default function CouponsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCoupons() {
    try {
      const data = await fetchAdminCoupons();
      if (Array.isArray(data)) {
        const mapped = data.map((c) => ({
          id: c.id,
          code: c.code,
          type: c.discount_type || "FLAT",
          value: `₹${c.discount_value}`,
          minOrder: `₹${c.min_order_value || 0}`,
          usage: "0 uses",
          status: c.is_active ? "Active" : "Inactive",
          expires: c.valid_until ? new Date(c.valid_until).toLocaleDateString("en-IN") : "No Expiry",
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
    loadCoupons();
    const unsubscribe = subscribeToAdminTableChanges("coupons", () => loadCoupons());
    return () => unsubscribe();
  }, []);

  return (
    <ResourcePage
      title="Coupons"
      description="Live discount coupon codes, usage rules, and promotions from Supabase."
      seed={rows}
      columns={columns}
      createLabel="Add New"
      createPath="/admin/marketing/coupons/new"
      editPath={(row) => `/admin/marketing/coupons/${encodeURIComponent(row.id)}/edit`}
      emptyTitle={loading ? "Loading coupons..." : "No coupons created yet"}
      emptyDescription="Create promotional discount coupons for students and customers across campus."
    />
  );
}
