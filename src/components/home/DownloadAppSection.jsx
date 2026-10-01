import React from "react";
import {
  Star,
  QrCode,
  ShieldCheck,
  Zap,
  CheckCircle2,
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
                <div className="mt-7 flex flex-wrap items-center gap-3.5">
                  {/* Google Play */}
                  <button
                    type="button"
                    onClick={() => onOpenTeaser?.("Google Play Store")}
                    className="group inline-flex items-center gap-3.5 rounded-2xl bg-[#141416] hover:bg-black text-white px-5 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.18)] border border-slate-800 transition-all duration-300 hover:-translate-y-1 hover:border-brandRed/50 hover:shadow-[0_16px_36px_rgba(211,47,47,0.22)] active:scale-95 cursor-pointer"
                  >
                    <svg viewBox="0 0 512 512" className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:scale-110" fill="none">
                      <path d="M47.5 45.4c-3.1 5.3-4.8 11.5-4.8 18.5v384.2c0 7 1.7 13.2 4.8 18.5l224.2-210.6z" fill="#4285F4"/>
                      <path d="M344.6 153.9L271.7 256l72.9 102.1 82.5-47.6c17.5-10.1 17.5-26.6 0-36.7z" fill="#34A853"/>
                      <path d="M47.5 45.4l297.1 108.5-72.9 102.1z" fill="#FBBC04"/>
                      <path d="M47.5 466.6l224.2-210.6 72.9 102.1z" fill="#EA4335"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none">
                        GET IT ON
                      </div>
                      <div className="text-[15px] font-black leading-tight text-white mt-0.5">
                        Google Play
                      </div>
                    </div>
                  </button>

                  {/* Apple App Store */}
                  <button
                    type="button"
                    onClick={() => onOpenTeaser?.("Apple App Store")}
                    className="group inline-flex items-center gap-3.5 rounded-2xl bg-[#141416] hover:bg-black text-white px-5 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.18)] border border-slate-800 transition-all duration-300 hover:-translate-y-1 hover:border-brandRed/50 hover:shadow-[0_16px_36px_rgba(211,47,47,0.22)] active:scale-95 cursor-pointer"
                  >
                    <svg viewBox="0 0 170 170" className="h-6 w-6 shrink-0 fill-current text-white transition-transform duration-300 group-hover:scale-110">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.32-7.23-11.02-12.72-22.95-16.48-35.8-3.76-12.84-5.64-24.89-5.64-36.14 0-14.45 3.73-26.68 11.19-36.7 7.46-10.02 17.07-15.17 28.84-15.46 5.86 0 12.35 1.48 19.46 4.45 7.12 2.97 11.66 4.5 13.63 4.5 1.57 0 6.32-1.61 14.25-4.83 7.93-3.22 14.54-4.59 19.82-4.11 14.97 1.25 26.63 6.94 34.98 17.07-13.14 7.94-19.52 18.82-19.14 32.65.38 10.79 4.41 19.82 12.09 27.09 4.3 4.12 9.28 7.13 14.93 9.03-2.61 7.63-5.83 15.08-9.66 22.35zM119.22 33.11c0-7.39 2.66-14.22 7.97-20.48 5.32-6.26 11.83-10.15 19.53-11.68.74 7.14-1.74 13.88-7.44 20.21-5.7 6.34-12.38 10.19-20.06 11.56v.39z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none">
                        DOWNLOAD ON THE
                      </div>
                      <div className="text-[15px] font-black leading-tight text-white mt-0.5">
                        App Store
                      </div>
                    </div>
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
                      Scan QR to Install SeroFast
                    </div>
                    <p className="mt-1 text-xs text-[#777] max-w-[280px] mx-auto leading-relaxed">
                      Open your camera to instantly download on iOS &amp; Android. Direct link to official store.
                    </p>

                    {/* Live Campus Highlights Strip */}
                    <div className="mt-4 space-y-2 text-left">
                      <div className="flex items-center justify-between rounded-xl border border-[#F0EBE6] bg-[#FAF8F5]/80 p-2.5 shadow-2xs">
                        <div className="flex items-center gap-2">
                          <div className="grid h-6 w-6 place-items-center rounded-lg bg-brandRed/10 text-brandRed">
                            <ShieldCheck size={13} />
                          </div>
                          <span className="text-[11px] font-bold text-[#191616]">
                            Zero Platform Commission
                          </span>
                        </div>
                        <span className="rounded-full bg-brandRed/10 px-2 py-0.5 text-[9px] font-extrabold text-brandRed">
                          100% Free
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl border border-[#F0EBE6] bg-[#FAF8F5]/80 p-2.5 shadow-2xs">
                        <div className="flex items-center gap-2">
                          <div className="grid h-6 w-6 place-items-center rounded-lg bg-brandRed/10 text-brandRed">
                            <Zap size={13} />
                          </div>
                          <span className="text-[11px] font-bold text-[#191616]">
                            Hostel Doorstep Delivery
                          </span>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold text-[#555]">
                          45-Min
                        </span>
                      </div>
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
