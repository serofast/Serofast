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
        {/* Sticker 1: Students Shop Share Earn */}
        <div className="absolute left-[36%] top-[8%] z-10">
          <FloatingElement duration={5800} delay={400} distance={6}>
            <div className="font-serif italic text-sm font-bold text-brandRed transform -rotate-12 flex flex-col items-center select-none drop-shadow-xs">
              <span>Students</span>
              <span>Shop</span>
              <span>Share</span>
              <span className="font-black text-brandRedDark">Earn</span>
            </div>
          </FloatingElement>
        </div>

        {/* Sticker 2: From Kanyakumari to India */}
        <div className="hidden xl:block absolute right-[26%] top-[10%] z-10 text-right">
          <FloatingElement duration={6400} delay={800} distance={8}>
            <div className="inline-flex items-center gap-1.5 font-serif italic text-sm font-bold text-brandRed">
              <MapPin size={14} className="text-brandRed" />
              <span>From Kanyakumari</span>
            </div>
            <div className="text-xs font-black text-[#555] tracking-wide">
              to India ✈️
            </div>
          </FloatingElement>
        </div>

        {/* Sticker 3: Same Students, Same Place */}
        <div className="hidden xl:block absolute right-[18%] top-[24%] z-10 text-right max-w-[150px]">
          <FloatingElement duration={5400} delay={1200} distance={6}>
            <div className="font-serif italic text-xs font-semibold text-[#333] leading-snug">
              Same Students. <br />
              Same Place. <br />
              <span className="font-bold text-brandRed">Bigger Opportunities.</span>
            </div>
          </FloatingElement>
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
