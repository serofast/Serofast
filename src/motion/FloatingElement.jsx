import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, isMobileDevice } from "./motionConfig";

/**
 * FloatingElement
 * Subtle continuous levitation with independent duration, delay,
 * float distance, and optional subtle desktop mouse parallax (±6px).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.duration=5500] Float cycle in ms
 * @param {number} [props.delay=0] Delay in ms
 * @param {number} [props.distance=8] Maximum vertical float travel in px
 * @param {boolean} [props.mouseTrack=false] Subtle mouse response
 * @param {string} [props.className=""]
 */
export default function FloatingElement({
  children,
  duration = 5500,
  delay = 0,
  distance = 8,
  mouseTrack = false,
  className = "",
  style = {},
  ...rest
}) {
  const containerRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!mouseTrack || prefersReducedMotion() || isMobileDevice()) return;

    let ticking = false;
    const handleMouseMove = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const { innerWidth, innerHeight } = window;
          // Very subtle mouse tilt (±6px)
          const normX = (e.clientX / innerWidth - 0.5) * 12;
          const normY = (e.clientY / innerHeight - 0.5) * 12;
          setMouseOffset({ x: normX, y: normY });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseTrack]);

  const floatStyle = prefersReducedMotion()
    ? {}
    : {
        animation: `gentleFloat ${duration}ms cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
        animationDelay: `${delay}ms`,
        transform: mouseTrack
          ? `translate3d(${mouseOffset.x.toFixed(1)}px, ${mouseOffset.y.toFixed(1)}px, 0)`
          : undefined,
        transition: mouseTrack ? "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)" : undefined,
      };

  return (
    <div
      ref={containerRef}
      className={`floating-element ${className}`}
      style={{
        ...floatStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
