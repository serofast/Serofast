import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./motionConfig";

const StaggerContext = createContext({ isRevealed: false, step: 80 });

/**
 * StaggerGroup
 * Orchestrates staggered entrances for child items when entering the viewport.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.step=90] Delay step in ms between each child item
 * @param {number} [props.threshold=0.12]
 * @param {string} [props.className=""]
 */
export function StaggerGroup({
  children,
  step = 90,
  threshold = 0.12,
  className = "",
  style = {},
  ...rest
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const node = containerRef.current;
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
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [threshold]);

  return (
    <StaggerContext.Provider value={{ isRevealed, step }}>
      <div
        ref={containerRef}
        className={`stagger-group ${className}`}
        style={style}
        {...rest}
      >
        {children}
      </div>
    </StaggerContext.Provider>
  );
}

/**
 * StaggerItem
 * Individual child inside a StaggerGroup that animates with staggered timing.
 *
 * @param {Object} props
 * @param {number} [props.index=0] Item order index
 * @param {number} [props.customDelay] Optional explicit delay override
 * @param {number} [props.duration=700]
 * @param {string} [props.className=""]
 */
export function StaggerItem({
  children,
  index = 0,
  customDelay,
  duration = 700,
  className = "",
  style = {},
  ...rest
}) {
  const { isRevealed, step } = useContext(StaggerContext);
  const delay = customDelay !== undefined ? customDelay : index * step;

  const hiddenStyle = prefersReducedMotion()
    ? { opacity: 0 }
    : {
        opacity: 0,
        transform: "translate3d(0, 24px, 0)",
        filter: "blur(4px)",
      };

  const visibleStyle = {
    opacity: 1,
    transform: "translate3d(0, 0, 0)",
    filter: "blur(0px)",
  };

  return (
    <div
      className={`stagger-item ${isRevealed ? "is-revealed" : ""} ${className}`}
      style={{
        transitionProperty: "opacity, transform, filter",
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform, opacity",
        ...(isRevealed ? visibleStyle : hiddenStyle),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default StaggerGroup;
