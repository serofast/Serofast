import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  CreditCard,
  Power,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { initialSellerStore } from "../../data/sellerData";

export default function ShopOwnerLayout() {
  const [storeStatus, setStoreStatus] = useState(initialSellerStore.status);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleStatus = () => {
    setStoreStatus((prev) => (prev === "online" ? "offline" : "online"));
  };

  const navItems = [
    { label: "Store Overview", path: "/shop-owner/dashboard", icon: LayoutDashboard },
    { label: "Products & Inventory", path: "/shop-owner/inventory", icon: Package },
    { label: "Live Customer Orders", path: "/shop-owner/orders", icon: ShoppingBag, badge: "3" },
    { label: "Store Profile & QR Poster", path: "/shop-owner/settings", icon: Settings },
    { label: "Bank Settlements & Payouts", path: "/shop-owner/payouts", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] flex flex-col font-sans">
      {/* Top Shop Owner Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-8 shadow-xs backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/shop-owner/dashboard" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brandRed text-white font-extrabold text-base shadow-sm">
              S
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                SEROFAST <span className="rounded-md bg-brandRed/10 px-1.5 py-0.5 text-[10px] text-brandRed font-bold">SHOP OWNER</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Verified Store Workspace</span>
            </div>
          </Link>
        </div>

        {/* Store Live Status & Action Controls */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Store Online / Offline Toggle Pill */}
          <button
            type="button"
            onClick={toggleStatus}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
              storeStatus === "online"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-2xs hover:bg-emerald-100"
                : "border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${storeStatus === "online" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
            <span className="hidden sm:inline">{storeStatus === "online" ? "Store Active & Accepting Orders" : "Store Offline"}</span>
          </button>

          {/* View Public Store Profile */}
          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brandRed hover:text-brandRed transition-colors"
          >
            <span>Preview Storefront</span>
            <ExternalLink size={13} />
          </Link>

          {/* Exit Shop Owner Portal */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-brandRed transition-colors"
            title="Exit Workspace"
          >
            <Power size={18} />
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-slate-200 bg-white pt-16 transition-transform duration-300 md:static md:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col justify-between p-4">
            <div className="space-y-6">
              {/* Store Summary Badge */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 flex items-center gap-3">
                <img
                  src={initialSellerStore.logoUrl}
                  alt={initialSellerStore.name}
                  className="h-10 w-10 rounded-xl object-cover border border-white shadow-2xs"
                />
                <div className="flex flex-col min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{initialSellerStore.name}</h4>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck size={11} /> Verified Shop Owner
                  </span>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
                          isActive
                            ? "bg-brandRed text-white shadow-md shadow-brandRed/20"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-brandRed">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Support Callout */}
            <div className="rounded-2xl bg-brandRed/5 border border-brandRed/10 p-3.5 text-center">
              <span className="text-[11px] font-bold text-brandRed block">Shop Owner Support</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">24/7 Merchant Support Line</span>
              <a
                href="#support"
                className="mt-2.5 inline-block w-full rounded-lg bg-white border border-brandRed/20 py-1 text-[11px] font-bold text-brandRed shadow-2xs hover:bg-brandRed hover:text-white transition-colors"
              >
                Whatsapp Support
              </a>
            </div>
          </div>
        </aside>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
