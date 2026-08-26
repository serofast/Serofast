import { Flame, Ticket, Store, Clock, ArrowRight, Sparkles } from "lucide-react";

export default function FreeBuffDealCard({ deal, onClaim }) {
  const claimedPercent = Math.min(
    100,
    Math.round(((deal.claimed || 15) / (deal.totalPasses || 20)) * 100)
  );

  return (
    <article className="landing-deal-card group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#F3E5E5] bg-white p-4 shadow-[-4px_5px_10px_rgba(211,47,47,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brandRed/40 hover:shadow-[-4px_8px_20px_rgba(211,47,47,0.22)] font-sans font-sansation">
      {/* Top Banner Tag */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-brandRed px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white shadow-xs">
        <Sparkles size={10} className="animate-pulse text-amber-300" />
        <span>{deal.tag || "FREEBUFF DEAL"}</span>
      </div>

      {deal.popular && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[9.5px] font-bold text-white shadow-xs">
          <Flame size={10} /> Hot
        </div>
      )}

      {/* Image Preview Container */}
      <div className="relative h-40 w-full overflow-hidden rounded-[18px] bg-[#FAF8F5] mt-6">
        <img
          src={deal.image}
          alt={deal.title}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[11px] font-medium">
          <span className="flex items-center gap-1 truncate">
            <Store size={12} className="text-amber-400 shrink-0" />
            <span className="truncate">{deal.shopName}</span>
          </span>
          <span className="flex items-center gap-1 text-[10px] text-slate-200 shrink-0">
            <Clock size={11} /> {deal.validUntil || "Today"}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="mt-3 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brandRed transition-colors line-clamp-1">
            {deal.title}
          </h3>
          <p className="text-[11px] text-slate-500 font-normal line-clamp-2 mt-0.5 leading-relaxed">
            {deal.description}
          </p>
        </div>

        {/* Pricing & Free Tag */}
        <div className="flex items-baseline gap-2 border-t border-slate-100 pt-2.5">
          <span className="text-lg font-bold text-brandRed">₹0</span>
          {deal.originalPrice && (
            <span className="text-xs text-slate-400 line-through">₹{deal.originalPrice}</span>
          )}
          <span className="ml-auto rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
            100% FREE
          </span>
        </div>

        {/* Claimed Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
            <span>Passes Claimed</span>
            <span className="font-bold text-slate-700">
              {deal.claimed || 15}/{deal.totalPasses || 20}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-brandRed transition-all duration-500"
              style={{ width: `${claimedPercent}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => onClaim?.(deal)}
          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-[30px] bg-brandRed text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark active:scale-95 transition-all cursor-pointer"
        >
          <Ticket size={14} />
          <span>Claim Free Pass</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </article>
  );
}
