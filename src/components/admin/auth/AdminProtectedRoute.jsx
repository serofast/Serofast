import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAdminAuthenticated } from "../../../services/adminAuthService";

/**
 * Route protection wrapper for all SeroFast Administration views.
 * Intercepts unauthenticated direct-URL attempts and redirects to /admin/login.
 */
export default function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const authenticated = isAdminAuthenticated();

  if (!authenticated) {
    const redirectTarget = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectTarget}`} replace />;
  }

  return children;
}
