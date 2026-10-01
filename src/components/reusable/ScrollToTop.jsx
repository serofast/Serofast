import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          const totalHeight =
            document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const progress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;

          setIsVisible(currentScroll > 320);
          setScrollProgress(Math.min(100, Math.max(0, progress)));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className={`scroll-top-control fixed bottom-6 right-6 z-40 transition-all duration-300 max-560:bottom-[76px] max-560:right-3 ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        className="group relative flex h-11 w-11 items-center justify-center rounded-full p-[3px] text-white shadow-[0_8px_20px_rgba(211,47,47,0.28)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_26px_rgba(210,33,37,0.34)] active:scale-95"
        style={{
          background: `conic-gradient(from 0deg, rgb(211 47 47) ${scrollProgress}%, white ${scrollProgress}% 100%)`,
        }}
      >
        <span className="grid h-full w-full place-items-center rounded-full bg-brandRed">
          <ArrowUp
            size={18}
            strokeWidth={2.5}
            className="relative z-[2] transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        </span>
      </button>
    </div>
  );
}
