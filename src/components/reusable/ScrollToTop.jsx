import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentScroll = window.scrollY;

      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
        setScrollProgress(progress);
      }

      if (currentScroll > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG circular calculation
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 max-560:bottom-20 max-560:right-4 ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-textPrimary shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_28px_rgba(210,33,37,0.25)] active:scale-95 border border-[#eee]"
      >
        {/* Circular SVG Scroll Progress Indicator */}
        <svg className="absolute inset-0 -rotate-90" width="48" height="48">
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="text-gray-100"
            strokeWidth="3"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="text-brandRed transition-all duration-150 ease-out"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>

        <ArrowUp
          size={19}
          className="relative z-[2] text-[#333] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-brandRed"
        />
      </button>
    </div>
  );
}
