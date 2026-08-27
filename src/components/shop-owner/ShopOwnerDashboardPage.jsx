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
  Coins,
} from "lucide-react";
import Logo from "../reusable/Logo";
import { ProgressCircle } from "../admin/shared/ui";
import { fetchShopOrders, updateOrderStatusInSupabase } from "../../lib/supabase";

export default function ShopOwnerDashboardPage() {
  const [activeShop, setActiveShop] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let sId = null;
    try {
      const storedOwner = localStorage.getItem("serofast_current_owner");
      const ownerObj = storedOwner ? JSON.parse(storedOwner) : null;
      const storedShop = localStorage.getItem("serofast_active_shop");

      if (storedShop && ownerObj) {
        const parsed = JSON.parse(storedShop);
        const isMatch =
          (parsed.owner_id && ownerObj.id && String(parsed.owner_id) === String(ownerObj.id)) ||
          (parsed.owner_email && ownerObj.email && parsed.owner_email.toLowerCase() === ownerObj.email.toLowerCase());

        if (isMatch) {
          setActiveShop(parsed);
          sId = parsed.id;
          setOrders(parsed.orders || []);
        } else {
          localStorage.removeItem("serofast_active_shop");
          setActiveShop(null);
          setOrders([]);
        }
      } else {
        localStorage.removeItem("serofast_active_shop");
        setActiveShop(null);
        setOrders([]);
      }
    } catch (e) {
      console.warn("Storage read error", e);
    }

    if (sId) {
      (async () => {
        try {
          const liveOrders = await fetchShopOrders(sId);
          if (liveOrders && liveOrders.length > 0) {
            setOrders(liveOrders);
          }
        } catch {}
      })();
    }
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder?.rawId) {
      await updateOrderStatusInSupabase(targetOrder.rawId, newStatus);
    }
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
          <span className="mt-2 font-sansation text-[32px] sm:text-[36px] font-normal tracking-[-0.5px] text-brandRed leading-none">
            SEROFAST
          </span>
        </div>

        <div className="h-6" />

        {/* Flutter-styled Create Your Shop First Card */}
        <div className="w-full max-w-[440px] rounded-[35px] bg-white border border-[#F3E5E5] px-6 py-8 sm:px-8 sm:py-9 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] text-center transition-all duration-300">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-brandRed mb-5 border border-rose-100/80 shadow-2xs">
            <Store size={30} />
          </div>

          <h2 className="text-2xl sm:text-[28px] font-extrabold text-brandRed tracking-tight">
            Create Your Shop First
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed px-1">
            Welcome to SeroFast! You haven't set up your campus store yet. Please complete the quick shop creation form to unlock your inventory, orders, payouts, and settings.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Link
              to="/create-shop/basic"
              className="inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-brandRed px-6 text-sm sm:text-base font-bold text-white shadow-md shadow-brandRed/25 hover:bg-brandRedDark active:scale-[0.98] transition cursor-pointer"
            >
              <Store size={20} /> Create My Shop Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // SHOP EXISTS: DASHBOARD OVERVIEW
  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation w-full pb-6">
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
            to="/shop-owner/settings"
            className="flex-1 sm:flex-initial h-10 flex items-center justify-center gap-1.5 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition"
          >
            <Store size={15} />
            <span>Shop Settings</span>
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

      {/* KPI Metrics Cards with Circular Diagrams */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] min-w-0 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Revenue</span>
            <div className="mt-1 text-2xl font-normal text-slate-900">₹{totalRevenue.toLocaleString("en-IN")}</div>
            <span className="mt-0.5 text-[10px] text-brandRed font-normal block">100% Direct</span>
          </div>
          <ProgressCircle percentage={100} color="#D32F2F" size={48} label="100%" />
        </div>

        <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] min-w-0 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Orders</span>
            <div className="mt-1 text-2xl font-normal text-slate-900">{orders.length}</div>
            <span className="mt-0.5 text-[10px] text-slate-500 font-normal block">
              {pendingOrdersCount > 0 ? `${pendingOrdersCount} Pending` : "0 Pending"}
            </span>
          </div>
          <ProgressCircle percentage={orders.length > 0 ? Math.round(((orders.length - pendingOrdersCount) / orders.length) * 100) : 100} color="#059669" size={48} />
        </div>

        <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] min-w-0 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Products</span>
            <div className="mt-1 text-2xl font-normal text-slate-900">{productsCount}</div>
            <span className="mt-0.5 text-[10px] text-brandRed font-normal block">{productsCount} Active</span>
          </div>
          <ProgressCircle percentage={productsCount > 0 ? 85 : 0} color="#0284C7" size={48} />
        </div>

        <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] min-w-0 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Promoters</span>
            <div className="mt-1 text-2xl font-normal text-slate-900">0</div>
            <span className="mt-0.5 text-[10px] text-slate-500 font-normal block">0 Referrals</span>
          </div>
          <ProgressCircle percentage={0} color="#9CA3AF" size={48} label="0%" />
        </div>
      </div>

      {/* Live Customer Orders Container */}
      <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-normal text-slate-800">Live Customer Orders</h3>
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
                    <span className="font-medium text-slate-900">{order.id}</span>
                    <span
                      className={`sm:hidden rounded-full px-2.5 py-0.5 text-[10px] font-normal ${
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
                  <span className="font-normal text-slate-800">{order.customerName}</span>
                  <span className="text-slate-500 font-normal text-[11px] truncate">{order.address}</span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200/60">
                  <span className="font-semibold text-slate-900 text-sm sm:text-xs">₹{order.totalAmount}</span>
                  <span
                    className={`hidden sm:inline-block rounded-full px-2.5 py-0.5 text-[10px] font-normal ${
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
                    <span className="text-xs text-brandRed font-normal flex items-center gap-1">
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
