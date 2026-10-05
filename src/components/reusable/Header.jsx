import { useState, useEffect } from "react";
import Logo from "./Logo";
import {
  Menu,
  X,
  Smartphone,
  Layers,
  GraduationCap,
  Store,
  LogIn,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
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

  return (
    <header
      className={`landing-header sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-slate-200/80 bg-white/95 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          : "border-b border-slate-200/50 bg-white/90 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
      }`}
      style={{
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
      }}
    >
      {/* Main Header Row */}
      <div className="landing-header-main mx-auto flex h-14 sm:h-16 w-[min(1400px,calc(100%_-_32px))] items-center justify-between gap-4">
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
            <span className="text-[17px] sm:text-[19px] font-black leading-none tracking-[-0.03em] text-[#d32f2f]">
              Serofast
            </span>
            <span className="mt-0.5 text-[7px] sm:text-[7.5px] font-black tracking-[0.14em] text-[#8b8282] uppercase">
              SHOP • SHARE • EARN
            </span>
          </div>
        </Link>

        {/* Right: Desktop Navigation Links + Login CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-slate-600 md:flex">
            <a
              href="#app-preview"
              className="rounded-full px-3.5 py-1.5 text-slate-700 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.06] active:scale-95"
            >
              Walkthrough
            </a>
            <a
              href="#app-features"
              className="rounded-full px-3.5 py-1.5 text-slate-700 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.06] active:scale-95"
            >
              Features
            </a>
            <a
              href="#dual-mode"
              className="rounded-full px-3.5 py-1.5 text-slate-700 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.06] active:scale-95"
            >
              Students
            </a>
            <Link
              to="/signup"
              className="rounded-full px-3.5 py-1.5 text-slate-700 transition-all duration-150 hover:text-brandRed hover:bg-brandRed/[0.06] active:scale-95"
            >
              Become a Seller
            </Link>
          </nav>

          {/* Login Button */}
          <Link
            to="/login"
            className="group inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/95 px-4 text-xs font-bold text-[#191616] shadow-2xs backdrop-blur-md transition-all duration-150 hover:border-brandRed/30 hover:text-brandRed hover:bg-brandRed/[0.06] active:scale-95"
          >
            <LogIn size={13} className="text-brandRed transition-transform duration-150 group-hover:translate-x-0.5" />
            <span>Login</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200/90 bg-white/90 text-slate-700 shadow-2xs transition-all duration-150 hover:text-brandRed hover:border-brandRed/30 hover:bg-brandRed/[0.06] active:scale-95 md:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-top-2">
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
