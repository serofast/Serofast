import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Users, Coins } from "lucide-react";
import useCountUp from "../../../hooks/useCountUp";
import { TextAnimate } from "@/registry/magicui/text-animate";
import { StaggerGroup, StaggerItem } from "../../../motion/StaggerGroup";

/**
 * HeroContent
 * Primary content layer of the Hero section:
 * - Animated badge
 * - MagicUI character blurInUp headline entrance
 * - Staggered subtitle, CTA buttons with micro-interactions, and live metrics
 */
export default function HeroContent() {
  const ordersCount = useCountUp(12480, 1800);
  const sellersCount = useCountUp(320, 1600);

  return (
    <div className="relative z-10 max-w-[620px]">
      <StaggerGroup step={90}>
        {/* Animated Badge */}
        <StaggerItem index={0}>
          <div className="inline-flex items-center gap-2 rounded-full border border-brandRed/20 bg-white/95 px-3.5 py-1.5 shadow-xs backdrop-blur-md transition-transform duration-300 hover:scale-105">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brandRed opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brandRed" />
            </span>
            <span className="text-xs font-black tracking-wide text-brandRed">
              India's Student-Powered Social Commerce
            </span>
          </div>
        </StaggerItem>

        {/* Primary Title with Smooth Word Entrance */}
        <StaggerItem index={1} customDelay={100}>
          <TextAnimate
            animation="blurInUp"
            by="word"
            once
            as="h1"
            duration={650}
            className="mt-4 text-[clamp(2.5rem,4.8vw,4.4rem)] font-black leading-[1.04] tracking-[-0.035em] text-[#191616]"
          >
            Shop Local. <br />
            <span className="text-brandRed">Discover More.</span>
          </TextAnimate>
        </StaggerItem>

        {/* Subtitle */}
        <StaggerItem index={2} customDelay={220}>
          <p className="mt-3 text-base leading-relaxed text-[#4f4a4a] sm:text-lg max-w-[500px]">
            Explore unique products from independent Serofast shops, built
            and managed by students and creators across India.
          </p>
        </StaggerItem>

        {/* Action CTAs with Micro-Interactions */}
        <StaggerItem index={3} customDelay={320}>
          <div className="mt-6 flex flex-wrap items-center gap-3.5">
            <a
              href="#app-preview"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brandRed px-7 text-sm font-black text-white shadow-lg shadow-brandRed/25 transition-all duration-300 hover:-translate-y-1 hover:bg-brandRedDark hover:shadow-brandRed/40 active:scale-95 cursor-pointer"
            >
              <span>Explore App Features</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>

            <Link
              to="/signup"
              className="group inline-flex h-12 items-center justify-center rounded-xl border-2 border-brandRed bg-white/90 px-7 text-sm font-black text-brandRed shadow-xs transition-all duration-300 hover:-translate-y-1 hover:bg-brandRed hover:text-white active:scale-95"
            >
              <span>Become a Seller</span>
            </Link>
          </div>
        </StaggerItem>

        {/* Live Counters & Metric Bar */}
        <StaggerItem index={4} customDelay={440}>
          <div className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-4 border-t border-[#EBE3DC]/80 pt-4 max-w-[480px]">
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
                <Coins size={13} className="text-brandRed" />
                <span>Margin Kept</span>
              </div>
              <div className="mt-0.5 text-base font-black text-brandRed sm:text-lg">
                100% Yours
              </div>
            </div>
          </div>
        </StaggerItem>
      </StaggerGroup>
    </div>
  );
}
