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
    if (onOpenAppTeaser) {
      onOpenAppTeaser(searchQuery || "Search Mobile App Features");
    }
  };

  return (
    <header
      className={`landing-header sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/60 bg-white/85 shadow-[0_10px_35px_rgba(0,0,0,0.06)]"
          : "border-b border-white/45 bg-white/75 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
      }`}
      style={{
        background: isScrolled
          ? "linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(255, 255, 255, 0.80) 100%)"
          : "linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.68) 100%)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      {/* Main Header Row (Progress bar, Install App, and Nagercoil removed per user request) */}
      <div className="mx-auto flex h-[68px] w-[min(1400px,calc(100%_-_32px))] items-center justify-between gap-3 lg:gap-6">
        {/* Left: Serofast Logo with Slogan */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5 transition-all duration-200 hover:opacity-90 active:scale-95"
          aria-label="Serofast Home"
        >
          <Logo
            size="sm"
            iconClassName="transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-[21px] font-black leading-none tracking-[-0.03em] text-[#d32f2f]">
              Serofast
            </span>
            <span className="mt-0.5 text-[8.5px] font-black tracking-[0.14em] text-[#8b8282] uppercase">
              SHOP • SHARE • EARN
            </span>
          </div>
        </Link>

        {/* Center: Search Bar with Glossy Finish */}
        <form
          onSubmit={handleSearchSubmit}
          className="group relative hidden flex-1 items-center rounded-full border border-slate-200/80 bg-white/70 backdrop-blur-md pl-4 pr-1.5 py-1 text-[#4f4a4a] transition-all duration-200 hover:border-slate-300 hover:bg-white/90 focus-within:border-brandRed focus-within:ring-2 focus-within:ring-brandRed/20 md:flex md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] shadow-2xs"
        >
          <Search size={16} className="text-[#888] shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search mobile app features, tools, catalog"
            placeholder="Search campus features, shops, deals..."
            className="w-full border-0 bg-transparent px-3 text-[13px] text-[#191616] outline-none placeholder:text-[#999]"
          />
          <button
            type="submit"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brandRed text-white shadow-xs transition-all duration-200 hover:bg-brandRedDark hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Submit search"
          >
            <Search size={14} />
          </button>
        </form>

        {/* Desktop Navigation Links with Unified Smooth Hover Effect */}
        <nav className="hidden items-center gap-1.5 text-[13px] font-bold text-[#333] lg:flex">
          <a
            href="#app-preview"
            className="rounded-full px-3.5 py-1.5 text-slate-700 transition-all duration-200 hover:text-brandRed hover:bg-brandRed/[0.07] active:scale-95"
          >
            App Walkthrough
          </a>
          <a
            href="#app-features"
            className="rounded-full px-3.5 py-1.5 text-slate-700 transition-all duration-200 hover:text-brandRed hover:bg-brandRed/[0.07] active:scale-95"
          >
            Features
          </a>
          <a
            href="#dual-mode"
            className="rounded-full px-3.5 py-1.5 text-slate-700 transition-all duration-200 hover:text-brandRed hover:bg-brandRed/[0.07] active:scale-95"
          >
            For Students
          </a>
          <Link
            to="/signup"
            className="rounded-full px-3.5 py-1.5 text-slate-700 transition-all duration-200 hover:text-brandRed hover:bg-brandRed/[0.07] active:scale-95"
          >
            Become a Seller
          </Link>
        </nav>

        {/* Right Actions: Login Button & Mobile Menu with Same Unified Hover Effect */}
        <div className="flex items-center gap-3">
          {/* Login Button */}
          <Link
            to="/login"
            className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/90 px-4.5 py-1.5 text-xs font-bold text-[#191616] shadow-2xs backdrop-blur-md transition-all duration-200 hover:border-brandRed/30 hover:text-brandRed hover:bg-brandRed/[0.07] hover:shadow-xs active:scale-95"
          >
            <LogIn size={13} className="text-brandRed transition-transform duration-200 group-hover:translate-x-0.5" />
            <span>Login</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200/90 bg-white/80 text-slate-700 shadow-2xs transition-all duration-200 hover:text-brandRed hover:border-brandRed/30 hover:bg-brandRed/[0.07] active:scale-95 lg:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="border-t border-[#EBE3DC] px-4 py-2.5 md:hidden">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 rounded-full border border-[#D5D9D9] bg-white px-3 py-1.5"
        >
          <Search size={15} className="text-[#888]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campus features, shops..."
            className="w-full border-0 bg-transparent text-[13px] text-[#191616] outline-none placeholder:text-[#999]"
          />
          <button
            type="submit"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brandRed text-white text-xs transition-transform active:scale-95"
          >
            <Search size={13} />
          </button>
        </form>
      </div>

      {/* Mobile Dropdown Menu with Unified Hover Effect */}
      {mobileMenuOpen && (
        <div className="border-t border-[#EBE3DC] bg-white/95 px-4 py-4 backdrop-blur-xl lg:hidden animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1.5 text-sm font-semibold text-[#333]">
            <a
              href="#app-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.07]"
            >
              <Smartphone size={16} className="text-brandRed" />
              <span>App Walkthrough</span>
            </a>
            <a
              href="#app-features"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.07]"
            >
              <Layers size={16} className="text-brandRed" />
              <span>Features Inside App</span>
            </a>
            <a
              href="#dual-mode"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.07]"
            >
              <GraduationCap size={16} className="text-brandRed" />
              <span>For Students</span>
            </a>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.07]"
            >
              <Store size={16} className="text-brandRed" />
              <span>Become a Seller</span>
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl border-t border-slate-100 px-3 py-2.5 font-bold text-brandRed hover:bg-brandRed/[0.07]"
            >
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
