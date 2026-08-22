import { useState } from "react";
import {
  Bell,
  ShoppingBag,
  Wallet,
  ShieldCheck,
  Tag,
  Trash2,
  X,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const initialNotifications = [
  {
    id: "notif-1",
    title: "New Order #SF-1043 Received",
    message: "Customer Rahul Sharma placed an order for 2 items (Total ₹799).",
    time: "10 mins ago",
    date: "Today, 10:42 AM",
    type: "order",
    unread: true,
    actionLink: "/shop-owner/orders",
    actionLabel: "View Order",
    details: {
      orderId: "SF-1043",
      customer: "Rahul Sharma",
      itemsCount: 2,
      total: "₹799",
      paymentMethod: "UPI (Paid)",
    },
  },
  {
    id: "notif-2",
    title: "Instant UPI Settlement Credited",
    message: "₹4,497 has been settled to your registered UPI ID (urbanstyles@hdfcbank).",
    time: "2 hours ago",
    date: "Today, 08:30 AM",
    type: "payout",
    unread: true,
    actionLink: "/shop-owner/payouts",
    actionLabel: "View Payouts",
    details: {
      payoutId: "SETTLE-89241",
      amount: "₹4,497",
      upi: "urbanstyles@hdfcbank",
      bank: "HDFC Bank",
    },
  },
  {
    id: "notif-3",
    title: "Campus Promoter Referral Alert",
    message: "Student Partner Priya Verma shared your store link. 5 new student visits recorded.",
    time: "5 hours ago",
    date: "Today, 05:15 AM",
    type: "promoter",
    unread: false,
    details: {
      promoterName: "Priya Verma",
      campus: "Main Campus Hostel B",
      referralVisits: 5,
    },
  },
  {
    id: "notif-4",
    title: "Welcome to SeroFast Platform",
    message: "Your shop account is verified with 0% commission guarantee.",
    time: "1 day ago",
    date: "Yesterday, 02:00 PM",
    type: "system",
    unread: false,
    details: {
      status: "Verified",
      commissionRate: "0%",
      tier: "Gold Campus Merchant",
    },
  },
];

export default function ShopOwnerNotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedNotification, setSelectedNotification] = useState(null);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markSingleRead = (id, e) => {
    e?.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const deleteNotification = (id, e) => {
    e?.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "Unread") return n.unread;
    if (activeFilter === "Orders") return n.type === "order";
    if (activeFilter === "Payouts") return n.type === "payout";
    if (activeFilter === "System") return n.type === "system";
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBag size={18} className="text-brandRed" />;
      case "payout":
        return <Wallet size={18} className="text-emerald-600" />;
      case "promoter":
        return <Tag size={18} className="text-amber-600" />;
      default:
        return <ShieldCheck size={18} className="text-blue-600" />;
    }
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case "order":
        return "bg-rose-50 border-rose-100";
      case "payout":
        return "bg-emerald-50 border-emerald-100";
      case "promoter":
        return "bg-amber-50 border-amber-100";
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <div className="w-full max-w-full min-w-0 overflow-x-hidden space-y-6 animate-fade-in font-sans font-sansation max-w-4xl mx-auto pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
            Notifications &amp; Alerts
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Stay updated with your latest orders, payout settlements, and campus store alerts.
          </p>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="text-xs font-normal text-brandRed hover:underline cursor-pointer self-start sm:self-auto"
        >
          Mark all as read
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none min-w-0 w-full">
        {[
          { id: "All", label: "All" },
          { id: "Unread", label: `Unread (${unreadCount})` },
          { id: "Orders", label: "Orders" },
          { id: "Payouts", label: "Payouts" },
          { id: "System", label: "System" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`h-7 rounded-full px-3 text-xs font-normal shrink-0 transition cursor-pointer ${
              activeFilter === tab.id
                ? "bg-slate-900 text-white font-medium"
                : "bg-white border border-[#E5E7EB] text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3 min-w-0 w-full">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-8 text-center">
            <Bell size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-medium text-slate-500">No notifications</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markSingleRead(n.id);
                setSelectedNotification(n);
              }}
              className={`group relative rounded-[24px] bg-white border p-4 transition flex items-start gap-4 cursor-pointer min-w-0 w-full overflow-hidden shadow-2xs hover:shadow-xs ${
                n.unread
                  ? "border-brandRed/30 bg-rose-50/20"
                  : "border-[#F3E5E5] hover:border-slate-300"
              }`}
            >
              {/* Left Icon Badge */}
              <div
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-[18px] border ${getBadgeClass(
                  n.type
                )}`}
              >
                {getIcon(n.type)}
              </div>

              {/* Notification Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h4 className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                      {n.title}
                    </h4>
                    {n.unread && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brandRed shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal shrink-0">
                    {n.time}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed break-words">
                  {n.message}
                </p>

                {/* Direct Action Link */}
                {n.actionLink && (
                  <div className="mt-2 flex items-center gap-1">
                    <Link
                      to={n.actionLink}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-brandRed hover:underline"
                    >
                      <span>{n.actionLabel || "View"}</span>
                      <ExternalLink size={11} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={(e) => deleteNotification(n.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition shrink-0 self-center"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Minimal Notification Detail Modal */}
      {selectedNotification && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white p-4 sm:p-5 shadow-xl border border-[#E5E7EB] space-y-3 min-w-0"
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border ${getBadgeClass(
                    selectedNotification.type
                  )}`}
                >
                  {getIcon(selectedNotification.type)}
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900">
                    {selectedNotification.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {selectedNotification.date || selectedNotification.time}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedNotification.message}
            </p>

            {selectedNotification.details && (
              <div className="space-y-1 rounded-xl bg-slate-50 p-2.5 text-[11px]">
                {Object.entries(selectedNotification.details).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-0.5">
                    <span className="text-slate-500 capitalize">{key}:</span>
                    <span className="font-medium text-slate-800">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              {selectedNotification.actionLink && (
                <Link
                  to={selectedNotification.actionLink}
                  onClick={() => setSelectedNotification(null)}
                  className="inline-flex h-8 items-center gap-1 rounded-full bg-brandRed px-3 text-xs font-medium text-white shadow-2xs"
                >
                  <span>{selectedNotification.actionLabel || "View"}</span>
                  <ExternalLink size={11} />
                </Link>
              )}
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="h-8 rounded-full border border-[#E5E7EB] px-3 text-xs text-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
