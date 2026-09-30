import React, { useEffect, useRef, useState, useMemo } from "react";
import { prefersReducedMotion } from "../../motion/motionConfig";

const ANIMATION_PRESETS = {
  blurInUp: {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      transform: "translate3d(0, 24px, 0)",
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transform: "translate3d(0, 0, 0)",
    },
  },
  blurInDown: {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      transform: "translate3d(0, -24px, 0)",
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transform: "translate3d(0, 0, 0)",
    },
  },
  blurIn: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      transform: "scale(0.92)",
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transform: "scale(1)",
    },
  },
  fadeIn: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  },
  slideUp: {
    hidden: {
      opacity: 0,
      transform: "translate3d(0, 30px, 0)",
    },
    visible: {
      opacity: 1,
      transform: "translate3d(0, 0, 0)",
    },
  },
};

/**
 * TextAnimate
 * MagicUI character/word-based staggered text animation component.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {"blurInUp" | "blurInDown" | "blurIn" | "fadeIn" | "slideUp"} [props.animation="blurInUp"]
 * @param {"character" | "word" | "line"} [props.by="character"]
 * @param {boolean} [props.once=true]
 * @param {number} [props.delay=0] Initial delay in ms
 * @param {number} [props.duration=550] Transition duration in ms per unit
 * @param {number} [props.staggerDelay=22] Stagger delay in ms between consecutive characters/words
 * @param {string} [props.className=""]
 * @param {string | React.ElementType} [props.as="p"]
 * @param {boolean} [props.startOnView=true]
 * @param {number} [props.threshold=0.15]
 */
export function TextAnimate({
  children,
  animation = "blurInUp",
  by = "character",
  once = true,
  delay = 0,
  duration = 550,
  staggerDelay,
  className = "",
  as: Component = "p",
  startOnView = true,
  threshold = 0.15,
  ...props
}) {
  const [isRevealed, setIsRevealed] = useState(!startOnView);
  const containerRef = useRef(null);

  const effectiveStagger =
    staggerDelay !== undefined ? staggerDelay : by === "word" ? 65 : 22;

  const preset = ANIMATION_PRESETS[animation] || ANIMATION_PRESETS.blurInUp;

  useEffect(() => {
    if (!startOnView) return;

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
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsRevealed(false);
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
  }, [startOnView, once, threshold]);

  // Recursively process text into animated character / word spans
  const renderedContent = useMemo(() => {
    if (prefersReducedMotion()) {
      return children;
    }

    let globalIndex = 0;

    const processString = (str, extraClasses = "") => {
      if (by === "word") {
        const words = str.split(/(\s+)/);
        return words.map((chunk, wIdx) => {
          if (/^\s+$/.test(chunk)) {
            return chunk;
          }
          const itemIndex = globalIndex++;
          const currentDelay = delay + itemIndex * effectiveStagger;
          const currentStyle = isRevealed ? preset.visible : preset.hidden;

          return (
            <span
              key={`word-${wIdx}-${itemIndex}`}
              className={`inline-block whitespace-nowrap transition-all ${extraClasses}`}
              style={{
                transitionProperty: "opacity, transform, filter",
                transitionDuration: `${duration}ms`,
                transitionDelay: `${currentDelay}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                willChange: "transform, opacity, filter",
                ...currentStyle,
              }}
            >
              {chunk}
            </span>
          );
        });
      }

      // Default: by="character"
      // Split into words first to preserve normal line-breaking behavior without breaking words mid-character
      const words = str.split(" ");
      return words.map((word, wordIdx) => {
        const chars = Array.from(word);
        const renderedWord = (
          <span
            key={`w-${wordIdx}`}
            className={`inline-block whitespace-nowrap ${extraClasses}`}
          >
            {chars.map((char, charIdx) => {
              const itemIndex = globalIndex++;
              const currentDelay = delay + itemIndex * effectiveStagger;
              const currentStyle = isRevealed ? preset.visible : preset.hidden;

              return (
                <span
                  key={`c-${wordIdx}-${charIdx}`}
                  className="inline-block transition-all"
                  style={{
                    transitionProperty: "opacity, transform, filter",
                    transitionDuration: `${duration}ms`,
                    transitionDelay: `${currentDelay}ms`,
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    willChange: "transform, opacity, filter",
                    ...currentStyle,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );

        // Add regular space between words
        return wordIdx < words.length - 1 ? (
          <React.Fragment key={`frag-${wordIdx}`}>
            {renderedWord}
            <span> </span>
          </React.Fragment>
        ) : (
          renderedWord
        );
      });
    };

    const processNode = (node, keyPrefix = "n") => {
      if (typeof node === "string") {
        return processString(node);
      }
      if (typeof node === "number") {
        return processString(String(node));
      }
      if (!React.isValidElement(node)) {
        return node;
      }

      // If it's a <br /> or empty element
      if (node.type === "br") {
        return node;
      }

      // If element has children (e.g. <span className="text-brandRed">...</span>)
      const elementChildren = React.Children.toArray(node.props.children);
      const processedChildren = elementChildren.map((child, cIdx) =>
        processNode(child, `${keyPrefix}-${cIdx}`)
      );

      return React.cloneElement(node, {
        key: node.key || keyPrefix,
        children: processedChildren,
      });
    };

    return React.Children.map(children, (child, idx) =>
      processNode(child, `root-${idx}`)
    );
  }, [children, by, isRevealed, delay, duration, effectiveStagger, preset]);

  return (
    <Component
      ref={containerRef}
      className={`text-animate-container ${className}`}
      {...props}
    >
      {renderedContent}
    </Component>
  );
}

export default TextAnimate;
