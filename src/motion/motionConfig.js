/**
 * Central Motion System Configuration for SeroFast
 * Provides unified timing, easing, parallax factors, and accessibility helpers.
 */

export const EASINGS = {
  // Ultra-smooth SaaS entrance curve (Freebuff / Apple style)
  cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
  // Smooth gentle deceleration for cards and micro-interactions
  smoothOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  // Balanced spring-like feel
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  // Gentle floating oscillation
  float: "cubic-bezier(0.45, 0.05, 0.55, 0.95)",
};

export const DURATIONS = {
  micro: 200,      // Hover, button presses, micro-interactions (150-250ms)
  card: 320,       // Card hover lift and depth transition (200-400ms)
  reveal: 750,     // Scroll-triggered content entrance (500-800ms)
  title: 850,      // Primary title entrance from left (800-1000ms)
  hero: 1000,      // Hero opening sequence
  floatSlow: 6000, // Background floating element cycle (4-8s)
  floatFast: 4200,
};

export const PARALLAX_SPEEDS = {
  background: 0.08, // Moves very slowly in the back (gentle depth)
  gradient: 0.25,   // Atmospheric glow and gradients
  decorations: 0.40,// Floating shapes, orbs, stickers
  cards: 0.65,      // Content cards and modules
  content: 0.80,    // Text and primary copy
  foreground: 1.00, // Interactive UI / foreground
};

export const STAGGER = {
  fast: 60,
  normal: 100,
  slow: 150,
};

/**
 * Checks if user prefers reduced motion
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Checks if current device is mobile/touch (< 768px)
 * @returns {boolean}
 */
export function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}
