import React from "react";
import { Play, MapPin } from "lucide-react";
import FloatingElement from "../../../motion/FloatingElement";
import ParallaxLayer from "../../../motion/ParallaxLayer";

/**
 * HeroFloatingVisuals
 * Floating UI elements in the Hero section:
 * - "Our Story" video pill button with gentle levitation
 * - Playful student callouts & stickers
 * - 3 Floating polaroids with independent float timing and hover 3D tilt
 */
export default function HeroFloatingVisuals({ onOpenVideo }) {
  return (
    <>
      {/* Floating Video Pill Button (Center-Right near student) */}
      <div className="hidden md:block absolute left-[38%] top-[58%] -translate-y-1/2 z-20">
        <FloatingElement duration={5200} distance={7} mouseTrack={true}>
          <button
            type="button"
            onClick={onOpenVideo}
            className="group flex items-center gap-3 rounded-full border border-white/80 bg-white/95 py-2 pl-2 pr-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-[0_14px_40px_rgba(229,25,32,0.22)] active:scale-95 cursor-pointer"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brandRed text-white shadow-md transition-transform duration-300 group-hover:scale-110">
              <Play size={16} fill="white" className="ml-0.5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black text-[#191616]">Our Story</div>
              <div className="text-[10px] font-semibold text-[#666]">
                Watch Video
              </div>
            </div>
          </button>
        </FloatingElement>
      </div>

      {/* Decorative Callout Stickers with Parallax Layer (0.40x speed) */}
      <ParallaxLayer speed={0.4} className="hidden lg:block absolute inset-0 pointer-events-none">
        {/* Sticker 1: Students • Shop • Share • Earn - Floating Sway Animation */}
        <div className="absolute left-[34%] top-[7%] z-10 pointer-events-auto">
          <div
            style={{
              animation: "heroFloatingSway 5.6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
              willChange: "transform",
            }}
            className="group relative select-none cursor-default transition-all duration-300 hover:scale-110"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-brandRed/25 bg-white/95 px-4 py-2 shadow-[0_10px_28px_rgba(211,47,47,0.16)] backdrop-blur-md transition-shadow duration-300 group-hover:shadow-[0_16px_36px_rgba(211,47,47,0.28)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brandRed opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brandRed" />
              </span>
              <div className="font-serif italic text-xs sm:text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                <span>Students</span>
                <span className="text-brandRed font-black">•</span>
                <span>Shop</span>
                <span className="text-brandRed font-black">•</span>
                <span>Share</span>
                <span className="text-brandRed font-black">•</span>
                <span className="rounded-md bg-brandRed px-1.5 py-0.5 font-sans not-italic text-[11px] font-black text-white shadow-2xs">
                  Earn
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticker 2: From Kanyakumari to India ✈️ - Floating Aerodynamic Glide */}
        <div className="hidden xl:block absolute right-[25%] top-[9%] z-10 pointer-events-auto text-right">
          <div
            style={{
              animation: "heroFloatingGlide 6.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
              animationDelay: "400ms",
              willChange: "transform",
            }}
            className="group relative select-none cursor-default transition-all duration-300 hover:scale-105"
          >
            <div className="inline-flex flex-col items-end rounded-2xl border border-rose-200/80 bg-white/95 px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md transition-shadow group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              <div className="inline-flex items-center gap-1.5 font-serif italic text-xs sm:text-[13px] font-bold text-brandRed">
                <MapPin size={13} className="text-brandRed animate-bounce" />
                <span>From Kanyakumari</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-[11px] font-black text-slate-700 tracking-wide uppercase">
                <span>to All India</span>
                <span
                  className="inline-block"
                  style={{ animation: "planeHoverGlide 2.2s ease-in-out infinite" }}
                >
                  ✈️
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticker 3: Same Students, Same Place - Floating Pulse Levitation */}
        <div className="hidden xl:block absolute right-[17%] top-[23%] z-10 pointer-events-auto text-right max-w-[170px]">
          <div
            style={{
              animation: "heroFloatingPulse 5.4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
              animationDelay: "900ms",
              willChange: "transform",
            }}
            className="group relative select-none cursor-default transition-all duration-300 hover:scale-105"
          >
            <div className="rounded-2xl border-l-2 border-l-brandRed border-y border-r border-slate-200/80 bg-white/95 px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.07)] backdrop-blur-md transition-all group-hover:shadow-[0_14px_32px_rgba(211,47,47,0.14)]">
              <div className="font-serif italic text-[11px] sm:text-xs font-semibold text-slate-600 leading-snug">
                Same Students. <br />
                Same Place. <br />
                <span className="font-sans not-italic font-black text-brandRed tracking-tight text-xs">
                  Bigger Opportunities.
                </span>
              </div>
            </div>
          </div>
        </div>
      </ParallaxLayer>

      {/* 3 Polaroids Floating Over Kanyakumari Ocean View with Independent Floating Delays */}
      <div className="hidden lg:flex items-center gap-3 absolute right-4 bottom-16 z-20">
        {/* Polaroid 1: Kanyakumari */}
        <FloatingElement duration={5000} delay={0} distance={8}>
          <div className="transform -rotate-6 transition-all duration-300 hover:rotate-0 hover:scale-110 hover:z-30 cursor-pointer rounded-lg bg-white p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.14)] border border-[#ddd]">
            <img
              src="/landing/kanyakumari.jpg"
              alt="Kanyakumari"
              className="h-20 w-22 object-cover rounded"
            />
            <div className="pt-1.5 text-center font-serif text-[10px] font-bold text-[#444]">
              Kanyakumari
            </div>
          </div>
        </FloatingElement>

        {/* Polaroid 2: Students */}
        <FloatingElement duration={5600} delay={600} distance={9}>
          <div className="transform rotate-3 transition-all duration-300 hover:rotate-0 hover:scale-110 hover:z-30 cursor-pointer rounded-lg bg-white p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.14)] border border-[#ddd]">
            <img
              src="/landing/students.jpg"
              alt="Students"
              className="h-20 w-22 object-cover rounded"
            />
            <div className="pt-1.5 text-center font-serif text-[10px] font-bold text-[#444]">
              Students
            </div>
          </div>
        </FloatingElement>

        {/* Polaroid 3: Opportunities */}
        <FloatingElement duration={6200} delay={1200} distance={7}>
          <div className="transform -rotate-3 transition-all duration-300 hover:rotate-0 hover:scale-110 hover:z-30 cursor-pointer rounded-lg bg-white p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.14)] border border-[#ddd]">
            <img
              src="/landing/opportunities.jpg"
              alt="Opportunities"
              className="h-20 w-22 object-cover rounded"
            />
            <div className="pt-1.5 text-center font-serif text-[10px] font-bold text-[#444]">
              Opportunities
            </div>
          </div>
        </FloatingElement>
      </div>
    </>
  );
}
