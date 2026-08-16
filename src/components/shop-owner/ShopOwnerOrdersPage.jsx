import { useState } from "react";
import { CheckCircle2, MapPin, Phone, UserCheck, ShoppingBag, Truck, Send, BellRing } from "lucide-react";
import { initialSellerOrders } from "../../data/sellerData";
import { AppFormButton, AppFormCard } from "../reusable/form";

export default function ShopOwnerOrdersPage() {
  const [orders, setOrders] = useState(initialSellerOrders);
  const [activeTab, setActiveTab] = useState("All");

  const notifyShipping = (id) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Shipped", notifiedAt: "Just now" } : o))
    );
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
    { label: "All Orders", value: "All" },
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
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Review shipped products and notify SeroFast when new orders are ready for shipping.
        </p>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Shipped Count */}
        <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Shipped Orders</span>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{shippedCount} Shipped</div>
            <p className="text-[11px] text-slate-400 font-normal mt-0.5">Dispatched to customers via SeroFast</p>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-brandRed shrink-0">
            <Truck size={24} />
          </div>
        </div>

        {/* Needs Notification */}
        <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Awaiting Shipping Notification</span>
            <div className="text-2xl sm:text-3xl font-bold text-brandRed mt-1">
              {needsNotificationCount} Orders
            </div>
            <p className="text-[11px] text-brandRed font-medium mt-0.5">
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
            className={`h-10 rounded-[30px] px-5 text-xs font-medium shrink-0 transition-all duration-200 cursor-pointer ${
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
      {filteredOrders.length === 0 ? (
        <div className="w-full rounded-[35px] bg-white border border-[#F3E5E5] p-8 text-center shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]">
          <ShoppingBag className="mx-auto text-slate-300 mb-2" size={36} />
          <p className="text-sm font-semibold text-slate-700">No Orders Found</p>
          <p className="text-xs text-slate-400 mt-1">There are no orders matching this view right now.</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-900 flex items-center gap-1.5 text-sm">
                      <UserCheck size={15} className="text-brandRed" /> {order.customerName}
                    </span>
                    <p className="text-slate-500 flex items-center gap-1.5 font-normal">
                      <Phone size={13} /> {order.phone}
                    </p>
                    <p className="text-slate-500 flex items-center gap-1.5 font-normal">
                      <MapPin size={13} /> {order.address}
                    </p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-slate-400 font-normal">Student Referral:</span>
                    <p className="font-medium text-slate-700">{order.studentPartner}</p>
                    <p className="text-slate-400">Order Date: {order.orderedAt}</p>
                  </div>
                </div>

                <div className="rounded-[24px] bg-[#FAF8F5] p-4 space-y-2 text-xs border border-slate-100">
                  {order.items.map((item, idx) => (
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

                <div className="flex justify-end pt-1">
                  {!isShipped ? (
                    <AppFormButton
                      type="button"
                      icon={Send}
                      onClick={() => notifyShipping(order.id)}
                      className="w-full sm:w-auto px-6"
                    >
                      Notify SeroFast for Shipping
                    </AppFormButton>
                  ) : (
                    <span className="text-xs font-semibold text-brandRed flex items-center gap-1.5">
                      <CheckCircle2 size={16} /> Notified for Shipping (Dispatched)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
