import React from "react";

export default function AppMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  active = false,
  onClick,
  variant = "default",
  className = "",
}) {
  const isClickable = Boolean(onClick);
  const Component = isClickable ? "button" : "div";

  const getVariantStyles = () => {
    if (variant === "gradient") {
      return "bg-gradient-to-br from-brandRed to-red-600 text-white shadow-[0_12px_28px_rgba(211,47,47,0.32)] border-transparent";
    }
    if (variant === "brandRed") {
      return "bg-rose-50/50 border-brandRed text-slate-900 shadow-[-4px_5px_10px_rgba(211,47,47,0.2)]";
    }
    if (active) {
      return "bg-rose-50/20 border-brandRed ring-1 ring-brandRed/20 shadow-[-4px_5px_10px_rgba(211,47,47,0.2)]";
    }
    return "bg-white border-[#F3E5E5] text-slate-900 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)]";
  };

  return (
    <Component
      type={isClickable ? "button" : undefined}
      onClick={onClick}
      className={`rounded-[28px] border p-4 text-left font-sans font-sansation transition-all duration-200 min-w-0 ${
        isClickable ? "cursor-pointer active:scale-[0.98]" : ""
      } ${getVariantStyles()} ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[11px] font-medium uppercase tracking-wider ${
            variant === "gradient" ? "text-white/90" : "text-slate-500"
          }`}
        >
          {title}
        </span>
        {Icon && (
          <div
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-2xl ${
              variant === "gradient"
                ? "bg-white/20 text-white backdrop-blur-xs"
                : active || variant === "brandRed"
                ? "bg-rose-100 text-brandRed"
                : "bg-rose-50 text-slate-700"
            }`}
          >
            <Icon size={16} />
          </div>
        )}
      </div>

      <div
        className={`mt-1.5 text-2xl font-normal tracking-tight ${
          variant === "gradient" ? "text-white" : "text-slate-900"
        }`}
      >
        {value}
      </div>

      {subtitle && (
        <span
          className={`text-[10px] font-normal block mt-0.5 truncate ${
            variant === "gradient"
              ? "text-white/90"
              : active || variant === "brandRed"
              ? "text-brandRed"
              : "text-slate-400"
          }`}
        >
          {subtitle}
        </span>
      )}
    </Component>
  );
}
