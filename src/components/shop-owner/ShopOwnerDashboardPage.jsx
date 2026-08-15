import { useState } from "react";
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
} from "lucide-react";
import { initialSellerOrders, initialSellerProducts, initialSellerStore } from "../../data/sellerData";

export default function ShopOwnerDashboardPage() {
  const [orders, setOrders] = useState(initialSellerOrders);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const totalRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Store performance for <strong className="text-slate-700 font-semibold">{initialSellerStore.name}</strong>.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/shop-owner/inventory"
            className="flex items-center gap-1.5 rounded-lg bg-brandRed px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition"
          >
            <Plus size={14} />
            <span>Add Product</span>
          </Link>
          <Link
            to="/shop-owner/settings"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 transition"
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
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Live Customer Orders</h3>
          <Link to="/shop-owner/orders" className="text-xs font-medium text-brandRed hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="space-y-2.5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900">{order.id}</span>
                <span className="font-medium text-slate-700">{order.customerName}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-normal">{order.address}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900">₹{order.totalAmount}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
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
                    className="rounded bg-brandRed px-2.5 py-1 text-[11px] font-medium text-white hover:bg-brandRedDark transition"
                  >
                    Accept
                  </button>
                )}
                {order.status === "Packing" && (
                  <button
                    type="button"
                    onClick={() => updateOrderStatus(order.id, "Dispatched")}
                    className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-blue-700 transition"
                  >
                    Dispatch
                  </button>
                )}
                {order.status === "Dispatched" && (
                  <button
                    type="button"
                    onClick={() => updateOrderStatus(order.id, "Delivered")}
                    className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-emerald-700 transition"
                  >
                    Deliver
                  </button>
                )}
                {order.status === "Delivered" && (
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 size={13} /> Done
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
