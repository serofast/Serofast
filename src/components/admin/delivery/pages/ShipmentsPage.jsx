import { useState, useEffect } from "react";
import ResourcePage from "../../shared/resource/ResourcePage";
import { deliveryRows as seed } from "../../shared/adminData";
import { fetchAdminOrders, subscribeToAdminTableChanges } from "../../../../lib/supabase";

const columns = [
  { key: "id", label: "ID" },
  { key: "order", label: "Order" },
  { key: "shop", label: "Shop" },
  { key: "customer", label: "Customer" },
  { key: "courier", label: "Courier" },
  { key: "tracking", label: "Tracking" },
  { key: "status", label: "Status" },
];

export default function ShipmentsPage() {
  const [rows, setRows] = useState(seed);

  useEffect(() => {
    async function loadShipments() {
      const orders = await fetchAdminOrders();
      if (orders && orders.length > 0) {
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
        setRows(seed);
      }
    }

    loadShipments();
    const unsub = subscribeToAdminTableChanges("orders", () => loadShipments());
    return () => unsub();
  }, []);

  return (
    <ResourcePage
      title="Delivery & Shipments"
      description="Track marketplace shipments, hyperlocal dispatch, and live courier tracking."
      seed={rows}
      columns={columns}
      viewPath={(row) => `/admin/delivery/${encodeURIComponent(row.id)}`}
    />
  );
}
