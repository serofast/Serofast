import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  ShoppingBag,
  Package,
  UsersRound,
  Plus,
  QrCode,
  Share2,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { initialSellerOrders, initialSellerProducts, initialSellerStore } from "../../data/sellerData";

export default function SellerDashboardPage() {
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
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {initialSellerStore.ownerName}! 👋
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Here is your live store performance for <strong className="text-slate-800">{initialSellerStore.name}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/seller/products"
            className="flex items-center gap-2 rounded-xl bg-brandRed px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brandRed/20 hover:bg-[#b81b1f] hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </Link>
          <Link
            to="/seller/settings"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-brandRed hover:text-brandRed transition-all active:scale-95"
          >
            <QrCode size={16} />
            <span>QR Banner</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-brandRed/30 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today&apos;s Revenue</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900">₹{totalRevenue.toLocaleString("en-IN")}</div>
          <span className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <TrendingUp size={12} /> 100% Retained (0% Commission)
          </span>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-brandRed/30 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Orders</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-brandRed">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900">{orders.length} Orders</div>
          <span className="mt-1 text-[11px] text-slate-500 font-medium">3 Pending Dispatch</span>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-brandRed/30 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Catalog</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Package size={20} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900">{initialSellerProducts.length} Items</div>
          <span className="mt-1 text-[11px] text-emerald-600 font-bold">3 In Stock / 1 Out</span>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-brandRed/30 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Referrals</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-50 text-purple-600">
              <UsersRound size={20} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900">2 Promoters</div>
          <span className="mt-1 text-[11px] text-purple-600 font-bold">Alex &amp; Rohan campus links</span>
        </div>
      </div>

      {/* Live Order Queue */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Live Customer Orders</h3>
            <p className="text-xs text-slate-500 font-medium">Manage incoming orders and update delivery dispatch states.</p>
          </div>
          <Link to="/seller/orders" className="text-xs font-bold text-brandRed hover:underline flex items-center gap-1">
            <span>View All Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-white hover:shadow-xs"
            >
              <div className="flex items-start gap-3.5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brandRed/10 text-brandRed font-bold text-xs">
                  #
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">{order.id}</span>
                    <span className="text-xs font-bold text-slate-700">• {order.customerName}</span>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{order.address}</p>
                  <div className="mt-1 text-[11px] font-medium text-slate-400">
                    Ordered: {order.orderedAt} | Promoted by: <strong className="text-purple-600">{order.studentPartner}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900">₹{order.totalAmount}</div>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      order.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.status === "Dispatched"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-800 animate-pulse"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Status Transition Actions */}
                {order.status === "Pending" && (
                  <button
                    type="button"
                    onClick={() => updateOrderStatus(order.id, "Packing")}
                    className="rounded-xl bg-brandRed px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-brandRedDark transition"
                  >
                    Accept Order
                  </button>
                )}
                {order.status === "Packing" && (
                  <button
                    type="button"
                    onClick={() => updateOrderStatus(order.id, "Dispatched")}
                    className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                  >
                    Dispatch Runner
                  </button>
                )}
                {order.status === "Dispatched" && (
                  <button
                    type="button"
                    onClick={() => updateOrderStatus(order.id, "Delivered")}
                    className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                  >
                    Mark Delivered
                  </button>
                )}
                {order.status === "Delivered" && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 size={16} /> Completed
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
