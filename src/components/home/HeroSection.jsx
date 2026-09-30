import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  GraduationCap,
  MapPin,
  Play,
  ShieldCheck,
  TrendingUp,
  Users,
  ShoppingBag,
  Coins,
} from "lucide-react";
import useCountUp from "../../hooks/useCountUp";

export default function HeroSection({ onOpenVideo }) {
  const ordersCount = useCountUp(12480, 1800);
  const sellersCount = useCountUp(320, 1600);

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-68px)] lg:h-[calc(100vh-68px)] flex flex-col justify-between overflow-hidden border-b border-[#EBE3DC] bg-white select-none"
    >
      {/* Background Image: User provided student hero banner */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-[center_right_10%] lg:bg-[center_right_20%]"
        style={{
          backgroundImage: "url('/hero-student-banner.png')",
        }}
      />

      {/* Ambient Red Glow Effects (Modern SaaS Aesthetic - Clean Light) */}
      <div className="pointer-events-none absolute -left-20 top-12 h-96 w-96 rounded-full bg-brandRed/[0.08] blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-80 w-80 rounded-full bg-rose-200/25 blur-[100px]" />

      {/* Left White Gradient Overlay for crystal clear typography */}
      <div
        className="pointer-events-none absolute inset-0 z-1"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.94) 34%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0.15) 70%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* Top Hero Content Container */}
      <div className="relative z-10 mx-auto w-[min(1400px,calc(100%_-_32px))] pt-6 sm:pt-10 lg:pt-12 flex-1 flex flex-col justify-center">
        <div className="max-w-[620px]">
          {/* Animated Badge */}
          <div className="animate-fade-in-down inline-flex items-center gap-2 rounded-full border border-brandRed/20 bg-white/95 px-3.5 py-1.5 shadow-sm backdrop-blur-md transition-transform hover:scale-105">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brandRed opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brandRed" />
            </span>
            <span className="text-xs font-extrabold text-brandRed">
              India's Student-Powered Social Commerce
            </span>
          </div>

          {/* Headline with staggered entrance */}
          <h1 className="animate-fade-in-up animation-delay-100 mt-4 text-[clamp(2.5rem,4.8vw,4.4rem)] font-black leading-[1.04] tracking-[-0.035em] text-[#191616]">
            Shop Local. <br />
            <span className="text-brandRed">Discover More.</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up animation-delay-200 mt-3 text-base leading-relaxed text-[#4f4a4a] sm:text-lg max-w-[500px]">
            Explore unique products from independent Serofast shops, built
            and managed by students and creators across India.
          </p>

          {/* CTAs with Button Micro-Interactions */}
          <div className="animate-fade-in-up animation-delay-300 mt-6 flex flex-wrap items-center gap-3.5">
            <a
              href="#app-preview"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brandRed px-7 text-sm font-extrabold text-white shadow-lg shadow-brandRed/25 transition-all duration-200 hover:-translate-y-1 hover:bg-brandRedDark hover:shadow-brandRed/40 active:scale-95 cursor-pointer"
            >
              <span>Explore App Features</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>

            <Link
              to="/signup"
              className="group inline-flex h-12 items-center justify-center rounded-xl border-2 border-brandRed bg-white/90 px-7 text-sm font-extrabold text-brandRed shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-brandRed hover:text-white active:scale-95"
            >
              <span>Become a Seller</span>
            </Link>
          </div>

          {/* Animated Statistics Metric Bar */}
          <div className="animate-fade-in-up animation-delay-400 mt-6 grid grid-cols-3 gap-2.5 sm:gap-4 border-t border-[#EBE3DC]/80 pt-4 max-w-[480px]">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#777]">
                <ShoppingBag size={13} className="text-brandRed" />
                <span>Orders</span>
              </div>
              <div className="mt-0.5 text-base font-black text-[#191616] sm:text-lg tabular-nums">
                {ordersCount.toLocaleString("en-IN")}+
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#777]">
                <Users size={13} className="text-brandRed" />
                <span>Active Sellers</span>
              </div>
              <div className="mt-0.5 text-base font-black text-[#191616] sm:text-lg tabular-nums">
                {sellersCount}+
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#777]">
                <Coins size={13} className="text-emerald-600" />
                <span>Margin Kept</span>
              </div>
              <div className="mt-0.5 text-base font-black text-emerald-700 sm:text-lg">
                100% Yours
              </div>
            </div>
          </div>
        </div>

        {/* Floating Video Pill (Center near the student) */}
        <div className="hidden md:block absolute left-[38%] top-[60%] -translate-y-1/2 z-20">
          <button
            type="button"
            onClick={onOpenVideo}
            className="group flex items-center gap-3 rounded-full border border-white/80 bg-white/95 py-2 pl-2 pr-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:shadow-[0_12px_36px_rgba(210,33,37,0.2)] active:scale-95"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brandRed text-white shadow-md transition-transform duration-200 group-hover:scale-110">
              <Play size={16} fill="white" className="ml-0.5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-[#191616]">Our Story</div>
              <div className="text-[10px] font-semibold text-[#666]">
                Watch Video
              </div>
            </div>
          </button>
        </div>

        {/* Playful Stickers & Callouts with gentle floating animation */}
        <div className="hidden lg:block absolute left-[36%] top-[8%] z-10 pointer-events-none animate-float-slow">
          <div className="font-serif italic text-sm font-bold text-brandRed transform -rotate-12 flex flex-col items-center">
            <span>Students</span>
            <span>Shop</span>
            <span>Share</span>
            <span className="font-black text-brandRedDark">Earn</span>
          </div>
        </div>

        <div className="hidden xl:block absolute right-[26%] top-[10%] z-10 pointer-events-none text-right animate-float-reverse">
          <div className="inline-flex items-center gap-1.5 font-serif italic text-sm font-bold text-[#b71c1c]">
            <MapPin size={14} className="text-brandRed" />
            <span>From Kanyakumari</span>
          </div>
          <div className="text-xs font-extrabold text-[#555] tracking-wide">
            to India ✈️
          </div>
        </div>

        <div className="hidden xl:block absolute right-[18%] top-[24%] z-10 pointer-events-none text-right max-w-[150px]">
          <div className="font-serif italic text-xs font-semibold text-[#333] leading-snug">
            Same Students. <br />
            Same Place. <br />
            <span className="font-bold text-brandRed">Bigger Opportunities.</span>
          </div>
        </div>

        {/* 3 Polaroids Floating Over Kanyakumari Ocean View */}
        <div className="hidden lg:flex items-center gap-3 absolute right-4 bottom-18 z-20">
          {/* Polaroid 1: Kanyakumari */}
          <div className="transform -rotate-6 transition-transform duration-300 hover:rotate-0 hover:scale-110 hover:z-30 cursor-pointer rounded-lg bg-white p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.15)] border border-[#ddd] animate-vivo-float">
            <img
              src="/landing/kanyakumari.jpg"
              alt="Kanyakumari"
              className="h-20 w-22 object-cover rounded"
            />
            <div className="pt-1.5 text-center font-serif text-[10px] font-bold text-[#444]">
              Kanyakumari
            </div>
          </div>

          {/* Polaroid 2: Students */}
          <div
            className="transform rotate-3 transition-transform duration-300 hover:rotate-0 hover:scale-110 hover:z-30 cursor-pointer rounded-lg bg-white p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.15)] border border-[#ddd] animate-vivo-float"
            style={{ animationDelay: "1.5s" }}
          >
            <img
              src="/landing/students.jpg"
              alt="Students"
              className="h-20 w-22 object-cover rounded"
            />
            <div className="pt-1.5 text-center font-serif text-[10px] font-bold text-[#444]">
              Students
            </div>
          </div>

          {/* Polaroid 3: Opportunities */}
          <div
            className="transform -rotate-3 transition-transform duration-300 hover:rotate-0 hover:scale-110 hover:z-30 cursor-pointer rounded-lg bg-white p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.15)] border border-[#ddd] animate-vivo-float"
            style={{ animationDelay: "3s" }}
          >
            <img
              src="/landing/opportunities.jpg"
              alt="Opportunities"
              className="h-20 w-22 object-cover rounded"
            />
            <div className="pt-1.5 text-center font-serif text-[10px] font-bold text-[#444]">
              Opportunities
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
