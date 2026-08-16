import { useState } from "react";
import { CheckCircle2, MapPin, Phone, UserCheck, ShoppingBag } from "lucide-react";
import { initialSellerOrders } from "../../data/sellerData";
import { AppFormButton } from "../reusable/form";

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
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-brandRed tracking-tight">
          Customer Orders
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Track incoming orders and update delivery fulfillment status.
        </p>
      </div>

      {/* Pill Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`h-10 rounded-[30px] px-5 text-xs font-semibold shrink-0 transition-all duration-200 cursor-pointer ${
              activeTab === tab
                ? "bg-brandRed text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)]"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-[#E5E7EB]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="w-full rounded-[35px] bg-white border border-[#F3E5E5] p-8 text-center shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]">
          <ShoppingBag className="mx-auto text-slate-300 mb-2" size={36} />
          <p className="text-sm font-semibold text-slate-700">No Orders Found</p>
          <p className="text-xs text-slate-400 mt-1">There are no {activeTab !== "All" ? activeTab.toLowerCase() : ""} orders to display right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 sm:p-7 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4 transition-all duration-200"
            >
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{order.id}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-0.5 text-[11px] font-medium text-slate-600">
                    {order.paymentMethod}
                  </span>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

              {/* Order fulfillment progress bar */}
              <div className="space-y-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
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
                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span className={order.status === "Pending" ? "text-amber-600" : ""}>Pending</span>
                  <span className={order.status === "Dispatched" ? "text-blue-600" : ""}>Dispatched</span>
                  <span className={order.status === "Delivered" ? "text-emerald-600" : ""}>Delivered</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
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
                  <p className="font-semibold text-purple-600">{order.studentPartner}</p>
                  <p className="text-slate-400">Placed: {order.orderedAt}</p>
                </div>
              </div>

              <div className="rounded-[24px] bg-[#FAF8F5] p-4 space-y-2 text-xs border border-slate-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 font-medium text-slate-700">
                    <span className="min-w-0 flex-1">{item.qty}x {item.name}</span>
                    <span className="shrink-0 font-bold">₹{item.price}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-slate-200/60 pt-2 font-bold text-slate-900 text-sm">
                  <span>Total Retained</span>
                  <span className="text-brandRed">₹{order.totalAmount}</span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                {order.status === "Pending" && (
                  <AppFormButton
                    type="button"
                    onClick={() => updateStatus(order.id, "Dispatched")}
                    className="w-full sm:w-auto px-6"
                  >
                    Dispatch Order
                  </AppFormButton>
                )}
                {order.status === "Dispatched" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(order.id, "Delivered")}
                    className="flex h-12 w-full sm:w-auto items-center justify-center rounded-[30px] bg-emerald-600 px-6 text-[15px] font-semibold text-white shadow-md hover:bg-emerald-700 transition active:scale-[0.98] cursor-pointer"
                  >
                    Mark Delivered
                  </button>
                )}
                {order.status === "Delivered" && (
                  <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> Order Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
