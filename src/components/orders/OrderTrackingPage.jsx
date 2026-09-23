import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  ArrowLeft,
  Search,
  RefreshCw,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { fetchDeliveryDetails, subscribeToRealtimeDeliveries } from "../../services/deliveryService";

const TRACKING_MILESTONES = [
  { key: "ORDER_PLACED", label: "Order Placed", desc: "We've received your order and sent it to our central warehouse.", icon: Clock },
  { key: "PACKED", label: "Packed in Warehouse", desc: "Your clothing items have been verified, folded & sealed in the parcel.", icon: Package },
  { key: "SHIPPED", label: "Dispatched / In Transit", desc: "Handed over to campus delivery runner / courier.", icon: Truck },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", desc: "Rider is heading to your hostel block for drop-off.", icon: MapPin },
  { key: "DELIVERED", label: "Delivered", desc: "Parcel successfully handed over to you.", icon: ShieldCheck },
];

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(orderId || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [recentOrders, setRecentOrders] = useState([]);

  async function loadOrder(queryId) {
    if (!queryId) return;
    setLoading(true);
    try {
      const data = await fetchDeliveryDetails(queryId);
      setOrder(data);
    } catch (e) {
      console.warn("Failed to track order:", e);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  async function loadRecentDemoOrders() {
    try {
      const { data } = await supabase
        .from("orders")
        .select("id, order_number, customer_name, total_amount, order_status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentOrders(data || []);
    } catch {}
  }

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId);
      // ── Real-Time WebSocket Channel for Live Status Sync ───────────────
      const unsub = subscribeToRealtimeDeliveries(() => {
        loadOrder(orderId);
      });
      return () => unsub();
    } else {
      loadRecentDemoOrders();
    }
  }, [orderId]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track/${encodeURIComponent(searchInput.trim())}`);
    }
  }

  const currentStepIndex = (() => {
    if (!order) return 0;
    const st = (order.status || "ORDER_PLACED").toUpperCase();
    if (st === "DELIVERED" || st === "COMPLETED") return 4;
    if (st === "OUT_FOR_DELIVERY") return 3;
    if (st === "SHIPPED" || st === "IN_TRANSIT" || st === "DISPATCHED") return 2;
    if (st === "PACKED") return 1;
    return 0;
  })();

  const orderItems = order?.orders?.order_items || [];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans font-sansation antialiased pb-20">
      {/* ── Top Navigation Header ───────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-brandRed hover:bg-red-50 transition"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-brandRed tracking-tight font-sansation">SeroFast</span>
              <span className="text-xs text-slate-400 font-medium">| Live Order Tracking</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live WebSocket Sync
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        {/* ── Search Bar Card ────────────────────────────────────────────── */}
        <div className="bg-white rounded-[24px] p-5 border border-slate-200/80 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter your Order Number (e.g. ORD-2026-8801)..."
                className="w-full h-11 pl-9 pr-4 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-brandRed"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-6 rounded-xl bg-brandRed text-white text-xs font-bold hover:brightness-110 shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* ── If Loading ─────────────────────────────────────────────────── */}
        {loading && (
          <div className="bg-white rounded-[24px] p-12 text-center border border-slate-200/80 space-y-3">
            <RefreshCw size={28} className="animate-spin text-brandRed mx-auto" />
            <p className="text-xs font-semibold text-slate-600">Connecting to live tracking satellite...</p>
          </div>
        )}

        {/* ── If Order Found: Live Real-Time Stepper & Parcel Content ────── */}
        {!loading && order && (
          <div className="space-y-6 animate-fade-in">
            {/* Main Tracker Card */}
            <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Parcel Tracking</span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    Order #{order.order_number || order.id}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Recipient: <strong className="text-slate-800">{order.customer_name}</strong> · AWB: <span className="font-mono font-semibold text-brandRed">{order.tracking_number}</span>
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-brandRed border border-red-200 text-xs font-bold">
                  <span className="h-2 w-2 rounded-full bg-brandRed animate-ping" />
                  <span>{order.status}</span>
                </div>
              </div>

              {/* ── 5-Step Animated Real-Time Stepper ──────────────────── */}
              <div className="py-2">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                  {TRACKING_MILESTONES.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    const StepIcon = step.icon;

                    return (
                      <div key={step.key} className="flex md:flex-col items-center md:text-center gap-3 md:gap-2 relative">
                        {/* Connecting bar for desktop */}
                        {idx < TRACKING_MILESTONES.length - 1 && (
                          <div
                            className={`hidden md:block absolute top-5 left-1/2 w-full h-0.5 z-0 ${
                              idx < currentStepIndex ? "bg-emerald-500" : "bg-slate-200"
                            }`}
                          />
                        )}

                        {/* Step Icon Node */}
                        <div
                          className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 transition-all duration-300 ${
                            isCompleted
                              ? "border-emerald-500 bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                              : isCurrent
                              ? "border-brandRed bg-brandRed text-white shadow-[0_0_16px_rgba(211,47,47,0.4)] scale-110"
                              : "border-slate-200 bg-white text-slate-400"
                          }`}
                        >
                          <StepIcon size={17} />
                        </div>

                        <div>
                          <h3
                            className={`text-xs font-bold ${
                              isCurrent ? "text-brandRed" : isCompleted ? "text-slate-800" : "text-slate-400"
                            }`}
                          >
                            {step.label}
                          </h3>
                          <p className="mt-0.5 text-[11px] text-slate-500 md:max-w-[130px] leading-tight">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery ETA & Drop Location Highlight Banner */}
              <div className="p-4 rounded-2xl bg-[#FFF9F6] border border-brandRed/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin size={17} className="text-brandRed shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Deliver To Hostel:</span>
                    <span className="text-slate-600">{order.delivery_address}</span>
                  </div>
                </div>

                <div className="text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                  <span className="text-[11px] text-slate-400 block font-medium">Estimated Arrival</span>
                  <span className="font-extrabold text-brandRed">Within 30–45 mins</span>
                </div>
              </div>
            </div>

            {/* Items in this Order Card */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag size={17} className="text-brandRed" />
                  <span>Items in this Parcel ({orderItems.length})</span>
                </h3>
                <span className="text-xs font-bold text-slate-800">
                  Total: ₹{Number(order.total_amount || 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {orderItems.map((item, idx) => (
                  <div key={item.id || idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden grid place-items-center">
                        {item.product_image ? (
                          <img src={item.product_image} alt={item.product_title} className="h-full w-full object-cover" />
                        ) : (
                          <Package size={18} className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block text-xs">{item.product_title || "Campus Fashion Apparel"}</span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>Size: <strong className="text-slate-700">{item.size || "M"}</strong></span>
                          <span>Color: <strong className="text-slate-700">{item.color || "Standard"}</strong></span>
                          <span>Qty: <strong className="text-brandRed">{item.quantity || 1}</strong></span>
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{(item.total_price || (Number(item.unit_price || 0) * Number(item.quantity || 1))).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── If No Order Tracked yet (Default Landing View) ─────────────── */}
        {!loading && !order && (
          <div className="space-y-6">
            <div className="bg-white rounded-[28px] p-8 text-center border border-slate-200/80 shadow-xs space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-red-50 text-brandRed flex items-center justify-center">
                <Truck size={28} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Track Your Campus Clothing Parcel</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Enter your order number above to watch your package move in real-time from the SeroFast warehouse to your hostel room.
                </p>
              </div>
            </div>

            {/* Quick Demo Orders to Test Real-Time Sync */}
            {recentOrders.length > 0 && (
              <div className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select a Sample Order to Test Live Tracking:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {recentOrders.map((ord) => (
                    <button
                      key={ord.id}
                      type="button"
                      onClick={() => navigate(`/track/${ord.order_number || ord.id}`)}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-brandRed hover:bg-red-50/40 text-left transition cursor-pointer"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 block font-mono">
                          #{ord.order_number}
                        </span>
                        <span className="text-[11px] text-slate-500 font-normal">
                          {ord.customer_name || "Hostel Resident"} · ₹{ord.total_amount}
                        </span>
                      </div>
                      <span className="text-[10.5px] font-bold text-brandRed bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {ord.order_status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
