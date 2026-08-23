import React from "react";

/**
 * Standardized Flutter-styled Card Container for all forms across SeroFast.
 * Features rounded-[35px] pill geometry, subtle border, and signature red dual shadow.
 */
export default function AppFormCard({ children, className = "", title, subtitle }) {
  return (
    <div
      className={`w-full rounded-[35px] bg-white border border-[#F3E5E5] px-6 py-7 sm:px-8 sm:py-8 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] transition-all duration-300 font-sans font-sansation ${className}`}
    >
      {(title || subtitle) && (
        <div className="text-center pb-4">
          {title && (
            <h2 className="text-[22px] font-semibold text-brandRed tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 font-normal leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
