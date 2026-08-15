import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, Bell, LogOut, X, ChevronDown } from "lucide-react";
import Icon from "../shared/legacyIcon";
import { nav } from "../data";

function SidebarItem({ item, close }) {
  const location = useLocation();
  const active =
    item[1] === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(item[1]);

  return (
    <NavLink
      to={item[1]}
      onClick={close}
      className={[
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
        active
          ? "bg-brandRed text-white"
          : "text-textSecondary hover:bg-promoHighlight hover:text-brandRed",
      ].join(" ")}
    >
      <Icon name={item[2]} size={17} />
      <span>{item[0]}</span>
    </NavLink>
  );
}

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-lightBackground text-textPrimary">
      <aside
        className={[
          "fixed inset-y-0 left-0 z-[70] flex w-[272px] flex-col",
          "border-r border-lightBorder bg-lightSurface p-4 shadow-sm",
          "transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-2">
          <Link
            to="/"
            onClick={close}
            className="flex items-center gap-2 text-lg font-extrabold text-brandRed"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brandRed text-sm text-white">
              S
            </span>
            SEROFAST
          </Link>

          <button
            type="button"
            onClick={close}
            className="grid h-9 w-9 place-items-center rounded-lg border border-lightBorder lg:hidden"
            aria-label="Close admin navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-7 flex-1 overflow-y-auto pr-1">
          {nav.map((group) => (
            <div key={group[0]} className="mb-6">
              <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-textMuted">
                {group[0]}
              </p>

              <div className="space-y-1">
                {group[1].map((item) => (
                  <SidebarItem key={item[1]} item={item} close={close} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-lightBorder pt-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-promoHighlight p-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brandRed text-sm font-bold text-white">
              A
            </span>
            <div>
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-textSecondary">Super Admin</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-textSecondary hover:bg-slate-50"
          >
            <LogOut size={17} />
            Exit Admin
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[60] bg-black/30 lg:hidden"
          onClick={close}
          aria-label="Close admin navigation"
        />
      )}

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-50 border-b border-lightBorder bg-lightSurface/95 backdrop-blur">
          <div className="mx-auto flex min-h-[68px] max-w-[1600px] items-center gap-3 px-4 sm:px-6 xl:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-lightBorder lg:hidden"
              aria-label="Open admin navigation"
            >
              <Menu size={18} />
            </button>

            <div className="flex flex-1 items-center gap-3">
              <label className="hidden h-10 w-full max-w-[380px] items-center gap-2 rounded-lg border border-lightBorder bg-white px-3 md:flex">
                <Search size={16} className="text-textMuted" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-textMuted"
                  placeholder="Search the marketplace..."
                />
              </label>

              <div className="hidden lg:block">
                <p className="text-sm font-semibold">SeroFast Admin</p>
                <p className="text-xs text-textMuted">
                  Marketplace control center
                </p>
              </div>
            </div>

            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg border border-lightBorder"
              aria-label="Notifications"
            >
              <Bell size={17} />
            </button>

            <button
              type="button"
              className="hidden items-center gap-2 rounded-xl border border-lightBorder px-3 py-2 sm:flex"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brandRed text-xs font-bold text-white">
                A
              </span>
              <span className="text-left">
                <span className="block text-xs font-semibold">Admin</span>
                <span className="block text-[11px] text-textMuted">
                  Super Admin
                </span>
              </span>
              <ChevronDown size={14} className="text-textMuted" />
            </button>
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100vh-68px)] max-w-[1600px] px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
