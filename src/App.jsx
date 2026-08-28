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
import HomePage from "./components/HomePage";
import OrderTrackingPage from "./components/orders/OrderTrackingPage";

import { shops, products, freeBuffDeals } from "./data/landing";

const pageContainer =
  "mx-auto w-[min(1320px,calc(100%_-_40px))] sm:w-[min(1320px,calc(100%_-_48px))] max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]";

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
           1. HERO BANNER
        ═══════════════════════════════════════════════════ */}
        <section className="landing-section landing-hero relative w-full overflow-hidden" id="home">
          <FreeBuffHeroBanner
            onClaimFirstDeal={() => handleClaimDeal(freeBuffDeals[0])}
            onOpenAppTeaser={handleOpenTeaser}
          />
        </section>

        {/* ═══════════════════════════════════════════════════
           2. LOGO MARQUEE
        ═══════════════════════════════════════════════════ */}
        <section className="landing-section landing-marquee relative w-full overflow-hidden">
          <LogoMarquee />
        </section>

        {/* ═══════════════════════════════════════════════════
           3. FREEBUFF DEALS — Featured Bento Grid
        ═══════════════════════════════════════════════════ */}
        <section className="landing-section landing-deals relative w-full overflow-hidden" id="freebuff">
          <div className="relative z-10 py-14 sm:py-20">
            <div className={pageContainer}>
              <ScrollReveal variant="fade-down" delay={50}>
                <div className="flex flex-col gap-4 mb-8 sm:mb-10">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-brandRed/15 bg-promoHighlight px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brandRed mb-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-brandRed animate-pulse" />
                        100% FREE CAMPUS PASSES
                      </span>
                      <h2 className="text-[clamp(22px,3.2vw,34px)] font-extrabold text-[#191616] tracking-[-0.02em] leading-tight">
                        Featured FreeBuff Deals & Passes
                      </h2>
                      <p className="mt-2 text-[14px] text-[#8b8282] max-w-lg">
                        Claim exclusive free food buffets, snack combos, and campus vouchers — zero hidden costs.
                      </p>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-2 text-[12px]">
                      {["All", "Buffets", "Drinks", "Vouchers"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`rounded-full px-4 py-2 font-bold transition-all duration-200 ${
                            selectedCategory === cat
                              ? "bg-brandRed text-white shadow-[0_4px_14px_rgba(211,47,47,0.35)]"
                              : "bg-white text-[#555] border border-slate-200 hover:bg-slate-50 hover:border-brandRed/30 hover:text-brandRed"
                          }`}
                        >
                          {cat === "All" ? "All FreeBuff" : cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* FreeBuff Cards — Bento Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
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
              <ScrollReveal variant="fade-up" delay={200} className="mt-8 sm:mt-10 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white px-5 py-2.5 text-[12px] font-semibold text-[#8b8282] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Passes refill daily · Claim before they run out · 100% verified campus deals
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
           4. CAMPUS SHOPS — Verified Partner Grid
        ═══════════════════════════════════════════════════ */}
        <section className="landing-section landing-shops relative w-full overflow-hidden bg-[#f5f3ef]" id="shops">
          <div className="relative z-10 py-14 sm:py-20">
            <div className={pageContainer}>
              <ScrollReveal variant="fade-down" delay={50}>
                <SectionHeader
                  title="Verified Campus Partner Shops"
                  subtitle="Browse our network of identity-verified neighbourhood stores with instant digital catalogues."
                  action="Explore All Shops in App"
                  onClickAction={() => handleOpenTeaser("Campus Shops Catalog")}
                />
              </ScrollReveal>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 sm:gap-5 max-800:grid-cols-2 max-560:gap-3 lg:[&>*:nth-child(n+7)]:hidden max-1100:[&>*:nth-child(n+7)]:hidden max-800:[&>*:nth-child(n+5)]:hidden">
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

              {/* Trust Strip */}
              <ScrollReveal variant="scale-up" delay={150} className="mt-8 sm:mt-10">
                <div className="flex flex-wrap items-center justify-center gap-3 rounded-[18px] border border-white bg-white/80 px-5 py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-sm sm:gap-5 sm:px-6">
                  {[
                    { color: "bg-emerald-500", label: "All shops are identity-verified" },
                    { color: "bg-brandRed", label: "Managed by real shop owners" },
                    { color: "bg-amber-500", label: "Instant UPI payouts" },
                  ].map((item, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-[11px] font-semibold text-[#555]">
                      <span className={`h-1.5 w-1.5 rounded-full ${item.color} ${i === 0 ? "animate-pulse" : ""}`} />
                      {item.label}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
           5. COMPARISON & PROFIT CALCULATOR
        ═══════════════════════════════════════════════════ */}
        <section id="comparison" className="landing-section landing-comparison relative bg-white">
          <ComparisonPricingSection />
        </section>

        {/* ═══════════════════════════════════════════════════
           6. INTERACTIVE PLATFORM DEMO
        ═══════════════════════════════════════════════════ */}
        <section id="demo" className="landing-section landing-demo relative bg-[#FAF8F5]">
          <PlatformDemoUI />
        </section>

        {/* ═══════════════════════════════════════════════════
           7. ABOUT SEROFAST ECOSYSTEM
        ═══════════════════════════════════════════════════ */}
        <section className="landing-section landing-about w-full relative bg-white" id="about">
          <AboutSeroFastBanner />
        </section>

        {/* ═══════════════════════════════════════════════════
           8. FAQ ACCORDION
        ═══════════════════════════════════════════════════ */}
        <section id="faq" className="landing-section landing-faq relative bg-[#FAF8F5]">
          <FaqAccordion />
        </section>

        {/* ═══════════════════════════════════════════════════
           9. ENQUIRY SECTION
        ═══════════════════════════════════════════════════ */}
        <section id="enquiry" className="landing-section landing-enquiry relative bg-white">
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
      <Route path="/" element={<HomePage />} />

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

      {/* Customer Real-Time Order Tracking Routes */}
      <Route path="/track" element={<OrderTrackingPage />} />
      <Route path="/track/:orderId" element={<OrderTrackingPage />} />
      <Route path="/orders/track/:orderId" element={<OrderTrackingPage />} />

      {/* Platform Administration Portal Routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
