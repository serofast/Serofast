import { useEffect, useRef, useState } from "react";

/**
 * ScrollReveal Component
 * High-performance, intersection-observer based scroll animation wrapper.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-up' | 'zoom-in'} [props.variant='fade-up']
 * @param {number} [props.delay=0] - Delay in milliseconds
 * @param {number} [props.duration=700] - Duration in milliseconds
 * @param {string} [props.className='']
 * @param {number} [props.threshold=0.12]
 * @param {boolean} [props.once=true]
 */
export default function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 750,
  className = "",
  threshold = 0.12,
  once = true,
  ...rest
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const node = domRef.current;
    if (!node) return;

    // If browser doesn't support IntersectionObserver, show immediately
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(node);
          }
        } else if (!once) {
          setIsVisible(false);
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
  }, [threshold, once]);

  const variantClass = `reveal-hidden-${variant}`;

  return (
    <div
      ref={domRef}
      className={`${variantClass} ${isVisible ? "reveal-visible" : ""} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
