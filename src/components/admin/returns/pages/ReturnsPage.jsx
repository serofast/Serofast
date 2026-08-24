import { useState, useEffect } from "react";
import ResourcePage from "../../shared/resource/ResourcePage";
import { returns as seed } from "../../shared/adminData";
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
  const [rows, setRows] = useState(seed);

  useEffect(() => {
    async function loadReturns() {
      const data = await fetchAdminReturnsList();
      if (data && data.length > 0) {
        const mapped = data.map((r) => ({
          id: r.id,
          order: r.orders?.order_number || r.order_id,
          customer: r.profiles?.full_name || r.user_id || "Customer",
          shop: r.shops?.name || "Shop",
          product: r.product_name,
          reason: r.reason,
          refund: `₹${r.refund_amount || 0}`,
          status: r.status,
        }));
        setRows(mapped);
      } else {
        setRows(seed);
      }
    }

    loadReturns();
    const unsub = subscribeAdminRealtime("returns", () => loadReturns());
    return () => unsub();
  }, []);

  return (
    <ResourcePage
      title="Returns"
      description="Review return requests, reasons, evidence and refund amounts."
      seed={rows}
      columns={columns}
      viewPath={(row) => `/admin/returns/${encodeURIComponent(row.id)}`}
    />
  );
}
