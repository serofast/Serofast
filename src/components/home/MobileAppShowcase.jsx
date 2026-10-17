import { useState, useRef } from "react";
import {
  Store,
  Check,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "../reusable/ScrollReveal";
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
      className="relative border-b border-[#EBE3DC] bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5] py-16 lg:py-24 select-none overflow-hidden"
    >
      {/* Soft ambient parallax lighting — clean light aesthetic */}
      <ParallaxLayer speed={0.2} className="section-atmosphere">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-brandRed/[0.05] blur-3xl animate-pulse-glow" />
        <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-rose-200/25 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-100/15 blur-[130px]" />
      </ParallaxLayer>

      <div className="relative mx-auto w-[min(1400px,calc(100%_-_32px))]">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brandRed/20 bg-white px-3.5 py-1 shadow-2xs">
            <Sparkles size={13} className="text-brandRed" />
            <span className="text-[11px] font-black uppercase tracking-wider text-brandRed">
              Live App Experience
            </span>
          </div>

          <h2 className="mt-3 text-[clamp(2rem,3.8vw,3rem)] font-black tracking-tight text-[#191616]">
            Explore What SeroFast Powers on Your Phone
          </h2>

          <ScrollTitleReveal direction="up" delay={180} duration={850}>
            <p className="mt-2 text-sm text-[#666] sm:text-base max-w-[580px] mx-auto leading-relaxed">
              Experience the mobile interface. Tap the phone screen or choose a view below to preview campus flash drops, store discovery, and student storefronts.
            </p>
          </ScrollTitleReveal>
        </div>

        {/* Main Stage: Floating Mobile Device + Clean Architecture Card */}
        <div className="mt-14 grid grid-cols-1 items-center justify-center gap-10 lg:grid-cols-[380px_480px] xl:grid-cols-[410px_520px] lg:justify-center">
          {/* Left: Floating Mobile Device with Levitation */}
          <ScrollReveal variant="fade-up" duration={700} className="relative flex flex-col items-center justify-center">
            {/* Ambient Glow behind Phone */}
            <div className="pointer-events-none absolute -inset-8 rounded-full bg-gradient-to-tr from-brandRed/15 via-rose-200/20 to-amber-100/15 blur-3xl opacity-80" />

            <div className="relative">
              {/* Floating Pill: Top-Right */}
              <div className="pointer-events-none absolute -right-6 -top-3 z-30 hidden sm:flex items-center">
                <FloatingElement duration={5000} distance={6}>
                  <div className="flex items-center gap-2 rounded-2xl border border-white/90 bg-white/95 px-3.5 py-2 shadow-[0_12px_30px_rgba(211,47,47,0.12)] backdrop-blur-xl">
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

              {/* Floating Pill: Bottom-Left */}
              <div className="pointer-events-none absolute -left-8 bottom-24 z-30 hidden sm:flex items-center">
                <FloatingElement duration={5800} delay={600} distance={7}>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-white/90 bg-white/95 px-3.5 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                    <div className="grid h-7 w-7 place-items-center rounded-xl bg-brandRed text-white text-xs font-black shadow-xs">
                      SF
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-[#191616]">
                        {currentView.floatingBadge.metric}
                      </div>
                      <div className="text-[9px] font-bold text-slate-500">
                        SeroFast Verified
                      </div>
                    </div>
                  </div>
                </FloatingElement>
              </div>

              {/* Phone Chassis */}
              <div
                onClick={handleCycleNext}
                title="Click phone to view next screen"
                className="relative w-[300px] sm:w-[330px] rounded-[48px] border-[9px] border-slate-200/95 bg-white p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.14)] ring-1 ring-slate-300/80 cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Dynamic Island / Speaker Pill */}
                <div className="absolute left-1/2 top-3.5 -translate-x-1/2 z-30 flex h-4 w-22 items-center justify-center rounded-full bg-slate-800 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-500 mr-2" />
                  <span className="h-2 w-2 rounded-full bg-slate-900" />
                </div>

                {/* Inside Phone Screen */}
                <div className="relative h-[560px] sm:h-[590px] w-full overflow-hidden rounded-[38px] bg-slate-900 shadow-inner">
                  <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.1]" />

                  <img
                    key={currentView.id}
                    src={currentView.image}
                    alt={currentView.name}
                    className="h-full w-full object-cover object-top select-none animate-in fade-in zoom-in-98 duration-200"
                    loading="eager"
                  />
                </div>
              </div>
            </div>

            {/* Shadow under phone */}
            <div className="mt-4 h-4 w-48 sm:w-56 rounded-[100%] bg-slate-900/15 blur-md pointer-events-none" />
          </ScrollReveal>

          {/* Right: Clean Showcase Detail Card */}
          <ScrollReveal variant="fade-up" delay={150} duration={700}>
            <div className="relative w-full rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
              {/* Tab Switchers */}
              <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-50 p-1.5 mb-6">
                {APP_VIEWS.map((view) => {
                  const isActive = activeTab === view.id;
                  return (
                    <button
                      key={view.id}
                      type="button"
                      onClick={() => handleTabChange(view.id, view.name)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-brandRed text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                      }`}
                    >
                      <span>{view.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Status Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-brandRed/20 bg-brandRed/5 px-3 py-1 text-xs font-bold text-brandRed">
                  <Store size={12} />
                  <span>{currentView.badge}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live App Interface</span>
                </div>
              </div>

              {/* Title & Summary */}
              <h3 className="mt-3.5 text-xl sm:text-2xl font-black tracking-tight text-[#191616]">
                {currentView.title}
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                {currentView.description}
              </p>

              {/* Highlights */}
              <div className="mt-5 space-y-2.5">
                {currentView.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-[#FAF8F5]/80 px-4 py-3 text-xs font-medium text-slate-700 transition-colors hover:bg-white hover:border-brandRed/30"
                  >
                    <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brandRed/10 text-brandRed">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-400">
                <span className="text-[11px] font-medium">Click phone screen to cycle</span>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1 font-bold text-brandRed hover:text-brandRedDark transition-colors"
                >
                  <span>Register as a Seller</span>
                  <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
