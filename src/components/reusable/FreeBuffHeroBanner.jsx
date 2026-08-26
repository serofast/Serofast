import { Sparkles, Ticket, Flame, ArrowRight, Store, Gift } from "lucide-react";
import { Link } from "react-router-dom";

export default function FreeBuffHeroBanner({ onClaimFirstDeal, onOpenAppTeaser }) {
  return (
    <div className="landing-hero-banner relative w-full overflow-hidden bg-gradient-to-b from-[#FFF5F5] via-[#FAF8F5] to-[#FAF8F5] pt-10 pb-14 sm:pt-14 sm:pb-20 font-sans font-sansation border-b border-[#F3E5E5]">
      {/* Layered ambient glow accents */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-brandRed/8 blur-3xl" />
      <div className="pointer-events-none absolute top-20 -left-40 h-80 w-80 rounded-full bg-amber-400/8 blur-3xl" style={{ animation: 'floatSlow 7s ease-in-out infinite' }} />
      <div className="pointer-events-none absolute bottom-10 -right-32 h-72 w-72 rounded-full bg-rose-300/8 blur-3xl" style={{ animation: 'floatSlow 5s ease-in-out infinite', animationDelay: '2s' }} />

      {/* Subtle grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, #d32f2f 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="landing-hero-inner relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        {/* Animated FreeBuff Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brandRed/20 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-brandRed shadow-[0_2px_12px_rgba(211,47,47,0.08)] backdrop-blur-sm mb-5 animate-fade-in-down">
          <Sparkles size={14} className="animate-spin text-amber-500" style={{ animationDuration: '3s' }} />
          <span>FREEBUFF CAMPUS STOREFRONT</span>
          <span className="h-1.5 w-1.5 rounded-full bg-brandRed animate-ping" />
        </div>

        {/* Hero Title — dramatic size */}
        <h1 className="text-[clamp(30px,5.5vw,60px)] sm:text-5xl lg:text-[56px] font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto animate-fade-in-up">
          Claim 100% <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandRed via-red-500 to-rose-500">Free Buffet Passes</span> & Campus Vouchers Daily!
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
          Discover verified campus food buffets, free snacks, student discount codes, and shop owner rewards with zero hidden costs.
        </p>

        {/* Hero Feature Pills — elevated design */}
        <div className="mt-7 flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
          <span className="inline-flex items-center gap-2 rounded-full border border-brandRed/15 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-sm">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-promoHighlight text-brandRed"><Ticket size={13} /></span>
            ₹0 Pass Cost
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-sm">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-50 text-amber-500"><Flame size={13} /></span>
            Instant QR Redemption
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-sm">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Gift size={13} /></span>
            100+ Verified Campus Deals
          </span>
        </div>

        {/* Primary Call To Action Buttons — more dramatic */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
          <button
            type="button"
            onClick={onClaimFirstDeal}
            className="flex h-13 items-center justify-center gap-2.5 rounded-[30px] bg-gradient-to-r from-brandRed to-rose-600 px-8 text-sm font-bold text-white shadow-[0_8px_28px_rgba(211,47,47,0.4)] hover:shadow-[0_12px_36px_rgba(211,47,47,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <Ticket size={17} />
            <span>Claim Free Buffet Pass</span>
            <ArrowRight size={16} />
          </button>

          <Link
            to="/signup"
            className="flex h-13 items-center justify-center gap-2.5 rounded-[30px] border-2 border-slate-200 bg-white px-8 text-sm font-bold text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:border-brandRed hover:text-brandRed hover:shadow-[0_8px_24px_rgba(210,33,37,0.1)] active:scale-95 transition-all duration-300"
          >
            <Store size={17} className="text-brandRed" />
            <span>List Shop on FreeBuff</span>
          </Link>
        </div>

        {/* Live Metrics Ticker — refined card style */}
        <div className="mt-10 grid grid-cols-3 gap-0 border-t border-slate-200/60 pt-7 max-w-lg mx-auto text-center animate-fade-in-up animation-delay-500">
          <div className="relative">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">4,820+</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Free Passes Claimed</div>
            <div className="absolute right-0 top-1 h-8 w-px bg-slate-200/60 hidden sm:block" />
          </div>
          <div className="relative">
            <div className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brandRed to-rose-500">100%</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Free Student Deals</div>
            <div className="absolute right-0 top-1 h-8 w-px bg-slate-200/60 hidden sm:block" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">120+</div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Campus Shops</div>
          </div>
        </div>
      </div>

      {/* Bottom wave divider to smoothly transition to marquee */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1440 50" xmlns="http://www.w3.org/2000/svg" className="w-full h-6 sm:h-10" preserveAspectRatio="none">
          <path d="M0 50L60 42C120 34 240 18 360 14C480 10 600 18 720 22C840 26 960 26 1080 22C1200 18 1320 10 1380 6L1440 2V50H0Z" fill="#fafafa"/>
        </svg>
      </div>
    </div>
  );
}
