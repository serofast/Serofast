import { Flame, Ticket, Store, Clock, ArrowRight, Sparkles, Users } from "lucide-react";

export default function FreeBuffDealCard({ deal, onClaim }) {
  const claimedPercent = Math.min(
    100,
    Math.round(((deal.claimed || 15) / (deal.totalPasses || 20)) * 100)
  );

  const remaining = (deal.totalPasses || 20) - (deal.claimed || 15);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[22px] border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brandRed/25 hover:shadow-[0_16px_40px_rgba(210,33,37,0.1)] font-sansation">
      {/* Image Section */}
      <div className="relative h-44 w-full overflow-hidden bg-[#FAF8F5] sm:h-48">
        <img
          src={deal.image}
          alt={deal.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Tags */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-brandRed px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
            <Sparkles size={9} className="text-amber-300 animate-pulse" />
            {deal.tag || "FREEBUFF DEAL"}
          </span>
          {deal.popular && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[9px] font-bold text-white shadow-sm">
              <Flame size={9} /> Hot
            </span>
          )}
        </div>

        {/* Bottom Info on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white">
            <Store size={11} className="text-amber-400" />
            <span className="truncate max-w-[140px]">{deal.shopName}</span>
          </span>
          <span className="flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium text-white">
            <Clock size={10} />
            {deal.validUntil || "Today"}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-[14px] font-bold text-[#191616] leading-snug line-clamp-1 transition-colors group-hover:text-brandRed">
          {deal.title}
        </h3>
        <p className="mt-1.5 text-[12px] leading-relaxed text-[#8b8282] line-clamp-2">
          {deal.description}
        </p>

        {/* Pricing Row */}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[22px] font-extrabold text-brandRed">₹0</span>
            {deal.originalPrice && (
              <span className="text-[12px] text-slate-400 line-through">₹{deal.originalPrice}</span>
            )}
            <span className="ml-auto rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/50">
              100% FREE
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[10px] font-semibold text-[#8b8282] mb-1.5">
              <span className="flex items-center gap-1">
                <Users size={10} />
                {deal.claimed || 15}/{deal.totalPasses || 20} claimed
              </span>
              <span className="text-brandRed font-bold">{remaining} left</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-brandRed to-rose-500 transition-all duration-700"
                style={{ width: `${claimedPercent}%` }}
              />
            </div>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            onClick={() => onClaim?.(deal)}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-brandRed to-rose-600 text-[13px] font-bold text-white shadow-[0_6px_20px_rgba(211,47,47,0.3)] hover:shadow-[0_10px_28px_rgba(211,47,47,0.4)] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300"
          >
            <Ticket size={14} />
            <span>Claim Free Pass</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}
