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
  LiveActivityTicker,
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
    <div className="min-h-screen overflow-x-hidden bg-[#FAF8F5] text-textPrimary max-560:pb-[68px]">
      <Header onOpenAppTeaser={handleOpenTeaser} />

      <main>
        {/* 1. FreeBuff Hero Banner */}
        <section className="w-full" id="home">
          <FreeBuffHeroBanner
            onClaimFirstDeal={() => handleClaimDeal(freeBuffDeals[0])}
            onOpenAppTeaser={handleOpenTeaser}
          />
        </section>

        {/* 2. Infinite Partner Marquee Ticker */}
        <LogoMarquee />

        {/* 3. FreeBuff Deals & Campus Buffet Passes */}
        <section className={`${pageContainer} pt-12 max-800:pt-8`} id="freebuff">
          <ScrollReveal variant="fade-down" delay={50}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brandRed block mb-1">
                  100% FREE CAMPUS PASSES
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Featured FreeBuff Deals & Passes
                </h2>
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
                        : "bg-white text-slate-600 border border-[#E5E7EB] hover:bg-slate-50"
                    }`}
                  >
                    {cat === "All" ? "All FreeBuff" : cat}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* FreeBuff Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </section>

        {/* 4. Top Rated Verified Campus Shops */}
        <section className={`${pageContainer} pt-14 max-800:pt-10`} id="shops">
          <ScrollReveal variant="fade-down" delay={50}>
            <SectionHeader
              title="Verified Campus Partner Shops"
              action="Explore All Shops in App"
              onClickAction={() => handleOpenTeaser("Campus Shops Catalog")}
            />
          </ScrollReveal>

          <div className="grid grid-cols-6 gap-3 max-1100:grid-cols-3 max-800:grid-cols-2 max-560:gap-2 [@media(max-width:1100px)_and_(min-width:801px)]:[&>*:nth-child(n+4)]:hidden max-800:[&>*:nth-child(n+5)]:hidden">
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
        </section>

        {/* 5. Animated Comparison & Profit Calculator Section */}
        <section id="comparison">
          <ComparisonPricingSection />
        </section>

        {/* 6. Interactive Platform Demo & Terminal UI */}
        <section id="demo">
          <PlatformDemoUI />
        </section>

        {/* 7. Full-Width About SeroFast Ecosystem Banner */}
        <section className="w-full" id="about">
          <AboutSeroFastBanner />
        </section>

        {/* 8. Interactive FAQ Accordion */}
        <section id="faq">
          <FaqAccordion />
        </section>

        {/* 9. Enquiry Email Section */}
        <section id="enquiry">
          <EnquirySection />
        </section>
      </main>

      {/* 10. Footer & Floating Controls */}
      <Footer />
      <ScrollToTop />
      <MobileBottomNav />

      {/* Real-time Activity Ticker Toast */}
      <LiveActivityTicker />

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
      <Route path="/create-shop/*" element={<CreateShopRoute />} />

      {/* Shop Owner Management Portal Routes */}
      <Route path="/shop-owner" element={<ShopOwnerLayout />}>
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
