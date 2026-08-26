import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, PageHeader, StatusBadge, Toast } from "../../shared/ui";
import { fetchAdminOrders } from "../../../../lib/supabase";
import { updateAdminOrderShipment } from "../../../../services/adminSupabaseService";

export default function ShipmentDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courier, setCourier] = useState("Delhivery Hyperlocal");
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadDbShipment() {
      setLoading(true);
      try {
        const orders = await fetchAdminOrders();
        if (Array.isArray(orders)) {
          const found = orders.find(
            (o) =>
              String(o.id) === String(params.shipmentId) ||
              String(o.order_number) === String(params.shipmentId) ||
              `DEL-${o.id ? o.id.slice(0, 6).toUpperCase() : ""}` === String(params.shipmentId)
          );
          if (found) {
            const mapped = {
              id: `DEL-${found.id ? found.id.slice(0, 6).toUpperCase() : "1"}`,
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
            setCourier(mapped.courier);
          } else {
            setRecord(null);
          }
        }
      } catch {
        setRecord(null);
      } finally {
        setLoading(false);
      }
    }
    loadDbShipment();
  }, [params.shipmentId]);

  async function handleUpdateTracking(e) {
    e.preventDefault();
    if (!record?.orderId) return;
    try {
      await updateAdminOrderShipment(record.orderId, trackingNumber, courier);
      setRecord((curr) => ({ ...curr, tracking: trackingNumber, courier }));
      setToast("Tracking information updated in Supabase.");
    } catch {
      setToast("Failed to update tracking in database.");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-8 text-center text-xs text-slate-500 font-sans font-sansation">
        Loading shipment details from database...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-8 text-center font-sans font-sansation">
        <div className="rounded-[24px] border border-slate-100 bg-white p-8">
          <p className="text-sm font-semibold text-slate-800">Shipment not found in database</p>
          <p className="mt-1 text-xs text-slate-500">The requested shipment ({params.shipmentId}) does not exist in Supabase.</p>
          <button
            type="button"
            onClick={() => navigate("/admin/delivery")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brandRed px-4 py-2 text-xs font-semibold text-white"
          >
            <ArrowLeft size={14} /> Back to Delivery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/delivery")}
            className="mb-2 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brandRed"
          >
            <ArrowLeft size={14} /> Back to Shipments
          </button>
          <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
            Shipment Details ({record.id})
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Operational detail view and live courier dispatch tracking.
          </p>
        </div>
        <StatusBadge value={record.status} />
      </div>

      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-slate-900 border-b pb-3 mb-4">
            Shipment Overview
          </h2>
          <div className="space-y-3">
            {Object.entries(record)
              .filter(([key]) => key !== "orderId")
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between gap-5 border-b border-slate-100 pb-2.5 text-xs"
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
              className="w-full h-10 rounded-xl bg-brandRed text-white text-xs font-semibold hover:bg-brandRed/90 shadow-sm"
            >
              Update Shipment in Supabase
            </button>
          </form>
        </Card>
      </div>
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
