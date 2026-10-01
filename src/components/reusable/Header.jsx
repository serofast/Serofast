import { useState, useEffect } from "react";
import Logo from "./Logo";
import {
  Search,
  Menu,
  X,
  Smartphone,
  Layers,
  GraduationCap,
  Store,
  LogIn,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({ onOpenAppTeaser }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 15);
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
    if (searchQuery.trim()) {
      const target = document.getElementById("app-preview");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      setMobileSearchOpen(false);
    }
  };

  return (
    <header
      className={`landing-header sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-slate-200/80 bg-white/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          : "border-b border-slate-200/50 bg-white/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
      }`}
      style={{
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
      }}
    >
      {/* Main Minimal Header Row */}
      <div className="landing-header-main mx-auto flex h-13 sm:h-14 w-[min(1400px,calc(100%_-_32px))] items-center justify-between gap-3 lg:gap-6">
        {/* Left: Serofast Logo with Slogan */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-95"
          aria-label="Serofast Home"
        >
          <Logo
            size="sm"
            iconClassName="transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-[17px] sm:text-[18px] font-black leading-none tracking-[-0.03em] text-[#d32f2f]">
              Serofast
            </span>
            <span className="mt-0.5 text-[7px] sm:text-[7.5px] font-black tracking-[0.14em] text-[#8b8282] uppercase">
              SHOP • SHARE • EARN
            </span>
          </div>
        </Link>

        {/* Center: Minimal Slim Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="group relative hidden flex-1 items-center rounded-full border border-slate-200/80 bg-slate-50/80 hover:bg-white hover:border-slate-300 focus-within:bg-white focus-within:border-brandRed focus-within:ring-2 focus-within:ring-brandRed/15 pl-3 pr-1 py-0.5 text-slate-700 transition-all duration-200 md:flex md:max-w-[220px] lg:max-w-[260px] xl:max-w-[300px] h-8 shadow-2xs"
        >
          <Search size={13} className="text-slate-400 shrink-0 group-focus-within:text-brandRed transition-colors" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search mobile app features, tools, catalog"
            placeholder="Search features, shops..."
            className="w-full border-0 bg-transparent px-2 text-xs text-[#191616] outline-none placeholder:text-slate-400 font-normal"
          />
          {searchQuery.trim() && (
            <button
              type="submit"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brandRed text-white text-[10px] shadow-xs hover:bg-brandRedDark transition-transform active:scale-95 cursor-pointer"
              aria-label="Submit search"
            >
              <Search size={11} />
            </button>
          )}
        </form>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 text-xs font-semibold text-slate-600 lg:flex">
          <a
            href="#app-preview"
            className="rounded-full px-3 py-1.5 text-slate-700 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.06] active:scale-95"
          >
            Walkthrough
          </a>
          <a
            href="#app-features"
            className="rounded-full px-3 py-1.5 text-slate-700 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.06] active:scale-95"
          >
            Features
          </a>
          <a
            href="#dual-mode"
            className="rounded-full px-3 py-1.5 text-slate-700 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.06] active:scale-95"
          >
            Students
          </a>
          <Link
            to="/signup"
            className="rounded-full px-3 py-1.5 text-slate-700 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.06] active:scale-95"
          >
            Become a Seller
          </Link>
        </nav>

        {/* Right Actions: Search Toggle (Mobile), Login Button & Hamburger Menu */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setMobileSearchOpen(!mobileSearchOpen);
              if (mobileMenuOpen) setMobileMenuOpen(false);
            }}
            className="grid h-8 w-8 place-items-center rounded-full border border-slate-200/80 bg-white/80 text-slate-600 shadow-2xs transition-all duration-150 hover:text-brandRed hover:border-brandRed/30 hover:bg-brandRed/[0.06] active:scale-95 md:hidden cursor-pointer"
            aria-label="Toggle search"
          >
            <Search size={14} />
          </button>

          {/* Login Button */}
          <Link
            to="/login"
            className="group inline-flex h-8 items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/90 px-3.5 text-xs font-bold text-[#191616] shadow-2xs backdrop-blur-md transition-all duration-150 hover:border-brandRed/30 hover:text-brandRed hover:bg-brandRed/[0.06] active:scale-95"
          >
            <LogIn size={12} className="text-brandRed transition-transform duration-150 group-hover:translate-x-0.5" />
            <span>Login</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              if (mobileSearchOpen) setMobileSearchOpen(false);
            }}
            className="grid h-8 w-8 place-items-center rounded-full border border-slate-200/90 bg-white/80 text-slate-700 shadow-2xs transition-all duration-150 hover:text-brandRed hover:border-brandRed/30 hover:bg-brandRed/[0.06] active:scale-95 lg:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar - Expandable Slide-Down */}
      {mobileSearchOpen && (
        <div className="border-t border-slate-100 bg-white/95 px-4 py-2 backdrop-blur-md md:hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 shadow-2xs"
          >
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features, shops..."
              className="w-full border-0 bg-transparent text-xs text-[#191616] outline-none placeholder:text-slate-400"
              autoFocus
            />
            {searchQuery.trim() && (
              <button
                type="submit"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brandRed text-white text-[11px] transition-transform active:scale-95"
              >
                <Search size={11} />
              </button>
            )}
          </form>
        </div>
      )}

      {/* Mobile Dropdown Menu with Unified Hover Effect */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-xl lg:hidden animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
            <a
              href="#app-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.07]"
            >
              <Smartphone size={15} className="text-brandRed" />
              <span>App Walkthrough</span>
            </a>
            <a
              href="#app-features"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.07]"
            >
              <Layers size={15} className="text-brandRed" />
              <span>Features Inside App</span>
            </a>
            <a
              href="#dual-mode"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.07]"
            >
              <GraduationCap size={15} className="text-brandRed" />
              <span>For Students</span>
            </a>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.07]"
            >
              <Store size={15} className="text-brandRed" />
              <span>Become a Seller</span>
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl border-t border-slate-100 px-3 py-2 font-bold text-brandRed hover:bg-brandRed/[0.07] mt-1"
            >
              <LogIn size={15} />
              <span>Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
