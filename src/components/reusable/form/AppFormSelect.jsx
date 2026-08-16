import React, { useState } from "react";

/**
 * Standardized Pill Dropdown Select Component for all forms.
 */
export default function AppFormSelect({
  label,
  icon: Icon,
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  error,
  required = false,
  className = "",
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`font-sans font-sansation ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
          {label} {required && <span className="text-brandRed">*</span>}
        </label>
      )}

      <div
        className={`flex h-12 items-center rounded-[30px] bg-white px-4 transition-all duration-200 ${
          error
            ? "border-[1.5px] border-red-500 shadow-[-4px_5px_10px_rgba(239,68,68,0.2)]"
            : focused
            ? "border-[1.5px] border-brandRed shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]"
            : "border border-[#E5E7EB] shadow-[-4px_5px_8px_rgba(211,47,47,0.15),-7px_8px_15px_rgba(211,47,47,0.07)] hover:border-slate-300"
        }`}
      >
        {Icon && <Icon size={20} className="mr-2.5 shrink-0 text-[#8FA0B8]" />}

        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full appearance-none border-0 bg-transparent text-[14px] font-normal text-slate-900 outline-none cursor-pointer placeholder:text-[#8FA0B8]"
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val = typeof opt === "object" ? opt.value : opt;
            const lbl = typeof opt === "object" ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
      </div>

      {error && (
        <span className="mt-1.5 ml-4 block text-xs text-red-500 font-normal">
          {error}
        </span>
      )}
    </div>
  );
}
