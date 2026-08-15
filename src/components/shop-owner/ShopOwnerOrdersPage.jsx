import { useState } from "react";
import { CheckCircle2, MapPin, Phone, UserCheck } from "lucide-react";
import { initialSellerOrders } from "../../data/sellerData";

export default function ShopOwnerOrdersPage() {
  const [orders, setOrders] = useState(initialSellerOrders);
  const [activeTab, setActiveTab] = useState("All");

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === activeTab.toLowerCase());

  const tabs = ["All", "Pending", "Dispatched", "Delivered"];

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in font-sans">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Customer Orders</h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">Track incoming orders and update delivery status.</p>
      </div>

      {/* Horizontally Scrollable Touch Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200/80">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-xs font-semibold shrink-0 transition ${
              activeTab === tab
                ? "bg-brandRed text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3 sm:space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{order.id}</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                  {order.paymentMethod}
                </span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  order.status === "Delivered"
                    ? "bg-emerald-100 text-emerald-700"
                    : order.status === "Dispatched"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                ● {order.status}
              </span>
            </div>

            {/* Order fulfillment progress indicator */}
            <div className="space-y-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    order.status === "Delivered"
                      ? "bg-emerald-500"
                      : order.status === "Dispatched"
                      ? "bg-blue-500"
                      : "bg-amber-500"
                  }`}
                  style={{
                    width:
                      order.status === "Delivered"
                        ? "100%"
                        : order.status === "Dispatched"
                        ? "66%"
                        : "33%",
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-medium text-slate-400">
                <span className={order.status === "Pending" ? "text-amber-600" : ""}>Pending</span>
                <span className={order.status === "Dispatched" ? "text-blue-600" : ""}>Dispatched</span>
                <span className={order.status === "Delivered" ? "text-emerald-600" : ""}>Delivered</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <UserCheck size={13} className="text-brandRed" /> {order.customerName}
                </span>
                <p className="text-slate-500 flex items-center gap-1 font-normal text-[11px]">
                  <Phone size={12} /> {order.phone}
                </p>
                <p className="text-slate-500 flex items-center gap-1 font-normal text-[11px]">
                  <MapPin size={12} /> {order.address}
                </p>
              </div>

              <div className="space-y-0.5 text-[11px]">
                <span className="text-slate-400 font-normal">Student Referral:</span>
                <p className="font-medium text-purple-600">{order.studentPartner}</p>
                <p className="text-slate-400">Placed: {order.orderedAt}</p>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 space-y-1 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 font-medium text-slate-700">
                  <span className="min-w-0 flex-1">{item.qty}x {item.name}</span>
                  <span className="shrink-0">₹{item.price}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-slate-200/60 pt-1.5 font-bold text-slate-900">
                <span>Total Retained</span>
                <span className="text-brandRed">₹{order.totalAmount}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-0.5">
              {order.status === "Pending" && (
                <button
                  type="button"
                  onClick={() => updateStatus(order.id, "Dispatched")}
                  className="min-h-[40px] w-full sm:w-auto rounded-xl bg-brandRed px-4 py-2 text-xs font-semibold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition cursor-pointer"
                >
                  Dispatch Order
                </button>
              )}
              {order.status === "Dispatched" && (
                <button
                  type="button"
                  onClick={() => updateStatus(order.id, "Delivered")}
                  className="min-h-[40px] w-full sm:w-auto rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition cursor-pointer"
                >
                  Mark Delivered
                </button>
              )}
              {order.status === "Delivered" && (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Completed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
