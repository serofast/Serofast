import React from "react";
import { Link } from "react-router-dom";
import {
  Store,
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  Download,
} from "lucide-react";
import ParallaxLayer from "../../motion/ParallaxLayer";
import ScrollTitleReveal from "../../motion/ScrollTitleReveal";
import ScrollReveal from "../reusable/ScrollReveal";
import { TextAnimate } from "@/registry/magicui/text-animate";

export default function DualModeExperience() {
  return (
    <section id="dual-mode" className="relative border-b border-[#EBE3DC] bg-[#FAF8F5] py-14 lg:py-20 select-none overflow-hidden">
      {/* Ambient Parallax Glow */}
      <ParallaxLayer speed={0.16} className="section-atmosphere">
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-brandRed/[0.04] blur-3xl" />
        <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-rose-200/20 blur-3xl" />
      </ParallaxLayer>

      <div className="relative mx-auto w-[min(1400px,calc(100%_-_32px))]">
        {/* Section Header with MagicUI blurInUp text entrance */}
        <div className="mx-auto max-w-3xl text-center">
          <TextAnimate
            animation="blurInUp"
            by="word"
            once
            as="h2"
            duration={650}
            className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-black text-[#191616]"
          >
            Engineered for Both Student Sellers & Campus Shoppers
          </TextAnimate>

          <ScrollTitleReveal direction="up" delay={180} duration={850}>
            <p className="mt-2 text-sm text-[#555] max-w-xl mx-auto">
              Switch seamlessly between managing your campus storefront and shopping verified peer deals.
            </p>
          </ScrollTitleReveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Seller Mode Card — Styled like Core Commerce Card */}
          <ScrollReveal
            variant="fade-right"
            duration={700}
            className="h-full"
          >
            <div className="saas-card-interactive relative flex h-full flex-col justify-between overflow-hidden rounded-[35px] border border-[#F3E5E5] bg-white p-6 sm:p-8 shadow-[-4px_5px_12px_rgba(211,47,47,0.14),-7px_8px_20px_rgba(211,47,47,0.06)] transition-all duration-300 hover:border-brandRed/30">
              {/* Subtle soft gradient warmth */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-100/35 blur-2xl" />
              <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-amber-50/40 blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brandRed text-white shadow-md shadow-brandRed/20 transition-transform duration-300 group-hover:scale-105">
                    <Store size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-brandRed">
                      For Student Sellers
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#191616]">Seller Mode</h3>
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Turn your phone into a full-scale commerce backend. Share products, manage customer orders, track profits, and withdraw cash daily.
                </p>

                <div className="mt-5 space-y-2.5">
                  {[
                    "Zero inventory risk — SeroFast stocks and ships",
                    "Custom margin setting on every single item",
                    "Auto-generated WhatsApp & Instagram promo posters",
                    "Instant UPI withdrawals directly to GPay / PhonePe",
                    "Official student entrepreneur certification & badges",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-2xl border border-[#F3E5E5] bg-[#FAF8F8]/60 px-4 py-3 text-xs font-medium text-slate-700 transition-colors hover:bg-white hover:border-brandRed/25"
                    >
                      <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brandRed/10 text-brandRed">
                        <CheckCircle2 size={12} strokeWidth={2.5} />
                      </div>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-6 pt-5 border-t border-[#F3E5E5]">
                <Link
                  to="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brandRed py-3.5 text-xs font-black text-white shadow-md shadow-brandRed/20 transition-all duration-200 hover:bg-brandRedDark hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Register as a Seller</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Buyer Mode Card — Styled like Core Commerce Card with Brand Red Accents (No Black, No Green) */}
          <ScrollReveal
            variant="fade-left"
            duration={650}
            className="h-full"
          >
            <div className="saas-card-interactive relative flex h-full flex-col justify-between overflow-hidden rounded-[35px] border border-[#F3E5E5] bg-white p-6 sm:p-8 shadow-[-4px_5px_12px_rgba(211,47,47,0.14),-7px_8px_20px_rgba(211,47,47,0.06)] transition-all duration-300 hover:border-brandRed/30">
              {/* Subtle soft gradient warmth */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-100/35 blur-2xl" />
              <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-amber-50/40 blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brandRed text-white shadow-md shadow-brandRed/20 transition-transform duration-300 group-hover:scale-105">
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-brandRed">
                      For Campus Shoppers
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#191616]">Buyer Mode</h3>
                  </div>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Discover curated products sold by fellow college students. Enjoy hostel doorstep delivery, verified quality, and student pricing.
                </p>

                <div className="mt-5 space-y-2.5">
                  {[
                    "Support verified student entrepreneurs across your campus",
                    "Hyperlocal delivery straight to college hostels & blocks",
                    "Exclusive student discounts up to 40% OFF",
                    "Real-time runner GPS tracking with arrival OTP",
                    "Secure UPI checkout & 7-day hassle-free returns",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-2xl border border-[#F3E5E5] bg-[#FAF8F8]/60 px-4 py-3 text-xs font-medium text-slate-700 transition-colors hover:bg-white hover:border-brandRed/25"
                    >
                      <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brandRed/10 text-brandRed">
                        <CheckCircle2 size={12} strokeWidth={2.5} />
                      </div>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-6 pt-5 border-t border-[#F3E5E5]">
                <a
                  href="#download-app"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brandRed py-3.5 text-xs font-black text-white shadow-md shadow-brandRed/20 transition-all duration-200 hover:bg-brandRedDark hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Download App to Shop</span>
                  <Download size={14} />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
