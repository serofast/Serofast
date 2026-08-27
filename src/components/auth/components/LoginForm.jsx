import { useState } from "react";
import { Mail, LockKeyhole, CheckCircle2, ShieldAlert } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { firebaseSignIn, firebaseGoogleSignIn } from "../../../lib/firebase";
import { loginShopOwner, registerShopOwner } from "../../../lib/supabase";
import { AppFormField, AppFormButton } from "../../reusable/form";
import { humanizeError } from "../../../utils/humanizer";

export default function LoginForm() {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const update = (key, value) => {
    setAuthError(null);
    setValues((current) => ({ ...current, [key]: value }));
  };

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
    if (!validate()) return;

    setIsLoading(true);
    setAuthError(null);

    try {
      // 1. Firebase Auth Sign-in (handles security & brute-force checks)
      const { user } = await firebaseSignIn(values.email, values.password);

      // 2. Fetch owner & shop from Supabase database
      await loginShopOwner({
        id: user.uid,
        email: values.email,
        password: values.password,
      });

      setIsLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        navigate("/shop-owner/dashboard");
      }, 800);
    } catch (err) {
      setIsLoading(false);
      setAuthError(humanizeError(err, "We couldn't sign you in. Please check your email and password."));
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const { user } = await firebaseGoogleSignIn();
      await registerShopOwner({
        id: user.uid,
        name: user.displayName || "Shop Owner",
        email: user.email,
        phone: user.phoneNumber || "",
      });
      setIsLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        navigate("/shop-owner/dashboard");
      }, 800);
    } catch (err) {
      setIsLoading(false);
      setAuthError(humanizeError(err, "Google sign-in could not be completed. Please try again."));
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
          Authenticated securely with Firebase...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 font-sans font-sansation">
      {/* Title */}
      <h2 className="text-center text-[22px] font-semibold text-brandRed tracking-tight pb-1">
        Shop Owner Login
      </h2>

      {/* Security Error Banner (e.g. Brute Force Lockout or Invalid Credentials) */}
      {authError && (
        <div className="p-3 rounded-[16px] bg-rose-50 border border-rose-200 text-brandRed text-xs flex items-center gap-2 animate-fade-in font-medium">
          <ShieldAlert size={18} className="shrink-0 text-brandRed" />
          <span>{authError}</span>
        </div>
      )}

      {/* 1. EMAIL FIELD */}
      <AppFormField
        icon={Mail}
        type="email"
        value={values.email}
        onChange={(val) => update("email", val)}
        placeholder="Email Address"
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
        Secure Login
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
        onClick={handleGoogleSignIn}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[30px] border border-[#E5E7EB] bg-white text-[13px] font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
      >
        <span className="text-xl font-bold text-brandRed leading-none">G</span>
        <span>Continue with Google</span>
      </button>

      {/* 6. REGISTER LINK */}
      <div className="flex items-center justify-center text-[13px] pt-2">
        <span className="text-slate-500 font-medium">Don't have a shop account?&nbsp;</span>
        <Link
          to="/signup"
          className="font-semibold text-brandRed hover:underline"
        >
          Register Shop
        </Link>
      </div>
    </form>
  );
}
