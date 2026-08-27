import { useState } from "react";
import { Mail, LockKeyhole, UserRound, Phone, Tag, CheckCircle2, ShieldAlert } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { shopCategories } from "../data";
import { firebaseSignUp, firebaseGoogleSignIn } from "../../../lib/firebase";
import { registerShopOwner } from "../../../lib/supabase";
import { AppFormField, AppFormSelect, AppFormButton } from "../../reusable/form";
import { humanizeError } from "../../../utils/humanizer";

export default function RegisterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({});
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
    if (!values.name?.trim()) errs.name = "Please enter your full name";
    if (!values.email?.trim() || !values.email.includes("@")) errs.email = "Please enter a valid email";
    if (!values.password || values.password.length < 8) {
      errs.password = "Password must be at least 8 characters (with uppercase, lowercase, & number)";
    }
    if (!values.phone?.trim()) errs.phone = "Please enter phone number";
    if (!values.category) errs.category = "Please select shop category";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setAuthError(null);

    try {
      // 1. Register with Firebase Auth (validates password strength & issues JWT token)
      const { user } = await firebaseSignUp(values.email, values.password);

      // 2. Persist owner profile in Supabase public.shop_owners table
      await registerShopOwner({
        id: user.uid,
        name: values.name,
        email: values.email,
        phone: values.phone,
        category: values.category,
      });

      setIsLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        navigate("/shop-owner/dashboard");
      }, 900);
    } catch (err) {
      setIsLoading(false);
      setAuthError(humanizeError(err, "We couldn't set up your account right now. Please try again."));
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
        category: values.category || "Fashion",
      });
      setIsLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        navigate("/shop-owner/dashboard");
      }, 900);
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
          Account Created
        </h2>
        <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate-500 font-normal">
          Setting up your seller portal...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 font-sans font-sansation">
      {/* Title */}
      <h2 className="text-center text-[22px] font-semibold text-brandRed tracking-tight pb-1">
        Register Shop Account
      </h2>

      {/* Security Error Banner */}
      {authError && (
        <div className="p-3 rounded-[16px] bg-rose-50 border border-rose-200 text-brandRed text-xs flex items-center gap-2 animate-fade-in font-medium">
          <ShieldAlert size={18} className="shrink-0 text-brandRed" />
          <span>{authError}</span>
        </div>
      )}

      {/* 1. FULL NAME */}
      <AppFormField
        icon={UserRound}
        value={values.name}
        onChange={(val) => update("name", val)}
        placeholder="Full Name"
        error={errors.name}
        autoComplete="name"
      />

      {/* 2. EMAIL */}
      <AppFormField
        icon={Mail}
        type="email"
        value={values.email}
        onChange={(val) => update("email", val)}
        placeholder="Email Address"
        error={errors.email}
        autoComplete="email"
      />

      {/* 3. PASSWORD & PHONE */}
      <div className="grid gap-4 sm:grid-cols-2">
        <AppFormField
          icon={LockKeyhole}
          isPassword
          value={values.password}
          onChange={(val) => update("password", val)}
          placeholder="Strong Password (8+ chars)"
          error={errors.password}
          autoComplete="new-password"
        />

        <AppFormField
          icon={Phone}
          type="tel"
          value={values.phone}
          onChange={(val) => update("phone", val)}
          placeholder="Phone Number"
          error={errors.phone}
          autoComplete="tel"
        />
      </div>

      {/* 4. CATEGORY */}
      <AppFormSelect
        icon={Tag}
        value={values.category}
        onChange={(val) => update("category", val)}
        placeholder="Primary Shop Category"
        options={shopCategories}
        error={errors.category}
      />

      <div className="pt-2" />

      {/* SUBMIT BUTTON */}
      <AppFormButton type="submit" isLoading={isLoading}>
        Create Secured Account
      </AppFormButton>

      {/* DIVIDER */}
      <div className="flex items-center pt-1">
        <div className="flex-1 border-t border-[#E5E7EB]" />
        <span className="px-3 text-[11px] font-bold text-[#8FA0B8]">OR</span>
        <div className="flex-1 border-t border-[#E5E7EB]" />
      </div>

      {/* GOOGLE SIGN IN BUTTON */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[30px] border border-[#E5E7EB] bg-white text-[13px] font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
      >
        <span className="text-xl font-bold text-brandRed leading-none">G</span>
        <span>Continue with Google</span>
      </button>

      {/* LOGIN LINK */}
      <div className="flex items-center justify-center text-[13px] pt-2">
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
