import React from "react";

/**
 * SeroFast Official Brand Logo
 * @param {Object} props
 * @param {"xs" | "sm" | "md" | "lg" | "xl" | number} [props.size="md"] Size preset or custom pixel number
 * @param {string} [props.className=""] Additional CSS classes for container
 * @param {string} [props.iconClassName=""] Additional CSS classes for SVG icon
 * @param {boolean} [props.withText=false] Whether to include the SEROFAST text
 * @param {string} [props.subtitle=""] Optional subtitle e.g., "STORE", "ADMIN", "PORTAL"
 * @param {string} [props.textClassName=""] Custom styling for text
 */
export default function Logo({
  size = "md",
  className = "",
  iconClassName = "",
  withText = false,
  subtitle = "",
  textClassName = "",
}) {
  const sizeMap = {
    xs: { iconWidth: 28, iconHeight: 17, text: "text-base tracking-tight" },
    sm: { iconWidth: 40, iconHeight: 24, text: "text-lg tracking-tight" },
    md: { iconWidth: 50, iconHeight: 30, text: "text-xl tracking-tight" },
    lg: { iconWidth: 64, iconHeight: 38, text: "text-2xl tracking-tight" },
    xl: { iconWidth: 84, iconHeight: 50, text: "text-3xl tracking-tight" },
  };

  const currentSize = typeof size === "string" ? sizeMap[size] || sizeMap.md : {
    iconWidth: size,
    iconHeight: Math.round(size * 0.6),
    text: "text-xl tracking-tight",
  };

  const svgIcon = (
    <svg
      viewBox="0 0 1000 600"
      width={currentSize.iconWidth}
      height={currentSize.iconHeight}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 ${iconClassName}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sfLogoTop" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#FF242A" />
          <stop offset="55%" stopColor="#E51920" />
          <stop offset="100%" stopColor="#B70E14" />
        </linearGradient>
        <linearGradient id="sfLogoBottom" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="#E51920" />
          <stop offset="50%" stopColor="#C50F16" />
          <stop offset="100%" stopColor="#8F050A" />
        </linearGradient>
      </defs>
      {/* Top Dart Fin */}
      <polygon points="42,92 960,162 242,212" fill="url(#sfLogoTop)" />
      {/* Bottom Origami Wing */}
      <polygon points="384,316 960,162 516,522" fill="url(#sfLogoBottom)" />
    </svg>
  );

  if (!withText) {
    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        {svgIcon}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 font-extrabold ${className}`}>
      {svgIcon}
      <span className="flex flex-col leading-none">
        <span className={`font-black text-brandRed ${currentSize.text} ${textClassName}`}>
          SEROFAST
        </span>
        {subtitle && (
          <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-0.5">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}
