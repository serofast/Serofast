import React from "react";
import {
  Smartphone,
  Download,
  Star,
  QrCode,
  ShieldCheck,
  Check,
} from "lucide-react";
import ScrollReveal from "../reusable/ScrollReveal";
import useCountUp from "../../hooks/useCountUp";

export default function DownloadAppSection({ onOpenTeaser }) {
  const downloadCount = useCountUp(10000, 1600);

  return (
    <section
      id="download-app"
      className="bg-gradient-to-br from-red-50/80 via-white to-rose-50/50 py-12 lg:py-16 text-[#191616] relative overflow-hidden border-b border-[#EBE3DC]"
    >
      {/* Subtle Ambient Red Glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brandRed/10 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-rose-200/25 blur-3xl" />

      <div className="relative mx-auto w-[min(1400px,calc(100%_-_32px))]">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px]">
          <ScrollReveal variant="fade-right" duration={650}>
            <span className="rounded-full bg-white px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brandRed border border-brandRed/20 shadow-xs inline-flex items-center gap-1.5">
              <span>📱 Mobile Application Available Now</span>
            </span>

            <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight text-[#191616]">
              Start Your Campus Business <br />
              <span className="text-brandRed">From Your Pocket.</span>
            </h2>

            <p className="mt-3 text-sm text-[#555] max-w-[560px] leading-relaxed">
              Download the SeroFast mobile application today. Join thousands of student sellers and college creators turning their free time into real income across India.
            </p>

            {/* Download CTA Buttons (Button Micro-Interactions) */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {/* Google Play */}
              <button
                type="button"
                onClick={() => onOpenTeaser?.("Google Play Store")}
                className="vivo-card-interactive group inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-5 py-3 text-[#191616] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brandRed/40 active:scale-95 cursor-pointer"
              >
                <Smartphone size={20} className="text-brandRed transition-transform duration-200 group-hover:scale-110" />
                <div className="text-left">
                  <div className="text-[9px] font-bold text-[#777] uppercase leading-none">GET IT ON</div>
                  <div className="text-xs font-black leading-tight">Google Play</div>
                </div>
              </button>

              {/* Apple App Store */}
              <button
                type="button"
                onClick={() => onOpenTeaser?.("Apple App Store")}
                className="vivo-card-interactive group inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-5 py-3 text-[#191616] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brandRed/40 active:scale-95 cursor-pointer"
              >
                <Smartphone size={20} className="text-slate-800 transition-transform duration-200 group-hover:scale-110" />
                <div className="text-left">
                  <div className="text-[9px] font-bold text-[#777] uppercase leading-none">DOWNLOAD ON</div>
                  <div className="text-xs font-black leading-tight">App Store</div>
                </div>
              </button>

              {/* Direct APK */}
              <button
                type="button"
                onClick={() => onOpenTeaser?.("Android APK Download")}
                className="vivo-card-interactive inline-flex items-center gap-2 rounded-xl bg-brandRed px-5 py-3 text-xs font-bold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition-all duration-200 hover:-translate-y-1 active:scale-95 cursor-pointer"
              >
                <Download size={15} />
                <span>Direct APK (v2.4.0)</span>
              </button>
            </div>

            {/* Dynamic Animated Statistics */}
            <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-slate-200 pt-4 text-xs text-[#666]">
              <div className="flex items-center gap-1 font-bold text-[#191616]">
                <Star size={14} className="text-amber-500" fill="#f59e0b" />
                <span>4.8 / 5 Rating</span>
              </div>
              <div>•</div>
              <div className="tabular-nums font-medium">
                <span className="font-black text-[#191616]">{downloadCount.toLocaleString("en-IN")}+</span> student downloads
              </div>
              <div>•</div>
              <div className="flex items-center gap-1 text-emerald-600 font-bold">
                <ShieldCheck size={14} />
                <span>100% Free Setup</span>
              </div>
            </div>
          </ScrollReveal>

          {/* QR Code Container (With Animated Pulse Glow Ring) */}
          <ScrollReveal variant="scale-up" duration={700} delay={150}>
            <div className="vivo-card-interactive rounded-3xl border border-slate-200/90 bg-white p-6 text-center shadow-lg transition-transform hover:scale-102">
              <div className="relative mx-auto grid h-44 w-44 place-items-center rounded-2xl bg-slate-50 p-3 border border-slate-100">
                {/* Animated breathing pulse ring */}
                <div className="absolute -inset-1 rounded-3xl border-2 border-brandRed/20 animate-vivo-pulse-ring pointer-events-none" />

                <div className="relative h-full w-full flex items-center justify-center">
                  <QrCode size={140} className="text-[#191616]" />
                  <div className="absolute grid h-8 w-8 place-items-center rounded-lg bg-brandRed text-white shadow-md animate-pulse">
                    <span className="text-xs font-black">SF</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs font-black text-[#191616]">Scan with Camera to Install</div>
              <div className="mt-1 text-[11px] text-[#777]">
                Instant detection for both Android &amp; iOS devices
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
