import { useState } from "react";
import {
  Mail,
  LockKeyhole,
  UserRound,
  Phone,
  Tag,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { shopCategories } from "../data";
import { registerShopOwner } from "../../../lib/supabase";

function _RegisterTextField({
  value,
  onChange,
  hint,
  icon: Icon,
  type = "text",
  error,
  autoComplete,
  children,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <div
        className={`flex h-12 items-center rounded-[30px] bg-white px-4 transition-all duration-200 ${
          focused
            ? "border-[1.5px] border-brandRed shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]"
            : "border border-[#E5E7EB] shadow-[-4px_5px_8px_rgba(211,47,47,0.15),-7px_8px_15px_rgba(211,47,47,0.07)]"
        }`}
      >
        <Icon size={20} className="mr-2.5 shrink-0 text-[#8FA0B8]" />
        {children || (
          <input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            type={type}
            placeholder={hint}
            className="w-full border-0 bg-transparent text-[14px] font-normal text-slate-900 outline-none placeholder:text-[#8FA0B8] placeholder:text-[13px] placeholder:font-medium"
            autoComplete={autoComplete}
          />
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

function PasswordInput({ value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <div
        className={`flex h-12 items-center rounded-[30px] bg-white px-4 transition-all duration-200 ${
          focused
            ? "border-[1.5px] border-brandRed shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]"
            : "border border-[#E5E7EB] shadow-[-4px_5px_8px_rgba(211,47,47,0.15),-7px_8px_15px_rgba(211,47,47,0.07)]"
        }`}
      >
        <LockKeyhole size={20} className="mr-2.5 shrink-0 text-[#8FA0B8]" />
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent text-[14px] font-normal text-slate-900 outline-none placeholder:text-[#8FA0B8] placeholder:text-[13px] placeholder:font-medium"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="ml-2 text-[#8FA0B8] hover:text-brandRed transition cursor-pointer"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <span className="mt-1.5 ml-4 block text-xs text-red-500 font-normal">
          {error}
        </span>
      )}
    </div>
  );
}

export default function RegisterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [categoryFocused, setCategoryFocused] = useState(false);
  const navigate = useNavigate();

  const update = (key, value) =>
    setValues((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const errs = {};
    if (!values.name?.trim()) errs.name = "Please enter your full name";
    if (!values.email?.trim() || !values.email.includes("@")) errs.email = "Please enter a valid email";
    if (!values.password || values.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (!values.phone?.trim()) errs.phone = "Please enter phone number";
    if (!values.category) errs.category = "Please select shop category";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      await registerShopOwner(values);
      setSubmitted(true);
      setTimeout(() => {
        navigate("/shop-owner/dashboard");
      }, 900);
    }
  };

  if (submitted) {
    return (
      <div className="py-6 text-center animate-scale-up font-sans font-sansation">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-800">
          Account Created 🎉
        </h2>
        <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate-500 font-normal">
          Opening shop setup wizard...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col font-sans font-sansation">
      {/* Title */}
      <h2 className="text-center text-[22px] font-semibold text-brandRed tracking-tight">
        Register
      </h2>

      <div className="h-[24px]" />

      <div className="space-y-4">
        {/* 1. FULL NAME */}
        <_RegisterTextField
          value={values.name}
          onChange={(val) => update("name", val)}
          hint="Full Name"
          icon={UserRound}
          error={errors.name}
          autoComplete="name"
        />

        {/* 2. EMAIL */}
        <_RegisterTextField
          value={values.email}
          onChange={(val) => update("email", val)}
          hint="Email"
          icon={Mail}
          type="email"
          error={errors.email}
          autoComplete="email"
        />

        {/* 3. PASSWORD & PHONE */}
        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordInput
            value={values.password}
            onChange={(val) => update("password", val)}
            placeholder="Password"
            error={errors.password}
          />

          <_RegisterTextField
            value={values.phone}
            onChange={(val) => update("phone", val)}
            hint="Phone Number"
            icon={Phone}
            type="tel"
            error={errors.phone}
            autoComplete="tel"
          />
        </div>

        {/* 4. CATEGORY */}
        <div>
          <div
            className={`flex h-12 items-center rounded-[30px] bg-white px-4 transition-all duration-200 ${
              categoryFocused
                ? "border-[1.5px] border-brandRed shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]"
                : "border border-[#E5E7EB] shadow-[-4px_5px_8px_rgba(211,47,47,0.15),-7px_8px_15px_rgba(211,47,47,0.07)]"
            }`}
          >
            <Tag size={20} className="mr-2.5 shrink-0 text-[#8FA0B8]" />
            <select
              value={values.category || ""}
              onChange={(e) => update("category", e.target.value)}
              onFocus={() => setCategoryFocused(true)}
              onBlur={() => setCategoryFocused(false)}
              className="w-full appearance-none border-0 bg-transparent text-[14px] font-normal text-slate-900 outline-none cursor-pointer placeholder:text-[#8FA0B8]"
            >
              <option value="" disabled>Primary Shop Category</option>
              {shopCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {errors.category && (
            <span className="mt-1.5 ml-4 block text-xs text-red-500 font-normal">
              {errors.category}
            </span>
          )}
        </div>
      </div>

      <div className="h-[24px]" />

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-[30px] bg-brandRed text-[15px] font-semibold tracking-[0.2px] text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] transition-all duration-150 active:scale-[0.98] cursor-pointer hover:bg-brandRedDark"
      >
        Register
      </button>

      <div className="h-[18px]" />

      {/* DIVIDER */}
      <div className="flex items-center">
        <div className="flex-1 border-t border-[#E5E7EB]" />
        <span className="px-3 text-[11px] font-bold text-[#8FA0B8]">OR</span>
        <div className="flex-1 border-t border-[#E5E7EB]" />
      </div>

      <div className="h-[18px]" />

      {/* GOOGLE SIGN IN BUTTON */}
      <button
        type="button"
        onClick={() => alert("Google Sign-In integration ready")}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[30px] border border-[#E5E7EB] bg-white text-[13px] font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
      >
        <span className="text-xl font-bold text-brandRed leading-none">G</span>
        <span>Continue with Google</span>
      </button>

      <div className="h-[24px]" />

      {/* LOGIN LINK */}
      <div className="flex items-center justify-center text-[13px]">
        <span className="text-slate-500 font-medium">Already have an account?&nbsp;</span>
        <Link
          to="/login"
          className="font-semibold text-brandRed hover:underline"
        >
          Login
        </Link>
      </div>
    </form>
  );
}
