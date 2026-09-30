import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./motionConfig";

/**
 * ScrollTitleReveal
 * Implements cinematic title entrance animations as specified:
 * - Left entrance: translateX(-80px) + opacity 0 + blur(8px) -> 0
 * - Up entrance: translateY(32px) + opacity 0 + blur(6px) -> 0
 * - Staggered subtitle reveal
 *
 * @param {Object} props
 * @param {"left" | "up" | "scale"} [props.direction="left"]
 * @param {number} [props.delay=0]
 * @param {number} [props.duration=850]
 * @param {number} [props.threshold=0.15]
 * @param {string} [props.className=""]
 * @param {React.ReactNode} props.children
 */
export default function ScrollTitleReveal({
  children,
  direction = "left",
  delay = 0,
  duration = 850,
  threshold = 0.15,
  className = "",
  style = {},
  ...rest
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const node = domRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined" || prefersReducedMotion()) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(node);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [threshold]);

  const getHiddenStyle = () => {
    if (prefersReducedMotion()) {
      return { opacity: 0 };
    }
    switch (direction) {
      case "left":
        return {
          opacity: 0,
          transform: "translate3d(-70px, 0, 0)",
          filter: "blur(8px)",
        };
      case "scale":
        return {
          opacity: 0,
          transform: "scale(0.94) translate3d(0, 20px, 0)",
          filter: "blur(6px)",
        };
      case "up":
      default:
        return {
          opacity: 0,
          transform: "translate3d(0, 32px, 0)",
          filter: "blur(6px)",
        };
    }
  };

  const getVisibleStyle = () => ({
    opacity: 1,
    transform: "translate3d(0, 0, 0) scale(1)",
    filter: "blur(0px)",
  });

  const activeTransformStyle = isRevealed ? getVisibleStyle() : getHiddenStyle();

  return (
    <div
      ref={domRef}
      className={`scroll-title-reveal ${isRevealed ? "is-revealed" : ""} ${className}`}
      style={{
        transitionProperty: "opacity, transform, filter",
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform, opacity, filter",
        ...activeTransformStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
