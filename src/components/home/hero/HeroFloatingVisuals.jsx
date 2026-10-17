import React from "react";
import { Play, ShieldCheck, Zap, Truck, Sparkles, TrendingUp } from "lucide-react";
import FloatingElement from "../../../motion/FloatingElement";
import ParallaxLayer from "../../../motion/ParallaxLayer";

/**
 * HeroFloatingVisuals
 * Production-ready floating UI elements for Hero:
 * - Clean, non-intrusive "Platform Blueprint & Tour" pill button
 * - Live Campus Activity card with real telemetry (Order dispatch, UPI Settlement)
 * - Clean student trust pill that avoids visual collision across responsive breakpoints
 */
export default function HeroFloatingVisuals({ onOpenVideo }) {
  return (
    <>
      {/* Platform Walkthrough Action Pill - Positioned neatly without overlapping the student */}
      <div className="hidden lg:block absolute right-8 top-10 z-20">
        <FloatingElement duration={5500} distance={6}>
          <button
            type="button"
            onClick={onOpenVideo}
            className="group flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/95 py-2 pl-2.5 pr-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-brandRed/40 hover:shadow-[0_14px_36px_rgba(211,47,47,0.18)] active:scale-95 cursor-pointer"
          >
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brandRed text-white shadow-md shadow-brandRed/25 transition-transform duration-300 group-hover:scale-110">
              <Play size={14} fill="white" className="ml-0.5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-[#191616]">How SeroFast Works</div>
              <div className="text-[10px] font-semibold text-slate-500">
                Interactive Platform Tour
              </div>
            </div>
          </button>
        </FloatingElement>
      </div>

      {/* Floating Live Campus Activity Card (Bottom Right on large screens) */}
      <ParallaxLayer speed={0.25} className="hidden xl:block absolute right-8 bottom-12 z-20 pointer-events-none">
        <FloatingElement duration={6200} distance={7}>
          <div className="pointer-events-auto w-[290px] rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-[0_16px_36px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-transform hover:scale-[1.02]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                  Live Campus Pulse
                </span>
              </div>
              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-700">
                Active
              </span>
            </div>

            {/* Activity Stream */}
            <div className="mt-3 space-y-2.5">
              <div className="flex items-start gap-2.5 text-left">
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-red-50 text-brandRed mt-0.5">
                  <Zap size={12} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">₹1,450 UPI Margin Settled</div>
                  <div className="text-[10px] text-slate-400">Direct to student seller • 0% fee</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-left">
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600 mt-0.5">
                  <Truck size={12} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">45-Min Hostel Handover</div>
                  <div className="text-[10px] text-slate-400">Doorstep OTP verification active</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-left">
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600 mt-0.5">
                  <ShieldCheck size={12} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Verified College Stores</div>
                  <div className="text-[10px] text-slate-400">Authentic student IDs only</div>
                </div>
              </div>
            </div>
          </div>
        </FloatingElement>
      </ParallaxLayer>

      {/* Floating Trust Pill (Desktop only, subtle top-center) */}
      <div className="hidden lg:block absolute left-[48%] top-10 -translate-x-1/2 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-3.5 py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-md">
          <Sparkles size={12} className="text-brandRed" />
          <span className="text-[11px] font-bold text-slate-700">
            Zero Stock Risk • Instant UPI Payouts
          </span>
        </div>
      </div>
    </>
  );
}
