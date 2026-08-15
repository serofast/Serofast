import { Store, TrendingUp, ShieldCheck, Zap, ArrowRight, Smartphone, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ServiceStrip from "./ServiceStrip";

export default function HeroBanner({ onOpenAppTeaser }) {
  return (
    <div className="relative grid min-h-[calc(100svh-119px)] max-800:min-h-[calc(100svh-90px)] w-full grid-cols-1 lg:grid-cols-[50%_50%] xl:grid-cols-[48%_52%] overflow-hidden bg-[#fff2f2]">
      {/* Left Column: Content */}
      <div className="relative z-[2] flex flex-col justify-center bg-[linear-gradient(90deg,#fff1f1_0%,#fff4f4_80%,rgba(255,244,244,0.3)_100%)] px-6 py-10 sm:px-12 md:px-16 lg:px-14 xl:px-20 lg:py-14 max-800:bg-[#fff2f2] max-800:p-[28px_20px_24px]">
        <div className="animate-fade-in-down mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-brandRed/20 bg-brandRed/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brandRed shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brandRed opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brandRed" />
          </span>
          Verified Shop Owner Platform
        </div>

        <h1 className="animate-fade-in-up animation-delay-100 m-0 mb-3 text-[clamp(34px,4vw,50px)] font-extrabold leading-[1.08] tracking-tight text-textPrimary">
          Empower Your Store.
          <br />
          <span className="text-brandRed">Become a Shop Owner</span>
        </h1>

        <p className="animate-fade-in-up animation-delay-200 m-0 mb-5 text-sm leading-relaxed text-slate-600 max-w-lg">
          Launch your official campus store profile, manage product inventory, and retain 100% of retail earnings with 0% commission.
        </p>

        {/* Minimal Feature Pills */}
        <div className="animate-fade-in-up animation-delay-300 flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs">
            <TrendingUp size={14} className="text-brandRed" />
            0% Commission (100% Direct Profit)
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs">
            <Zap size={14} className="text-amber-500" />
            Instant Daily UPI Payouts
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs">
            <ShieldCheck size={14} className="text-emerald-600" />
            Verified Campus Network
          </span>
        </div>

        {/* Action Buttons */}
        <div className="animate-fade-in-up animation-delay-400 flex flex-wrap items-center gap-3">
          <Link
            to="/signup"
            className="inline-flex h-12 min-w-[170px] items-center justify-center gap-2 rounded-xl bg-brandRed px-6 text-xs font-bold text-white shadow-md shadow-brandRed/20 transition-all hover:bg-brandRedDark hover:shadow-lg active:scale-95 max-560:w-full"
          >
            <Store size={16} />
            <span>Become a Shop Owner</span>
            <ArrowRight size={15} />
          </Link>
          
          <Link
            to="/login"
            className="inline-flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-xs font-bold text-slate-800 shadow-2xs transition-all hover:border-brandRed hover:text-brandRed active:scale-95 max-560:w-full"
          >
            <span>Shop Owner Login</span>
          </Link>

          <button
            type="button"
            onClick={() => onOpenAppTeaser?.("Customer Mobile App")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-500/20 max-560:w-full max-560:justify-center"
          >
            <Smartphone size={14} className="text-amber-600" />
            <span>Shopper? Download App</span>
          </button>
        </div>

        {/* Live Metrics */}
        <div className="mt-7 grid grid-cols-3 gap-3 border-t border-rose-200/60 pt-4">
          <div>
            <div className="text-base font-bold text-slate-900">₹48.5K+</div>
            <div className="text-[11px] font-medium text-slate-500">Daily Payouts</div>
          </div>
          <div>
            <div className="text-base font-bold text-slate-900">150+</div>
            <div className="text-[11px] font-medium text-slate-500">Shop Owners</div>
          </div>
          <div>
            <div className="text-base font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle size={13} /> 100%
            </div>
            <div className="text-[11px] font-medium text-slate-500">Direct Profit</div>
          </div>
        </div>
      </div>

      {/* Right Column: Visual */}
      <div className="group relative flex min-h-[340px] w-full flex-col justify-end overflow-hidden lg:min-h-full">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=90"
          alt="Verified Shop Owner Managing Campus Business"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#fff2f2_0%,rgba(255,242,242,0.45)_15%,transparent_40%)] max-lg:bg-[linear-gradient(180deg,#fff2f2_0%,rgba(255,242,242,0.3)_30%,transparent_70%)]" />

        <div className="animate-float-slow absolute top-6 right-6 z-[3] hidden sm:flex items-center gap-2 rounded-full border border-white/80 bg-white/95 px-3.5 py-1.5 shadow-float backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-800">150+ Verified Campus Outlets</span>
        </div>

        <ServiceStrip />
      </div>
    </div>
  );
}
