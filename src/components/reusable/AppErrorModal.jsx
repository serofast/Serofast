import React, { useEffect } from "react";
import { AlertCircle, X, RefreshCw, ArrowLeft } from "lucide-react";

/**
 * Standardized Brand-Red Error / Failure Status Dialog Component.
 * Used for all error states across SeroFast.
 */
export default function AppErrorModal({
  isOpen = false,
  onClose,
  title = "Something Went Wrong",
  message = "We encountered an issue performing this action. Please try again.",
  details = null,
  primaryActionLabel = "Try Again",
  onPrimaryAction,
  secondaryActionLabel = "Dismiss",
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
      <div className="relative w-full max-w-md rounded-[35px] bg-white border border-rose-200 p-6 sm:p-8 shadow-[-4px_12px_30px_rgba(225,29,72,0.2),0_8px_24px_rgba(0,0,0,0.12)] animate-scale-up text-center space-y-5">
        {/* Top Close X Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close error dialog"
            className="absolute top-5 right-5 grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        )}

        {/* Brand Alert Icon Badge */}
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-100 border border-rose-300 text-rose-600 shadow-md shadow-rose-500/10 animate-pulse">
          <AlertCircle size={36} className="stroke-[2.2]" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-xs mx-auto">
            {message}
          </p>
        </div>

        {/* Optional Technical Details Box */}
        {details && (
          <div className="rounded-[20px] bg-rose-50/60 border border-rose-200/80 p-3.5 text-xs font-mono text-rose-800 text-left overflow-x-auto max-h-28">
            {details}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-12 w-full sm:flex-1 items-center justify-center gap-1.5 rounded-[30px] border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>{secondaryActionLabel}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePrimaryClick}
            className="flex h-12 w-full sm:flex-1 items-center justify-center gap-2 rounded-[30px] bg-brandRed text-xs font-semibold tracking-[0.2px] text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark active:scale-[0.98] transition cursor-pointer"
          >
            <RefreshCw size={16} />
            <span>{primaryActionLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
