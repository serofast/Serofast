import { useState, useEffect } from "react";
import Logo from "./Logo";
import { Search, Smartphone, Store, UserRound, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({ onOpenAppTeaser, hideFreeBuffBranding = false }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight =
            document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const currentScroll = window.scrollY;

          const progress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
          setScrollProgress(Math.min(100, Math.max(0, progress)));
          setIsScrolled(currentScroll > 15);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onOpenAppTeaser) {
      onOpenAppTeaser(searchQuery || "Search Products");
    }
  };

  return (
    <header
      className={`landing-header sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-slate-200/60 bg-white/[0.98] shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-[20px]"
          : "border-b border-slate-100 bg-white/[0.95] backdrop-blur-[16px]"
      }`}
    >
      {/* Scroll Progress Bar */}
      <div
        className="fixed left-0 top-0 z-[100] h-[3px] w-full origin-left bg-gradient-to-r from-brandRed via-red-500 to-rose-400 shadow-[0_0_10px_rgba(210,33,37,0.5)] transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Main Header Row */}
      <div className="landing-header-main mx-auto flex min-h-[64px] w-[min(1320px,calc(100%_-_40px))] items-center justify-between gap-4 px-1 sm:min-h-[68px] sm:px-2 lg:min-h-[72px]">
        {/* Logo */}
        <Link
          to="/"
          className="group inline-flex shrink-0 items-center gap-2 text-[20px] font-extrabold tracking-[-0.5px] text-brandRed transition-transform duration-200 hover:scale-[1.02] sm:text-[22px]"
          aria-label="SeroFast home"
        >
          <Logo size="sm" iconClassName="transition-transform duration-300 group-hover:scale-110" />
          <span className="tracking-tight">SEROFAST</span>
        </Link>

        {/* Search Bar — Desktop */}
        <form
          onSubmit={handleSearchSubmit}
          className="group hidden flex-1 items-center rounded-full border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-[#777] transition-all duration-300 hover:border-slate-300 hover:bg-white focus-within:border-brandRed focus-within:bg-white focus-within:ring-4 focus-within:ring-brandRed/10 focus-within:shadow-[0_4px_18px_rgba(210,33,37,0.08)] sm:flex sm:max-w-[420px] lg:max-w-[480px]"
        >
          <Search size={18} className="shrink-0 transition-colors group-hover:text-brandRed group-focus-within:text-brandRed" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
            placeholder="Search shops, deals, products..."
            className="w-full border-0 bg-transparent px-3 text-[13px] text-[#191616] outline-none placeholder:text-[#aaa]"
          />
          <button
            type="submit"
            className="rounded-full bg-brandRed/10 px-3 py-1 text-[11px] font-bold text-brandRed transition-colors hover:bg-brandRed hover:text-white"
          >
            Search
          </button>
        </form>

        {/* Nav Actions — Desktop */}
        <nav className="hidden items-center gap-2 text-[12px] font-semibold lg:flex lg:gap-3" aria-label="Account actions">
          <button
            type="button"
            onClick={() => onOpenAppTeaser?.("Customer Mobile App")}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-brandRed/30 hover:text-brandRed"
          >
            <Smartphone size={15} className="text-brandRed" />
            <span>Mobile App</span>
            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[8px] font-extrabold text-amber-700 border border-amber-200">
              NEW
            </span>
          </button>

          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-brandRed to-rose-600 px-4 py-2 text-white shadow-[0_4px_14px_rgba(211,47,47,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(211,47,47,0.35)] active:scale-95"
          >
            <Store size={15} />
            <span>List Shop</span>
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-brandRed/30 hover:bg-white hover:text-brandRed"
          >
            <UserRound size={15} />
            <span>Shop Owner Login</span>
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="no-btn-anim grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Search Bar */}
      <div className="border-t border-slate-100 px-4 py-2.5 sm:hidden">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2"
        >
          <Search size={16} className="text-[#aaa]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shops, deals..."
            className="w-full border-0 bg-transparent text-[13px] text-[#191616] outline-none placeholder:text-[#aaa]"
          />
        </form>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 sm:hidden animate-fade-in-down">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => { onOpenAppTeaser?.("Customer Mobile App"); setMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-left text-[13px] font-semibold text-slate-700 transition hover:bg-white hover:border-brandRed/20"
            >
              <Smartphone size={16} className="text-brandRed" />
              <span>Mobile App</span>
              <span className="ml-auto rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">NEW</span>
            </button>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-brandRed to-rose-600 px-4 py-3 text-[13px] font-bold text-white shadow-sm"
            >
              <Store size={16} />
              <span>List Your Shop</span>
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold text-slate-700 transition hover:border-brandRed/20"
            >
              <UserRound size={16} />
              <span>Shop Owner Login</span>
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
