import React, { useEffect } from "react";
import { CheckCircle2, X, Sparkles, ArrowRight } from "lucide-react";

/**
 * Standardized Brand-Red Success Status Dialog & Modal Component.
 * Aligns perfectly with SeroFast brand identity, color theory, and pill geometry.
 */
export default function AppSuccessModal({
  isOpen = false,
  onClose,
  title = "Success!",
  message = "Operation completed successfully.",
  details = null,
  primaryActionLabel = "Continue",
  onPrimaryAction,
  autoCloseMs = 0,
}) {
  useEffect(() => {
    if (isOpen && autoCloseMs > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, autoCloseMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseMs, onClose]);

  if (!isOpen) return null;

  const handlePrimaryClick = () => {
    if (onPrimaryAction) onPrimaryAction();
    else if (onClose) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in font-sans font-sansation"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-[35px] bg-white border border-[#F3E5E5] p-6 sm:p-8 shadow-[-4px_12px_30px_rgba(211,47,47,0.2),0_8px_24px_rgba(0,0,0,0.12)] animate-scale-up text-center space-y-5">
        {/* Top Close X Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        )}

        {/* Brand Red Animated Icon Badge */}
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-50 border border-rose-200 text-brandRed shadow-lg shadow-brandRed/20 animate-bounce">
          <CheckCircle2 size={34} className="stroke-[2.2]" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-xs mx-auto">
            {message}
          </p>
        </div>

        {/* Optional Details Box */}
        {details && (
          <div className="rounded-[20px] bg-[#FAF8F5] border border-[#F3E5E5] p-3.5 text-xs font-semibold text-slate-700 text-center">
            {details}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handlePrimaryClick}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[30px] bg-brandRed text-sm font-semibold tracking-[0.2px] text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark active:scale-[0.98] transition cursor-pointer"
          >
            <span>{primaryActionLabel}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
