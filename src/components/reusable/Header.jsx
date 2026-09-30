import { useState, useEffect } from "react";
import Logo from "./Logo";
import {
  Search,
  MapPin,
  Heart,
  Smartphone,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Store,
  Layers,
  Download,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({
  onOpenAppTeaser,
  selectedLocation = "Nagercoil",
  onLocationChange,
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState(selectedLocation);

  const LOCATIONS = [
    "Nagercoil",
    "Kanyakumari",
    "Tirunelveli",
    "Trivandrum",
    "Madurai",
    "Chennai",
    "Coimbatore",
  ];

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
          const currentScroll = window.scrollY;
          const progress =
            totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
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
      onOpenAppTeaser(searchQuery || "Search Mobile App Features");
    }
  };

  const handleSelectCity = (city) => {
    setCurrentCity(city);
    setLocationOpen(false);
    if (onLocationChange) onLocationChange(city);
  };

  return (
    <header
      className={`landing-header sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "border-b border-[#E5E7EB] bg-white/98 shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md"
          : "border-b border-[#EBE3DC]/80 bg-white"
      }`}
    >
      {/* Scroll Progress Bar */}
      <div
        className="fixed left-0 top-0 z-[100] h-[3px] w-full origin-left bg-gradient-to-r from-brandRed via-red-500 to-rose-400 shadow-[0_0_8px_rgba(210,33,37,0.4)] transition-transform duration-100 ease-out"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Main Header Row */}
      <div className="mx-auto flex h-[68px] w-[min(1400px,calc(100%_-_32px))] items-center justify-between gap-3 lg:gap-5">
        {/* Left: Serofast Logo with Slogan */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5 transition-transform duration-150 hover:scale-[1.01]"
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

        {/* Center: Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="group relative hidden flex-1 items-center rounded-full border border-[#D5D9D9] bg-white pl-4 pr-1 py-1 text-[#4f4a4a] transition-all duration-200 hover:border-[#999] focus-within:border-brandRed focus-within:ring-2 focus-within:ring-brandRed/20 md:flex md:max-w-[380px] lg:max-w-[420px] xl:max-w-[460px]"
        >
          <Search size={16} className="text-[#888] shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search mobile app features, tools, catalog"
            placeholder="Search mobile app features, tools..."
            className="w-full border-0 bg-transparent px-3 text-[13px] text-[#191616] outline-none placeholder:text-[#999]"
          />
          <button
            type="submit"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brandRed text-white shadow-sm transition hover:bg-brandRedDark"
            aria-label="Submit search"
          >
            <Search size={15} />
          </button>
        </form>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-4 text-[13px] font-semibold text-[#333] xl:flex xl:gap-5">
          <a
            href="#app-preview"
            className="transition hover:text-brandRed hover:underline decoration-brandRed underline-offset-4"
          >
            App Walkthrough
          </a>
          <a
            href="#app-features"
            className="transition hover:text-brandRed hover:underline decoration-brandRed underline-offset-4"
          >
            Features
          </a>
          <a
            href="#dual-mode"
            className="transition hover:text-brandRed hover:underline decoration-brandRed underline-offset-4"
          >
            For Students
          </a>
          <a
            href="#download-app"
            className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-brandRed transition hover:bg-brandRed hover:text-white"
          >
            <Smartphone size={13} />
            <span>Get Mobile App</span>
          </a>
          <Link
            to="/signup"
            className="transition hover:text-brandRed hover:underline decoration-brandRed underline-offset-4"
          >
            Become a Seller
          </Link>
        </nav>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Location Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLocationOpen(!locationOpen)}
              className="inline-flex items-center gap-1 rounded-full border border-transparent px-2.5 py-1.5 text-xs font-semibold text-[#191616] transition hover:border-[#E5E7EB] hover:bg-slate-50"
            >
              <MapPin size={15} className="text-brandRed shrink-0" />
              <span>{currentCity}</span>
              <ChevronDown
                size={14}
                className={`text-[#777] transition-transform duration-200 ${
                  locationOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {locationOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-[#E5E7EB] bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 z-50">
                <div className="px-2.5 py-1.5 text-[10px] font-bold text-[#888] uppercase tracking-wider">
                  Deliver To
                </div>
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleSelectCity(loc)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                      currentCity === loc
                        ? "bg-brandRed/10 font-bold text-brandRed"
                        : "text-[#333] hover:bg-slate-100"
                    }`}
                  >
                    <span>{loc}</span>
                    {currentCity === loc && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brandRed" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick App Download Pill */}
          <a
            href="#download-app"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-brandRed px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-brandRedDark"
          >
            <Download size={13} />
            <span>Install App</span>
          </a>

          {/* User Profile */}
          <div className="hidden items-center gap-2 border-l border-[#E5E7EB] pl-3 sm:flex">
            <Link
              to="/shop-owner/dashboard"
              className="flex items-center gap-2 rounded-full p-1 transition hover:bg-slate-100"
            >
              <img
                src="/landing/user-sanjay.png"
                alt="Sanjay"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-brandRed/20"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80";
                }}
              />
              <div className="hidden text-left xl:block">
                <span className="block text-[11px] font-semibold leading-tight text-[#777]">
                  Hello,
                </span>
                <span className="block text-xs font-bold leading-tight text-[#191616]">
                  Sanjay
                </span>
              </div>
              <ChevronDown size={13} className="text-[#888]" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-[#E5E7EB] text-slate-700 xl:hidden"
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
            placeholder="Search mobile app features..."
            className="w-full border-0 bg-transparent text-[13px] text-[#191616] outline-none placeholder:text-[#999]"
          />
          <button
            type="submit"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brandRed text-white text-xs"
          >
            <Search size={13} />
          </button>
        </form>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#EBE3DC] bg-white px-4 py-4 xl:hidden animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-2.5 text-sm font-semibold text-[#333]">
            <a
              href="#app-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-50"
            >
              <Smartphone size={16} className="text-brandRed" />
              <span>App Walkthrough</span>
            </a>
            <a
              href="#app-features"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-50"
            >
              <Layers size={16} className="text-brandRed" />
              <span>Features Inside App</span>
            </a>
            <a
              href="#dual-mode"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-50"
            >
              <GraduationCap size={16} className="text-brandRed" />
              <span>For Students</span>
            </a>
            <a
              href="#download-app"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg p-2 text-brandRed hover:bg-red-50"
            >
              <Download size={16} />
              <span>Download Mobile App</span>
            </a>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-50"
            >
              <Store size={16} className="text-brandRed" />
              <span>Become a Seller</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
