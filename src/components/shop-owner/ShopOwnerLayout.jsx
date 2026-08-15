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
    { label: "Overview", path: "/shop-owner/dashboard", icon: LayoutDashboard },
    { label: "Products", path: "/shop-owner/inventory", icon: Package },
    { label: "Orders", path: "/shop-owner/orders", icon: ShoppingBag, badge: "3" },
    { label: "Settings", path: "/shop-owner/settings", icon: Settings },
    { label: "Payouts", path: "/shop-owner/payouts", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-200/80 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-500 hover:text-slate-900 p-1"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/shop-owner/dashboard" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brandRed text-white font-bold text-xs">
              S
            </span>
            <span className="text-xs font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              SEROFAST <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">STORE</span>
            </span>
          </Link>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleStatus}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition ${
              storeStatus === "online"
                ? "border-emerald-200 bg-emerald-50/80 text-emerald-700"
                : "border-slate-200 bg-slate-100 text-slate-600"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${storeStatus === "online" ? "bg-emerald-500" : "bg-slate-400"}`} />
            <span className="hidden sm:inline text-[11px]">{storeStatus === "online" ? "Online" : "Offline"}</span>
          </button>

          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-brandRed"
          >
            <span>Storefront</span>
            <ExternalLink size={12} />
          </Link>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            title="Exit"
          >
            <Power size={16} />
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex flex-1">
        {/* Mobile Backdrop Overlay */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-xs md:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-slate-200/80 bg-white pt-14 transition-transform duration-200 md:static md:w-56 md:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col justify-between p-3">
            <div className="space-y-4">
              {/* Store Identity Badge */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 flex items-center gap-2.5">
                <img
                  src={initialSellerStore.logoUrl}
                  alt={initialSellerStore.name}
                  className="h-8 w-8 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 truncate">{initialSellerStore.name}</h4>
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <ShieldCheck size={10} /> Verified
                  </span>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition ${
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

            {/* Bottom Merchant Support */}
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
              <span className="text-[11px] font-medium text-slate-700 block">Merchant Support</span>
              <a
                href="#support"
                className="mt-1.5 inline-block w-full rounded-lg bg-white border border-slate-200 py-1 text-[11px] font-medium text-slate-700 hover:border-brandRed hover:text-brandRed transition"
              >
                Help Desk
              </a>
            </div>
          </div>
        </aside>

        {/* Page Body Outlet */}
        <main className="flex-1 p-4 sm:p-6 max-w-6xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
