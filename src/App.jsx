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
  ShopCard,
  ProductCard,
  MobileBottomNav,
} from "./components/reusable";

import { CreateShopPage } from "./components/create-shop";
import { AuthPage } from "./components/auth";

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
        <section className="w-full" id="home">
          <HeroBanner />
        </section>

        <section className={`${pageContainer} pt-12 max-800:pt-8`} id="shops">
          <SectionHeader
            title="Top Rated Shops"
            action="View all shops"
            href="#shops"
          />

          <div className="grid grid-cols-6 gap-3 max-1100:grid-cols-3 max-800:grid-cols-2 max-560:gap-2 max-1100:[&>*:nth-child(n+4)]:hidden">
            {shops.map((shop) => (
              <ShopCard key={shop.name} shop={shop} />
            ))}
          </div>
        </section>

        <section
          className={`${pageContainer} pt-[27px] pb-[38px]`}
          id="products"
        >
          <SectionHeader
            title="Popular Products"
            action="View all products"
            href="#products"
          />

          <div className="grid grid-cols-6 gap-[13px] max-1100:grid-cols-3 max-800:grid-cols-2 max-560:gap-2 max-1100:[&>*:nth-child(n+4)]:hidden">
            {products.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
              />
            ))}
          </div>
        </section>

        <section
          className={`${pageContainer} pb-[90px] max-560:pb-[35px]`}
        >
          <div className="flex items-center justify-between gap-10 rounded-bento-lg bg-promoHighlight px-[38px] py-8 max-800:flex-col max-800:items-start max-560:px-5 max-560:py-6">
            <div>
              <span className="text-[11px] font-extrabold tracking-[0.14em] text-brandRed">
                WHY SER0FAST
              </span>

              <h2 className="my-2 max-w-[600px] text-[29px] max-560:text-[24px]">
                Everything you love, from shops you trust.
              </h2>

              <p className="m-0 max-w-[620px] text-[14px] leading-[1.6] text-textSecondary">
                Discover local fashion, electronics, home essentials and more
                without jumping between different stores.
              </p>
            </div>

            <div className="grid min-w-[360px] grid-cols-2 gap-3 max-800:min-w-0 max-800:w-full max-560:grid-cols-1">
              <div className="flex items-center gap-2 text-[12px] font-semibold">
                <Truck size={20} className="text-brandRed" />
                <span>Fast local delivery</span>
              </div>

              <div className="flex items-center gap-2 text-[12px] font-semibold">
                <RotateCcw size={20} className="text-brandRed" />
                <span>Easy 7-day returns</span>
              </div>

              <div className="flex items-center gap-2 text-[12px] font-semibold">
                <CreditCard size={20} className="text-brandRed" />
                <span>Secure payments</span>
              </div>

              <div className="flex items-center gap-2 text-[12px] font-semibold">
                <Headphones size={20} className="text-brandRed" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </section>
      </main>

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
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/create-shop/*"
        element={<CreateShopRoute />}
      />

      <Route
        path="/login"
        element={<AuthRoute mode="login" />}
      />

      <Route
        path="/signup"
        element={<AuthRoute mode="signup" />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}