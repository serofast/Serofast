import { Store, TrendingUp, ShieldCheck, Zap, ArrowRight, Smartphone, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ServiceStrip from "./ServiceStrip";

export default function HeroBanner({ onOpenAppTeaser }) {
  return (
    <div className="relative grid min-h-[calc(100svh-119px)] max-800:min-h-[calc(100svh-90px)] w-full grid-cols-1 lg:grid-cols-[50%_50%] xl:grid-cols-[48%_52%] overflow-hidden bg-[#fff2f2]">
      {/* Left Column: Content */}
      <div className="relative z-[2] flex flex-col justify-center bg-[linear-gradient(90deg,#fff1f1_0%,#fff4f4_80%,rgba(255,244,244,0.3)_100%)] px-6 py-12 sm:px-12 md:px-16 lg:px-14 xl:px-20 lg:py-16 max-800:bg-[#fff2f2] max-800:p-[32px_24px_28px]">
        <div className="animate-fade-in-down mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#D22125]/20 bg-[#D22125]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D22125] shadow-sm max-800:mb-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D22125] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D22125]" />
          </span>
          Official Shop Owner &amp; Campus Merchant Platform
        </div>

        <h1 className="animate-fade-in-up animation-delay-100 m-0 mb-4 text-[clamp(36px,4.2vw,54px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-textPrimary max-560:text-[33px] max-380:text-[29px]">
          Empower Your Store.
          <br />
          <span className="text-[#D22125] drop-shadow-sm">Become a Shop Owner</span>
        </h1>

        <div className="grid gap-3.5 my-2 max-560:gap-2.5">
          <p className="group animate-fade-in-up animation-delay-200 m-0 flex cursor-default items-center gap-3 text-[15px] font-medium text-[#404040] transition-all duration-200 hover:translate-x-2 max-560:text-[13px]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#ffe0e0] bg-white text-[#D22125] shadow-sm transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-[#D22125] group-hover:text-white group-hover:shadow-md">
              <Store size={18} />
            </span>
            <span className="transition-colors duration-200 group-hover:text-black">
              Launch your official campus store profile in 2 minutes
            </span>
          </p>

          <p className="group animate-fade-in-up animation-delay-300 m-0 flex cursor-default items-center gap-3 text-[15px] font-medium text-[#404040] transition-all duration-200 hover:translate-x-2 max-560:text-[13px]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#ffe0e0] bg-white text-[#D22125] shadow-sm transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-[#D22125] group-hover:text-white group-hover:shadow-md">
              <TrendingUp size={18} />
            </span>
            <span className="transition-colors duration-200 group-hover:text-black">
              Keep 100% of retail earnings — 0% marketplace commission
            </span>
          </p>

          <p className="group animate-fade-in-up animation-delay-400 m-0 flex cursor-default items-center gap-3 text-[15px] font-medium text-[#404040] transition-all duration-200 hover:translate-x-2 max-560:text-[13px]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#ffe0e0] bg-white text-[#D22125] shadow-sm transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-[#D22125] group-hover:text-white group-hover:shadow-md">
              <Zap size={18} />
            </span>
            <span className="transition-colors duration-200 group-hover:text-black">
              Instant daily UPI payouts &amp; automated order tracking
            </span>
          </p>

          <p className="group animate-fade-in-up animation-delay-500 m-0 flex cursor-default items-center gap-3 text-[15px] font-medium text-[#404040] transition-all duration-200 hover:translate-x-2 max-560:text-[13px]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#ffe0e0] bg-white text-[#D22125] shadow-sm transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-[#D22125] group-hover:text-white group-hover:shadow-md">
              <ShieldCheck size={18} />
            </span>
            <span className="transition-colors duration-200 group-hover:text-black">
              Dedicated Admin &amp; Student Promoter support ecosystem
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="animate-fade-in-up animation-delay-600 mt-8 flex flex-wrap items-center gap-4 max-560:gap-2.5">
          <Link
            to="/signup?role=shop-owner"
            className="inline-flex h-[52px] min-w-[190px] items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-[#D22125] to-rose-600 px-7 text-[15px] font-extrabold text-white shadow-[0_10px_25px_rgba(210,33,37,0.3)] transition-all duration-300 hover:shadow-[0_16px_32px_rgba(210,33,37,0.45)] hover:-translate-y-1 active:translate-y-0 active:scale-95 max-560:w-full"
          >
            <Store size={19} />
            <span>Become a Shop Owner</span>
            <ArrowRight size={17} />
          </Link>
          
          <Link
            to="/login"
            className="inline-flex h-[52px] min-w-[160px] items-center justify-center gap-2 rounded-[12px] border border-slate-300 bg-white px-6 text-[15px] font-bold text-slate-800 shadow-sm transition-all duration-300 hover:border-[#D22125] hover:text-[#D22125] hover:shadow-md hover:-translate-y-1 active:translate-y-0 active:scale-95 max-560:w-full"
          >
            <span>Shop Owner Login</span>
          </Link>

          {/* Customer Notice Badge */}
          <button
            type="button"
            onClick={() => onOpenAppTeaser?.("Customer Product Browser")}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 text-xs font-bold text-amber-900 transition hover:bg-amber-500/20 max-560:w-full max-560:justify-center"
          >
            <Smartphone size={15} className="text-amber-600" />
            <span>Shopper? Download Customer Mobile App</span>
          </button>
        </div>

        {/* Live Metrics Ticker */}
        <div className="mt-8 grid grid-cols-3 gap-3 border-t border-red-200/60 pt-5 max-560:grid-cols-3">
          <div>
            <div className="text-lg font-black text-slate-900">₹48.5K+</div>
            <div className="text-[11px] font-semibold text-slate-500">Daily Payouts</div>
          </div>
          <div>
            <div className="text-lg font-black text-slate-900">150+</div>
            <div className="text-[11px] font-semibold text-slate-500">Shop Owners</div>
          </div>
          <div>
            <div className="text-lg font-black text-emerald-600 flex items-center gap-1">
              <CheckCircle size={14} /> 100%
            </div>
            <div className="text-[11px] font-semibold text-slate-500">Direct Profit</div>
          </div>
        </div>
      </div>

      {/* Right Column: Hero Visual & Service Strip */}
      <div className="group relative flex min-h-[380px] w-full flex-col justify-end overflow-hidden lg:min-h-full">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=90"
          alt="Verified Shop Owner Managing Campus Business"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#fff2f2_0%,rgba(255,242,242,0.45)_15%,transparent_40%)] max-lg:bg-[linear-gradient(180deg,#fff2f2_0%,rgba(255,242,242,0.3)_30%,transparent_70%)]" />

        {/* Floating live indicator badge */}
        <div className="animate-float-slow absolute top-6 right-6 z-[3] hidden sm:flex items-center gap-2 rounded-full border border-white/80 bg-white/95 px-4 py-2 shadow-float backdrop-blur-md">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[12px] font-bold text-textPrimary">150+ Active Campus Shop Owners</span>
        </div>

        <ServiceStrip />
      </div>
    </div>
  );
}
