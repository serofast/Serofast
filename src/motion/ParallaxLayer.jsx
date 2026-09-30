import { useEffect, useRef } from "react";
import { prefersReducedMotion, isMobileDevice } from "./motionConfig";

/**
 * ParallaxLayer
 * High-performance GPU-accelerated parallax layer container.
 * Automatically respects mobile limits and prefers-reduced-motion.
 *
 * @param {Object} props
 * @param {number} [props.speed=0.2] Speed multiplier (-1.0 to 1.0)
 * @param {string} [props.className=""]
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.horizontal=false] Whether to offset horizontally
 * @param {number} [props.damping=1.0] Dampening factor
 */
export default function ParallaxLayer({
  children,
  speed = 0.2,
  className = "",
  horizontal = false,
  damping = 1.0,
  style = {},
  ...rest
}) {
  const layerRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let ticking = false;
    const isMobile = isMobileDevice();
    // Substantially reduce parallax strength on mobile for smooth performance
    const effectiveSpeed = (isMobile ? speed * 0.35 : speed) * damping;

    const updateParallax = () => {
      const node = layerRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only calculate if within or approaching viewport
      if (rect.bottom >= -150 && rect.top <= windowHeight + 150) {
        // Distance from center of viewport
        const centerY = rect.top + rect.height / 2 - windowHeight / 2;
        const offset = -centerY * effectiveSpeed;

        if (horizontal) {
          node.style.transform = `translate3d(${offset.toFixed(1)}px, 0, 0)`;
        } else {
          node.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updateParallax();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [speed, horizontal, damping]);

  return (
    <div
      ref={layerRef}
      className={`parallax-layer ${className}`}
      style={{
        willChange: "transform",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
