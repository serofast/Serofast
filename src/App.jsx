import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import {
  Truck,
  RotateCcw,
  CreditCard,
  Headphones,
} from "lucide-react";

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
} from "./components/reusable";

import { CreateShopPage } from "./components/create-shop";
import { AuthPage } from "./components/auth";

import {
  SellerLayout,
  SellerDashboardPage,
  SellerProductsPage,
  SellerOrdersPage,
  SellerStoreSettingsPage,
  SellerPayoutsPage,
} from "./components/seller";

import {
  AdminLayout,
  AdminDashboardPage,
  AdminShopsPage,
  AdminStudentsPage,
  AdminOrdersPage,
} from "./components/admin";

import { shops, products } from "./data/landing";

const pageContainer =
  "mx-auto w-[min(1280px,calc(100%_-_48px))] max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]";

/* =========================================================
   LANDING PAGE
   ========================================================= */

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-lightBackground text-textPrimary max-560:pb-[68px]">
      <Header />

      <main>
        {/* 1. Hero Banner */}
        <section className="w-full" id="home">
          <HeroBanner />
        </section>

        {/* 2. Infinite Logo & Partner Marquee Ticker */}
        <LogoMarquee />

        {/* 3. Top Rated Shops */}
        <section className={`${pageContainer} pt-12 max-800:pt-8`} id="shops">
          <ScrollReveal variant="fade-down" delay={50}>
            <SectionHeader
              title="Top Rated Shops"
              action="View all shops"
              href="#shops"
            />
          </ScrollReveal>

          <div className="grid grid-cols-6 gap-3 max-1100:grid-cols-3 max-800:grid-cols-2 max-560:gap-2 max-1100:[&>*:nth-child(n+4)]:hidden">
            {shops.map((shop, idx) => (
              <ScrollReveal
                key={shop.name}
                variant="fade-up"
                delay={idx * 75}
                duration={650}
              >
                <ShopCard shop={shop} />
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
              title="Popular Products"
              action="View all products"
              href="#products"
            />
          </ScrollReveal>

          <div className="grid grid-cols-6 gap-[13px] max-1100:grid-cols-3 max-800:grid-cols-2 max-560:gap-2 max-1100:[&>*:nth-child(n+4)]:hidden">
            {products.map((product, idx) => (
              <ScrollReveal
                key={product.name}
                variant="fade-up"
                delay={idx * 75}
                duration={650}
              >
                <ProductCard product={product} />
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
      onClose={() => navigate("/")}
    />
  );
}

function AuthRoute({ mode }) {
  return <AuthPage mode={mode} />;
}

export default function App() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Create Shop Onboarding Flow */}
      <Route
        path="/create-shop/*"
        element={<CreateShopRoute />}
      />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={<AuthRoute mode="login" />}
      />
      <Route
        path="/signup"
        element={<AuthRoute mode="signup" />}
      />

      {/* Seller Portal Routes */}
      <Route path="/seller" element={<SellerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SellerDashboardPage />} />
        <Route path="products" element={<SellerProductsPage />} />
        <Route path="orders" element={<SellerOrdersPage />} />
        <Route path="settings" element={<SellerStoreSettingsPage />} />
        <Route path="payouts" element={<SellerPayoutsPage />} />
      </Route>

      {/* Admin Portal Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="shops" element={<AdminShopsPage />} />
        <Route path="students" element={<AdminStudentsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}