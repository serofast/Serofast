import { useState, useEffect } from "react";
import {
  Sparkles,
  Ticket,
  Flame,
  ArrowRight,
  Store,
  Gift,
  Zap,
  Users,
  TrendingUp,
  Star,
  ShieldCheck,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

function AnimatedCounter({ target, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <span>
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function FreeBuffHeroBanner({ onClaimFirstDeal, onOpenAppTeaser }) {
  return (
    <div className="relative w-full overflow-hidden bg-[#FAF8F5] pt-8 pb-0 sm:pt-12 font-sansation">
      {/* === Ambient Glow Layer === */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[700px] w-[900px] rounded-full bg-brandRed/[0.04] blur-[120px]" />
        <div className="absolute top-20 -left-32 h-[400px] w-[400px] rounded-full bg-amber-400/[0.05] blur-[100px] animate-float-slow" />
        <div className="absolute bottom-20 -right-20 h-[350px] w-[350px] rounded-full bg-rose-300/[0.05] blur-[100px]" style={{ animation: "floatSlow 6s ease-in-out infinite", animationDelay: "2s" }} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, #d32f2f 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      {/* === Main Content Container === */}
      <div className="relative z-10 mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-center lg:gap-10 xl:grid-cols-[1fr_460px]">
          {/* ─── Left Column: Typography + CTA ─── */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left pt-6 sm:pt-10 pb-10 sm:pb-14">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brandRed/15 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-brandRed shadow-[0_2px_12px_rgba(211,47,47,0.06)] backdrop-blur-sm mb-5 animate-fade-in-down">
              <Sparkles size={13} className="text-amber-500 animate-spin" style={{ animationDuration: "3s" }} />
              <span>FREEBUFF CAMPUS STOREFRONT</span>
              <span className="h-1.5 w-1.5 rounded-full bg-brandRed animate-ping" />
            </div>

            {/* Headline */}
            <h1 className="text-[clamp(2.4rem,6vw,4.2rem)] sm:text-[clamp(2.6rem,5.5vw,4.8rem)] font-extrabold text-[#191616] tracking-[-0.03em] leading-[1.02] max-w-[680px] animate-fade-in-up">
              Claim{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandRed via-red-500 to-rose-500">
                  100% Free
                </span>
                <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-brandRed/40 to-rose-400/40" />
              </span>{" "}
              Buffet Passes & Campus Vouchers Daily
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-[520px] text-[15px] sm:text-[16px] leading-relaxed text-[#4f4a4a] animate-fade-in-up animation-delay-200">
              Discover verified campus food buffets, free snacks, student discount codes, and shop owner rewards with zero hidden costs.
            </p>

            {/* Feature Chips */}
            <div className="mt-6 flex flex-wrap justify-center gap-2.5 max-w-[520px] lg:justify-start animate-fade-in-up animation-delay-300">
              {[
                { icon: Ticket, label: "₹0 Pass Cost", color: "bg-promoHighlight text-brandRed border-brandRed/10" },
                { icon: Zap, label: "Instant QR Redemption", color: "bg-amber-50 text-amber-600 border-amber-200/50" },
                { icon: ShieldCheck, label: "100+ Verified Deals", color: "bg-emerald-50 text-emerald-600 border-emerald-200/50" },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-semibold text-[#333] shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-sm ${chip.color}`}
                >
                  <chip.icon size={13} />
                  {chip.label}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start animate-fade-in-up animation-delay-400">
              <button
                type="button"
                onClick={onClaimFirstDeal}
                className="group flex h-13 items-center gap-2.5 rounded-full bg-gradient-to-r from-brandRed to-rose-600 px-7 text-[14px] font-bold text-white shadow-[0_8px_30px_rgba(211,47,47,0.35)] hover:shadow-[0_12px_40px_rgba(211,47,47,0.45)] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300"
              >
                <Ticket size={17} />
                <span>Claim Free Buffet Pass</span>
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <Link
                to="/signup"
                className="group flex h-13 items-center gap-2.5 rounded-full border-2 border-slate-200 bg-white px-7 text-[14px] font-bold text-[#191616] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-brandRed hover:text-brandRed hover:shadow-[0_8px_24px_rgba(210,33,37,0.08)] active:scale-[0.97] transition-all duration-300"
              >
                <Store size={17} className="text-brandRed" />
                <span>List Shop on FreeBuff</span>
              </Link>
            </div>

            {/* Live Stats Row */}
            <div className="mt-10 grid w-full max-w-[480px] grid-cols-3 gap-0 border-t border-slate-200/60 pt-6 animate-fade-in-up animation-delay-500">
              <div className="relative text-center">
                <div className="text-xl sm:text-2xl font-extrabold text-[#191616]">
                  <AnimatedCounter target={4820} suffix="+" />
                </div>
                <div className="mt-0.5 text-[11px] font-semibold text-[#8b8282]">Free Passes Claimed</div>
                <div className="absolute right-0 top-1 h-8 w-px bg-slate-200/50 hidden sm:block" />
              </div>
              <div className="relative text-center">
                <div className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brandRed to-rose-500">
                  100%
                </div>
                <div className="mt-0.5 text-[11px] font-semibold text-[#8b8282]">Free Student Deals</div>
                <div className="absolute right-0 top-1 h-8 w-px bg-slate-200/50 hidden sm:block" />
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-extrabold text-[#191616]">
                  <AnimatedCounter target={120} suffix="+" />
                </div>
                <div className="mt-0.5 text-[11px] font-semibold text-[#8b8282]">Campus Shops</div>
              </div>
            </div>
          </div>

          {/* ─── Right Column: Bento Feature Grid ─── */}
          <div className="hidden lg:block pb-10 animate-fade-in-up animation-delay-300">
            <div className="grid grid-cols-2 gap-3">
              {/* Featured Deal Card */}
              <div className="col-span-2 group relative overflow-hidden rounded-[22px] border border-brandRed/10 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_40px_rgba(210,33,37,0.1)] transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-brandRed px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  <Sparkles size={10} className="text-amber-300 animate-pulse" />
                  FREEBUFF DEAL
                </div>
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white">
                  <Flame size={10} /> HOT
                </div>
                <div className="mt-8 rounded-[16px] bg-gradient-to-br from-promoHighlight to-rose-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brandRed text-white shadow-md">
                      <Ticket size={22} />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold text-[#191616]">Free Unlimited Lunch Buffet</h3>
                      <p className="text-[12px] text-[#4f4a4a]">Campus Central Food Court</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-brandRed">₹0</span>
                    <span className="text-[12px] text-slate-400 line-through">₹249</span>
                    <span className="ml-auto rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">100% FREE</span>
                  </div>
                </div>
              </div>

              {/* Quick Stat Card 1 */}
              <div className="overflow-hidden rounded-[22px] border border-slate-100 bg-white p-5 shadow-[0_6px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brandRed/10 text-brandRed mb-3">
                  <Users size={20} />
                </div>
                <div className="text-xl font-extrabold text-[#191616]">500+</div>
                <div className="text-[12px] text-[#8b8282] mt-0.5">Verified Campus Partners</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-brandRed to-rose-400" />
                </div>
              </div>

              {/* Quick Stat Card 2 */}
              <div className="overflow-hidden rounded-[22px] border border-slate-100 bg-white p-5 shadow-[0_6px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 mb-3">
                  <TrendingUp size={20} />
                </div>
                <div className="text-xl font-extrabold text-[#191616]">₹0</div>
                <div className="text-[12px] text-[#8b8282] mt-0.5">Commission for Shop Owners</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
                </div>
              </div>

              {/* Quick Stat Card 3 */}
              <div className="overflow-hidden rounded-[22px] border border-slate-100 bg-white p-5 shadow-[0_6px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600 mb-3">
                  <Star size={20} />
                </div>
                <div className="text-xl font-extrabold text-[#191616]">4.8★</div>
                <div className="text-[12px] text-[#8b8282] mt-0.5">Average Shop Rating</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-amber-400 to-amber-500" />
                </div>
              </div>

              {/* Quick Stat Card 4 */}
              <div className="overflow-hidden rounded-[22px] border border-slate-100 bg-white p-5 shadow-[0_6px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 mb-3">
                  <Clock size={20} />
                </div>
                <div className="text-xl font-extrabold text-[#191616]">{"<"}2hrs</div>
                <div className="text-[12px] text-[#8b8282] mt-0.5">Average Delivery Time</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-blue-400 to-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bento Grid (visible on tablet, hidden on desktop) */}
        <div className="lg:hidden pb-10 animate-fade-in-up animation-delay-300">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex items-center gap-3 rounded-[20px] border border-brandRed/10 bg-white p-4 shadow-[0_6px_20px_rgba(0,0,0,0.03)]">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brandRed text-white">
                <Ticket size={20} />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#191616]">Free Buffet Pass</div>
                <div className="text-[12px] text-[#4f4a4a]">Campus Central • ₹0</div>
              </div>
              <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">FREE</span>
            </div>
            <div className="overflow-hidden rounded-[18px] border border-slate-100 bg-white p-4 text-center shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
              <div className="text-lg font-extrabold text-[#191616]">500+</div>
              <div className="text-[11px] text-[#8b8282]">Partner Shops</div>
            </div>
            <div className="overflow-hidden rounded-[18px] border border-slate-100 bg-white p-4 text-center shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
              <div className="text-lg font-extrabold text-brandRed">₹0</div>
              <div className="text-[11px] text-[#8b8282]">Commission</div>
            </div>
            <div className="overflow-hidden rounded-[18px] border border-slate-100 bg-white p-4 text-center shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
              <div className="text-lg font-extrabold text-amber-500">4.8★</div>
              <div className="text-[11px] text-[#8b8282]">Avg Rating</div>
            </div>
            <div className="overflow-hidden rounded-[18px] border border-slate-100 bg-white p-4 text-center shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
              <div className="text-lg font-extrabold text-blue-600">{"<"}2hrs</div>
              <div className="text-[11px] text-[#8b8282]">Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* === Bottom Wave Transition === */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 sm:h-12" preserveAspectRatio="none">
          <path d="M0 60L80 50C160 40 320 20 480 16C640 12 800 24 960 28C1120 32 1280 28 1360 26L1440 24V60H0Z" fill="white" />
          <path d="M0 60L120 54C240 48 480 36 720 34C960 32 1200 40 1320 44L1440 48V60H0Z" fill="white" fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  );
}
