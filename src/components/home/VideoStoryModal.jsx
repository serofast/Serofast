import React, { useState } from "react";
import {
  X,
  ShoppingBag,
  Share2,
  Truck,
  Wallet,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const TOUR_STEPS = [
  {
    id: "step-1",
    step: "01",
    tab: "Zero-Stock Dropship",
    title: "10,000+ Verified Products Centralized at Regional Hubs",
    icon: ShoppingBag,
    accent: "text-brandRed bg-red-50 border-red-200",
    description:
      "Student creators never purchase inventory or hold physical boxes in hostel rooms. SeroFast curates, quality-checks, and warehouses thousands of trending lifestyle, stationery, and tech essentials at central hubs.",
    highlights: [
      "No upfront investment or minimum order quantity (MOQ)",
      "Set your custom retail markups with full pricing freedom",
      "Automated packaging with your verified shop branding",
    ],
    metricBadge: "10,000+ Items • Zero Inventory Risk",
  },
  {
    id: "step-2",
    step: "02",
    tab: "1-Tap Social Storefront",
    title: "Instant WhatsApp & Instagram Micro-Storefronts",
    icon: Share2,
    accent: "text-blue-600 bg-blue-50 border-blue-200",
    description:
      "Launch a clean, branded campus web store in 60 seconds. Auto-generate high-resolution WhatsApp status flyers, direct buy links, and QR codes for quick peer ordering across college groups.",
    highlights: [
      "Custom shop URL with verified college roll-number badge",
      "Instant 1-click WhatsApp order routing and customer chat",
      "Real-time status flyer generator with live stock counts",
    ],
    metricBadge: "3.4x Higher Conversions via Campus Status",
  },
  {
    id: "step-3",
    step: "03",
    tab: "45-Min Delivery",
    title: "Hyperlocal Hostel Gate & Campus Handover",
    icon: Truck,
    accent: "text-amber-600 bg-amber-50 border-amber-200",
    description:
      "Orders are dispatched through student runners straight to hostel gates, study halls, and campus hangouts. Secure OTP handovers guarantee 100% arrival integrity without outside courier delays.",
    highlights: [
      "Sub-45 minute average delivery across university zones",
      "4-digit customer security OTP required upon package receipt",
      "Live order telemetry & status updates in the buyer portal",
    ],
    metricBadge: "<45m Average ETA • 100% OTP Verified",
  },
  {
    id: "step-4",
    step: "04",
    tab: "Instant UPI Payouts",
    title: "Sub-2 Second Direct Bank & UPI Settlement",
    icon: Wallet,
    accent: "text-emerald-600 bg-emerald-50 border-emerald-200",
    description:
      "When an order is successfully delivered, your margin unlocks immediately. Withdraw earnings in under 2 seconds straight to GPay, PhonePe, or Paytm with zero platform commission deductions.",
    highlights: [
      "100% of your retail margin is paid directly to you",
      "Zero withdrawal fees, zero holding periods, zero minimums",
      "Automated ledger with downloadable GST & earnings receipts",
    ],
    metricBadge: "Sub-2s UPI Transfer • 0% Platform Fee",
  },
];

export default function VideoStoryModal({ isOpen, onClose }) {
  const [activeStepId, setActiveStepId] = useState(TOUR_STEPS[0].id);

  if (!isOpen) return null;

  const currentStep =
    TOUR_STEPS.find((s) => s.id === activeStepId) || TOUR_STEPS[0];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-brandRed hover:text-white cursor-pointer"
          aria-label="Close tour"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 bg-[#FAF8F5]/80">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-brandRed/10 text-brandRed">
              <Zap size={13} />
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest text-brandRed">
              Platform Architecture Tour
            </span>
          </div>
          <h3 className="mt-1.5 text-xl sm:text-2xl font-black text-[#191616] tracking-tight">
            How SeroFast Powers India's Campus Commerce
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            A 4-step zero-capital commerce engine designed for student entrepreneurs.
          </p>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/70 p-2 gap-1.5 scrollbar-none">
          {TOUR_STEPS.map((s) => {
            const isActive = s.id === activeStepId;
            const StepIcon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStepId(s.id)}
                className={`flex flex-1 min-w-[140px] items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-brandRed shadow-xs border border-slate-200/80"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/60"
                }`}
              >
                <StepIcon size={14} className={isActive ? "text-brandRed" : "text-slate-400"} />
                <span className="truncate">{s.tab}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black text-brandRed">Step {currentStep.step}</span>
                <span className="text-slate-300">•</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                  {currentStep.metricBadge}
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-black text-[#191616] leading-snug">
                {currentStep.title}
              </h4>

              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentStep.description}
              </p>

              {/* Highlights */}
              <div className="mt-5 space-y-2">
                {currentStep.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 size={15} className="text-brandRed shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Icon Callout Card */}
            <div className="w-full md:w-56 shrink-0 rounded-2xl border border-slate-200/80 bg-[#FAF8F5] p-5 text-center flex flex-col items-center justify-center">
              <div className={`grid h-16 w-16 place-items-center rounded-2xl border shadow-inner ${currentStep.accent}`}>
                <Icon size={32} />
              </div>
              <div className="mt-3 text-xs font-black text-slate-800">
                100% Automated
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Campus peer network verified
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-[#FAF8F5]/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <ShieldCheck size={14} className="text-brandRed" />
            <span>Zero platform commission • 100% Free setup</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Close Tour
            </button>
            <Link
              to="/signup"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brandRed px-5 py-2 text-xs font-black text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition"
            >
              <span>Launch Store Now</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
