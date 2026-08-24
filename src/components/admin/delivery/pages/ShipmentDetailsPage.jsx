import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, PageHeader, StatusBadge, Toast } from "../../shared/ui";
import { shipments as fallbackShipments } from "../../shared/adminData";
import { fetchAdminOrders } from "../../../../lib/supabase";
import { updateAdminOrderShipment } from "../../../../services/adminSupabaseService";

export default function ShipmentDetailsPage() {
  const params = useParams();
  const [record, setRecord] = useState(
    fallbackShipments.find((item) => item.id === params.shipmentId) || fallbackShipments[0]
  );
  const [trackingNumber, setTrackingNumber] = useState(record.tracking || "");
  const [courier, setCourier] = useState(record.courier || "Delhivery Hyperlocal");
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadDbShipment() {
      const orders = await fetchAdminOrders();
      if (orders && orders.length > 0) {
        const found = orders.find(
          (o) =>
            o.id === params.shipmentId ||
            o.order_number === params.shipmentId ||
            `DEL-${o.id ? o.id.slice(0, 6).toUpperCase() : ""}` === params.shipmentId
        );
        if (found) {
          const mapped = {
            id: params.shipmentId,
            orderId: found.id,
            order: found.order_number || found.id,
            shop: found.shops?.name || "Campus Vendor",
            customer: found.customer_phone || found.address || "Hostel Resident",
            courier: found.tracking_number ? "Delhivery Hyperlocal" : "Campus Courier",
            tracking: found.tracking_number || `SF-TRK-${(found.order_number || found.id).slice(-4)}`,
            status: found.order_status === "DELIVERED" ? "Delivered" : "In Transit",
            address: found.address || "Main Campus Hostel",
            created: new Date(found.created_at).toLocaleDateString("en-IN"),
          };
          setRecord(mapped);
          setTrackingNumber(mapped.tracking);
        }
      }
    }
    loadDbShipment();
  }, [params.shipmentId]);

  async function handleUpdateTracking(e) {
    e.preventDefault();
    if (record.orderId) {
      await updateAdminOrderShipment(record.orderId, trackingNumber, courier);
      setToast("Tracking information updated in Supabase.");
    } else {
      setToast("Tracking updated locally.");
    }
    setRecord((curr) => ({ ...curr, tracking: trackingNumber, courier }));
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          Shipment Details ({record.id})
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Operational detail view and live courier dispatch tracking.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="p-6">
          <div className="space-y-4">
            {Object.entries(record)
              .filter(([key]) => key !== "orderId")
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between gap-5 border-b border-slate-100 pb-3 text-xs"
                >
                  <span className="capitalize text-slate-500 font-normal">{key}</span>
                  <span className="font-medium text-slate-900">
                    {key === "status" ? <StatusBadge value={value} /> : String(value)}
                  </span>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 border-b pb-2">
            Courier Assignment
          </h2>
          <form onSubmit={handleUpdateTracking} className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">
                Courier Service
              </label>
              <input
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="w-full h-10 px-3 border rounded-xl text-xs outline-none focus:border-brandRed"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">
                Tracking Number / AWB
              </label>
              <input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full h-10 px-3 border rounded-xl text-xs outline-none focus:border-brandRed"
              />
            </div>
            <button
              type="submit"
              className="w-full h-10 rounded-xl bg-brandRed text-white text-xs font-semibold hover:bg-brandRed/90"
            >
              Update Shipment
            </button>
          </form>
        </Card>
      </div>
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
