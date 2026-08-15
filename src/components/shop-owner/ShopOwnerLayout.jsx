import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  CreditCard,
  Search,
  Bell,
  ChevronDown,
  ShieldCheck,
  Power,
  ExternalLink,
  Store,
} from "lucide-react";
import { initialSellerStore } from "../../data/sellerData";
import ShopOwnerBottomNav from "./ShopOwnerBottomNav";

export default function ShopOwnerLayout() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeShop, setActiveShop] = useState(() => {
    try {
      const stored = localStorage.getItem("serofast_active_shop");
      return stored ? JSON.parse(stored) : initialSellerStore;
    } catch (e) {
      return initialSellerStore;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("serofast_active_shop");
      if (stored) {
        setActiveShop(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Storage read error", e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("serofast_active_shop");
    navigate("/login");
  };

  const navItems = [
    { label: "Overview", path: "/shop-owner/dashboard", icon: LayoutDashboard },
    { label: "Products", path: "/shop-owner/inventory", icon: Package },
    { label: "Orders", path: "/shop-owner/orders", icon: ShoppingBag, badge: "3" },
    { label: "Payouts", path: "/shop-owner/payouts", icon: CreditCard },
    { label: "Settings", path: "/shop-owner/settings", icon: Settings },
  ];

  const currentStoreName = activeShop?.name || initialSellerStore.name;
  const currentLogoUrl = activeShop?.avatar_url || initialSellerStore.logoUrl;

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-3 sm:px-6 gap-3 shadow-2xs">
        {/* Left: Brand Logo & Store Title */}
        <div className="flex items-center gap-2">
          <Link to="/shop-owner/dashboard" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brandRed text-white font-bold text-sm shadow-xs">
              S
            </span>
            <span className="text-xs font-bold tracking-tight text-slate-900 flex items-center gap-1">
              SEROFAST <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">STORE</span>
            </span>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 items-center max-w-xs sm:max-w-md mx-2">
          <div className="flex min-h-[38px] w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-brandRed focus-within:bg-white focus-within:ring-2 focus-within:ring-brandRed/10">
            <Search size={15} className="mr-2 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search orders, catalog..."
              className="w-full border-0 bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right: Notification Icon & Profile Icon */}
        <div className="flex items-center gap-2">
          {/* Notification Icon */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              className="relative grid h-9 w-9 place-items-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition active:scale-95"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 grid h-4 w-4 place-items-center rounded-full bg-brandRed text-[9px] font-bold text-white shadow-xs">
                2
              </span>
            </button>

            {/* Notification Dropdown Box */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50 text-xs animate-scale-up space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] text-brandRed font-medium">Alerts</span>
                </div>
                <div className="space-y-1.5">
                  <div className="rounded-lg bg-slate-50 p-2 space-y-0.5">
                    <p className="font-semibold text-slate-900">New Order #SF-1043 Received</p>
                    <p className="text-[10px] text-slate-500">2 items • ₹799 • 5 mins ago</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 space-y-0.5">
                    <p className="font-semibold text-slate-900">Weekly Settlement Deposited</p>
                    <p className="text-[10px] text-emerald-600 font-medium">₹4,497 settled to UPI</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Icon with Interactive Dropdown & Logout Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white p-1 pr-2 hover:border-slate-300 transition cursor-pointer active:scale-95"
            >
              <img
                src={currentLogoUrl}
                alt={currentStoreName}
                className="h-7 w-7 rounded-full object-cover border border-slate-200"
              />
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {/* Profile & Logout Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 text-xs animate-scale-up space-y-1">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900 block truncate">{currentStoreName}</span>
                  <span className="text-[10px] text-slate-500 block truncate">owner@serofast.com</span>
                </div>

                <Link
                  to="/shop-owner/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 transition font-medium"
                >
                  <Settings size={14} className="text-slate-500" />
                  <span>Store Settings</span>
                </Link>

                <Link
                  to="/"
                  target="_blank"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 transition font-medium"
                >
                  <ExternalLink size={14} className="text-slate-500" />
                  <span>Customer Storefront</span>
                </Link>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-brandRed font-semibold hover:bg-rose-50 transition cursor-pointer"
                  >
                    <Power size={14} />
                    <span>Log Out / Exit Store</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex flex-1">
        {/* Desktop Sidebar (Visible on Desktop >= md) */}
        <aside className="hidden md:block w-56 border-r border-slate-200/80 bg-white min-h-[calc(100vh-56px)] shrink-0">
          <div className="flex h-full flex-col justify-between p-3 sticky top-14">
            <div className="space-y-4">
              {/* Store Identity Badge */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 flex items-center gap-2.5">
                <img
                  src={currentLogoUrl}
                  alt={currentStoreName}
                  className="h-8 w-8 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 truncate">{currentStoreName}</h4>
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <ShieldCheck size={10} /> Verified Store
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
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition ${
                          isActive
                            ? "bg-brandRed text-white font-semibold shadow-md shadow-brandRed/20"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="rounded-full bg-rose-100 px-2 py-0.2 text-[10px] font-bold text-brandRed">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Merchant Support & Log Out Button */}
            <div className="space-y-2">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
                <span className="text-[11px] font-medium text-slate-700 block">Merchant Support</span>
                <a
                  href="#support"
                  className="mt-1.5 inline-block w-full rounded-lg bg-white border border-slate-200 py-1 text-[11px] font-medium text-slate-700 hover:border-brandRed hover:text-brandRed transition"
                >
                  Help Desk
                </a>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-brandRed hover:bg-rose-50 transition cursor-pointer"
              >
                <Power size={14} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile App Bottom Navigation Bar (Visible on Mobile < md) */}
      <ShopOwnerBottomNav />
    </div>
  );
}
