import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";

// Lazy-loaded routes for production-grade bundle optimization
const LoginPage = lazy(() =>
  import("./components/auth").then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("./components/auth").then((m) => ({ default: m.RegisterPage }))
);
const CreateShopPage = lazy(() =>
  import("./components/create-shop").then((m) => ({ default: m.CreateShopPage }))
);

const ShopOwnerLayout = lazy(() =>
  import("./components/shop-owner").then((m) => ({ default: m.ShopOwnerLayout }))
);
const ShopOwnerDashboardPage = lazy(() =>
  import("./components/shop-owner").then((m) => ({ default: m.ShopOwnerDashboardPage }))
);
const ShopOwnerInventoryPage = lazy(() =>
  import("./components/shop-owner").then((m) => ({ default: m.ShopOwnerInventoryPage }))
);
const ShopOwnerOrdersPage = lazy(() =>
  import("./components/shop-owner").then((m) => ({ default: m.ShopOwnerOrdersPage }))
);
const ShopOwnerSettingsPage = lazy(() =>
  import("./components/shop-owner").then((m) => ({ default: m.ShopOwnerSettingsPage }))
);
const ShopOwnerPayoutsPage = lazy(() =>
  import("./components/shop-owner").then((m) => ({ default: m.ShopOwnerPayoutsPage }))
);
const ShopOwnerNotificationsPage = lazy(() =>
  import("./components/shop-owner").then((m) => ({ default: m.ShopOwnerNotificationsPage }))
);

const AdminRoutes = lazy(() =>
  import("./components/admin").then((m) => ({ default: m.AdminRoutes }))
);
const OrderTrackingPage = lazy(() =>
  import("./components/orders/OrderTrackingPage")
);

/* =========================================================
   CLEAN BRANDED PAGE LOADER
   ========================================================= */
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-3 select-none">
      <div className="relative flex h-10 w-10 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brandRed opacity-30" />
        <span className="relative inline-flex h-6 w-6 rounded-full bg-brandRed shadow-md shadow-brandRed/25" />
      </div>
      <span className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
        Loading SeroFast...
      </span>
    </div>
  );
}

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
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
}
