import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Standardized Pill Action Button Component for all form submissions.
 */
export default function AppFormButton({
  children,
  onClick,
  type = "submit",
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`flex h-12 w-full items-center justify-center gap-2 rounded-[30px] bg-brandRed text-[15px] font-semibold tracking-[0.2px] text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] transition-all duration-150 active:scale-[0.98] cursor-pointer hover:bg-brandRedDark disabled:opacity-60 disabled:cursor-not-allowed font-sans font-sansation ${className}`}
    >
      {isLoading ? (
        <Loader2 size={20} className="animate-spin text-white" />
      ) : (
        <>
          <span>{children}</span>
          {Icon && <Icon size={18} />}
        </>
      )}
    </button>
  );
}
