import { useState, useEffect } from "react";
import ResourcePage from "../../shared/resource/ResourcePage";
import {
  fetchAdminReturnsList,
  subscribeAdminRealtime,
} from "../../../../services/adminSupabaseService";

const columns = [
  { key: "id", label: "ID" },
  { key: "order", label: "Order" },
  { key: "customer", label: "Customer" },
  { key: "shop", label: "Shop" },
  { key: "product", label: "Product" },
  { key: "reason", label: "Reason" },
  { key: "refund", label: "Refund" },
  { key: "status", label: "Status" },
];

export default function ReturnsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadReturns() {
    try {
      const data = await fetchAdminReturnsList();
      if (Array.isArray(data)) {
        const mapped = data.map((r) => ({
          id: r.id,
          order: r.orders?.order_number || r.order_id || "Direct Request",
          customer: r.profiles?.full_name || r.user_id || "Customer",
          shop: r.shops?.name || "Marketplace Merchant",
          product: r.product_name || "Item",
          reason: r.reason || "Return Requested",
          refund: `₹${r.refund_amount || 0}`,
          status: r.status || "Requested",
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
    loadReturns();
    const unsub = subscribeAdminRealtime("returns", () => loadReturns());
    return () => unsub();
  }, []);

  return (
    <ResourcePage
      title="Returns Management"
      description="Live return disputes, evidence review, and customer refund resolutions from Supabase."
      seed={rows}
      columns={columns}
      viewPath={(row) => `/admin/returns/${encodeURIComponent(row.id)}`}
      emptyTitle={loading ? "Loading return requests..." : "No return requests in database"}
      emptyDescription="When customers submit return requests, they will appear here in real-time."
    />
  );
}
