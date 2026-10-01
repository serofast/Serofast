import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { prefersReducedMotion } from "./motionConfig";

/**
 * SmoothScroll
 * Initializes Lenis smooth momentum scrolling across SeroFast.
 * Provides dampened inertia so section entrance animations,
 * scroll reveals, and parallax layers render smoothly and give the user
 * time to appreciate effects instead of abruptly skipping past them.
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Respect accessibility reduced-motion preference
    if (prefersReducedMotion()) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.35, // Smooth cinematic deceleration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.82, // Calibrated gentleness to prevent fast scroll skipping
      touchMultiplier: 1.4,
      autoRaf: true,
      anchors: true,
      autoResize: true,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      if (window.lenis === lenis) {
        delete window.lenis;
      }
    };
  }, []);

  // When route changes, scroll instantly to top unless navigating to a hash
  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target && lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: -60, duration: 1.2 });
      }
    } else if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [location.pathname, location.hash]);

  return children;
}
