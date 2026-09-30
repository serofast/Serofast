import React from "react";
import { Link } from "react-router-dom";
import {
  Store,
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  Download,
} from "lucide-react";
import ScrollReveal from "../reusable/ScrollReveal";

export default function DualModeExperience() {
  return (
    <section id="dual-mode" className="border-b border-[#EBE3DC] bg-[#FAF8F5] py-12 lg:py-16 select-none">
      <div className="mx-auto w-[min(1400px,calc(100%_-_32px))]">
        <ScrollReveal variant="fade-down" duration={600} className="mx-auto max-w-3xl text-center">
          <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-black text-[#191616]">
            Engineered for Both Student Sellers &amp; Campus Shoppers
          </h2>
          <p className="mt-2 text-sm text-[#555] max-w-xl mx-auto">
            Switch seamlessly between managing your campus storefront and shopping verified peer deals.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Seller Mode Card */}
          <ScrollReveal
            variant="fade-right"
            duration={650}
            className="h-full"
          >
            <div className="vivo-card-interactive group flex h-full flex-col justify-between rounded-3xl border border-[#EBE3DC] bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-brandRed/30">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brandRed text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                    <Store size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-brandRed">
                      For Student Sellers
                    </span>
                    <h3 className="text-xl font-black text-[#191616]">Seller Mode</h3>
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#555] leading-relaxed sm:text-sm">
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
                      className="flex items-center gap-2.5 text-xs font-bold text-[#333] transition-transform duration-200 hover:translate-x-1"
                    >
                      <CheckCircle2 size={16} className="text-brandRed shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#F0EBE6]">
                <Link
                  to="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brandRed py-3 text-xs font-black text-white shadow-md shadow-brandRed/20 transition-all duration-200 hover:bg-brandRedDark hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Register as a Seller</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Buyer Mode Card (Strictly No Green: Sleek Obsidian & Brand Red Accents) */}
          <ScrollReveal
            variant="fade-left"
            duration={650}
            className="h-full"
          >
            <div className="vivo-card-interactive group flex h-full flex-col justify-between rounded-3xl border border-[#EBE3DC] bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-400">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white shadow-md transition-transform duration-300 group-hover:scale-105">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                      For Campus Shoppers
                    </span>
                    <h3 className="text-xl font-black text-[#191616]">Buyer Mode</h3>
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#555] leading-relaxed sm:text-sm">
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
                      className="flex items-center gap-2.5 text-xs font-bold text-[#333] transition-transform duration-200 hover:translate-x-1"
                    >
                      <CheckCircle2 size={16} className="text-slate-800 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#F0EBE6]">
                <a
                  href="#download-app"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-900 bg-slate-900 py-3 text-xs font-black text-white shadow-md transition-all duration-200 hover:bg-black hover:-translate-y-0.5 active:scale-95"
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
