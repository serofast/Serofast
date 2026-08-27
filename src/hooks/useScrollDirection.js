import { useState, useEffect } from "react";

/**
 * Enhanced hook to detect intentional scroll direction with hysteresis accumulation.
 * Smoothly hides mobile navbar when scrolling down, and smoothly reveals when scrolling up.
 * Ignores micro-jitters and mobile bounce overscroll.
 * @param {number} threshold - Accumulated scroll delta (pixels) before triggering. Default 12px.
 * @returns {boolean} isVisible
 */
export function useScrollDirection(threshold = 12) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop);
    let accumulatedDelta = 0;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY || document.documentElement.scrollTop);
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );

      // 1. Always visible near top of page (< 30px)
      if (currentScrollY <= 30) {
        setIsVisible(true);
        lastScrollY = currentScrollY;
        accumulatedDelta = 0;
        ticking = false;
        return;
      }

      // 2. Ignore mobile bounce/overscroll past bottom
      if (maxScroll > 0 && currentScrollY >= maxScroll - 10) {
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      const diff = currentScrollY - lastScrollY;

      // Accumulate in same direction, or reset when direction flips
      if ((diff > 0 && accumulatedDelta < 0) || (diff < 0 && accumulatedDelta > 0)) {
        accumulatedDelta = diff;
      } else {
        accumulatedDelta += diff;
      }

      // Check if accumulated delta exceeds threshold
      if (accumulatedDelta >= threshold && currentScrollY > 70) {
        setIsVisible(false);
        accumulatedDelta = 0;
      } else if (accumulatedDelta <= -threshold) {
        setIsVisible(true);
        accumulatedDelta = 0;
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return isVisible;
}

export default useScrollDirection;
