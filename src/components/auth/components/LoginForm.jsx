import { useState } from "react";
import { Mail, LockKeyhole, CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { firebaseSignIn, firebaseGoogleSignIn } from "../../../lib/firebase";
import { loginShopOwner, registerShopOwner } from "../../../lib/supabase";
import { loginAdmin, isAdminUser } from "../../../services/adminAuthService";
import { AppFormField, AppFormButton } from "../../reusable/form";
import { humanizeError } from "../../../utils/humanizer";

export default function LoginForm() {
  const [submitted, setSubmitted] = useState(false);
  const [authRole, setAuthRole] = useState(null); // 'admin' | 'shop_owner'
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectTarget = searchParams.get("redirect")
    ? decodeURIComponent(searchParams.get("redirect"))
    : null;
  const isAdminRedirect = Boolean(redirectTarget && redirectTarget.startsWith("/admin"));
  const isTargetingAdmin = isAdminRedirect || isAdminUser(values.email);

  const update = (key, value) => {
    setAuthError(null);
    setValues((current) => ({ ...current, [key]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!values.email?.trim()) {
      errs.email = "Please enter your email or administrator ID";
    }
    if (!values.password || values.password.length < 4) {
      errs.password = "Please enter your password";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setAuthError(null);

    // ── Check if user is logging in with Admin credentials ─────────────────
    if (isTargetingAdmin) {
      try {
        const adminRes = await loginAdmin({
          username: values.email,
          passcode: values.password,
        });

        if (adminRes.success) {
          setIsLoading(false);
          setAuthRole("admin");
          setSubmitted(true);
          setTimeout(() => {
            navigate(redirectTarget || "/admin", { replace: true });
          }, 700);
          return;
        } else {
          setIsLoading(false);
          setAuthError(adminRes.error || "Invalid administrator credentials.");
          return;
        }
      } catch (err) {
        setIsLoading(false);
        setAuthError("Admin authentication error. Please retry.");
        return;
      }
    }

    // ── Otherwise proceed with standard Shop Owner authentication ──────────
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
      setAuthRole("shop_owner");
      setSubmitted(true);
      setTimeout(() => {
        navigate(redirectTarget || "/shop-owner/dashboard", { replace: true });
      }, 700);
    } catch (err) {
      const rawMsg = err?.message || String(err);
      const isGoogleLinked =
        rawMsg.toLowerCase().includes("google sign-in") ||
        rawMsg.toLowerCase().includes("continue with google");

      if (isGoogleLinked) {
        setIsLoading(false);
        setAuthError({
          isGoogle: true,
          title: "Google Sign-In Account",
          message: "This account was created with Google Sign-In and does not use a password. Please sign in with Google below.",
        });
        return;
      }

      // If Firebase failed, check if this was actually an admin trying to login with an admin password
      const adminFallback = await loginAdmin({
        username: values.email,
        passcode: values.password,
      });

      if (adminFallback.success) {
        setIsLoading(false);
        setAuthRole("admin");
        setSubmitted(true);
        setTimeout(() => {
          navigate(redirectTarget || "/admin", { replace: true });
        }, 700);
        return;
      }

      setIsLoading(false);
      setAuthError({
        isGoogle: false,
        message: humanizeError(err, "We couldn't sign you in. Please check your email and password."),
      });
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
        auth_provider: "google",
      });
      setIsLoading(false);
      setAuthRole("shop_owner");
      setSubmitted(true);
      setTimeout(() => {
        navigate(redirectTarget || "/shop-owner/dashboard", { replace: true });
      }, 700);
    } catch (err) {
      setIsLoading(false);
      setAuthError({
        isGoogle: false,
        message: humanizeError(err, "Google sign-in could not be completed. Please try again."),
      });
    }
  };

  if (submitted) {
    return (
      <div className="py-6 text-center animate-scale-up font-sans font-sansation">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-800">
          {authRole === "admin" ? "Admin Console Unlocked" : "Welcome Back"}
        </h2>
        <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate-500 font-normal">
          {authRole === "admin"
            ? "Session authenticated. Opening administration dashboard..."
            : "Authenticated securely with Firebase..."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 font-sans font-sansation">
      {/* Header Badge */}
      <div className="text-center pb-1">
        {isAdminRedirect ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-brandRed text-[11px] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={14} className="text-brandRed" />
            <span>Admin Authentication Required</span>
          </div>
        ) : null}

        <h2 className="text-[22px] font-semibold text-brandRed tracking-tight">
          {isAdminRedirect ? "Administrator Access" : "Platform Login"}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isAdminRedirect
            ? "Enter your master administrator credentials to proceed"
            : "Sign in to manage your shop or platform console"}
        </p>
      </div>

      {/* Security Error Banner / Google Account Detection Alert */}
      {authError && authError.isGoogle ? (
        <div className="p-3.5 rounded-[18px] bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex flex-col gap-2.5 animate-fade-in shadow-2xs font-sans">
          <div className="flex items-start gap-2.5">
            <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900 font-bold text-xs">
              G
            </div>
            <div className="flex-1">
              <span className="font-semibold text-slate-900 block text-[12.5px]">{authError.title}</span>
              <p className="text-slate-600 mt-0.5 leading-relaxed text-[11.5px]">
                {authError.message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-[24px] bg-brandRed text-white text-[12px] font-semibold shadow-xs hover:bg-rose-700 active:scale-[0.99] transition cursor-pointer"
          >
            <span className="text-sm font-bold leading-none">G</span>
            <span>Sign In with Google</span>
          </button>
        </div>
      ) : authError ? (
        <div className="p-3 rounded-[16px] bg-rose-50 border border-rose-200 text-brandRed text-xs flex items-center gap-2 animate-fade-in font-medium">
          <ShieldAlert size={18} className="shrink-0 text-brandRed" />
          <span>{typeof authError === 'string' ? authError : authError.message}</span>
        </div>
      ) : null}

      {/* 1. EMAIL / USERNAME FIELD */}
      <AppFormField
        icon={Mail}
        type="text"
        value={values.email}
        onChange={(val) => update("email", val)}
        placeholder={isAdminRedirect ? "Admin Email or Username" : "Email Address"}
        error={errors.email}
        autoComplete="username"
      />

      {/* 2. PASSWORD FIELD */}
      <AppFormField
        icon={LockKeyhole}
        isPassword
        value={values.password}
        onChange={(val) => update("password", val)}
        placeholder="Password / Master Passcode"
        error={errors.password}
        autoComplete="current-password"
      />

      <div className="pt-2" />

      {/* 3. LOGIN BUTTON */}
      <AppFormButton type="submit" isLoading={isLoading}>
        {isTargetingAdmin ? "Authenticate Admin Session" : "Secure Login"}
      </AppFormButton>

      {/* 4. GOOGLE SIGN IN & REGISTER (Shown for general / shop owner users) */}
      {!isAdminRedirect && (
        <>
          <div className="flex items-center pt-1">
            <div className="flex-1 border-t border-[#E5E7EB]" />
            <span className="px-3 text-[11px] font-bold text-[#8FA0B8]">OR</span>
            <div className="flex-1 border-t border-[#E5E7EB]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[30px] border border-[#E5E7EB] bg-white text-[13px] font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50 cursor-pointer"
          >
            <span className="text-xl font-bold text-brandRed leading-none">G</span>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center justify-center text-[13px] pt-2">
            <span className="text-slate-500 font-medium">Don't have a shop account?&nbsp;</span>
            <Link
              to="/signup"
              className="font-semibold text-brandRed hover:underline"
            >
              Register Shop
            </Link>
          </div>
        </>
      )}
    </form>
  );
}

