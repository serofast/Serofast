import { useState, useEffect } from "react";
import { Search, Smartphone, Store, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "../../data/landing";

export default function Header() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentScroll = window.scrollY;

      if (totalHeight > 0) {
        setScrollProgress((currentScroll / totalHeight) * 100);
      }
      setIsScrolled(currentScroll > 15);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      <div className="mx-auto grid min-h-[68px] w-[min(1280px,calc(100%_-_48px))] grid-cols-[190px_minmax(280px,1fr)_auto] items-center gap-[26px] max-1100:grid-cols-[170px_1fr_auto] max-1100:gap-[15px] max-800:w-[min(680px,calc(100%_-_28px))] max-800:grid-cols-[1fr_auto] max-800:min-h-[60px] max-800:py-2 max-560:w-[calc(100%_-_20px)] max-560:gap-[9px]">
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 text-[21px] font-extrabold tracking-[-0.5px] text-brandRed transition-transform duration-200 hover:scale-[1.02] max-560:text-[18px]"
          aria-label="SeroFast home"
        >
          <span className="inline-block -rotate-12 text-[31px] leading-none transition-transform duration-300 group-hover:-rotate-45 group-hover:scale-110">
            ➤
          </span>
          <span className="tracking-tight">SEROFAST</span>
        </Link>

        <div className="group flex h-[44px] items-center rounded-[18px] border border-[#d9d9d9] bg-[#fafafa] px-[14px] text-[#777] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-[#bbb] hover:bg-white focus-within:border-brandRed focus-within:bg-white focus-within:ring-4 focus-within:ring-brandRed/10 focus-within:shadow-[0_4px_18px_rgba(210,33,37,0.1)] max-800:order-3 max-800:col-span-full max-800:mb-2.5">
          <Search size={20} className="shrink-0 transition-colors duration-200 group-hover:text-brandRed group-focus-within:text-brandRed" />
          <input
            aria-label="Search products"
            placeholder="Search for products and more"
            className="w-full border-0 bg-transparent px-3 text-[14px] text-textPrimary outline-none placeholder:text-[#999]"
          />
          <span className="h-[18px] w-[18px] rounded-full border-[1.6px] border-[#a9a9a9] transition-all duration-300 group-hover:border-brandRed group-focus-within:border-brandRed group-focus-within:bg-brandRed/15" />
        </div>

        <nav
          className="flex items-center gap-[17px] whitespace-nowrap text-[13px] font-semibold max-1100:gap-2.5 max-1100:text-[11px]"
          aria-label="Account actions"
        >
          <a
            className="inline-flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:text-brandRed max-800:hidden"
            href="#app"
          >
            <Smartphone size={20} className="transition-transform duration-200 hover:scale-110" />
            Download App
          </a>
          <span className="h-7 w-px bg-[#e6e6e6] max-800:hidden" />
          <Link
            to="/create-shop"
            className="inline-flex items-center gap-2 text-brandRed transition-all duration-200 hover:-translate-y-0.5 hover:text-brandRedDark max-560:text-[0px] max-560:[&>svg]:h-[22px] max-560:[&>svg]:w-[22px]"
          >
            <Store size={20} className="transition-transform duration-200 hover:scale-110" />
            Create Shop
          </Link>
          <span className="h-7 w-px bg-[#e6e6e6] max-800:hidden" />
          <Link
            to="/login?role=admin"
            className="inline-flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:text-brandRed max-800:hidden"
          >
            <UserRound size={20} className="transition-transform duration-200 hover:scale-110" />
            Login
          </Link>
        </nav>
      </div>

      <div className="border-t border-[#f4f4f4] max-800:hidden">
        <nav
          className="mx-auto flex h-[51px] w-[min(1280px,calc(100%_-_48px))] items-center justify-between gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]"
          aria-label="Categories"
        >
          {categories.map((category) => (
            <a
              key={category}
              href="#products"
              className="group relative shrink-0 rounded-full px-3 py-1.5 text-[13px] font-semibold text-[#222] transition-all duration-200 hover:bg-brandRed/10 hover:text-brandRed"
            >
              {category}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
