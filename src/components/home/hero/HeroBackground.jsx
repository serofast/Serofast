import React from "react";
import ParallaxLayer from "../../../motion/ParallaxLayer";
import { PARALLAX_SPEEDS } from "../../../motion/motionConfig";

/**
 * HeroBackground
 * Layer 1 of the Hero section:
 * High-resolution background with smooth, slow parallax (0.08x speed)
 * and crisp gradient mask ensuring readable typography.
 */
export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Parallax Background Image Layer */}
      <ParallaxLayer
        speed={PARALLAX_SPEEDS.background}
        className="absolute inset-0 w-full h-[115%] -top-[8%]"
      >
        <div
          className="w-full h-full bg-cover bg-no-repeat bg-[center_right_10%] lg:bg-[center_right_20%] opacity-95 transition-opacity duration-700"
          style={{
            backgroundImage: "url('/hero-student-banner.png')",
          }}
        />
      </ParallaxLayer>

      {/* Atmospheric Soft Light Overlay (Plain clean white background aesthetic) */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.94) 34%, rgba(255,255,255,0.65) 52%, rgba(255,255,255,0.18) 72%, rgba(255,255,255,0) 100%)",
        }}
      />
    </div>
  );
}
