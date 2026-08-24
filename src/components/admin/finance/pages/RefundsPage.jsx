import { useState, useEffect } from "react";
import ResourcePage from "../../shared/resource/ResourcePage";
import { refunds as seed } from "../../shared/adminData";
import {
  fetchAdminRefundsList,
  subscribeAdminRealtime,
} from "../../../../services/adminSupabaseService";

const columns = [
  { key: "id", label: "ID" },
  { key: "order", label: "Order" },
  { key: "customer", label: "Customer" },
  { key: "shop", label: "Shop" },
  { key: "amount", label: "Amount" },
  { key: "reason", label: "Reason" },
  { key: "status", label: "Status" },
];

export default function RefundsPage() {
  const [rows, setRows] = useState(seed);

  useEffect(() => {
    async function loadRefunds() {
      const data = await fetchAdminRefundsList();
      if (data && data.length > 0) {
        const mapped = data.map((r) => ({
          id: r.refund_number || r.id,
          order: r.orders?.order_number || r.order_id,
          customer: r.profiles?.full_name || r.user_id || "Customer",
          shop: r.shops?.name || "Marketplace Merchant",
          amount: `₹${r.amount || 0}`,
          reason: r.reason,
          status: r.status,
        }));
        setRows(mapped);
      } else {
        setRows(seed);
      }
    }

    loadRefunds();
    const unsub = subscribeAdminRealtime("refunds", () => loadRefunds());
    return () => unsub();
  }, []);

  return (
    <ResourcePage
      title="Refunds"
      description="Review customer refund requests, resolution status and gateway settlements."
      seed={rows}
      columns={columns}
      viewPath={(row) => `/admin/finance/refunds/${encodeURIComponent(row.id)}`}
      routeParam="refundId"
      basePath="/admin/finance/refunds"
    />
  );
}
