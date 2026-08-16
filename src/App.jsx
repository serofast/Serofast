import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import {
  Header,
  SectionHeader,
  HeroBanner,
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

import { shops, products } from "./data/landing";

const pageContainer =
  "mx-auto w-[min(1280px,calc(100%_-_48px))] max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]";

/* =========================================================
   LANDING PAGE
   ========================================================= */

function LandingPage() {
  const [isAppTeaserOpen, setIsAppTeaserOpen] = useState(false);
  const [teaserItemName, setTeaserItemName] = useState("");

  const handleOpenTeaser = (itemName) => {
    setTeaserItemName(itemName || "");
    setIsAppTeaserOpen(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-lightBackground text-textPrimary max-560:pb-[68px]">
      <Header onOpenAppTeaser={handleOpenTeaser} />

      <main>
        {/* 1. Hero Banner */}
        <section className="w-full" id="home">
          <HeroBanner onOpenAppTeaser={handleOpenTeaser} />
        </section>

        {/* 2. Infinite Logo & Partner Marquee Ticker */}
        <LogoMarquee />

        {/* 3. Top Rated Campus Shops */}
        <section className={`${pageContainer} pt-12 max-800:pt-8`} id="shops">
          <ScrollReveal variant="fade-down" delay={50}>
            <SectionHeader
              title="Verified Partner Campus Shops"
              action="Explore Shops in App"
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

        {/* 4. Popular Products */}
        <section
          className={`${pageContainer} pt-[32px] pb-[44px]`}
          id="products"
        >
          <ScrollReveal variant="fade-down" delay={50}>
            <SectionHeader
              title="Popular Campus Products"
              action="View All Products in App"
              onClickAction={() => handleOpenTeaser("All Campus Products")}
            />
          </ScrollReveal>

          <div className="grid grid-cols-6 gap-[13px] max-1100:grid-cols-3 max-800:grid-cols-2 max-560:gap-2 [@media(max-width:1100px)_and_(min-width:801px)]:[&>*:nth-child(n+4)]:hidden max-800:[&>*:nth-child(n+5)]:hidden">
            {products.map((product, idx) => (
              <ScrollReveal
                key={product.name}
                variant="fade-up"
                delay={idx * 75}
                duration={650}
              >
                <ProductCard product={product} onOpenAppTeaser={handleOpenTeaser} />
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* 5. Animated Comparison & Profit Calculator Section */}
        <ComparisonPricingSection />

        {/* 6. Interactive Platform Demo & Terminal UI */}
        <PlatformDemoUI />

        {/* 7. Full-Width About SeroFast Ecosystem Banner */}
        <section className="w-full" id="about">
          <AboutSeroFastBanner />
        </section>

        {/* 8. Interactive FAQ Accordion */}
        <FaqAccordion />

        {/* 9. Enquiry Email Section */}
        <EnquirySection />
      </main>

      {/* 10. Footer & Floating Controls */}
      <Footer />
      <ScrollToTop />
      <MobileBottomNav />

      {/* Real-time Activity Ticker Toast */}
      <LiveActivityTicker />

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
