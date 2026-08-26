import { useState, useEffect } from "react";
import ResourcePage from "../../shared/resource/ResourcePage";
import { fetchAdminOrders, subscribeToAdminTableChanges } from "../../../../lib/supabase";

const columns = [
  { key: "id", label: "Shipment ID" },
  { key: "order", label: "Order" },
  { key: "shop", label: "Shop" },
  { key: "customer", label: "Customer" },
  { key: "courier", label: "Courier" },
  { key: "tracking", label: "Tracking AWB" },
  { key: "status", label: "Status" },
];

export default function ShipmentsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadShipments() {
    try {
      const orders = await fetchAdminOrders();
      if (Array.isArray(orders)) {
        const mapped = orders.map((o, index) => ({
          id: `DEL-${o.id ? o.id.slice(0, 6).toUpperCase() : index + 1}`,
          orderId: o.id,
          order: o.order_number || o.id,
          shop: o.shops?.name || "Campus Vendor",
          customer: o.customer_phone || o.address || "Hostel Resident",
          courier: o.tracking_number ? "Delhivery Hyperlocal" : "Campus Courier",
          tracking: o.tracking_number || `SF-TRK-${(o.order_number || o.id).slice(-4)}`,
          status: o.order_status === "DELIVERED" ? "Delivered" : o.order_status === "SHIPPED" ? "In Transit" : "Out for Delivery",
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
    loadShipments();
    const unsub = subscribeToAdminTableChanges("orders", () => loadShipments());
    return () => unsub();
  }, []);

  return (
    <ResourcePage
      title="Delivery & Shipments"
      description="Live marketplace shipments, courier assignment, and delivery dispatch from Supabase."
      seed={rows}
      columns={columns}
      viewPath={(row) => `/admin/delivery/${encodeURIComponent(row.orderId || row.id)}`}
      emptyTitle={loading ? "Loading shipments..." : "No shipments found in database"}
      emptyDescription="Dispatched customer orders will appear here automatically."
    />
  );
}
