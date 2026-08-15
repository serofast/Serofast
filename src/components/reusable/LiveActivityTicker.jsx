import { useState, useEffect } from "react";
import { Store, TrendingUp, CheckCircle, Sparkles, X } from "lucide-react";

const activities = [
  {
    id: 1,
    icon: Store,
    color: "text-brandRed bg-rose-50 border-rose-200",
    title: "New Shop Owner Onboarded",
    desc: "Campus Stationery registered in SRM Zone 2",
    time: "Just now",
  },
  {
    id: 2,
    icon: TrendingUp,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    title: "Instant Payout Settled",
    desc: "₹6,850 credited to Urban Styles Shop Owner",
    time: "2m ago",
  },
  {
    id: 3,
    icon: Sparkles,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    title: "Inventory Stock Restocked",
    desc: "Electronics Hub updated 45 items with 0% fees",
    time: "5m ago",
  },
  {
    id: 4,
    icon: CheckCircle,
    color: "text-amber-600 bg-amber-50 border-amber-200",
    title: "Order Fulfilled",
    desc: "Campus Munchies completed 15-min delivery",
    time: "8m ago",
  },
];

export default function LiveActivityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setAnimating(false);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const current = activities[currentIndex];
  const Icon = current.icon;

  return (
    <div className="fixed bottom-6 left-6 z-[90] max-w-[340px] max-560:left-3 max-560:bottom-20 max-560:max-w-[calc(100%-24px)]">
      <div className="relative flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-[0_12px_32px_rgba(15,23,42,0.12)] backdrop-blur-md transition-all duration-300 hover:shadow-xl">
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:text-slate-700"
          aria-label="Dismiss activity"
        >
          <X size={12} />
        </button>

        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${current.color}`}>
          <Icon size={19} />
        </div>

        <div className={`flex-1 transition-opacity duration-300 ${animating ? "opacity-0" : "opacity-100"}`}>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold text-slate-900 tracking-tight">
              {current.title}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              {current.time}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
            {current.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
