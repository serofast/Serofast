import { useState, useEffect } from "react";
import {
  CheckCircle2,
  MapPin,
  Phone,
  UserCheck,
  ShoppingBag,
  Truck,
  Eye,
  X,
  Loader2,
  Package,
  Clock,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { fetchShopOrders } from "../../lib/supabase";

export default function ShopOwnerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeShopId, setActiveShopId] = useState(null);

  useEffect(() => {
    let sId = null;
    try {
      const storedOwner = localStorage.getItem("serofast_current_owner");
      const ownerObj = storedOwner ? JSON.parse(storedOwner) : null;
      const active = localStorage.getItem("serofast_active_shop");
      if (active && ownerObj) {
        const parsed = JSON.parse(active);
        const isMatch =
          (parsed.owner_id && ownerObj.id && String(parsed.owner_id) === String(ownerObj.id)) ||
          (parsed.owner_email && ownerObj.email && parsed.owner_email.toLowerCase() === ownerObj.email.toLowerCase());

        if (isMatch) sId = parsed.id;
      }
    } catch (e) {
      console.warn(e);
    }
    setActiveShopId(sId);

    (async () => {
      setLoading(true);
      try {
        const data = await fetchShopOrders(sId);
        setOrders(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const deliveredCount = orders.filter((o) => {
    const s = String(o.status || "").toLowerCase();
    return s === "delivered" || s === "completed";
  }).length;

  const inTransitCount = orders.filter((o) => {
    const s = String(o.status || "").toLowerCase();
    return s === "shipped" || s === "dispatched" || s === "out_for_delivery" || s === "in transit";
  }).length;

  const packingCount = orders.filter((o) => {
    const s = String(o.status || "").toLowerCase();
    return s === "pending" || s === "packing" || s === "order_placed" || s === "order placed";
  }).length;

  const filteredOrders = orders.filter((o) => {
    const s = String(o.status || "").toLowerCase();
    if (activeTab === "In Transit") {
      return s === "shipped" || s === "dispatched" || s === "out_for_delivery" || s === "in transit";
    }
    if (activeTab === "Delivered") {
      return s === "delivered" || s === "completed";
    }
    if (activeTab === "Packing") {
      return s === "pending" || s === "packing" || s === "order_placed" || s === "order placed";
    }
    return true;
  });

  const tabs = [
    { label: "All Orders", value: "All" },
    { label: `Delivered (${deliveredCount})`, value: "Delivered" },
    { label: `In Transit (${inTransitCount})`, value: "In Transit" },
    { label: `In Warehouse (${packingCount})`, value: "Packing" },
  ];

  const getStatusBadge = (statusStr) => {
    const s = String(statusStr || "").toUpperCase();
    if (s.includes("DELIVERED") || s.includes("COMPLETED")) {
      return { label: "Delivered", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: ShieldCheck };
    }
    if (s.includes("OUT_FOR_DELIVERY") || s.includes("SHIPPED") || s.includes("DISPATCHED")) {
      return { label: "In Transit / Dispatched", bg: "bg-blue-50 text-blue-700 border-blue-200", icon: Truck };
    }
    return { label: "Packing in Central Hub", bg: "bg-amber-50 text-amber-800 border-amber-200", icon: Package };
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation w-full pb-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
            Orders &amp; Fulfillment Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Live real-time feed of customer purchases for your apparel listings
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-semibold">
          <Building2 size={13} className="text-brandRed" />
          <span>Fulfillment Managed by SeroFast Central Warehouse</span>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Delivered Count */}
        <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.14)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Completed Deliveries</span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1">{deliveredCount} Orders</div>
            <p className="text-[10px] text-slate-400 font-normal mt-0.5">Payout credited to wallet (₹30/dress)</p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
            <CheckCircle2 size={24} />
          </div>
        </div>

        {/* In Transit */}
        <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.14)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Dispatched / In Transit</span>
            <div className="text-xl sm:text-2xl font-bold text-blue-700 mt-1">{inTransitCount} Orders</div>
            <p className="text-[10px] text-slate-400 font-normal mt-0.5">Campus riders en route to hostels</p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 shrink-0">
            <Truck size={24} />
          </div>
        </div>

        {/* Warehouse Packing */}
        <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.14)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Warehouse Packing</span>
            <div className="text-xl sm:text-2xl font-bold text-brandRed mt-1">{packingCount} Orders</div>
            <p className="text-[10px] text-slate-400 font-normal mt-0.5">Under verification in central hub</p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-brandRed shrink-0">
            <Package size={24} />
          </div>
        </div>
      </div>

      {/* Pill Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`h-10 rounded-[30px] px-3.5 sm:px-5 text-[11px] sm:text-xs font-medium shrink-0 transition-all duration-200 cursor-pointer ${
              activeTab === tab.value
                ? "bg-brandRed text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] font-semibold"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-[#E5E7EB]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
          <Loader2 size={32} className="animate-spin text-brandRed" />
          <span className="text-xs font-normal">Fetching real-time orders from Supabase...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="w-full rounded-[35px] bg-white border border-[#F3E5E5] p-8 text-center shadow-[-4px_5px_10px_rgba(211,47,47,0.24)]">
          <ShoppingBag className="mx-auto text-slate-300 mb-2" size={36} />
          <p className="text-sm font-semibold text-slate-700">No Orders Found</p>
          <p className="text-xs text-slate-400 mt-1">There are no customer orders in this view.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={order.id}
                className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 sm:p-7 shadow-[-4px_5px_10px_rgba(211,47,47,0.24)] space-y-4 transition-all duration-200"
              >
                <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{order.id}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-0.5 text-[11px] font-normal text-slate-600">
                      {order.paymentMethod || "Prepaid"}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${badge.bg}`}
                  >
                    <BadgeIcon size={13} />
                    <span>{badge.label}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5 text-sm">
                      <UserCheck size={15} className="text-brandRed" /> {order.customerName || "Campus Student"}
                    </span>
                    <p className="text-slate-500 flex items-center gap-1.5 font-normal">
                      <Phone size={13} /> {order.phone || "+91 99887 76655"}
                    </p>
                    <p className="text-slate-500 flex items-center gap-1.5 font-normal">
                      <MapPin size={13} /> {order.address || "Main Campus Hostel"}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-slate-400 font-normal">Fulfillment Hub:</span>
                    <p className="font-medium text-slate-700">SeroFast Central Warehouse</p>
                    <p className="text-slate-400">Order Date: {order.orderedAt || "Recent"}</p>
                  </div>
                </div>

                <div className="rounded-[24px] bg-[#FAF8F5] p-4 space-y-2 text-xs border border-slate-100">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 font-medium text-slate-700">
                      <span className="min-w-0 flex-1">{item.qty || 1}x {item.name || item.title || "Apparel Item"}</span>
                      <span className="shrink-0 font-semibold">₹{item.price || item.unit_price || 0}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-slate-200/60 pt-2 font-bold text-slate-900 text-sm">
                    <span>Order Value</span>
                    <span className="text-brandRed">₹{order.totalAmount || 0}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-brandRed transition font-semibold cursor-pointer"
                  >
                    <Eye size={14} /> View Order Breakdown
                  </button>

                  <span className="text-[11px] text-slate-400">
                    Auto-synced with Central Dispatch
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal (View Only) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in font-sans font-sansation">
          <div className="w-full max-w-lg max-h-[88vh] rounded-[32px] sm:rounded-[35px] bg-white border border-[#F3E5E5] p-5 sm:p-7 shadow-[0_20px_50px_rgba(211,47,47,0.25)] flex flex-col space-y-4 relative animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-normal text-brandRed tracking-tight">Order Invoice &amp; Details</h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">Order ID: {selectedOrder.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
              {/* Customer details */}
              <div className="bg-[#FAF8F5] p-4 rounded-[22px] border border-[#F3E5E5] space-y-2">
                <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Customer Drop Details</span>
                <div className="flex justify-between font-medium text-slate-900 text-sm">
                  <span>{selectedOrder.customerName || "Hostel Resident"}</span>
                  <span className="text-xs text-slate-500 font-normal">{selectedOrder.phone}</span>
                </div>
                <p className="text-slate-600 flex items-start gap-1">
                  <MapPin size={14} className="text-brandRed shrink-0 mt-0.5" />
                  <span>{selectedOrder.address || "Main Campus Hostel"}</span>
                </p>
              </div>

              {/* Items Breakdown */}
              <div className="bg-slate-50 p-4 rounded-[22px] border border-slate-100 space-y-2">
                <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Ordered Items</span>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-800">
                    <span>{item.qty || 1}x {item.name || item.title || "Apparel Item"}</span>
                    <span className="font-semibold">₹{item.price || item.unit_price || 0}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Order Amount</span>
                  <span className="text-brandRed">₹{selectedOrder.totalAmount || 0}</span>
                </div>
              </div>

              {/* Fulfillment Status Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-center gap-2.5">
                <Package size={18} className="text-amber-700 shrink-0" />
                <span>
                  <strong>Warehouse Fulfillment:</strong> Packaging, courier dispatch, and final hostel delivery are handled by SeroFast Admin. Your earnings (₹30/dress) are credited upon delivery.
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-full h-11 rounded-[30px] border border-[#E5E7EB] bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
