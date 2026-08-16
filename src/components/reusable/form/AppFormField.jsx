import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Standardized Pill Input Field Component for all forms.
 */
export default function AppFormField({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  isPassword = false,
  required = false,
  className = "",
  inputClassName = "",
}) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const activeType = isPassword ? (showPassword ? "text" : "password") : type;

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

        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          type={activeType}
          placeholder={placeholder}
          className={`w-full border-0 bg-transparent text-[14px] font-normal text-slate-900 outline-none placeholder:text-[#8FA0B8] placeholder:text-[13px] placeholder:font-medium ${inputClassName}`}
          autoComplete={autoComplete}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 text-[#8FA0B8] hover:text-brandRed transition cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <span className="mt-1.5 ml-4 block text-xs text-red-500 font-normal">
          {error}
        </span>
      )}
    </div>
  );
}
