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
    <div className="space-y-6 animate-fade-in font-sans">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Orders</h1>
        <p className="text-xs text-slate-500 font-normal mt-1">Track incoming orders and update fulfillment status in real-time.</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              activeTab === tab
                ? "bg-brandRed text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 hover:border-slate-300 transition"
          >
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{order.id}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                  {order.paymentMethod} ({order.paymentStatus})
                </span>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <UserCheck size={14} className="text-brandRed" /> {order.customerName}
                </span>
                <p className="text-slate-500 flex items-center gap-1 font-normal">
                  <Phone size={13} /> {order.phone}
                </p>
                <p className="text-slate-500 flex items-center gap-1 font-normal">
                  <MapPin size={13} /> {order.address}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-normal">Student Promoter Link:</span>
                <p className="font-semibold text-purple-600">{order.studentPartner}</p>
                <p className="text-slate-400 font-normal">Order Placed: {order.orderedAt}</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs font-semibold text-slate-800">
                  <span>{item.qty}x {item.name}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-slate-200 pt-2 text-xs font-bold text-slate-900">
                <span>Total Amount Kept by You</span>
                <span className="text-brandRed text-sm">₹{order.totalAmount}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              {order.status === "Pending" && (
                <button
                  type="button"
                  onClick={() => updateStatus(order.id, "Dispatched")}
                  className="rounded-xl bg-brandRed px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brandRedDark transition"
                >
                  Accept &amp; Dispatch Student Runner
                </button>
              )}
              {order.status === "Dispatched" && (
                <button
                  type="button"
                  onClick={() => updateStatus(order.id, "Delivered")}
                  className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                >
                  Mark Order Delivered
                </button>
              )}
              {order.status === "Delivered" && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={15} /> Order Completed Successfully
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
