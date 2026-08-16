import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  CreditCard,
  Bell,
  ChevronDown,
  ShieldCheck,
  Power,
  ExternalLink,
  Store,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";
import { initialSellerStore } from "../../data/sellerData";
import ShopOwnerBottomNav from "./ShopOwnerBottomNav";
import { Logo } from "../reusable";

export default function ShopOwnerLayout() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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

  const storeName = activeShop?.name || currentOwner?.full_name || "New Seller";
  const storeLogo = activeShop?.avatar_url || "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&q=80";

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col font-sans">
      {/* Top Nav — Clean: Brand + Notification + Profile */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-6 gap-3 shadow-2xs">
        {/* Left: Brand */}
        <Link to="/shop-owner/dashboard" className="group inline-flex items-center gap-2 text-[19px] sm:text-[21px] font-extrabold tracking-[-0.5px] text-brandRed transition-transform duration-200 hover:scale-[1.02]">
          <Logo size="sm" iconClassName="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" />
          <span className="tracking-tight">SEROFAST</span>
        </Link>

        {/* Right: Notification + Profile */}
        <div className="flex items-center gap-2">
          {/* Notification */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileDropdownOpen(false); }}
              className="relative grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100 transition active:scale-95"
            >
              <Bell size={20} />
              {hasShop && (
                <span className="absolute top-1.5 right-1.5 grid h-4 w-4 place-items-center rounded-full bg-brandRed text-[9px] font-bold text-white">2</span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50 text-xs animate-scale-up space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] text-brandRed font-medium">Alerts</span>
                </div>
                {hasShop ? (
                  <>
                    <div className="rounded-xl bg-slate-50 p-2.5 space-y-0.5">
                      <p className="font-semibold text-slate-900">New Order #SF-1043</p>
                      <p className="text-[10px] text-slate-500">2 items • ₹799 • 5 mins ago</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 space-y-0.5">
                      <p className="font-semibold text-slate-900">Settlement Deposited</p>
                      <p className="text-[10px] text-emerald-600 font-medium">₹4,497 settled to UPI</p>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-400 py-3 text-center">No notifications yet. Create your shop to start selling!</p>
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setProfileDropdownOpen(!profileDropdownOpen); setNotificationsOpen(false); }}
              className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white p-1 pr-2 hover:border-slate-300 transition cursor-pointer active:scale-95"
            >
              <img src={storeLogo} alt={storeName} className="h-7 w-7 rounded-full object-cover border border-slate-200" />
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 text-xs animate-scale-up space-y-1">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900 block truncate">{storeName}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{currentOwner?.email || "owner@serofast.com"}</span>
                </div>

                {hasShop && (
                  <>
                    <Link to="/shop-owner/settings" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 transition font-medium">
                      <Settings size={14} className="text-slate-500" /> Store Settings
                    </Link>
                    <Link to="/" target="_blank" className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 transition font-medium">
                      <ExternalLink size={14} className="text-slate-500" /> Customer Storefront
                    </Link>
                  </>
                )}

                <div className="border-t border-slate-100 pt-1">
                  <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-brandRed font-semibold hover:bg-rose-50 transition cursor-pointer">
                    <Power size={14} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-56 border-r border-slate-200/80 bg-white min-h-[calc(100vh-56px)] shrink-0">
          <div className="flex h-full flex-col justify-between p-3 sticky top-14">
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 flex items-center gap-2.5">
                <img src={storeLogo} alt={storeName} className="h-9 w-9 rounded-xl object-cover border border-slate-200 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 truncate">{storeName}</h4>
                  <span className={`text-[10px] font-medium flex items-center gap-1 ${hasShop ? "text-emerald-600" : "text-amber-600"}`}>
                    <ShieldCheck size={10} /> {hasShop ? "Verified Store" : "Setup Incomplete"}
                  </span>
                </div>
              </div>

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
                      <div className="flex items-center gap-2.5"><Icon size={16} /> {item.label}</div>
                      {item.badge && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-brandRed">{item.badge}</span>}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-2">
              <button type="button" onClick={handleLogout} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-brandRed hover:bg-rose-50 transition cursor-pointer">
                <Power size={14} /> Log Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      <ShopOwnerBottomNav />
    </div>
  );
}
