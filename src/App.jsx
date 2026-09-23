import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
