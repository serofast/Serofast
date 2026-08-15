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
  Sparkles,
} from "lucide-react";
import { initialSellerOrders, initialSellerProducts, initialSellerStore } from "../../data/sellerData";

export default function ShopOwnerDashboardPage() {
  const [orders, setOrders] = useState(initialSellerOrders);
  const [activeShop, setActiveShop] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("serofast_active_shop");
      if (stored) {
        setActiveShop(JSON.parse(stored));
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
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const currentStoreName = activeShop?.name || initialSellerStore.name;

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in font-sans">
      {/* Create Shop Banner for New Users */}
      {!activeShop && (
        <div className="rounded-2xl border border-brandRed/20 bg-gradient-to-r from-promoHighlight via-white to-white p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 max-w-xl">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brandRed text-white shadow-md shadow-brandRed/20">
                <Store size={20} />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brandRed">
                  <Sparkles size={12} /> Store Setup Required
                </span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                  Create Your Campus Shop in 4 Simple Steps
                </h2>
                <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
                  Set up your store name, logo, products, and details on our standalone page to unlock digital shop ownership &amp; Supabase database sync.
                </p>
              </div>
            </div>

            <Link
              to="/create-shop"
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-brandRed px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition shrink-0 w-full sm:w-auto"
            >
              <span>Create Shop</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Store performance for <strong className="text-slate-700 font-semibold">{currentStoreName}</strong>.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/create-shop"
            className="flex-1 sm:flex-initial min-h-[40px] flex items-center justify-center gap-1.5 rounded-lg bg-brandRed px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition"
          >
            <Plus size={14} />
            <span>Add Shop</span>
          </Link>
          <Link
            to="/shop-owner/settings"
            className="flex-1 sm:flex-initial min-h-[40px] flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 transition"
          >
            <QrCode size={14} />
            <span>QR Code</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Revenue</span>
            <DollarSign size={16} className="text-emerald-600" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">₹{totalRevenue.toLocaleString("en-IN")}</div>
          <span className="mt-0.5 text-[11px] text-emerald-600 font-medium">100% Direct Retained</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Orders</span>
            <ShoppingBag size={16} className="text-slate-700" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">{orders.length}</div>
          <span className="mt-0.5 text-[11px] text-slate-500 font-normal">3 Pending dispatch</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Products</span>
            <Package size={16} className="text-blue-600" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">{initialSellerProducts.length}</div>
          <span className="mt-0.5 text-[11px] text-emerald-600 font-medium">3 In Stock</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Promoters</span>
            <UsersRound size={16} className="text-purple-600" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">2</div>
          <span className="mt-0.5 text-[11px] text-purple-600 font-medium">Active referrals</span>
        </div>
      </div>

      {/* Live Customer Orders */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Live Customer Orders</h3>
          <Link to="/shop-owner/orders" className="text-xs font-medium text-brandRed hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{order.id}</span>
                  <span
                    className={`sm:hidden rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      order.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.status === "Dispatched"
                        ? "bg-blue-100 text-blue-700"
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
                  className={`hidden sm:inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    order.status === "Delivered"
                      ? "bg-emerald-100 text-emerald-700"
                      : order.status === "Dispatched"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {order.status}
                </span>

                {order.status === "Pending" && (
                  <button
                    type="button"
                    onClick={() => updateOrderStatus(order.id, "Packing")}
                    className="min-h-[36px] rounded-lg bg-brandRed px-3 py-1.5 text-xs font-semibold text-white hover:bg-brandRedDark transition"
                  >
                    Accept
                  </button>
                )}
                {order.status === "Packing" && (
                  <button
                    type="button"
                    onClick={() => updateOrderStatus(order.id, "Dispatched")}
                    className="min-h-[36px] rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                  >
                    Dispatch
                  </button>
                )}
                {order.status === "Dispatched" && (
                  <button
                    type="button"
                    onClick={() => updateOrderStatus(order.id, "Delivered")}
                    className="min-h-[36px] rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                  >
                    Deliver
                  </button>
                )}
                {order.status === "Delivered" && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 size={14} /> Delivered
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
