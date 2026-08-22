import { useState, useEffect } from "react";
import { CheckCircle2, MapPin, Phone, UserCheck, ShoppingBag, Truck, Send, BellRing, Eye, X, Loader2 } from "lucide-react";
import { fetchShopOrders, updateOrderStatusInSupabase } from "../../lib/supabase";

export default function ShopOwnerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeShopId, setActiveShopId] = useState(null);

  useEffect(() => {
    let sId = null;
    try {
      const active = localStorage.getItem("serofast_active_shop");
      if (active) sId = JSON.parse(active).id;
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

  const notifyShipping = async (order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: "Shipped", notifiedAt: "Just now" } : o))
    );
    if (order.rawId) {
      await updateOrderStatusInSupabase(order.rawId, "Shipped");
    }
  };

  const shippedCount = orders.filter((o) => o.status === "Shipped" || o.status === "Delivered" || o.status === "Dispatched").length;
  const needsNotificationCount = orders.filter((o) => o.status === "Pending" || o.status === "Packing").length;

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "Needs Shipping") {
      return o.status === "Pending" || o.status === "Packing";
    }
    if (activeTab === "Shipped") {
      return o.status === "Shipped" || o.status === "Dispatched" || o.status === "Delivered";
    }
    return true;
  });

  const tabs = [
    { label: "All", value: "All" },
    { label: `Needs Shipping (${needsNotificationCount})`, value: "Needs Shipping" },
    { label: `Shipped (${shippedCount})`, value: "Shipped" },
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          Shipping &amp; Order Status
        </h1>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Shipped Count */}
        <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Shipped Orders</span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{shippedCount} Shipped</div>
            <p className="text-[10px] text-slate-400 font-normal mt-0.5">Dispatched to customers via SeroFast</p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-brandRed shrink-0">
            <Truck size={24} />
          </div>
        </div>

        {/* Needs Notification */}
        <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Awaiting Shipping Notification</span>
            <div className="text-xl sm:text-2xl font-bold text-brandRed mt-1">
              {needsNotificationCount} Orders
            </div>
            <p className="text-[10px] text-brandRed font-medium mt-0.5">
              {needsNotificationCount > 0 ? "Action required: Notify for shipping" : "All orders notified!"}
            </p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-brandRed shrink-0">
            <BellRing size={24} />
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
          <span className="text-xs font-normal">Fetching orders for your shop from Supabase...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="w-full rounded-[35px] bg-white border border-[#F3E5E5] p-8 text-center shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]">
          <ShoppingBag className="mx-auto text-slate-300 mb-2" size={36} />
          <p className="text-sm font-semibold text-slate-700">No Orders Found</p>
          <p className="text-xs text-slate-400 mt-1">There are no customer orders for this shop right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isShipped = order.status === "Shipped" || order.status === "Dispatched" || order.status === "Delivered";

            return (
              <div
                key={order.id}
                className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 sm:p-7 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4 transition-all duration-200"
              >
                <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{order.id}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-0.5 text-[11px] font-normal text-slate-600">
                      {order.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3.5 py-1 text-xs font-semibold ${
                        isShipped
                          ? "bg-rose-50 border border-rose-100 text-brandRed"
                          : "bg-amber-50 border border-amber-200 text-amber-800"
                      }`}
                    >
                      ● {isShipped ? "Shipped" : "Ready to Notify"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5 text-sm">
                      <UserCheck size={15} className="text-brandRed" /> {order.customerName}
                    </span>
                    <p className="text-slate-500 flex items-center gap-1.5 font-normal">
                      <Phone size={13} /> {order.phone || "No phone provided"}
                    </p>
                    <p className="text-slate-500 flex items-center gap-1.5 font-normal">
                      <MapPin size={13} /> {order.address || "Campus Address"}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-slate-400 font-normal">Student Referral:</span>
                    <p className="font-medium text-slate-700">{order.studentPartner}</p>
                    <p className="text-slate-400">Order Date: {order.orderedAt}</p>
                  </div>
                </div>

                <div className="rounded-[24px] bg-[#FAF8F5] p-4 space-y-2 text-xs border border-slate-100">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 font-medium text-slate-700">
                      <span className="min-w-0 flex-1">{item.qty}x {item.name}</span>
                      <span className="shrink-0 font-semibold">₹{item.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-slate-200/60 pt-2 font-bold text-slate-900 text-sm">
                    <span>Total Retained</span>
                    <span className="text-brandRed">₹{order.totalAmount}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-brandRed transition font-medium"
                  >
                    <Eye size={14} /> View Details
                  </button>

                  {!isShipped ? (
                    <button
                      type="button"
                      onClick={() => notifyShipping(order)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brandRed px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-brandRedDark transition cursor-pointer active:scale-95"
                    >
                      <Send size={13} />
                      <span className="hidden sm:inline">Notify Shipping</span>
                      <span className="sm:hidden">Notify</span>
                    </button>
                  ) : (
                    <span className="text-[11px] sm:text-xs font-semibold text-brandRed flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="shrink-0" /> <span className="hidden sm:inline">Notified for Shipping (Dispatched)</span><span className="sm:hidden">Notified</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
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
                <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Customer Info</span>
                <div className="flex justify-between font-medium text-slate-900 text-sm">
                  <span>{selectedOrder.customerName}</span>
                  <span className="text-xs text-slate-500 font-normal">{selectedOrder.phone}</span>
                </div>
                <p className="text-slate-600 flex items-start gap-1">
                  <MapPin size={14} className="text-brandRed shrink-0 mt-0.5" />
                  <span>{selectedOrder.address}</span>
                </p>
              </div>

              {/* Items Breakdown */}
              <div className="bg-slate-50 p-4 rounded-[22px] border border-slate-100 space-y-2">
                <span className="text-slate-400 block text-[11px] font-semibold uppercase tracking-wider">Ordered Items</span>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-800">
                    <span>{item.qty}x {item.name}</span>
                    <span className="font-semibold">₹{item.price}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Retained Amount</span>
                  <span className="text-brandRed">₹{selectedOrder.totalAmount}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-[18px] border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Payment Method</span>
                  <span className="font-medium text-slate-800 text-xs block mt-0.5">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-[18px] border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Student Referral</span>
                  <span className="font-medium text-slate-800 text-xs block mt-0.5">{selectedOrder.studentPartner}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex-1 h-11 rounded-[30px] border border-[#E5E7EB] bg-white text-xs font-normal text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Close
              </button>
              {selectedOrder.status !== "Shipped" && selectedOrder.status !== "Dispatched" && selectedOrder.status !== "Delivered" && (
                <button
                  type="button"
                  onClick={() => {
                    notifyShipping(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="flex-1 h-11 rounded-[30px] bg-brandRed text-xs font-semibold text-white hover:bg-brandRedDark transition cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(211,47,47,0.3)]"
                >
                  <Send size={15} />
                  <span>Notify Shipping</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
