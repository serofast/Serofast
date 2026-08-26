import { useState, useEffect } from "react";
import ResourcePage from "../../shared/resource/ResourcePage";
import {
  fetchAdminRefundsList,
  subscribeAdminRealtime,
} from "../../../../services/adminSupabaseService";

const columns = [
  { key: "id", label: "Refund ID" },
  { key: "order", label: "Order" },
  { key: "customer", label: "Customer" },
  { key: "shop", label: "Shop" },
  { key: "amount", label: "Amount" },
  { key: "reason", label: "Reason" },
  { key: "status", label: "Status" },
];

export default function RefundsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadRefunds() {
    try {
      const data = await fetchAdminRefundsList();
      if (Array.isArray(data)) {
        const mapped = data.map((r) => ({
          id: r.refund_number || r.id,
          order: r.orders?.order_number || r.order_id || "Direct Order",
          customer: r.profiles?.full_name || r.user_id || "Customer",
          shop: r.shops?.name || "Marketplace Merchant",
          amount: `₹${r.amount || 0}`,
          reason: r.reason || "Customer Refund",
          status: r.status || "Pending",
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
    loadRefunds();
    const unsub = subscribeAdminRealtime("refunds", () => loadRefunds());
    return () => unsub();
  }, []);

  return (
    <ResourcePage
      title="Refunds Ledger"
      description="Live customer refund requests, settlement states, and gateway transactions from Supabase."
      seed={rows}
      columns={columns}
      viewPath={(row) => `/admin/finance/refunds/${encodeURIComponent(row.id)}`}
      routeParam="refundId"
      basePath="/admin/finance/refunds"
      emptyTitle={loading ? "Loading refunds..." : "No refunds in database"}
      emptyDescription="Processed return refunds and gateway reversals will appear here in real-time."
    />
  );
}
