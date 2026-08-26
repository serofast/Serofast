import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import {
  Header,
  SectionHeader,
  HeroBanner,
  FreeBuffHeroBanner,
  FreeBuffDealCard,
  FreeBuffClaimModal,
  LogoMarquee,
  ShopCard,
  ProductCard,
  ComparisonPricingSection,
  PlatformDemoUI,
  AboutSeroFastBanner,
  FaqAccordion,
  EnquirySection,
  Footer,
  ScrollReveal,
  ScrollToTop,
  MobileBottomNav,
  AppTeaserModal,
} from "./components/reusable";

import { CreateShopPage } from "./components/create-shop";
import { LoginPage, RegisterPage } from "./components/auth";

import {
  ShopOwnerLayout,
  ShopOwnerDashboardPage,
  ShopOwnerInventoryPage,
  ShopOwnerOrdersPage,
  ShopOwnerSettingsPage,
  ShopOwnerPayoutsPage,
  ShopOwnerNotificationsPage,
} from "./components/shop-owner";

import { AdminRoutes } from "./components/admin";

import { shops, products, freeBuffDeals } from "./data/landing";

const pageContainer =
  "mx-auto w-[min(1280px,calc(100%_-_48px))] max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]";

const sectionDivider = (
  <div className="relative h-16 sm:h-20 w-full overflow-hidden">
    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="white" fillOpacity="0.6"/>
      <path d="M0 50C360 10 720 70 1080 30C1260 15 1380 45 1440 50V80H0V50Z" fill="white"/>
    </svg>
  </div>
);

const sectionDividerReverse = (
  <div className="relative h-16 sm:h-20 w-full overflow-hidden rotate-180">
    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="white" fillOpacity="0.6"/>
      <path d="M0 50C360 10 720 70 1080 30C1260 15 1380 45 1440 50V80H0V50Z" fill="white"/>
    </svg>
  </div>
);

/* =========================================================
   LANDING PAGE
   ========================================================= */

function LandingPage() {
  const [isAppTeaserOpen, setIsAppTeaserOpen] = useState(false);
  const [teaserItemName, setTeaserItemName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeClaimDeal, setActiveClaimDeal] = useState(null);

  const handleOpenTeaser = (itemName) => {
    setTeaserItemName(itemName || "");
    setIsAppTeaserOpen(true);
  };

  const handleClaimDeal = (deal) => {
    setActiveClaimDeal(deal);
  };

  const filteredDeals = selectedCategory === "All"
    ? freeBuffDeals
    : freeBuffDeals.filter((d) => d.category === selectedCategory || (selectedCategory === "Buffets" && d.tag.includes("BUFFET")));

  return (
    <div className="landing-page min-h-screen overflow-x-hidden bg-[#FAF8F5] text-textPrimary max-560:pb-[68px]">
      <Header onOpenAppTeaser={handleOpenTeaser} />

      <main className="landing-main">
        {/* ═══════════════════════════════════════════════════
           1. HERO BANNER — Full dramatic gradient intro
        ═══════════════════════════════════════════════════ */}
        <section className="landing-section landing-hero relative w-full overflow-hidden" id="home">
          {/* Ambient decorative shapes behind hero */}
          <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden">
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brandRed/5 blur-3xl animate-float-slow" />
            <div className="absolute top-1/2 -right-20 h-80 w-80 rounded-full bg-amber-400/5 blur-3xl" style={{ animationDelay: '2s', animation: 'floatSlow 6s ease-in-out infinite' }} />
            <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-rose-300/5 blur-3xl" style={{ animationDelay: '4s', animation: 'floatSlow 5s ease-in-out infinite' }} />
          </div>
          <FreeBuffHeroBanner
            onClaimFirstDeal={() => handleClaimDeal(freeBuffDeals[0])}
            onOpenAppTeaser={handleOpenTeaser}
          />
        </section>

        {/* ═══════════════════════════════════════════════════
           2. LOGO MARQUEE — Trusted partners ticker
        ═══════════════════════════════════════════════════ */}
        <LogoMarquee />

        {/* ═══════════════════════════════════════════════════
           3. FREEBUFF DEALS — Featured passes section
        ═══════════════════════════════════════════════════ */}
        <section className="landing-section landing-deals relative w-full overflow-hidden" id="freebuff">
          {/* Gradient background band for the deals section */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fff8f8] to-white" />
          <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-brandRed/5 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-amber-400/5 blur-3xl" />

          <div className="relative z-10 py-12 sm:py-16 max-800:py-10">
            <div className={pageContainer}>
              <ScrollReveal variant="fade-down" delay={50}>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 max-800:mb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-brandRed/20 bg-promoHighlight px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brandRed mb-3 shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-brandRed animate-pulse" />
                      100% FREE CAMPUS PASSES
                    </span>
                    <h2 className="text-2xl sm:text-[clamp(26px,3.2vw,38px)] font-extrabold text-slate-900 tracking-tight leading-tight">
                      Featured FreeBuff Deals & Passes
                    </h2>
                    <p className="mt-2 text-sm text-textSecondary max-w-lg">
                      Claim exclusive free food buffets, snack combos, and campus vouchers — zero hidden costs.
                    </p>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {["All", "Buffets", "Drinks", "Vouchers"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-full px-4 py-2 font-semibold transition-all duration-200 cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-brandRed text-white shadow-[0_4px_14px_rgba(211,47,47,0.35)]"
                            : "bg-white text-slate-600 border border-[#E5E7EB] hover:bg-slate-50 hover:border-brandRed/30"
                        }`}
                      >
                        {cat === "All" ? "All FreeBuff" : cat}
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* FreeBuff Cards Grid */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 max-560:gap-3">
                {filteredDeals.map((deal, idx) => (
                  <ScrollReveal
                    key={deal.id}
                    variant="fade-up"
                    delay={idx * 75}
                    duration={650}
                  >
                    <FreeBuffDealCard deal={deal} onClaim={handleClaimDeal} />
                  </ScrollReveal>
                ))}
              </div>

              {/* Bottom CTA hint */}
              <ScrollReveal variant="fade-up" delay={200} className="mt-8 max-800:mt-6 text-center">
                <p className="text-xs font-semibold text-textMuted">
                  Passes refill daily · Claim before they run out · 100% verified campus deals
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
           4. CAMPUS SHOPS — Verified partner grid
        ═══════════════════════════════════════════════════ */}
        <section className="landing-section landing-shops relative w-full overflow-hidden" id="shops">
          <div className="pointer-events-none absolute top-1/4 left-0 h-80 w-80 rounded-full bg-blue-400/5 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-400/5 blur-3xl" />

          <div className="relative z-10 py-14 sm:py-16 max-800:py-10">
            <div className={pageContainer}>
              <ScrollReveal variant="fade-down" delay={50}>
                <SectionHeader
                  title="Verified Campus Partner Shops"
                  action="Explore All Shops in App"
                  onClickAction={() => handleOpenTeaser("Campus Shops Catalog")}
                />
              </ScrollReveal>

              <div className="grid grid-cols-6 gap-4 max-1100:grid-cols-3 max-800:grid-cols-2 max-560:gap-2.5 [@media(max-width:1100px)_and_(min-width:801px)]:[&>*:nth-child(n+4)]:hidden max-800:[&>*:nth-child(n+5)]:hidden">
                {shops.map((shop, idx) => (
                  <ScrollReveal
                    key={shop.name}
                    variant="fade-up"
                    delay={idx * 75}
                    duration={650}
                  >
                    <ShopCard shop={shop} onOpenAppTeaser={handleOpenTeaser} />
                  </ScrollReveal>
                ))}
              </div>

              {/* Trust strip beneath shops */}
              <ScrollReveal variant="scale-up" delay={150} className="mt-8 max-800:mt-6">
                <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-[#f0f0f0] bg-white/80 px-6 py-4 shadow-sm backdrop-blur-sm text-xs font-semibold text-textSecondary max-560:px-3 max-560:gap-2">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    All shops are identity-verified
                  </span>
                  <span className="hidden sm:block h-4 w-px bg-gray-200" />
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-brandRed" />
                    Managed by real shop owners
                  </span>
                  <span className="hidden sm:block h-4 w-px bg-gray-200" />
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Instant UPI payouts
                  </span>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
           5. COMPARISON & PROFIT CALCULATOR
        ═══════════════════════════════════════════════════ */}
        <section id="comparison" className="landing-section landing-comparison relative">
          <ComparisonPricingSection />
        </section>

        {/* ═══════════════════════════════════════════════════
           6. INTERACTIVE PLATFORM DEMO
        ═══════════════════════════════════════════════════ */}
        <section id="demo" className="landing-section landing-demo relative">
          <PlatformDemoUI />
        </section>

        {/* ═══════════════════════════════════════════════════
           7. ABOUT SEROFAST ECOSYSTEM
        ═══════════════════════════════════════════════════ */}
        <section className="landing-section landing-about w-full relative" id="about">
          <AboutSeroFastBanner />
        </section>

        {/* ═══════════════════════════════════════════════════
           8. FAQ ACCORDION
        ═══════════════════════════════════════════════════ */}
        <section id="faq" className="landing-section landing-faq relative">
          <FaqAccordion />
        </section>

        {/* ═══════════════════════════════════════════════════
           9. ENQUIRY SECTION
        ═══════════════════════════════════════════════════ */}
        <section id="enquiry" className="landing-section landing-enquiry relative">
          <EnquirySection />
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════
         10. FOOTER & FLOATING CONTROLS
      ═══════════════════════════════════════════════════ */}
      <Footer />
      <ScrollToTop />
      <MobileBottomNav />

      {/* FreeBuff QR Claim Modal */}
      <FreeBuffClaimModal
        deal={activeClaimDeal}
        isOpen={Boolean(activeClaimDeal)}
        onClose={() => setActiveClaimDeal(null)}
      />

      {/* Shopper App Teaser Modal */}
      <AppTeaserModal
        isOpen={isAppTeaserOpen}
        onClose={() => setIsAppTeaserOpen(false)}
        initialItemName={teaserItemName}
      />
    </div>
  );
}

/* =========================================================
   ROUTES
   ========================================================= */

/* =========================================================
   PROTECTED ROUTE GUARD
   ========================================================= */

function ProtectedRoute({ children }) {
  const getStoredOwner = () => {
    try {
      const storedOwner = localStorage.getItem("serofast_current_owner");
      return storedOwner ? JSON.parse(storedOwner) : null;
    } catch {
      return null;
    }
  };

  const isAuthenticated = Boolean(getStoredOwner());

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function CreateShopRoute() {
  const navigate = useNavigate();

  return (
    <CreateShopPage
      onClose={() => navigate("/shop-owner/dashboard")}
    />
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication & Onboarding Routes */}
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/register" element={<Navigate to="/signup" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/become-shop-owner/*" element={<Navigate to="/signup" replace />} />

      {/* Protected Create Shop Wizard Route */}
      <Route
        path="/create-shop/*"
        element={
          <ProtectedRoute>
            <CreateShopRoute />
          </ProtectedRoute>
        }
      />

      {/* Protected Shop Owner Management Portal Routes */}
      <Route
        path="/shop-owner"
        element={
          <ProtectedRoute>
            <ShopOwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ShopOwnerDashboardPage />} />
        <Route path="inventory" element={<ShopOwnerInventoryPage />} />
        <Route path="products" element={<Navigate to="../inventory" replace />} />
        <Route path="orders" element={<ShopOwnerOrdersPage />} />
        <Route path="settings" element={<ShopOwnerSettingsPage />} />
        <Route path="payouts" element={<ShopOwnerPayoutsPage />} />
        <Route path="notifications" element={<ShopOwnerNotificationsPage />} />
      </Route>

      {/* Legacy Seller Route Redirects */}
      <Route path="/seller/*" element={<Navigate to="/shop-owner/dashboard" replace />} />

      {/* Platform Administration Portal Routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
