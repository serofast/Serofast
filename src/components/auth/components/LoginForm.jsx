import { useState } from "react";
import { Mail, LockKeyhole, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginShopOwner } from "../../../lib/supabase";
import { AppFormField, AppFormButton } from "../../reusable/form";

export default function LoginForm() {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      await loginShopOwner({
        email: values.email,
        password: values.password,
      });
      setIsLoading(false);
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
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 font-sans font-sansation">
      {/* Title */}
      <h2 className="text-center text-[22px] font-semibold text-brandRed tracking-tight pb-2">
        Login
      </h2>

      {/* 1. EMAIL FIELD */}
      <AppFormField
        icon={Mail}
        type="email"
        value={values.email}
        onChange={(val) => update("email", val)}
        placeholder="Email"
        error={errors.email}
        autoComplete="email"
      />

      {/* 2. PASSWORD FIELD */}
      <AppFormField
        icon={LockKeyhole}
        isPassword
        value={values.password}
        onChange={(val) => update("password", val)}
        placeholder="Password"
        error={errors.password}
        autoComplete="current-password"
      />

      <div className="pt-2" />

      {/* 3. LOGIN BUTTON */}
      <AppFormButton type="submit" isLoading={isLoading}>
        Login
      </AppFormButton>

      {/* 4. DIVIDER */}
      <div className="flex items-center pt-1">
        <div className="flex-1 border-t border-[#E5E7EB]" />
        <span className="px-3 text-[11px] font-bold text-[#8FA0B8]">OR</span>
        <div className="flex-1 border-t border-[#E5E7EB]" />
      </div>

      {/* 5. GOOGLE SIGN IN BUTTON */}
      <button
        type="button"
        onClick={() => alert("Google Sign-In integration ready")}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[30px] border border-[#E5E7EB] bg-white text-[13px] font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
      >
        <span className="text-xl font-bold text-brandRed leading-none">G</span>
        <span>Continue with Google</span>
      </button>

      {/* 6. REGISTER LINK */}
      <div className="flex items-center justify-center text-[13px] pt-2">
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
