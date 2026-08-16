import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  ShoppingBag,
  Package,
  UsersRound,
  Plus,
  QrCode,
  CheckCircle2,
  ArrowRight,
  Store,
} from "lucide-react";
import Logo from "../reusable/Logo";

export default function ShopOwnerDashboardPage() {
  const [activeShop, setActiveShop] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("serofast_active_shop");
      if (stored) {
        const parsed = JSON.parse(stored);
        setActiveShop(parsed);
        setOrders(parsed.orders || []);
      }
    } catch (e) {
      console.warn("Storage read error", e);
    }
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;
  const productsCount = activeShop?.selectedProducts?.length || 0;
  const currentStoreName = activeShop?.name || "Your Campus Shop";

  // IF THE USER LOGGED IN AND HAS NO SHOP: SHOW ONLY "CREATE SHOP TO CONTINUE" CARD
  if (!activeShop) {
    return (
      <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-6 px-4 font-sans font-sansation">
        {/* Animated Logo Stack */}
        <div className="flex flex-col items-center justify-center text-center">
          <Logo size={64} iconClassName="drop-shadow-xs" />
          <span className="mt-2 font-sansation text-[32px] sm:text-[36px] font-semibold tracking-[-0.5px] text-brandRed leading-none">
            SEROFAST
          </span>
        </div>

        <div className="h-6" />

        {/* Flutter-styled Create Shop Card */}
        <div className="w-full max-w-[440px] rounded-[35px] bg-white border border-[#F3E5E5] px-6 py-8 sm:px-8 sm:py-9 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] text-center transition-all duration-300">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-50 text-brandRed mb-4 border border-rose-100">
            <Store size={28} />
          </div>

          <h2 className="text-2xl font-semibold text-brandRed tracking-tight">
            No Shop Found
          </h2>

          <p className="mt-2 text-sm text-slate-500 font-normal leading-relaxed">
            You haven't set up your store yet. Create your campus shop to continue and unlock your seller workspace.
          </p>

          <div className="h-6" />

          {/* Primary Action Button */}
          <Link
            to="/create-shop"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[30px] bg-brandRed text-[15px] font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] transition hover:bg-brandRedDark active:scale-[0.98]"
          >
            <span>Create Shop to Continue</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  // SHOP EXISTS: DASHBOARD OVERVIEW
  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
            Overview
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Store performance metrics for <span className="text-slate-800 font-medium">{currentStoreName}</span>.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/create-shop"
            className="flex-1 sm:flex-initial h-10 flex items-center justify-center gap-1.5 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition"
          >
            <Plus size={15} />
            <span>Add Shop</span>
          </Link>
          <Link
            to="/shop-owner/settings"
            className="flex-1 sm:flex-initial h-10 flex items-center justify-center gap-1.5 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium text-slate-700 hover:border-slate-300 transition"
          >
            <QrCode size={15} />
            <span>QR Code</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Revenue</span>
            <DollarSign size={18} className="text-brandRed" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">₹{totalRevenue.toLocaleString("en-IN")}</div>
          <span className="mt-0.5 text-[11px] text-brandRed font-medium block">100% Direct Retained</span>
        </div>

        <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Orders</span>
            <ShoppingBag size={18} className="text-slate-700" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{orders.length}</div>
          <span className="mt-0.5 text-[11px] text-slate-500 font-normal block">
            {pendingOrdersCount > 0 ? `${pendingOrdersCount} Pending dispatch` : "0 Pending orders"}
          </span>
        </div>

        <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Products</span>
            <Package size={18} className="text-brandRed" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{productsCount}</div>
          <span className="mt-0.5 text-[11px] text-brandRed font-medium block">{productsCount} In Stock</span>
        </div>

        <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Promoters</span>
            <UsersRound size={18} className="text-slate-700" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">0</div>
          <span className="mt-0.5 text-[11px] text-slate-500 font-normal block">0 Active referrals</span>
        </div>
      </div>

      {/* Live Customer Orders Container */}
      <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-semibold text-slate-900">Live Customer Orders</h3>
          <Link to="/shop-owner/orders" className="text-xs font-normal text-brandRed hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-slate-200 rounded-[24px] bg-[#FAF8F5]">
            <ShoppingBag className="mx-auto text-slate-300 mb-2" size={34} />
            <p className="text-xs font-medium text-slate-600">No Orders Yet</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto font-normal">Incoming campus orders will appear here in real-time once customers start placing orders.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[24px] border border-slate-100 bg-[#FAF8F5] p-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{order.id}</span>
                    <span
                      className={`sm:hidden rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        order.status === "Delivered"
                          ? "bg-rose-100 text-brandRed"
                          : order.status === "Dispatched"
                          ? "bg-rose-100 text-brandRed"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <span className="font-medium text-slate-800">{order.customerName}</span>
                  <span className="text-slate-500 font-normal text-[11px] truncate">{order.address}</span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200/60">
                  <span className="font-bold text-slate-900 text-sm sm:text-xs">₹{order.totalAmount}</span>
                  <span
                    className={`hidden sm:inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      order.status === "Delivered"
                        ? "bg-rose-100 text-brandRed"
                        : order.status === "Dispatched"
                        ? "bg-rose-100 text-brandRed"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {order.status}
                  </span>

                  {order.status === "Pending" && (
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, "Packing")}
                      className="h-9 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(211,47,47,0.3)] hover:bg-brandRedDark transition active:scale-95 cursor-pointer"
                    >
                      Accept
                    </button>
                  )}
                  {order.status === "Packing" && (
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, "Dispatched")}
                      className="h-9 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(211,47,47,0.3)] hover:bg-brandRedDark transition active:scale-95 cursor-pointer"
                    >
                      Dispatch
                    </button>
                  )}
                  {order.status === "Dispatched" && (
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order.id, "Delivered")}
                      className="h-9 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(211,47,47,0.3)] hover:bg-brandRedDark transition active:scale-95 cursor-pointer"
                    >
                      Deliver
                    </button>
                  )}
                  {order.status === "Delivered" && (
                    <span className="text-xs text-brandRed font-medium flex items-center gap-1">
                      <CheckCircle2 size={14} /> Delivered
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
