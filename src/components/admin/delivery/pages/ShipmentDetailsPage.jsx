import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Truck,
  Package,
  Clock,
  ShieldCheck,
  MapPin,
  Phone,
  Store,
  Calendar,
  CreditCard,
  Edit2,
  Save,
  X,
  Check,
  RefreshCw,
  User,
} from "lucide-react";
import { Card, StatusBadge, Toast } from "../../shared/ui";
import {
  fetchDeliveryDetails,
  updateDeliveryStatus,
  subscribeToRealtimeDeliveries,
} from "../../../../services/deliveryService";

const TRACKING_STEPS = [
  { key: "ORDER_PLACED", label: "Order Received", desc: "Customer order placed in system", icon: Clock },
  { key: "PACKED", label: "Packed in Warehouse", desc: "Admin verified & boxed items", icon: Package },
  { key: "SHIPPED", label: "In Transit / Dispatched", desc: "Handed to courier / runner", icon: Truck },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", desc: "Rider reaching hostel drop point", icon: MapPin },
  { key: "DELIVERED", label: "Delivered", desc: "Parcel handed to customer", icon: ShieldCheck },
];

const STATUS_OPTIONS = [
  { value: "ORDER_PLACED", label: "ORDER_PLACED (Needs Packing)", color: "text-amber-700 bg-amber-50" },
  { value: "PACKED", label: "PACKED (Packed in Box)", color: "text-blue-700 bg-blue-50" },
  { value: "SHIPPED", label: "SHIPPED (In Transit)", color: "text-indigo-700 bg-indigo-50" },
  { value: "OUT_FOR_DELIVERY", label: "OUT_FOR_DELIVERY (Out for Delivery)", color: "text-purple-700 bg-purple-50" },
  { value: "DELIVERED", label: "DELIVERED (Delivered)", color: "text-emerald-700 bg-emerald-50" },
  { value: "CANCELLED", label: "CANCELLED (Cancelled)", color: "text-rose-700 bg-rose-50" },
];

export default function ShipmentDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [toast, setToast] = useState("");

  async function loadDetails() {
    try {
      const data = await fetchDeliveryDetails(params.shipmentId);
      if (data) {
        setRecord(data);
        setSelectedStatus(data.status || "ORDER_PLACED");
      } else {
        setRecord(null);
      }
    } catch {
      setRecord(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetails();
    // ── Live Supabase Real-Time Listener ─────────────────────────────────
    const unsub = subscribeToRealtimeDeliveries(() => {
      loadDetails();
    });
    return () => unsub();
  }, [params.shipmentId]);

  async function handleSaveStatus() {
    if (!record?.order_id || !selectedStatus) return;
    setSavingStatus(true);
    try {
      const res = await updateDeliveryStatus({
        orderId: record.order_id,
        status: selectedStatus,
        trackingNumber: record.tracking_number,
      });

      if (res.success) {
        setToast(`Order status changed to ${selectedStatus}. Updated in Supabase.`);
        setIsStatusModalOpen(false);
        await loadDetails();
      } else {
        setToast("Failed to update status in database.");
      }
    } catch (err) {
      setToast(`Error saving status: ${err.message}`);
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleQuickStatusChange(newStatus) {
    if (!record?.order_id || savingStatus) return;
    setSavingStatus(true);
    try {
      const res = await updateDeliveryStatus({
        orderId: record.order_id,
        status: newStatus,
        trackingNumber: record.tracking_number,
      });
      if (res.success) {
        setRecord((prev) => (prev ? { ...prev, status: newStatus } : null));
        setToast(`Status updated to ${newStatus}. Live across all devices.`);
        await loadDetails();
      } else {
        setToast("Failed to update status.");
      }
    } catch {
      setToast("Failed to transition delivery stage.");
    } finally {
      setSavingStatus(false);
    }
  }

  const currentStepIndex = (() => {
    if (!record) return 0;
    const st = (record.status || "ORDER_PLACED").toUpperCase();
    if (st === "DELIVERED" || st === "COMPLETED") return 4;
    if (st === "OUT_FOR_DELIVERY") return 3;
    if (st === "SHIPPED" || st === "IN_TRANSIT" || st === "DISPATCHED") return 2;
    if (st === "PACKED") return 1;
    return 0;
  })();

  const orderItems = record?.orders?.order_items || [];

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-16 text-center text-xs text-slate-500 font-sans font-sansation">
        <RefreshCw size={24} className="animate-spin text-brandRed mx-auto mb-2" />
        Loading live parcel details from Supabase...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-8 text-center font-sans font-sansation">
        <div className="rounded-[24px] border border-slate-100 bg-white p-8">
          <p className="text-sm font-semibold text-slate-800">Order/Shipment not found</p>
          <p className="mt-1 text-xs text-slate-500">
            The requested parcel ({params.shipmentId}) does not exist in the orders table.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/delivery")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brandRed px-4 py-2 text-xs font-semibold text-white cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Delivery Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-16">
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/delivery")}
            className="mb-2 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brandRed cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Deliveries
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Parcel #{record.order_number || record.id}</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live WebSocket Sync
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin Central Fulfillment Center · Warehouse Packaging & Dispatch Tracking.
          </p>
        </div>

        {/* Status Badge + Edit Icon */}
        <div className="flex items-center gap-2">
          <StatusBadge value={record.status} />
          <button
            type="button"
            onClick={() => {
              setSelectedStatus(record.status || "ORDER_PLACED");
              setIsStatusModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-brandRed hover:text-brandRed shadow-2xs transition cursor-pointer"
            title="Edit Status in Supabase"
          >
            <Edit2 size={13} />
            <span>Edit Status</span>
          </button>
        </div>
      </div>

      {/* ── Real-Time Delivery Stepper Timeline ─────────────────────────── */}
      <Card className="p-6 bg-white border border-[#E5E7EB] rounded-[24px] shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-brandRed" />
            <h2 className="text-sm font-bold text-slate-900">Live Delivery Lifecycle Tracker</h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono font-medium">
            AWB: {record.tracking_number || "Awaiting Assignment"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {TRACKING_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center text-center relative">
                {idx < TRACKING_STEPS.length - 1 && (
                  <div
                    className={`hidden md:block absolute top-5 left-1/2 w-full h-0.5 z-0 ${
                      idx < currentStepIndex ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}

                <div
                  className={`relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                      : isCurrent
                      ? "border-brandRed bg-brandRed text-white shadow-[0_0_16px_rgba(211,47,47,0.4)] scale-110"
                      : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  <StepIcon size={18} />
                </div>

                <div className="mt-3">
                  <h3
                    className={`text-xs font-bold ${
                      isCurrent ? "text-brandRed" : isCompleted ? "text-slate-800" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </h3>
                  <p className="mt-0.5 text-[10.5px] text-slate-500 max-w-[130px] leading-tight">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Progression Stage Triggers */}
        <div className="mt-6 border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11.5px] text-slate-500 font-medium">
            Advance Warehouse Stage (Direct Supabase Mutation):
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={savingStatus || record.status === "PACKED"}
              onClick={() => handleQuickStatusChange("PACKED")}
              className="px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 text-xs font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-40 cursor-pointer"
            >
              1. Pack Box
            </button>
            <button
              type="button"
              disabled={savingStatus || record.status === "SHIPPED"}
              onClick={() => handleQuickStatusChange("SHIPPED")}
              className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-xs font-bold text-blue-800 hover:bg-blue-100 disabled:opacity-40 cursor-pointer"
            >
              2. Hand to Courier
            </button>
            <button
              type="button"
              disabled={savingStatus || record.status === "OUT_FOR_DELIVERY"}
              onClick={() => handleQuickStatusChange("OUT_FOR_DELIVERY")}
              className="px-3 py-1.5 rounded-xl border border-purple-200 bg-purple-50 text-xs font-bold text-purple-800 hover:bg-purple-100 disabled:opacity-40 cursor-pointer"
            >
              3. Out for Delivery
            </button>
            <button
              type="button"
              disabled={savingStatus || record.status === "DELIVERED"}
              onClick={() => handleQuickStatusChange("DELIVERED")}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40 shadow-xs cursor-pointer"
            >
              4. Mark Delivered
            </button>
          </div>
        </div>
      </Card>

      {/* ── Main Details Grid ───────────────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_340px]">
        {/* Left Column: Warehouse Packing Checklist & Order Items */}
        <div className="space-y-5">
          {/* Packing Inspection Card */}
          <Card className="p-6 bg-white border border-[#E5E7EB] rounded-[24px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Package className="text-brandRed" size={17} />
                <h2 className="text-sm font-bold text-slate-900">
                  Warehouse Packing Inspection ({orderItems.length} {orderItems.length === 1 ? "Item" : "Items"})
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Total: ₹{(record.total_amount || 0).toLocaleString("en-IN")}
              </span>
            </div>

            {orderItems.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                <Package className="mx-auto mb-1 text-slate-400" size={20} />
                Standard campus catalog item packaged from central warehouse.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {orderItems.map((item) => {
                  const title = item.product_title || item.product_name || "Clothing Item";
                  const image = item.product_image || item.image_url;
                  const itemPrice = Number(item.unit_price || item.price || item.price_at_purchase || 0);
                  const totalPrice = item.total_price ? Number(item.total_price) : itemPrice * (Number(item.quantity) || 1);

                  return (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden grid place-items-center">
                          {image ? (
                            <img src={image} alt={title} className="h-full w-full object-cover" />
                          ) : (
                            <Package size={18} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block">{title}</span>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            {item.size && <span>Size: <strong className="text-slate-700">{item.size}</strong></span>}
                            {item.color && <span>Color: <strong className="text-slate-700">{item.color}</strong></span>}
                            <span>Qty: <strong className="text-brandRed">{item.quantity}</strong></span>
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Destination & Payment Info */}
          <Card className="p-6 bg-white border border-[#E5E7EB] rounded-[24px]">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              Destination & Payment Details
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <User size={14} className="text-brandRed" /> Customer Name:
                </span>
                <span className="font-bold text-slate-900">
                  {record.customer_name || "Hostel Resident"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <MapPin size={14} className="text-brandRed" /> Customer Drop Address:
                </span>
                <span className="font-bold text-slate-800 text-right max-w-[240px]">
                  {record.delivery_address || "Main Campus Hostel"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Phone size={14} className="text-brandRed" /> Customer Contact:
                </span>
                <span className="font-mono font-semibold text-slate-800">
                  {record.customer_phone || "+91 99887 76655"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <CreditCard size={14} className="text-brandRed" /> Payment Method & Status:
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{record.orders?.payment_method || "UPI"}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-bold">
                    {record.orders?.payment_status || "COMPLETED"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Store size={14} className="text-brandRed" /> Merchant Store:
                </span>
                <span className="font-semibold text-slate-800">
                  {record.shop_name}
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Calendar size={14} className="text-brandRed" /> Order Timestamp:
                </span>
                <span className="font-medium text-slate-700">
                  {new Date(record.created_at || Date.now()).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Courier Info Card */}
        <div>
          <Card className="p-6 bg-white border border-[#E5E7EB] rounded-[24px] sticky top-20">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              Courier Dispatch Details
            </h2>

            <div className="space-y-3 text-xs mb-6">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Courier Fleet</span>
                <span className="font-semibold text-slate-800">{record.courier_name}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tracking AWB</span>
                <span className="font-mono font-bold text-brandRed">{record.tracking_number}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Runner</span>
                <span className="font-semibold text-slate-800">{record.runner_name} ({record.runner_phone})</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedStatus(record.status || "ORDER_PLACED");
                setIsStatusModalOpen(true);
              }}
              className="w-full h-11 rounded-xl bg-brandRed text-white text-xs font-bold hover:brightness-110 shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Edit2 size={14} /> Change Delivery Status
            </button>
          </Card>
        </div>
      </div>

      {/* ── Edit Status Modal ───────────────────────────────────────────── */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-[24px] p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 size={16} className="text-brandRed" />
                <h3 className="text-sm font-bold text-slate-900">
                  Change Delivery Status
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-xs text-slate-600">
              Select new status for <strong className="text-slate-900">Order #{record.order_number || record.id}</strong>:
            </div>

            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    selectedStatus === opt.value
                      ? "border-brandRed bg-brandRed/5 text-brandRed font-bold"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${
                      opt.value === "ORDER_PLACED" ? "bg-amber-500" :
                      opt.value === "PACKED" ? "bg-blue-500" :
                      opt.value === "SHIPPED" ? "bg-indigo-500" :
                      opt.value === "OUT_FOR_DELIVERY" ? "bg-purple-500" :
                      opt.value === "DELIVERED" ? "bg-emerald-500" : "bg-rose-500"
                    }`} />
                    {opt.label}
                  </span>
                  {selectedStatus === opt.value && <Check size={14} className="text-brandRed" />}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingStatus}
                onClick={handleSaveStatus}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brandRed text-white text-xs font-bold hover:brightness-110 shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                <Save size={13} />
                {savingStatus ? "Updating Supabase..." : "Save Status"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
