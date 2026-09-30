import React from "react";
import ParallaxLayer from "../../../motion/ParallaxLayer";

/**
 * HeroGlow
 * Layer 2 of the Hero section:
 * Dedicated atmospheric glow layer with smooth parallax (0.24x speed),
 * creating visual depth behind the typography and hero visuals.
 */
export default function HeroGlow() {
  return (
    <div className="section-atmosphere">
      <ParallaxLayer speed={0.24} className="absolute inset-0">
        {/* Soft Brand Red Atmospheric Flare (Top-Left) */}
        <div className="absolute -left-20 top-10 h-[420px] w-[420px] rounded-full bg-brandRed/[0.07] blur-[130px] animate-pulse-glow" />

        {/* Delicate Rose Flare (Center-Right) */}
        <div className="absolute right-1/4 top-1/3 h-80 w-80 rounded-full bg-rose-200/20 blur-[110px]" />

        {/* Warm Subtle Underglow */}
        <div className="absolute left-1/3 bottom-4 h-64 w-64 rounded-full bg-amber-100/25 blur-[100px]" />
      </ParallaxLayer>
    </div>
  );
}
