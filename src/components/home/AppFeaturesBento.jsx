import React, { useState } from "react";
import {
  ShoppingBag,
  Share2,
  Wallet,
  Truck,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  RotateCw,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import ScrollReveal from "../reusable/ScrollReveal";

// ============================================================================
// 6 FEATURE CARDS DEFINITION (MINIMAL TEXT FRONT, DETAILED BACK)
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
    accentBorder: "border-red-200/80",
    backTitle: "Dropshipping Architecture",
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
    accentBorder: "border-emerald-200/80",
    backTitle: "Payout & Settlement",
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
    accentBorder: "border-blue-200/80",
    backTitle: "Social Selling Tools",
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
    accentBorder: "border-amber-200/80",
    backTitle: "Hyperlocal Dispatch",
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
    accentBorder: "border-purple-200/80",
    backTitle: "Verification & Trust",
    points: [
      "Roll number authentication via campus student registry.",
      "Official Verified Seller badge shown on store links.",
      "Eliminates scams, impersonations & fake listings.",
    ],
    metric: "100% Student Verified • 3.2x Conversions",
  },
  {
    id: "ai-radar",
    badge: "AI Predictor",
    title: "AI Campus Demand Radar",
    tagline:
      "Predictive recommendations for semester exam stationery, midnight snacks, and campus trends.",
    icon: TrendingUp,
    accentBg: "bg-rose-50",
    accentText: "text-rose-600",
    accentBorder: "border-rose-200/80",
    backTitle: "Predictive Analytics",
    points: [
      "Semester exam schedule alerts (calculators, drafters).",
      "Midnight hostel snack order surge detection (11 PM - 2 AM).",
      "1-click trending inventory auto-sync to your store.",
    ],
    metric: "+140% Order Surges During Exams",
  },
];

// ============================================================================
// MAIN FEATURES SECTION WITH 3D FLIP CARDS
// ============================================================================
export default function AppFeaturesBento() {
  // Track flipped state for each card independently
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="app-features"
      className="relative border-b border-[#EBE3DC] bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5]/60 py-14 lg:py-20 select-none overflow-hidden"
    >
      {/* Soft Ambient Radial Lights (Strictly clean & light) */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-red-100/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative mx-auto w-[min(1400px,calc(100%_-_32px))]">
        {/* Section Header */}
        <ScrollReveal variant="fade-down" duration={600} className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brandRed/20 bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-brandRed shadow-2xs">
            <Sparkles size={12} className="text-brandRed" />
            <span>Mobile App Architecture</span>
          </div>
          <h2 className="mt-2.5 text-[clamp(1.8rem,3.4vw,2.7rem)] font-black tracking-tight text-[#191616]">
            Engineered for Campus Commerce
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#555] max-w-md mx-auto">
            Minimal, zero-friction mobile tooling. Click any card to flip and explore architectural details.
          </p>
        </ScrollReveal>

        {/* =========================================================
            3D FLIP CARDS GRID (MINIMAL TEXT FRONT, DETAILED BACK)
            ========================================================= */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES_DATA.map((item, index) => {
            const Icon = item.icon;
            const isFlipped = Boolean(flippedCards[item.id]);

            return (
              <ScrollReveal
                key={item.id}
                variant="fade-up"
                duration={550}
                delay={index * 60}
              >
                <div className="flip-card-wrapper h-[245px] sm:h-[255px] w-full">
                  <div
                    onClick={() => toggleFlip(item.id)}
                    className={`flip-card-inner cursor-pointer ${
                      isFlipped ? "is-flipped" : ""
                    }`}
                  >
                    {/* ─────────────────────────────────────────────────────
                        FRONT FACE: MINIMAL COMPONENTS & CRISP TEXT ONLY
                        ───────────────────────────────────────────────────── */}
                    <div className="flip-card-face flex flex-col justify-between rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-slate-300 hover:shadow-md">
                      <div>
                        {/* Top: Icon + Badge + Flip Hint */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`grid h-9 w-9 place-items-center rounded-xl ${item.accentBg} ${item.accentText}`}
                            >
                              <Icon size={18} />
                            </div>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${item.accentBg} ${item.accentText}`}
                            >
                              {item.badge}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-bold text-[#888] hover:text-[#333] transition-colors">
                            <RotateCw size={12} className="text-[#999]" />
                            <span className="hidden sm:inline">Flip</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="mt-3.5 text-lg font-black text-[#191616] tracking-tight">
                          {item.title}
                        </h3>

                        {/* Minimal Tagline / Summary */}
                        <p className="mt-2 text-xs leading-relaxed text-[#555]">
                          {item.tagline}
                        </p>
                      </div>

                      {/* Bottom Footer Hint */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#888]">
                        <span className="flex items-center gap-1 text-brandRed font-black">
                          <span>Click for details</span>
                          <ArrowRight size={12} />
                        </span>
                        <span className="text-[10px] text-[#999]">Tap to flip ↺</span>
                      </div>
                    </div>

                    {/* ─────────────────────────────────────────────────────
                        BACK FACE: DETAILED SPECIFICATIONS & BULLET POINTS
                        ───────────────────────────────────────────────────── */}
                    <div
                      className={`flip-card-face flip-card-back flex flex-col justify-between rounded-2xl border ${item.accentBorder} bg-gradient-to-br from-white via-[#FAF8F5] to-white p-5 sm:p-6 shadow-md`}
                    >
                      <div>
                        {/* Back Top: Title + Flip Back Button */}
                        <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`h-2 w-2 rounded-full ${item.accentBg.replace(
                                "50",
                                "500"
                              )}`}
                            />
                            <span className="text-xs font-black text-[#191616] uppercase tracking-wider">
                              {item.backTitle}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-bold text-brandRed">
                            <RotateCw size={12} />
                            <span>Flip back</span>
                          </div>
                        </div>

                        {/* In-Depth Feature Bullets */}
                        <div className="mt-3 space-y-2">
                          {item.points.map((point, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs text-[#444] leading-snug"
                            >
                              <CheckCircle2
                                size={14}
                                className={`shrink-0 mt-0.5 ${item.accentText}`}
                              />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Back Bottom Metric Highlight */}
                      <div className="pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[10px] font-black text-[#666]">
                        <span className={item.accentText}>{item.metric}</span>
                        <span className="text-[9px] text-[#999]">Tap to close ↺</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
