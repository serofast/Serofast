import { useState } from "react";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginShopOwner } from "../../../lib/supabase";

export default function LoginForm() {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const update = (key, value) =>
    setValues((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const errs = {};
    if (!values.email?.trim()) errs.email = "Please enter your email";
    else if (!values.email.includes("@") || !values.email.includes(".")) {
      errs.email = "Please enter a valid email";
    }
    if (!values.password || values.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      const result = await loginShopOwner({
        email: values.email,
        password: values.password,
      });
      setSubmitted(true);
      setTimeout(() => {
        navigate("/shop-owner/dashboard");
      }, 800);
    }
  };

  if (submitted) {
    return (
      <div className="py-6 text-center animate-scale-up font-sans font-sansation">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-800">
          Welcome Back
        </h2>
        <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate-500 font-normal">
          Logging into SeroFast...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col font-sans font-sansation">
      {/* Title */}
      <h2 className="text-center text-[22px] font-semibold text-brandRed tracking-tight">
        Login
      </h2>

      <div className="h-[28px]" />

      {/* 1. EMAIL TEXT FIELD */}
      <div>
        <div
          className={`flex h-12 items-center rounded-[30px] bg-white px-4 transition-all duration-200 ${
            emailFocused
              ? "border-[1.5px] border-brandRed shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]"
              : "border border-[#E5E7EB] shadow-[-4px_5px_8px_rgba(211,47,47,0.15),-7px_8px_15px_rgba(211,47,47,0.07)]"
          }`}
        >
          <Mail size={20} className="mr-2.5 shrink-0 text-[#8FA0B8]" />
          <input
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            type="email"
            placeholder="Email"
            className="w-full border-0 bg-transparent text-[14px] font-normal text-slate-900 outline-none placeholder:text-[#8FA0B8] placeholder:text-[13px] placeholder:font-medium"
            autoComplete="email"
          />
        </div>
        {errors.email && (
          <span className="mt-1.5 ml-4 block text-xs text-red-500 font-normal">
            {errors.email}
          </span>
        )}
      </div>

      <div className="h-[20px]" />

      {/* 2. PASSWORD TEXT FIELD */}
      <div>
        <div
          className={`flex h-12 items-center rounded-[30px] bg-white px-4 transition-all duration-200 ${
            passwordFocused
              ? "border-[1.5px] border-brandRed shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]"
              : "border border-[#E5E7EB] shadow-[-4px_5px_8px_rgba(211,47,47,0.15),-7px_8px_15px_rgba(211,47,47,0.07)]"
          }`}
        >
          <LockKeyhole size={20} className="mr-2.5 shrink-0 text-[#8FA0B8]" />
          <input
            value={values.password}
            onChange={(e) => update("password", e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border-0 bg-transparent text-[14px] font-normal text-slate-900 outline-none placeholder:text-[#8FA0B8] placeholder:text-[13px] placeholder:font-medium"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 text-[#8FA0B8] hover:text-brandRed transition cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <span className="mt-1.5 ml-4 block text-xs text-red-500 font-normal">
            {errors.password}
          </span>
        )}
      </div>

      <div className="h-[26px]" />

      {/* 3. LOGIN BUTTON */}
      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center rounded-[30px] bg-brandRed text-[15px] font-semibold tracking-[0.2px] text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] transition-all duration-150 active:scale-[0.98] cursor-pointer hover:bg-brandRedDark"
      >
        Login
      </button>

      <div className="h-[18px]" />

      {/* 4. DIVIDER */}
      <div className="flex items-center">
        <div className="flex-1 border-t border-[#E5E7EB]" />
        <span className="px-3 text-[11px] font-bold text-[#8FA0B8]">OR</span>
        <div className="flex-1 border-t border-[#E5E7EB]" />
      </div>

      <div className="h-[18px]" />

      {/* 5. GOOGLE SIGN IN BUTTON */}
      <button
        type="button"
        onClick={() => alert("Google Sign-In integration ready")}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[30px] border border-[#E5E7EB] bg-white text-[13px] font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
      >
        <span className="text-xl font-bold text-brandRed leading-none">G</span>
        <span>Continue with Google</span>
      </button>

      <div className="h-[24px]" />

      {/* 6. REGISTER LINK */}
      <div className="flex items-center justify-center text-[13px]">
        <span className="text-slate-500 font-medium">Don't have an account?&nbsp;</span>
        <Link
          to="/signup"
          className="font-semibold text-brandRed hover:underline"
        >
          Register
        </Link>
      </div>
    </form>
  );
}
