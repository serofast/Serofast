import React from "react";
import HeroBackground from "./hero/HeroBackground";
import HeroGlow from "./hero/HeroGlow";
import HeroContent from "./hero/HeroContent";
import HeroFloatingVisuals from "./hero/HeroFloatingVisuals";

/**
 * HeroSection
 * Refactored modular Hero section with:
 * - Layered Parallax Background (0.15x)
 * - Layered Atmospheric Red Glow (0.25x)
 * - Cinematic Left-to-Right Title Entrance
 * - Floating UI Elements & Micro-interactions
 * - Clean plain white background aesthetic with brand red accents
 */
export default function HeroSection({ onOpenVideo }) {
  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-68px)] lg:h-[calc(100vh-68px)] flex flex-col justify-between overflow-hidden border-b border-[#EBE3DC] bg-white select-none"
    >
      {/* Layer 1: Parallax Background */}
      <HeroBackground />

      {/* Layer 2: Parallax Atmospheric Glow */}
      <HeroGlow />

      {/* Main Content & Interactive Visual Stage */}
      <div className="relative z-10 mx-auto w-[min(1400px,calc(100%_-_32px))] pt-6 sm:pt-10 lg:pt-12 flex-1 flex flex-col justify-center">
        {/* Layer 3: Typography & Action CTAs */}
        <HeroContent />

        {/* Layer 4: Floating Interactive UI, Video Pill & Polaroids */}
        <HeroFloatingVisuals onOpenVideo={onOpenVideo} />
      </div>
    </section>
  );
}
