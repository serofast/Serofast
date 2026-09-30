import { useState, useEffect, useRef } from "react";

/**
 * useCountUp hook for animating numbers dynamically when in view
 * @param {number} target - The final number to count up to
 * @param {number} duration - Animation duration in ms (default 1800ms)
 * @param {boolean} trigger - Whether the animation should start (e.g. inView)
 */
export default function useCountUp(target, duration = 1800, trigger = true) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!trigger || startedRef.current) return;
    startedRef.current = true;

    const startTime = performance.now();
    let frameId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * easedProgress));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration, trigger]);

  return count;
}
