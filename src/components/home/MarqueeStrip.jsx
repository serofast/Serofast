import React from "react";
import {
  Sparkles,
  ShoppingBag,
  Zap,
  Store,
  ShieldCheck,
  Truck,
  Wallet,
  GraduationCap,
} from "lucide-react";

const MARQUEE_ITEMS = [
  { icon: Store, text: "Verified Campus Stores" },
  { icon: Zap, text: "0% Platform Commission" },
  { icon: Truck, text: "45-Min Campus Delivery" },
  { icon: Wallet, text: "Instant UPI Bank Payouts" },
  { icon: GraduationCap, text: "India's Student-Powered Commerce" },
  { icon: ShieldCheck, text: "Verified Student Shops" },
  { icon: ShoppingBag, text: "Zero Stock Dropshipping" },
  { icon: Sparkles, text: "From Kanyakumari to Pan-India" },
];

export default function MarqueeStrip() {
  return (
    <div className="overflow-hidden border-b border-[#EBE3DC] bg-[#FAF8F5]/90 py-3.5 select-none">
      <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
        {[0, 1].map((copyIndex) => (
          <div
            key={copyIndex}
            className="flex shrink-0 items-center gap-8 pr-8"
            aria-hidden={copyIndex === 1}
          >
            {MARQUEE_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${copyIndex}-${idx}`}
                  className="flex items-center gap-2 text-xs font-black tracking-wide text-[#333] transition-colors hover:text-brandRed"
                >
                  <Icon size={14} className="text-brandRed shrink-0" />
                  <span>{item.text}</span>
                  <span className="ml-6 h-1 w-1 rounded-full bg-brandRed/40" />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
