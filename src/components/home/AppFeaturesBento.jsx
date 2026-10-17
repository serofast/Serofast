import React from "react";
import {
  ShoppingBag,
  Share2,
  Wallet,
  Truck,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import ParallaxLayer from "../../motion/ParallaxLayer";
import ScrollTitleReveal from "../../motion/ScrollTitleReveal";
import { StaggerGroup, StaggerItem } from "../../motion/StaggerGroup";

// ============================================================================
// 6 ENTERPRISE FEATURE CARDS
// ============================================================================
const FEATURES_DATA = [
  {
    id: "dropship",
    badge: "Zero Capital",
    title: "Zero-Stock Dropship Engine",
    tagline:
      "Sell 10,000+ verified products across campus without buying or warehousing any inventory.",
    icon: ShoppingBag,
    accentBg: "bg-red-50",
    accentText: "text-brandRed",
    accentBorder: "border-red-100",
    points: [
      "SeroFast sources, inspects & holds goods at regional hubs.",
      "Set your custom retail markup and keep 100% of profit.",
      "Hub handles automatic packing, quality checks & dispatch.",
    ],
    metric: "10,000+ Central Items • Zero Stock Risk",
  },
  {
    id: "payouts",
    badge: "0% Commission",
    title: "Instant UPI Payouts",
    tagline:
      "Withdraw earned retail margins directly to GPay, PhonePe, or Paytm in under 2 seconds.",
    icon: Wallet,
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-600",
    accentBorder: "border-emerald-100",
    points: [
      "Immediate automated settlements straight to any UPI VPA.",
      "Zero minimum balance threshold or withdrawal wait times.",
      "Direct bank deposits with 100% earnings to the seller.",
    ],
    metric: "Sub-2s UPI Transfer • ₹0 Platform Cut",
  },
  {
    id: "social",
    badge: "Viral Commerce",
    title: "1-Tap WhatsApp Stories",
    tagline:
      "Auto-generate high-res product story cards with instant order links for WhatsApp & Instagram.",
    icon: Share2,
    accentBg: "bg-blue-50",
    accentText: "text-blue-600",
    accentBorder: "border-blue-100",
    points: [
      "1-click formatted status card generation with product media.",
      "Embedded QR codes & direct WhatsApp order chat links.",
      "Real-time view analytics and referral click tracking.",
    ],
    metric: "3.4x Higher Campus Reach via Status",
  },
  {
    id: "delivery",
    badge: "Under 45 Mins",
    title: "Campus Express Delivery",
    tagline:
      "Direct delivery to hostel gates, dorm rooms, and campus canteens via student runners.",
    icon: Truck,
    accentBg: "bg-amber-50",
    accentText: "text-amber-600",
    accentBorder: "border-amber-100",
    points: [
      "Guaranteed doorstep handover in under 45 minutes.",
      "Live GPS telemetry & route updates with student runners.",
      "4-digit security OTP verification required at handover.",
    ],
    metric: "<45m Average ETA • 100% OTP Verified",
  },
  {
    id: "identity",
    badge: "Peer Trust",
    title: "Verified Student Identity",
    tagline:
      "College ID authentication badges eliminate marketplace scams and build instant peer trust.",
    icon: ShieldCheck,
    accentBg: "bg-purple-50",
    accentText: "text-purple-600",
    accentBorder: "border-purple-100",
    points: [
      "Roll number authentication via campus student registry.",
      "Official Verified Seller badge shown on store links.",
      "Eliminates scams, impersonations & fake listings.",
    ],
    metric: "100% Student Verified • 3.2x Conversions",
  },
  {
    id: "ai-radar",
    badge: "Demand Intelligence",
    title: "Campus Demand Radar",
    tagline:
      "Data-driven recommendations for semester exam stationery, midnight snacks, and campus trends.",
    icon: TrendingUp,
    accentBg: "bg-rose-50",
    accentText: "text-rose-600",
    accentBorder: "border-rose-100",
    points: [
      "Semester exam schedule alerts (calculators, drafters).",
      "Midnight hostel snack order surge detection (11 PM - 2 AM).",
      "1-click trending inventory auto-sync to your store.",
    ],
    metric: "+140% Order Surges During Exams",
  },
];

export default function AppFeaturesBento() {
  return (
    <section
      id="app-features"
      className="relative border-b border-[#EBE3DC] bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5]/60 py-16 lg:py-24 select-none overflow-hidden"
    >
      {/* Soft Ambient Radial Lights with Parallax */}
      <ParallaxLayer speed={0.18} className="section-atmosphere">
        <div className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-red-100/30 blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />
      </ParallaxLayer>

      <div className="relative mx-auto w-[min(1400px,calc(100%_-_32px))]">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brandRed/20 bg-white px-3.5 py-1 shadow-2xs">
            <Sparkles size={13} className="text-brandRed" />
            <span className="text-[11px] font-black uppercase tracking-wider text-brandRed">
              Architecture & Capabilities
            </span>
          </div>

          <h2 className="mt-3 text-[clamp(2rem,3.8vw,3rem)] font-black tracking-tight text-[#191616]">
            Engineered for Campus Commerce
          </h2>

          <ScrollTitleReveal direction="up" delay={180} duration={850}>
            <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
              Minimal, zero-friction mobile tooling built from the ground up for verified university ecosystems.
            </p>
          </ScrollTitleReveal>
        </div>

        {/* =========================================================
            BENTO GRID (HIGH-DENSITY, ENTERPRISE-GRADE UI)
            ========================================================= */}
        <StaggerGroup step={70} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES_DATA.map((item, index) => {
            const Icon = item.icon;

            return (
              <StaggerItem key={item.id} index={index}>
                <div className="group relative flex flex-col justify-between h-full rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-brandRed/40 hover:shadow-[0_16px_40px_rgba(211,47,47,0.08)]">
                  <div>
                    {/* Top Header: Icon + Badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`grid h-10 w-10 place-items-center rounded-xl ${item.accentBg} ${item.accentText} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon size={20} />
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border ${item.accentBg} ${item.accentText} ${item.accentBorder}`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="mt-4 text-lg font-black text-[#191616] group-hover:text-brandRed transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-slate-500">
                      {item.tagline}
                    </p>

                    {/* Bullet Architecture Points */}
                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                      {item.points.map((point, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-start gap-2 text-xs text-slate-600 leading-snug"
                        >
                          <CheckCircle2
                            size={14}
                            className="text-brandRed shrink-0 mt-0.5"
                          />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Metric Pill */}
                  <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 truncate">
                      {item.metric}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-slate-300 group-hover:text-brandRed group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
