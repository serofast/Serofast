import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  CreditCard,
  Bell,
  ShieldCheck,
  ExternalLink,
  Store,
  LogOut,
  UserRound,
} from "lucide-react";
import ShopOwnerBottomNav from "./ShopOwnerBottomNav";
import { Logo } from "../reusable";

export default function ShopOwnerLayout() {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const [activeShop, setActiveShop] = useState(() => {
    try {
      const stored = localStorage.getItem("serofast_active_shop");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [currentOwner, setCurrentOwner] = useState(() => {
    try {
      const stored = localStorage.getItem("serofast_current_owner");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      const storedShop = localStorage.getItem("serofast_active_shop");
      if (storedShop) setActiveShop(JSON.parse(storedShop));

      const storedOwner = localStorage.getItem("serofast_current_owner");
      if (storedOwner) setCurrentOwner(JSON.parse(storedOwner));
    } catch (e) {
      console.warn("Storage read error", e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("serofast_active_shop");
    localStorage.removeItem("serofast_current_owner");
    navigate("/login");
  };

  const hasShop = Boolean(activeShop);

  const navItems = [
    { label: "Overview", path: "/shop-owner/dashboard", icon: LayoutDashboard },
    { label: "Products", path: "/shop-owner/inventory", icon: Package },
    { label: "Orders", path: "/shop-owner/orders", icon: ShoppingBag, badge: hasShop ? "3" : null },
    { label: "Payouts", path: "/shop-owner/payouts", icon: CreditCard },
    { label: "Settings", path: "/shop-owner/settings", icon: Settings },
  ];

  const storeName = activeShop?.name || currentOwner?.full_name || "New Store";
  const storeInitials = storeName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex flex-col font-sans font-sansation">
      {/* Top Nav Header */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md px-4 sm:px-6 gap-3 shadow-2xs">
        {/* Left: Brand Logo Stack */}
        <Link to="/shop-owner/dashboard" className="group inline-flex items-center gap-2 text-[17px] sm:text-[19px] font-semibold tracking-tight text-brandRed">
          <Logo size="sm" />
          <span className="tracking-tight font-semibold">SEROFAST</span>
        </Link>

        {/* Right: Notification Bell & Profile Avatar */}
        <div className="flex items-center gap-2">
          {/* Notification Link */}
          <Link
            to="/shop-owner/notifications"
            className="relative grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-slate-50 transition active:scale-95 border border-[#E5E7EB]"
            title="Notifications"
          >
            <Bell size={18} className="text-slate-700" />
            {hasShop && (
              <span className="absolute top-1.5 right-1.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-brandRed text-[8px] font-bold text-white">
                2
              </span>
            )}
          </Link>

          {/* Profile Icon Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#E5E7EB] bg-white hover:border-brandRed transition cursor-pointer active:scale-95 shadow-2xs"
              title="Account Menu"
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-rose-50 text-[11px] font-semibold text-brandRed">
                {storeInitials || <UserRound size={16} />}
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-[24px] border border-[#E5E7EB] bg-white p-2 shadow-xl z-50 text-xs animate-scale-up space-y-1">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-900 block truncate">{storeName}</span>
                  <span className="text-[10px] text-slate-500 font-normal block truncate">{currentOwner?.email || "owner@serofast.com"}</span>
                </div>

                <Link
                  to="/shop-owner/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 transition font-normal"
                >
                  <Settings size={14} className="text-slate-500" /> Store Settings
                </Link>

                <Link
                  to="/"
                  target="_blank"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 transition font-normal"
                >
                  <ExternalLink size={14} className="text-slate-500" /> Customer Storefront
                </Link>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-brandRed font-medium hover:bg-rose-50 transition cursor-pointer"
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex flex-1">
        {/* Desktop Sidebar — Expanded Buttons for Great UI/UX */}
        <aside className="hidden md:block w-64 border-r border-[#E5E7EB] bg-white min-h-[calc(100vh-56px)] shrink-0">
          <div className="flex h-full flex-col justify-between p-4 sticky top-14">
            <div className="space-y-5">
              {/* Store Profile Card */}
              <div className="rounded-[24px] border border-[#F3E5E5] bg-[#FAF8F5] p-3.5 flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-brandRed">
                  {storeInitials || <Store size={18} />}
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 truncate">{storeName}</h4>
                  <span className={`text-[10.5px] font-normal flex items-center gap-1 ${hasShop ? "text-brandRed" : "text-amber-600"}`}>
                    <ShieldCheck size={11} /> {hasShop ? "Verified Store" : "Setup Required"}
                  </span>
                </div>
              </div>

              {/* Navigation Items with Bigger Touch Buttons */}
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-[30px] px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-brandRed text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)]"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-brandRed">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <main className="flex-1 p-3 sm:p-6 max-w-5xl mx-auto pb-24 md:pb-6 w-full min-w-0 overflow-x-hidden">
          {!hasShop ? (
            <div className="flex min-h-[65vh] w-full flex-col items-center justify-center py-6 px-4 font-sans font-sansation">
              <div className="w-full max-w-[460px] rounded-[35px] bg-white border border-[#F3E5E5] px-6 py-8 sm:px-8 sm:py-9 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] text-center transition-all duration-300">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-brandRed mb-4 border border-rose-100 shadow-sm">
                  <Store size={32} />
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-brandRed tracking-tight">
                  Create Your Shop First
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                  Welcome to SeroFast! You haven't set up your campus store yet. Please complete the quick shop creation form to unlock your inventory, orders, payouts, and settings.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    to="/create-shop/basic"
                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-brandRed px-6 text-sm font-bold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark active:scale-[0.98] transition cursor-pointer"
                  >
                    <Store size={18} /> Create My Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      <ShopOwnerBottomNav />
    </div>
  );
}
