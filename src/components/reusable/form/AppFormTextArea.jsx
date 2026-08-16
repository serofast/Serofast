import React, { useState } from "react";

/**
 * Standardized Multiline Textarea Component for all forms.
 */
export default function AppFormTextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
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

      <textarea
        rows={rows}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={`w-full rounded-[24px] bg-white p-4 text-[14px] font-normal text-slate-900 outline-none transition-all duration-200 placeholder:text-[#8FA0B8] placeholder:text-[13px] placeholder:font-medium ${
          error
            ? "border-[1.5px] border-red-500 shadow-[-4px_5px_10px_rgba(239,68,68,0.2)]"
            : focused
            ? "border-[1.5px] border-brandRed shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]"
            : "border border-[#E5E7EB] shadow-[-4px_5px_8px_rgba(211,47,47,0.15),-7px_8px_15px_rgba(211,47,47,0.07)] hover:border-slate-300"
        }`}
      />

      {error && (
        <span className="mt-1.5 ml-4 block text-xs text-red-500 font-normal">
          {error}
        </span>
      )}
    </div>
  );
}
