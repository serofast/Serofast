import { useState, useEffect } from "react";
import {
  Bell,
  ShoppingBag,
  Wallet,
  ShieldCheck,
  Tag,
  Trash2,
  X,
  ExternalLink,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  fetchNotifications,
  markNotificationAsReadInSupabase,
  markAllNotificationsAsReadInSupabase,
  deleteNotificationFromSupabase,
  subscribeToRealtimeNotifications,
} from "../../lib/supabase";

export default function ShopOwnerNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [justMarkedAll, setJustMarkedAll] = useState(false);

  // Fetch initial notifications for this shop owner
  useEffect(() => {
    let ownerId = null;
    let shopId = null;

    try {
      const ownerStr = localStorage.getItem("serofast_current_owner");
      if (ownerStr) {
        const owner = JSON.parse(ownerStr);
        ownerId = owner.id;
      }
      const shopStr = localStorage.getItem("serofast_active_shop");
      if (shopStr) {
        const shop = JSON.parse(shopStr);
        shopId = shop.id;
      }
    } catch {}

    const loadData = async () => {
      setLoading(true);
      const data = await fetchNotifications({
        role: "shop_owner",
        recipientId: ownerId,
        shopId: shopId,
      });
      setNotifications(data);
      setLoading(false);
    };

    loadData();

    // Subscribe to live real-time notifications
    const unsubscribe = subscribeToRealtimeNotifications({
      role: "shop_owner",
      recipientId: ownerId,
      shopId: shopId,
      onNotification: (newNotif) => {
        setNotifications((prev) => {
          if (prev.some((n) => n.id === newNotif.id)) return prev;
          return [newNotif, ...prev];
        });
      },
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const markAllRead = async () => {
    if (notifications.every((n) => !n.unread) || isMarkingAll) return;

    setIsMarkingAll(true);
    let ownerId = null;
    let shopId = null;
    try {
      const ownerStr = localStorage.getItem("serofast_current_owner");
      if (ownerStr) ownerId = JSON.parse(ownerStr).id;
      const shopStr = localStorage.getItem("serofast_active_shop");
      if (shopStr) shopId = JSON.parse(shopStr).id;
    } catch {}

    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    await markAllNotificationsAsReadInSupabase({
      role: "shop_owner",
      recipientId: ownerId,
      shopId: shopId,
    });

    setIsMarkingAll(false);
    setJustMarkedAll(true);
    setTimeout(() => setJustMarkedAll(false), 2500);
  };

  const markSingleRead = async (id, e) => {
    e?.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    await markNotificationAsReadInSupabase(id);
  };

  const deleteNotification = async (id, e) => {
    e?.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
    await deleteNotificationFromSupabase(id);
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
    <div className="w-full max-w-full min-w-0 overflow-x-hidden space-y-6 animate-fade-in font-sans font-sansation pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
              Notifications &amp; Alerts
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Stay updated with your latest orders, payout settlements, and campus store alerts in real time.
          </p>
        </div>

        {/* Animated Mark All As Read Button */}
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0 || isMarkingAll}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 active:scale-95 cursor-pointer shadow-2xs self-start sm:self-auto ${
            justMarkedAll
              ? "bg-emerald-500 text-white border border-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.3)] scale-[1.03]"
              : unreadCount === 0
              ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-70"
              : "bg-rose-50 border border-brandRed/30 text-brandRed hover:bg-brandRed hover:text-white hover:shadow-[0_4px_14px_rgba(211,47,47,0.3)]"
          }`}
        >
          {isMarkingAll ? (
            <Loader2 size={13} className="animate-spin text-brandRed" />
          ) : justMarkedAll ? (
            <Sparkles size={13} className="text-white animate-bounce" />
          ) : (
            <span className={`h-2 w-2 rounded-full ${unreadCount > 0 ? "bg-brandRed" : "bg-slate-300"}`} />
          )}
          <span>
            {isMarkingAll
              ? "Marking all..."
              : justMarkedAll
              ? "All caught up! ✓"
              : "Mark all as read"}
          </span>
        </button>
      </div>

      {/* Category Filter Pills (Brand Red Harmony) */}
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
            className={`h-8 rounded-full px-4 text-xs font-semibold shrink-0 transition-all duration-200 active:scale-95 cursor-pointer border ${
              activeFilter === tab.id
                ? "bg-brandRed text-white border-brandRed shadow-[0_4px_14px_rgba(211,47,47,0.32)] scale-[1.02]"
                : "bg-white border-[#E5E7EB] text-slate-700 hover:border-brandRed/40 hover:text-brandRed hover:bg-rose-50/40 hover:shadow-2xs"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3 min-w-0 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 size={28} className="animate-spin text-brandRed" />
            <span className="text-xs font-medium">Fetching real-time notifications...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-8 text-center">
            <Bell size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-medium text-slate-500">No notifications in this category</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markSingleRead(n.id);
                setSelectedNotification(n);
              }}
              className={`group relative rounded-[24px] bg-white border p-4 transition-all duration-200 flex items-start gap-4 cursor-pointer min-w-0 w-full overflow-hidden shadow-2xs hover:shadow-sm active:scale-[0.99] ${
                n.unread
                  ? "border-brandRed/30 bg-rose-50/20 shadow-[-2px_4px_10px_rgba(211,47,47,0.08)]"
                  : "border-[#F3E5E5] hover:border-slate-300"
              }`}
            >
              {/* Left Icon Badge */}
              <div
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-[18px] border transition-transform duration-200 group-hover:scale-105 ${getBadgeClass(
                  n.type
                )}`}
              >
                {getIcon(n.type)}
              </div>

              {/* Notification Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                      {n.title}
                    </h4>
                    {n.unread && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brandRed shrink-0 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal shrink-0">
                    {n.time}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-normal mt-1 leading-relaxed break-words">
                  {n.message}
                </p>

                {/* Direct Action Link with matching button effect */}
                {n.actionLink && (
                  <div className="mt-2.5 flex items-center gap-1">
                    <Link
                      to={n.actionLink}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-brandRed/20 px-3 py-1 text-[11px] font-semibold text-brandRed hover:bg-brandRed hover:text-white transition-all duration-200 active:scale-95 shadow-2xs hover:shadow-[0_3px_10px_rgba(211,47,47,0.25)]"
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
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all duration-200 active:scale-90 shrink-0 self-center cursor-pointer"
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
            className="w-full max-w-sm rounded-[28px] bg-white p-5 sm:p-6 shadow-2xl border border-[#E5E7EB] space-y-4 min-w-0 animate-scale-in"
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${getBadgeClass(
                    selectedNotification.type
                  )}`}
                >
                  {getIcon(selectedNotification.type)}
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
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
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition active:scale-90 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {selectedNotification.message}
            </p>

            {selectedNotification.details && Object.keys(selectedNotification.details).length > 0 && (
              <div className="space-y-1.5 rounded-2xl bg-slate-50 border border-slate-100 p-3 text-[11px]">
                {Object.entries(selectedNotification.details).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-0.5">
                    <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-semibold text-slate-800">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              {selectedNotification.actionLink && (
                <Link
                  to={selectedNotification.actionLink}
                  onClick={() => setSelectedNotification(null)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brandRed px-4 text-xs font-bold text-white shadow-[0_4px_12px_rgba(211,47,47,0.3)] hover:bg-brandRedDark active:scale-95 transition-all cursor-pointer"
                >
                  <span>{selectedNotification.actionLabel || "View Details"}</span>
                  <ExternalLink size={12} />
                </Link>
              )}
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="h-9 rounded-full border border-[#E5E7EB] bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
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
