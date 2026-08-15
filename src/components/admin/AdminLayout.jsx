import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  GraduationCap,
  ShoppingBag,
  ShieldCheck,
  Power,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Executive Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Merchant Shops (₹50)", path: "/admin/shops", icon: Store, badge: "542" },
    { label: "Student Program", path: "/admin/students", icon: GraduationCap, badge: "1.2k" },
    { label: "Global Order Monitor", path: "/admin/orders", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 sm:px-8 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brandRed text-white font-extrabold text-base shadow-sm">
              S
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                SEROFAST <span className="rounded-md bg-rose-500/20 px-1.5 py-0.5 text-[10px] text-rose-400 font-bold border border-rose-500/30">SUPER ADMIN</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Platform Management Portal</span>
            </div>
          </Link>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Platform Systems Normal</span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="grid h-9 w-9 place-items-center rounded-full bg-slate-800 text-slate-400 hover:bg-rose-900/40 hover:text-rose-400 transition"
            title="Exit Admin Portal"
          >
            <Power size={18} />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1">
        {/* Admin Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-slate-800 bg-slate-900 pt-16 transition-transform duration-300 md:static md:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col justify-between p-4">
            <div className="space-y-6">
              {/* Badge */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 flex items-center gap-3">
                <ShieldCheck size={24} className="text-brandRed" />
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold text-white">SeroFast HQ Control</span>
                  <span className="text-[10px] text-slate-400">Master Coordinator Mode</span>
                </div>
              </div>

              {/* Navigation */}
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
                            ? "bg-brandRed text-white shadow-lg shadow-brandRed/25"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 text-center text-[10px] text-slate-400">
              SeroFast Core Engine v2.4.0
            </div>
          </div>
        </aside>

        {/* Dynamic Admin Page View */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
