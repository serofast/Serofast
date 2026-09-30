import React from "react";
import {
  Smartphone,
  Download,
  Star,
  QrCode,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Layers,
} from "lucide-react";
import { TextAnimate } from "@/registry/magicui/text-animate";
import ParallaxLayer from "../../motion/ParallaxLayer";
import ScrollTitleReveal from "../../motion/ScrollTitleReveal";
import FloatingElement from "../../motion/FloatingElement";
import ScrollReveal from "../reusable/ScrollReveal";
import useCountUp from "../../hooks/useCountUp";

export default function DownloadAppSection({ onOpenTeaser }) {
  const downloadCount = useCountUp(10000, 1600);

  return (
    <section
      id="download-app"
      className="relative overflow-hidden border-b border-[#EBE3DC] bg-gradient-to-b from-[#FAF8F5] via-white to-red-50/30 py-16 lg:py-24 select-none"
    >
      {/* Ambient Parallax Gradient Lights */}
      <ParallaxLayer speed={0.16} className="section-atmosphere">
        <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-brandRed/[0.08] blur-[120px] animate-pulse-glow" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-rose-200/25 blur-[140px]" />
      </ParallaxLayer>

      <div className="relative mx-auto w-[min(1400px,calc(100%_-_32px))]">
        {/* Main Glassmorphic Showcase Box */}
        <div className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/75 p-6 sm:p-10 lg:p-14 shadow-[0_20px_60px_rgba(211,47,47,0.06)] backdrop-blur-2xl">
          {/* Subtle Decorative Grid Pattern inside Card */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(#191616 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* Left Content (Cols 1-7) */}
            <div className="lg:col-span-7">
              <div>
                <TextAnimate
                  animation="blurInUp"
                  by="character"
                  once
                  as="h2"
                  className="text-[clamp(2rem,4.2vw,3.4rem)] font-black leading-[1.08] tracking-tight text-[#191616]"
                >
                  Power Your Campus Business <br />
                  <span className="text-brandRed">Right From Your Pocket.</span>
                </TextAnimate>

                <ScrollTitleReveal direction="up" delay={180} duration={850}>
                  <p className="mt-3.5 text-sm text-[#555] sm:text-base max-w-[560px] leading-relaxed">
                    Download the SeroFast mobile application today. Join thousands of verified college creators, hostel resellers, and campus shoppers turning idle time into verified earnings across India.
                  </p>
                </ScrollTitleReveal>

                {/* Key Benefits Pills (Strictly No Green) */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-[520px]">
                  {[
                    "Zero inventory required upfront",
                    "Instant UPI withdrawals daily",
                    "45-Min campus hostel doorstep delivery",
                    "Official student entrepreneur badge",
                  ].map((benefit, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs font-bold text-[#333]"
                    >
                      <CheckCircle2 size={15} className="text-brandRed shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Download CTA Buttons */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {/* Google Play */}
                  <button
                    type="button"
                    onClick={() => onOpenTeaser?.("Google Play Store")}
                    className="group inline-flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-3 text-[#191616] shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-brandRed/40 hover:shadow-md active:scale-95 cursor-pointer"
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-brandRed transition-transform duration-200 group-hover:scale-110">
                      <Smartphone size={18} />
                    </div>
                    <div className="text-left">
                      <div className="text-[9px] font-extrabold uppercase text-[#777] leading-none">
                        GET IT ON
                      </div>
                      <div className="text-xs font-black leading-tight text-[#191616]">
                        Google Play
                      </div>
                    </div>
                  </button>

                  {/* Apple App Store */}
                  <button
                    type="button"
                    onClick={() => onOpenTeaser?.("Apple App Store")}
                    className="group inline-flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-3 text-[#191616] shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-brandRed/40 hover:shadow-md active:scale-95 cursor-pointer"
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-800 transition-transform duration-200 group-hover:scale-110">
                      <Smartphone size={18} />
                    </div>
                    <div className="text-left">
                      <div className="text-[9px] font-extrabold uppercase text-[#777] leading-none">
                        DOWNLOAD ON
                      </div>
                      <div className="text-xs font-black leading-tight text-[#191616]">
                        App Store
                      </div>
                    </div>
                  </button>

                  {/* Direct APK */}
                  <button
                    type="button"
                    onClick={() => onOpenTeaser?.("Android APK Download")}
                    className="group inline-flex items-center gap-2.5 rounded-2xl bg-brandRed px-5 py-3 text-xs font-extrabold text-white shadow-md shadow-brandRed/25 transition-all duration-200 hover:-translate-y-1 hover:bg-brandRedDark hover:shadow-brandRed/40 active:scale-95 cursor-pointer"
                  >
                    <Download size={16} className="transition-transform group-hover:translate-y-0.5" />
                    <span>Direct APK (v2.4.0)</span>
                  </button>
                </div>

                {/* Trust Metrics Bar (No Green Used) */}
                <div className="mt-7 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-slate-200/80 pt-4 text-xs text-[#666]">
                  <div className="flex items-center gap-1 font-bold text-[#191616]">
                    <Star size={14} className="text-amber-500" fill="#f59e0b" />
                    <span>4.9 / 5 Rating</span>
                  </div>
                  <div>•</div>
                  <div className="tabular-nums font-medium">
                    <span className="font-black text-[#191616]">
                      {downloadCount.toLocaleString("en-IN")}+
                    </span>{" "}
                    active installs
                  </div>
                  <div>•</div>
                  <div className="flex items-center gap-1 text-[#191616] font-bold">
                    <ShieldCheck size={14} className="text-brandRed" />
                    <span>100% Free Student Setup</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive QR & Device Showcase (Cols 8-12) */}
            <div className="lg:col-span-5 flex justify-center">
              <ScrollReveal variant="fade-left" duration={700} delay={100} className="w-full max-w-[380px]">
                <FloatingElement duration={5600} distance={7} mouseTrack={true}>
                  <div className="saas-card-interactive group relative rounded-3xl border border-white/90 bg-white/95 p-7 text-center shadow-xl backdrop-blur-xl">
                    {/* Subtle Top Badge */}
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-[#444]">
                      <QrCode size={13} className="text-brandRed" />
                      <span>Fast Instant Install</span>
                    </div>

                  {/* QR Code Container with Animated Scan Line & Pulse Ring */}
                  <div className="relative mx-auto mt-5 grid h-52 w-52 place-items-center rounded-3xl bg-slate-50 p-4 border border-slate-200 shadow-inner overflow-hidden">
                    {/* Glowing Pulse Ring */}
                    <div className="absolute -inset-1 rounded-3xl border-2 border-brandRed/25 animate-vivo-pulse-ring pointer-events-none" />

                    <div className="relative h-full w-full flex items-center justify-center">
                      <QrCode size={168} className="text-[#191616]" />

                      {/* Animated Laser Scanning Beam */}
                      <div
                        className="pointer-events-none absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brandRed to-transparent shadow-[0_0_12px_rgba(211,47,47,0.8)] opacity-70 animate-bounce"
                        style={{ animationDuration: "2.4s" }}
                      />

                      {/* Central Badge */}
                      <div className="absolute grid h-9 w-9 place-items-center rounded-xl bg-brandRed text-white shadow-md">
                        <span className="text-xs font-black">SF</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 text-sm font-black text-[#191616]">
                    Point Camera to Install
                  </div>
                  <p className="mt-1 text-xs text-[#777]">
                    Automatically opens iOS App Store or Android Play Store
                  </p>

                  {/* Floating Micro Notification Card */}
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/70 p-2.5 text-left shadow-2xs">
                    <div className="flex items-center gap-2">
                      <div className="grid h-6 w-6 place-items-center rounded-lg bg-brandRed text-white">
                        <Zap size={12} />
                      </div>
                      <div className="text-[10px] font-bold text-[#191616]">
                        Order Alert: Hostel 2 Delivery
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-brandRed">₹890</span>
                  </div>
                </div>
              </FloatingElement>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
