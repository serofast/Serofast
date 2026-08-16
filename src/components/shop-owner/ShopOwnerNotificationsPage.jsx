import { useState } from "react";
import { Bell, ShoppingBag, Wallet, CheckCircle2, ShieldCheck, Tag, Info } from "lucide-react";
import { AppFormCard } from "../reusable/form";

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

export default function ShopOwnerNotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-4xl mx-auto pb-6">
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

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-[28px] bg-white border p-4 sm:p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] transition-all duration-200 flex items-start gap-4 ${
              n.unread ? "border-brandRed/40 bg-rose-50/20" : "border-[#F3E5E5]"
            }`}
          >
            <div
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-[18px] ${
                n.type === "order"
                  ? "bg-rose-50 text-brandRed"
                  : n.type === "payout"
                  ? "bg-rose-100 text-brandRed"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {n.type === "order" && <ShoppingBag size={20} />}
              {n.type === "payout" && <Wallet size={20} />}
              {n.type === "promoter" && <Tag size={20} />}
              {n.type === "system" && <ShieldCheck size={20} />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-medium text-slate-900 truncate">{n.title}</h4>
                <span className="text-[11px] text-slate-400 font-normal shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                {n.message}
              </p>
            </div>

            {n.unread && (
              <span className="h-2.5 w-2.5 rounded-full bg-brandRed shrink-0 mt-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
