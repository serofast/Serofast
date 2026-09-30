import { useState, useEffect, useRef } from "react";
import {
  Store,
  Check,
  Sparkles,
  ShoppingBag,
  Zap,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "../reusable/ScrollReveal";
import { TextAnimate } from "@/registry/magicui/text-animate";
import ParallaxLayer from "../../motion/ParallaxLayer";
import FloatingElement from "../../motion/FloatingElement";
import ScrollTitleReveal from "../../motion/ScrollTitleReveal";

export const APP_VIEWS = [
  {
    id: "home",
    name: "Home Page",
    badge: "Flash Deals & Tech Drops",
    tagline: "Campus Home",
    title: "Campus Home & Flash Deals",
    description: "Daily campus surges, tech drops from ₹499, and instant hostel delivery.",
    image: "/app-screens/screen-home.png",
    highlights: [
      "Audio & tech surge with ₹500 student savings",
      "Flash drop pricing on shirts & low-tops from ₹499",
      "Native navigation: Home, Shop, Cart, and Profile",
    ],
    floatingBadge: {
      title: "Flash Drop",
      metric: "From ₹499",
      accent: "Home Deals",
    },
  },
  {
    id: "discover",
    name: "Shop Discover",
    badge: "Campus Directory",
    tagline: "Discover Shops",
    title: "All Campus Shops & Boutiques",
    description: "Centralized directory of student creator boutiques and campus stores.",
    image: "/app-screens/screen-shops.png",
    highlights: [
      "Directory of student stores: Drezz, Rushers, ABCD, LocalZ",
      "Instant filter: All Shops, Stationery, and Fashion",
      "Direct shop cards with verified peer trust badges",
    ],
    floatingBadge: {
      title: "Campus Shops",
      metric: "4+ Verified Stores",
      accent: "Discover",
    },
  },
  {
    id: "storefront",
    name: "Shop Opened View",
    badge: "Storefront Preview",
    tagline: "Opened Store",
    title: "How a Shop Looks When Opened",
    description: "How an individual campus store appears to buyers with ratings and catalog.",
    image: "/app-screens/screen-storefront.png",
    highlights: [
      "Custom brand banner & verified student storefront identity",
      "4.8★ peer ratings and authentic campus reviews",
      "1-tap Follow alerts for new campus product drops",
    ],
    floatingBadge: {
      title: "Drezz Storefront",
      metric: "4.8 ★ Rating",
      accent: "Shop Opened",
    },
  },
];

export default function MobileAppShowcase({ onShowToast }) {
  const [activeTab, setActiveTab] = useState(APP_VIEWS[0].id);
  const containerRef = useRef(null);
  const phoneRef = useRef(null);
  const contentRef = useRef(null);

  // Synchronized scroll animation:
  // Mobile phone glides UP from below, while the Core Commerce content slides IN from the RIGHT.
  // Both move simultaneously in direct 1:1 sync with the user's scroll.
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current && phoneRef.current && contentRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const startScroll = windowHeight * 1.05;
            const endScroll = windowHeight * 0.15;
            const progress = Math.min(
              1,
              Math.max(0, (startScroll - rect.top) / (startScroll - endScroll))
            );

            const isMobile = window.innerWidth < 768;
            const maxTranslateY = isMobile ? 180 : 280; // Extreme down
            const maxTranslateX = isMobile ? 220 : 380; // Extreme right

            // Phone glides UP from extreme down as user scrolls down
            const phoneTranslateY = (1 - progress) * maxTranslateY;
            const phoneScale = 0.92 + progress * 0.08;
            const phoneOpacity = Math.min(1, Math.max(0, 0.05 + progress * 0.95));
            phoneRef.current.style.transform = `translate3d(0, ${phoneTranslateY}px, 0) scale(${phoneScale})`;
            phoneRef.current.style.opacity = `${phoneOpacity}`;

            // Core Commerce content slides IN from the EXTREME RIGHT as user scrolls down
            const contentTranslateX = (1 - progress) * maxTranslateX;
            const contentOpacity = Math.min(1, Math.max(0, 0.05 + progress * 0.95));
            contentRef.current.style.transform = `translate3d(${contentTranslateX}px, 0, 0)`;
            contentRef.current.style.opacity = `${contentOpacity}`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const currentView = APP_VIEWS.find((v) => v.id === activeTab) || APP_VIEWS[0];

  const handleTabChange = (id, name) => {
    setActiveTab(id);
    if (onShowToast) onShowToast(`Switched to ${name}`);
  };

  const handleCycleNext = () => {
    const currentIndex = APP_VIEWS.findIndex((v) => v.id === activeTab);
    const nextIndex = (currentIndex + 1) % APP_VIEWS.length;
    handleTabChange(APP_VIEWS[nextIndex].id, APP_VIEWS[nextIndex].name);
  };

  return (
    <section
      id="app-preview"
      ref={containerRef}
      className="relative border-b border-[#EBE3DC] bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5] py-14 lg:py-20 select-none overflow-hidden vivo-perspective-container"
    >
      {/* Soft ambient parallax lighting — clean light aesthetic */}
      <ParallaxLayer speed={0.2} className="section-atmosphere">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-brandRed/[0.05] blur-3xl animate-pulse-glow" />
        <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-rose-200/25 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-100/15 blur-[130px]" />
      </ParallaxLayer>

      <div className="relative mx-auto w-[min(1400px,calc(100%_-_32px))]">
        {/* Clean Header with MagicUI blurInUp text entrance */}
        <div className="mx-auto max-w-3xl text-center">
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            as="h2"
            className="text-[clamp(1.9rem,3.6vw,2.9rem)] font-black tracking-tight text-[#191616]"
          >
            Explore What SeroFast Powers on Your Phone
          </TextAnimate>

          <ScrollTitleReveal direction="up" delay={180} duration={850}>
            <p className="mt-2 text-sm text-[#666] sm:text-base max-w-[580px] mx-auto">
              Experience the live mobile interface. Tap the phone or the tabs below to preview campus flash drops, store discover, and active storefronts.
            </p>
          </ScrollTitleReveal>
        </div>

        {/* Main Stage: Floating Mobile Device + Soft Auth-Styled Compact Showcase Card */}
        <div className="mt-12 grid grid-cols-1 items-center justify-center gap-10 lg:grid-cols-[380px_460px] xl:grid-cols-[410px_480px] lg:justify-center">
          {/* Left: Floating Mobile Device with Levitation & Orbiting Graphic Badges */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Ambient Multi-Layer Glow Orbs behind Phone */}
            <div className="pointer-events-none absolute -inset-8 rounded-full bg-gradient-to-tr from-brandRed/20 via-rose-200/25 to-amber-100/20 blur-3xl opacity-80" />

            {/* Floating Outer Wrapper (Continuous Gentle Floating Levitation) */}
            <div className="animate-vivo-float relative">
              {/* Floating Pill 1: Top-Right (Orbiting Graphic Badge) */}
              <div className="pointer-events-none absolute -right-6 -top-3 z-30 hidden sm:flex items-center">
                <FloatingElement duration={5000} distance={7} mouseTrack={true}>
                  <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/95 px-3.5 py-2 shadow-[0_12px_30px_rgba(211,47,47,0.15)] backdrop-blur-xl">
                    <span className="flex h-2 w-2 rounded-full bg-brandRed animate-ping" />
                    <div className="text-left">
                      <div className="text-[10px] font-black uppercase text-brandRed tracking-wider">
                        {currentView.floatingBadge.accent}
                      </div>
                      <div className="text-xs font-black text-[#191616]">
                        {currentView.floatingBadge.title}
                      </div>
                    </div>
                  </div>
                </FloatingElement>
              </div>

              {/* Floating Pill 2: Bottom-Left (Orbiting Social Proof Badge) */}
              <div className="pointer-events-none absolute -left-8 bottom-24 z-30 hidden sm:flex items-center">
                <FloatingElement duration={5800} delay={600} distance={8} mouseTrack={true}>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/95 px-3.5 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.1)] backdrop-blur-xl">
                    <div className="grid h-7 w-7 place-items-center rounded-xl bg-brandRed text-white text-xs font-black shadow-xs">
                      SF
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-[#191616]">
                        {currentView.floatingBadge.metric}
                      </div>
                      <div className="text-[9px] font-bold text-[#777]">
                        SeroFast Verified
                      </div>
                    </div>
                  </div>
                </FloatingElement>
              </div>

              {/* Floating Pill 3: Bottom-Right */}
              <div className="pointer-events-none absolute -right-4 bottom-6 z-30 hidden sm:flex items-center">
                <FloatingElement duration={6400} delay={1200} distance={6}>
                  <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/95 px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                    <Sparkles size={13} className="text-brandRed" />
                    <span className="text-[10px] font-black text-[#191616]">⚡ Instant Campus Delivery</span>
                  </div>
                </FloatingElement>
              </div>

              {/* The Phone Chassis with Scroll-Linked Translate + Scale */}
              <div
                ref={phoneRef}
                style={{
                  willChange: "transform, opacity",
                  transition: "transform 0.08s ease-out, opacity 0.08s ease-out",
                }}
                onClick={handleCycleNext}
                title="Click phone to view next screen"
                className="vivo-device-chassis relative w-[310px] sm:w-[335px] rounded-[48px] border-[9px] border-slate-200/95 bg-white p-1.5 shadow-[0_30px_70px_rgba(211,47,47,0.18)] ring-1 ring-slate-300/80 cursor-pointer transition-transform hover:scale-[1.01]"
              >
                {/* Dynamic Island / Speaker Pill */}
                <div className="absolute left-1/2 top-3.5 -translate-x-1/2 z-30 flex h-4 w-22 items-center justify-center rounded-full bg-slate-800 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500 mr-2" />
                  <span className="h-2 w-2 rounded-full bg-slate-900" />
                </div>

                {/* Inside Phone Screen: Real screenshots provided by user */}
                <div className="relative h-[590px] w-full overflow-hidden rounded-[38px] bg-slate-900 shadow-inner">
                  {/* Glass reflection gloss across screen */}
                  <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12]" />

                  {/* Screenshot Image with fade-in and smooth fit */}
                  <img
                    key={currentView.id}
                    src={currentView.image}
                    alt={currentView.name}
                    className="h-full w-full object-cover object-top select-none animate-in fade-in zoom-in-95 duration-300"
                    loading="eager"
                  />

                  {/* Subtle Interactive Screen Tap Cue on hover */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 rounded-full bg-black/65 px-3 py-1 text-[9px] font-bold text-white/90 backdrop-blur-md opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Tap phone to switch screen 👆
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Breathing Under-Device Ground Shadow */}
            <div className="mt-4 h-4 w-48 sm:w-56 rounded-[100%] bg-slate-900/15 blur-md animate-pulse pointer-events-none" />
          </div>

          {/* Right: Soft Auth-Style Compact Showcase Card (Reduced width, Soft Login/Register Aesthetic) */}
          <div
            ref={contentRef}
            style={{
              willChange: "transform, opacity",
              transition: "transform 0.08s ease-out, opacity 0.08s ease-out",
            }}
            className="saas-card-interactive relative w-full max-w-[460px] xl:max-w-[480px] mx-auto lg:mx-0 rounded-[35px] bg-white border border-[#F3E5E5] p-6 sm:p-8 shadow-[-4px_5px_12px_rgba(211,47,47,0.14),-7px_8px_20px_rgba(211,47,47,0.06)]"
          >
            {/* Subtle soft gradient warmth */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-100/35 blur-2xl" />
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-amber-50/40 blur-2xl" />

            {/* Soft Interactive Switcher Tabs (Home Page, Shop Discover, Shop Opened View) */}
            <div className="relative z-10 flex flex-wrap items-center gap-1.5 rounded-2xl border border-[#F3E5E5] bg-[#FAF6F6] p-1.5 mb-6">
              {APP_VIEWS.map((view) => {
                const isActive = activeTab === view.id;
                return (
                  <button
                    key={view.id}
                    type="button"
                    onClick={() => handleTabChange(view.id, view.name)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-brandRed text-white shadow-xs scale-102"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white"
                    }`}
                  >
                    <span>{view.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Soft Badge & Status Indicator */}
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-brandRed/15 bg-brandRed/5 px-3 py-1 text-xs font-bold text-brandRed">
                <Store size={12} />
                <span>{currentView.badge}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                <span className="h-2 w-2 rounded-full bg-brandRed animate-pulse" />
                <span>Live View</span>
              </div>
            </div>

            {/* Minimal Title & Concise Summary */}
            <h3 className="relative z-10 mt-3 text-xl sm:text-2xl font-bold tracking-tight text-[#191616]">
              {currentView.title}
            </h3>

            <p className="relative z-10 mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
              {currentView.description}
            </p>

            {/* Minimal Feature Highlights (Soft Auth-Styled Pill Rows) */}
            <div className="relative z-10 mt-5 space-y-2.5">
              {currentView.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-2xl border border-[#F3E5E5] bg-[#FAF8F8]/60 px-4 py-3 text-xs font-medium text-slate-700 transition-colors hover:bg-white hover:border-brandRed/25"
                >
                  <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brandRed/10 text-brandRed">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>

            {/* Minimal Soft Footer Note: Clean and uncluttered, NO download or next screen buttons */}
            <div className="relative z-10 mt-6 flex items-center justify-between pt-4 border-t border-[#F3E5E5] text-xs text-slate-400">
              <span className="text-[11px]">Tap phone to cycle screens</span>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1 font-bold text-slate-600 hover:text-brandRed transition-colors"
              >
                <span>Become a Seller</span>
                <ExternalLink size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
