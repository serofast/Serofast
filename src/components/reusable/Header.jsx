import { useState, useEffect } from "react";
import Logo from "./Logo";
import { Search, Smartphone, Store, UserRound, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "../../data/landing";

export default function Header({ onOpenAppTeaser }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight =
            document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const currentScroll = window.scrollY;

          if (totalHeight > 0) {
            setScrollProgress((currentScroll / totalHeight) * 100);
          }
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-[#e5e5e5] bg-white/[0.98] shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-[20px]"
          : "border-b border-[#eee] bg-white/[0.95] backdrop-blur-[16px]"
      }`}
    >
      {/* Top Dynamic Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 z-[100] h-[3px] bg-gradient-to-r from-[#D22125] via-red-500 to-rose-400 shadow-[0_0_8px_rgba(210,33,37,0.5)] transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <div className="mx-auto grid min-h-[68px] w-[min(1280px,calc(100%_-_48px))] grid-cols-[190px_minmax(280px,1fr)_auto] items-center gap-[26px] pt-2.5 max-1100:grid-cols-[170px_1fr_auto] max-1100:gap-[15px] max-800:w-[min(680px,calc(100%_-_28px))] max-800:grid-cols-[1fr_auto] max-800:min-h-[60px] max-800:pt-3.5 max-800:pb-1 max-560:w-[calc(100%_-_20px)] max-560:gap-[9px]">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-[21px] font-extrabold tracking-[-0.5px] text-brandRed transition-transform duration-200 hover:scale-[1.02] max-560:text-[18px]"
          aria-label="SeroFast home"
        >
          <Logo size="sm" iconClassName="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" />
          <span className="tracking-tight">SEROFAST</span>
        </Link>

        {/* Search Bar (Triggers App Teaser for Shoppers) */}
        <form
          onSubmit={handleSearchSubmit}
          className="group flex h-[44px] items-center rounded-[18px] border border-[#d9d9d9] bg-[#fafafa] px-[14px] text-[#777] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-[#bbb] hover:bg-white focus-within:border-brandRed focus-within:bg-white focus-within:ring-4 focus-within:ring-brandRed/10 focus-within:shadow-[0_4px_18px_rgba(210,33,37,0.1)] max-800:order-3 max-800:col-span-full max-800:mb-2.5"
        >
          <Search size={20} className="shrink-0 transition-colors duration-200 group-hover:text-brandRed group-focus-within:text-brandRed" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
            placeholder="Search"
            className="w-full border-0 bg-transparent px-3 text-[14px] text-textPrimary outline-none placeholder:text-[#999]"
          />
          <button
            type="submit"
            className="rounded-full bg-brandRed/10 px-2.5 py-1 text-[11px] font-bold text-brandRed transition hover:bg-brandRed hover:text-white"
          >
            Search
          </button>
        </form>

        <nav
          className="flex items-center gap-[17px] whitespace-nowrap text-[13px] font-semibold max-1100:gap-2.5 max-1100:text-[11px]"
          aria-label="Account actions"
        >
          <button
            type="button"
            onClick={() => onOpenAppTeaser?.("Customer Mobile App")}
            className="inline-flex items-center gap-2 text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:text-brandRed max-800:hidden"
          >
            <Smartphone size={18} className="text-brandRed transition-transform duration-200 hover:scale-110" />
            <span>Mobile App</span>
            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-700 border border-amber-300">
              NEW
            </span>
          </button>

          <span className="h-7 w-px bg-[#e6e6e6] max-800:hidden" />

          {/* Become a Shop Owner CTA */}
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-brandRed to-rose-600 px-4 py-2 text-white shadow-md shadow-brandRed/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brandRed/30 active:scale-95 max-560:text-[12px] max-560:px-3 max-380:text-[11px] max-380:px-2.5"
          >
            <Store size={18} className="animate-bounce shrink-0 max-380:hidden" />
            <span>Become a Shop Owner</span>
          </Link>

          <span className="h-7 w-px bg-[#e6e6e6] max-800:hidden" />

          {/* Shop Owner Login Link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-brandRed/40 hover:bg-white hover:text-brandRed max-800:hidden"
          >
            <UserRound size={17} />
            <span>Shop Owner Login</span>
          </Link>
        </nav>
      </div>

      {/* Sub Navigation Bar */}
      <div className="border-t border-[#f4f4f4] max-800:hidden">
        <nav
          className="mx-auto flex h-[51px] w-[min(1280px,calc(100%_-_48px))] items-center justify-between gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)] text-[13px] font-semibold text-[#333]"
          aria-label="Section Navigation"
        >
          <a href="#freebuff" className="shrink-0 rounded-full px-3 py-1.5 transition-all duration-200 bg-brandRed/10 text-brandRed font-bold active:scale-95 flex items-center gap-1">
            <Sparkles size={13} className="text-amber-500" /> FreeBuff Deals
          </a>
          <a href="#buffets" className="shrink-0 rounded-full px-3 py-1.5 transition-all duration-200 hover:bg-brandRed/10 hover:text-brandRed active:scale-95">
            Campus Buffets
          </a>
          <a href="#vouchers" className="shrink-0 rounded-full px-3 py-1.5 transition-all duration-200 hover:bg-brandRed/10 hover:text-brandRed active:scale-95">
            Student Vouchers
          </a>
          <a href="#shops" className="shrink-0 rounded-full px-3 py-1.5 transition-all duration-200 hover:bg-brandRed/10 hover:text-brandRed active:scale-95">
            Partner Campus Shops
          </a>
          <a href="#comparison" className="shrink-0 rounded-full px-3 py-1.5 transition-all duration-200 hover:bg-brandRed/10 hover:text-brandRed active:scale-95">
            Profit Calculator
          </a>
          <a href="#about" className="shrink-0 rounded-full px-3 py-1.5 transition-all duration-200 hover:bg-brandRed/10 hover:text-brandRed active:scale-95">
            Ecosystem
          </a>
          <span className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-1 overflow-x-auto">
            {categories.slice(0, 5).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onOpenAppTeaser?.(category)}
                className="shrink-0 rounded-full px-2.5 py-1 text-[12px] text-gray-600 transition-all duration-200 hover:text-brandRed hover:bg-rose-50"
              >
                {category}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
