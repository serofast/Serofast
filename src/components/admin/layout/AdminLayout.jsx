import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, Bell, LogOut, X, ChevronDown } from "lucide-react";
import Icon from "../shared/legacyIcon";
import { nav } from "../data";
import { Logo } from "../../reusable";
import AdminBreadcrumbs from "./AdminBreadcrumbs";
import AdminBottomNav from "./AdminBottomNav";

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
      className={`flex items-center justify-between rounded-[30px] px-4 py-3 text-xs font-medium transition-all duration-200 ${
        active
          ? "bg-brandRed text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)]"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon name={item[2]} size={20} />
        <span>{item[0]}</span>
      </div>
    </NavLink>
  );
}

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const navigate = useNavigate();
  const close = () => setMobileOpen(false);

  function handleGlobalSearch(event) {
    event.preventDefault();
    const query = globalSearch.trim();

    if (query) {
      navigate(`/admin/analytics/search?q=${encodeURIComponent(query)}`);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex flex-col font-sans font-sansation">
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[60] bg-black/30 lg:hidden"
          onClick={close}
          aria-label="Close admin navigation"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-[70] flex w-[272px] flex-col",
          "border-r border-[#E5E7EB] bg-white p-4",
          "transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-2">
          <Link
            to="/"
            onClick={close}
            className="flex items-center gap-2 text-[17px] text-brandRed group"
          >
            <Logo size="sm" iconClassName="group-hover:scale-105" />
            <span className="tracking-tight font-semibold">SEROFAST</span>
          </Link>

          <button
            type="button"
            onClick={close}
            className="grid h-8 w-8 place-items-center rounded-full border border-[#E5E7EB] lg:hidden"
            aria-label="Close admin navigation"
          >
            <X size={16} />
          </button>
        </div>

        {/* Store Profile Card */}
        <div className="mt-4 rounded-[24px] border border-[#F3E5E5] bg-[#FAF8F5] p-3.5 flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-brandRed">
            A
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="text-xs font-semibold text-slate-900 truncate">Admin Panel</h4>
            <span className="text-[10.5px] font-normal flex items-center gap-1 text-brandRed">
              Super Admin
            </span>
          </div>
        </div>

        <nav className="mt-5 flex-1 overflow-y-auto pr-1">
          {nav.map((group) => (
            <div key={group[0]} className="mb-5">
              <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                {group[0]}
              </p>

              <div className="space-y-1.5">
                {group[1].map((item) => (
                  <SidebarItem key={item[1]} item={item} close={close} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-[#E5E7EB] pt-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-[30px] px-4 py-3 text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            <LogOut size={17} />
            Exit Admin
          </button>
        </div>
      </aside>

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md px-4 sm:px-6 gap-3 shadow-2xs">
          <div className="flex flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#E5E7EB] lg:hidden"
              aria-label="Open admin navigation"
            >
              <Menu size={18} className="text-slate-700" />
            </button>

            <form
              onSubmit={handleGlobalSearch}
              className="hidden h-10 w-full max-w-[380px] items-center gap-2 rounded-[30px] border border-[#E5E7EB] bg-white px-4 shadow-[-4px_5px_10px_rgba(211,47,47,0.1)] focus-within:border-brandRed focus-within:shadow-[-4px_5px_10px_rgba(211,47,47,0.2)] transition-all md:flex"
            >
              <Search size={16} className="text-slate-400" />
              <input
                aria-label="Search the marketplace"
                value={globalSearch}
                onChange={(event) => setGlobalSearch(event.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Search the marketplace..."
              />
            </form>

            <div className="hidden lg:block">
              <p className="text-sm font-semibold">SeroFast Admin</p>
              <p className="text-xs text-slate-400">
                Marketplace control center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Link */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((current) => !current)}
                className="relative grid h-10 w-10 place-items-center rounded-full border border-[#E5E7EB] text-slate-600 hover:bg-slate-50 transition active:scale-95"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell size={18} className="text-slate-700" />
                <span className="absolute top-1.5 right-1.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-brandRed text-[8px] font-bold text-white">
                  2
                </span>
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-[24px] border border-[#E5E7EB] bg-white p-2 shadow-xl z-50 text-xs animate-scale-up">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">Admin notifications</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate("/admin/notifications");
                    }}
                    className="mt-1 w-full rounded-xl bg-[#FAF8F5] p-3 text-left text-xs text-slate-600 hover:bg-slate-50 transition"
                  >
                    3 operational templates need review
                  </button>
                </div>
              )}
            </div>

            {/* Profile Icon Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                aria-expanded={profileOpen}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#E5E7EB] bg-white hover:border-brandRed transition cursor-pointer active:scale-95 shadow-2xs"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-rose-50 text-[11px] font-semibold text-brandRed">
                  A
                </div>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-[24px] border border-[#E5E7EB] bg-white p-2 shadow-xl z-50 text-xs animate-scale-up space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-900 block truncate">Admin</span>
                    <span className="text-[10px] text-slate-500 font-normal block truncate">Super Admin</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/admin/settings");
                    }}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 transition font-normal w-full text-left"
                  >
                    Settings
                  </button>
                  <div className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-brandRed font-medium hover:bg-rose-50 transition cursor-pointer"
                    >
                      <LogOut size={14} /> Exit Admin
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto pb-20 md:pb-6 w-full min-w-0">
          <AdminBreadcrumbs />
          {children}
        </main>
      </div>

      <AdminBottomNav />
    </div>
  );
}
