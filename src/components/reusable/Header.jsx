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
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  const handleNavClick = (e, targetHash) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const targetElement = document.querySelector(targetHash);
      if (targetElement) {
        if (window.lenis) {
          window.lenis.scrollTo(targetElement, { offset: -70, duration: 1.2 });
        } else {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        window.history.pushState(null, "", targetHash);
      }
    }
  };

  const handleMobileNavClick = (e, targetHash) => {
    setMobileMenuOpen(false);
    handleNavClick(e, targetHash);
  };

  return (
    <header
      className={`landing-header sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-slate-200/70 bg-white/95 backdrop-blur-2xl backdrop-saturate-[1.8] shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
          : "border-b border-slate-200/50 bg-white/85 backdrop-blur-xl backdrop-saturate-[1.8] shadow-[0_1px_6px_rgba(0,0,0,0.02)]"
      }`}
      style={{
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      {/* Main Header Row */}
      <div className="landing-header-main mx-auto flex h-14 sm:h-16 w-[min(1400px,calc(100%_-_32px))] items-center justify-between gap-3 sm:gap-6">
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

        {/* Center: Desktop Navigation Options - Occupying All Available Space (No round container) */}
        <nav className="hidden md:flex flex-1 items-center justify-between mx-4 sm:mx-8 lg:mx-14 h-full">
          <a
            href={location.pathname === "/" ? "#app-preview" : "/#app-preview"}
            onClick={(e) => handleNavClick(e, "#app-preview")}
            className="group relative flex-1 flex flex-col items-center justify-center py-2 px-2 text-xs lg:text-[13.5px] font-bold text-slate-700 transition-colors duration-200 hover:text-brandRed cursor-pointer"
          >
            <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
              Walkthrough
            </span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] w-0 bg-brandRed rounded-full transition-all duration-200 group-hover:w-8 group-hover:shadow-[0_2px_8px_rgba(211,47,47,0.35)]" />
          </a>
          <a
            href={location.pathname === "/" ? "#app-features" : "/#app-features"}
            onClick={(e) => handleNavClick(e, "#app-features")}
            className="group relative flex-1 flex flex-col items-center justify-center py-2 px-2 text-xs lg:text-[13.5px] font-bold text-slate-700 transition-colors duration-200 hover:text-brandRed cursor-pointer"
          >
            <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
              Features
            </span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] w-0 bg-brandRed rounded-full transition-all duration-200 group-hover:w-8 group-hover:shadow-[0_2px_8px_rgba(211,47,47,0.35)]" />
          </a>
          <a
            href={location.pathname === "/" ? "#dual-mode" : "/#dual-mode"}
            onClick={(e) => handleNavClick(e, "#dual-mode")}
            className="group relative flex-1 flex flex-col items-center justify-center py-2 px-2 text-xs lg:text-[13.5px] font-bold text-slate-700 transition-colors duration-200 hover:text-brandRed cursor-pointer"
          >
            <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
              Students
            </span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] w-0 bg-brandRed rounded-full transition-all duration-200 group-hover:w-8 group-hover:shadow-[0_2px_8px_rgba(211,47,47,0.35)]" />
          </a>
          <Link
            to="/signup"
            className="group relative flex-1 flex flex-col items-center justify-center py-2 px-2 text-xs lg:text-[13.5px] font-bold text-slate-700 transition-colors duration-200 hover:text-brandRed cursor-pointer"
          >
            <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
              Become a Seller
            </span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] w-0 bg-brandRed rounded-full transition-all duration-200 group-hover:w-8 group-hover:shadow-[0_2px_8px_rgba(211,47,47,0.35)]" />
          </Link>
        </nav>

        {/* Right: Action Buttons (Login CTA & Mobile Toggle) */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Login Button */}
          <Link
            to="/login"
            className="group inline-flex h-9 sm:h-10 items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/85 px-4 sm:px-5 text-xs sm:text-[13px] font-bold text-[#191616] shadow-2xs backdrop-blur-md transition-all duration-200 hover:border-brandRed hover:bg-white hover:text-brandRed hover:shadow-[0_4px_12px_rgba(211,47,47,0.12)] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            <LogIn
              size={14}
              className="text-brandRed transition-transform duration-200 group-hover:translate-x-0.5"
            />
            <span>Login</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid h-9 sm:h-10 w-9 sm:w-10 place-items-center rounded-full border border-slate-200/80 bg-white/85 text-slate-700 shadow-2xs backdrop-blur-md transition-all duration-200 hover:border-brandRed hover:bg-white hover:text-brandRed hover:shadow-xs hover:-translate-y-0.5 active:scale-95 md:hidden cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Subtle bottom glass highlight reflection */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" />

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-2xl backdrop-saturate-[1.8] shadow-lg md:hidden animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
            <a
              href={location.pathname === "/" ? "#app-preview" : "/#app-preview"}
              onClick={(e) => handleMobileNavClick(e, "#app-preview")}
              className="group flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 transition-all duration-200 hover:text-brandRed hover:bg-slate-50/80 hover:translate-x-1"
            >
              <Smartphone size={16} className="text-brandRed transition-transform duration-200 group-hover:scale-110" />
              <span>App Walkthrough</span>
            </a>
            <a
              href={location.pathname === "/" ? "#app-features" : "/#app-features"}
              onClick={(e) => handleMobileNavClick(e, "#app-features")}
              className="group flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 transition-all duration-200 hover:text-brandRed hover:bg-slate-50/80 hover:translate-x-1"
            >
              <Layers size={16} className="text-brandRed transition-transform duration-200 group-hover:scale-110" />
              <span>Features Inside App</span>
            </a>
            <a
              href={location.pathname === "/" ? "#dual-mode" : "/#dual-mode"}
              onClick={(e) => handleMobileNavClick(e, "#dual-mode")}
              className="group flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 transition-all duration-200 hover:text-brandRed hover:bg-slate-50/80 hover:translate-x-1"
            >
              <GraduationCap size={16} className="text-brandRed transition-transform duration-200 group-hover:scale-110" />
              <span>For Students</span>
            </a>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="group flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 transition-all duration-200 hover:text-brandRed hover:bg-slate-50/80 hover:translate-x-1"
            >
              <Store size={16} className="text-brandRed transition-transform duration-200 group-hover:scale-110" />
              <span>Become a Seller</span>
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="group flex items-center gap-2.5 rounded-xl border border-slate-200/80 px-3.5 py-2.5 font-bold text-slate-800 transition-all duration-200 hover:border-brandRed hover:text-brandRed hover:shadow-xs mt-1.5"
            >
              <LogIn size={16} className="text-brandRed transition-transform duration-200 group-hover:translate-x-0.5" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
