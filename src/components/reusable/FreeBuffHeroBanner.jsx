import { Sparkles, Ticket, Flame, ArrowRight, Store, Gift } from "lucide-react";
import { Link } from "react-router-dom";

export default function FreeBuffHeroBanner({ onClaimFirstDeal, onOpenAppTeaser }) {
  return (
    <div className="relative w-full overflow-hidden bg-[#FAF8F5] border-b border-[#F3E5E5] pt-8 pb-12 sm:pt-12 sm:pb-16 font-sans font-sansation">
      {/* Ambient Red Glow Accents */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full bg-brandRed/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        {/* Animated FreeBuff Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brandRed/20 bg-rose-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-brandRed shadow-xs mb-4">
          <Sparkles size={14} className="animate-spin text-amber-500" />
          <span>FREEBUFF CAMPUS STOREFRONT</span>
          <span className="h-1.5 w-1.5 rounded-full bg-brandRed animate-ping" />
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-3xl mx-auto">
          Claim 100% <span className="text-brandRed">Free Buffet Passes</span> & Campus Vouchers Daily!
        </h1>

        {/* Subtitle */}
        <p className="mt-3.5 text-xs sm:text-sm text-slate-600 font-normal max-w-xl mx-auto leading-relaxed">
          Discover verified campus food buffets, free snacks, student discount codes, and shop owner rewards with zero hidden costs.
        </p>

        {/* Hero Feature Pills */}
        <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F3E5E5] bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs">
            <Ticket size={14} className="text-brandRed" /> ₹0 Pass Cost
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F3E5E5] bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs">
            <Flame size={14} className="text-amber-500" /> Instant QR Redemption
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F3E5E5] bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs">
            <Gift size={14} className="text-emerald-600" /> 100+ Verified Campus Deals
          </span>
        </div>

        {/* Primary Call To Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClaimFirstDeal}
            className="flex h-12 items-center justify-center gap-2 rounded-[30px] bg-brandRed px-6 text-xs font-bold text-white shadow-[0_6px_20px_rgba(211,47,47,0.35)] hover:bg-brandRedDark active:scale-95 transition cursor-pointer"
          >
            <Ticket size={16} />
            <span>Claim Free Buffet Pass</span>
            <ArrowRight size={15} />
          </button>

          <Link
            to="/signup"
            className="flex h-12 items-center justify-center gap-2 rounded-[30px] border border-[#E5E7EB] bg-white px-6 text-xs font-bold text-slate-800 shadow-2xs hover:border-brandRed hover:text-brandRed active:scale-95 transition"
          >
            <Store size={16} className="text-brandRed" />
            <span>List Shop on FreeBuff</span>
          </Link>
        </div>

        {/* Live Metrics Ticker */}
        <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-200/80 pt-5 max-w-lg mx-auto text-center">
          <div>
            <div className="text-lg font-bold text-slate-900">4,820+</div>
            <div className="text-[11px] font-medium text-slate-500">Free Passes Claimed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-brandRed">100%</div>
            <div className="text-[11px] font-medium text-slate-500">Free Student Deals</div>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">120+</div>
            <div className="text-[11px] font-medium text-slate-500">Campus Shops</div>
          </div>
        </div>
      </div>
    </div>
  );
}
