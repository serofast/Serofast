import { useState } from "react";
import { Bell, ShoppingBag, Wallet, ShieldCheck, Tag } from "lucide-react";

const initialNotifications = [
  {
    id: "notif-1",
    title: "New Order #SF-1043 Received",
    message: "Customer Rahul Sharma placed an order for 2 items (Total ₹799).",
    time: "10 mins ago",
    type: "order",
    unread: true,
  },
  {
    id: "notif-2",
    title: "Instant UPI Settlement Credited",
    message: "₹4,497 has been settled to your registered UPI ID (urbanstyles@hdfcbank).",
    time: "2 hours ago",
    type: "payout",
    unread: true,
  },
  {
    id: "notif-3",
    title: "Campus Promoter Referral Alert",
    message: "Student Partner Priya Verma shared your store link. 5 new visits recorded.",
    time: "5 hours ago",
    type: "promoter",
    unread: false,
  },
  {
    id: "notif-4",
    title: "Welcome to SeroFast Platform",
    message: "Your shop account is verified with 0% commission guarantee.",
    time: "1 day ago",
    type: "system",
    unread: false,
  },
];

const typeFilters = [
  { label: "All", value: "All" },
  { label: "Orders", value: "order" },
  { label: "Payouts", value: "payout" },
  { label: "Alerts", value: "promoter" },
  { label: "System", value: "system" },
];

const typeIconMap = {
  order: { Icon: ShoppingBag, bg: "bg-rose-50 text-brandRed" },
  payout: { Icon: Wallet, bg: "bg-rose-100 text-brandRed" },
  promoter: { Icon: Tag, bg: "bg-slate-100 text-slate-600" },
  system: { Icon: ShieldCheck, bg: "bg-slate-100 text-slate-600" },
};

export default function ShopOwnerNotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("All");

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "All") return true;
    return n.type === activeFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
            Notifications &amp; Alerts
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5 truncate max-w-xs sm:max-w-none">
            Stay updated with orders, payouts, and store alerts.
            {unreadCount > 0 && (
              <span className="ml-1.5 inline-flex items-center gap-1 text-brandRed font-medium">
                <Bell size={11} /> {unreadCount} unread
              </span>
            )}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="text-xs font-normal text-brandRed hover:underline cursor-pointer self-start sm:self-auto shrink-0"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Pill Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100">
        {typeFilters.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveFilter(tab.value)}
            className={`h-9 rounded-[30px] px-4 text-xs font-normal shrink-0 transition-all cursor-pointer ${
              activeFilter === tab.value
                ? "bg-brandRed text-white font-medium shadow-xs"
                : "bg-white text-slate-600 border border-[#E5E7EB]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="w-full rounded-[35px] bg-white border border-[#F3E5E5] p-8 text-center shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]">
            <Bell className="mx-auto text-slate-300 mb-2" size={36} />
            <p className="text-sm font-semibold text-slate-700">No Notifications Found</p>
            <p className="text-xs text-slate-400 mt-1">There are no notifications matching this filter right now.</p>
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const { Icon, bg } = typeIconMap[n.type] || typeIconMap.system;

            return (
              <div
                key={n.id}
                className={`rounded-[28px] bg-white border p-4 sm:p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] transition-all duration-200 ${
                  n.unread ? "border-brandRed/40 bg-rose-50/20" : "border-[#F3E5E5]"
                }`}
              >
                {/* Mobile: stacked layout. Desktop: row layout */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className={`grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-[16px] sm:rounded-[18px] ${bg}`}
                  >
                    <Icon size={18} className="sm:hidden" />
                    <Icon size={20} className="hidden sm:block" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <h4 className="text-[13px] sm:text-sm font-medium text-slate-900 truncate">{n.title}</h4>
                        {n.unread && (
                          <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-brandRed shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal shrink-0 whitespace-nowrap">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
