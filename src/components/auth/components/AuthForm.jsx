import { useMemo, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  Store,
  UserRound,
  Phone,
  Tag,
  Chrome,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { shopCategories } from "../data";

function Field({ label, icon: Icon, children, error }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#6b7c96]">
        {label}
      </span>
      <div
        className={`relative flex min-h-[52px] items-center rounded-[14px] border bg-white px-4 transition-all duration-200 ${
          error
            ? "border-red-400 ring-2 ring-red-500/10"
            : "border-[#DCE4EE] focus-within:border-brandRed focus-within:ring-4 focus-within:ring-brandRed/10 focus-within:shadow-[0_4px_16px_rgba(210,33,37,0.08)]"
        }`}
      >
        <Icon size={19} className="mr-3 shrink-0 text-[#90A4C1]" />
        {children}
      </div>
      {error ? (
        <span className="mt-1.5 block text-xs text-red-500">{error}</span>
      ) : null}
    </label>
  );
}

function PasswordInput({ value, onChange, placeholder, name, error }) {
  const [show, setShow] = useState(false);

  return (
    <Field label="Password" icon={LockKeyhole} error={error}>
      <input
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-textPrimary outline-none placeholder:text-[#95A5BD]"
        autoComplete={name === "new-password" ? "new-password" : "current-password"}
      />
      <button
        type="button"
        onClick={() => setShow((current) => !current)}
        className="ml-2 grid h-8 w-8 place-items-center rounded-full text-[#8BA0BC] transition hover:text-brandRed"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </Field>
  );
}

export default function AuthForm({ mode, role }) {
  const isLogin = mode === "login";
  const isAdmin = role === "admin";
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({});

  const title = useMemo(() => {
    if (isLogin && isAdmin) return "Platform Admin Sign In";
    if (isLogin) return "Shop Owner Sign In";
    if (isAdmin) return "Create Admin Credentials";
    return "Become a Shop Owner";
  }, [isLogin, isAdmin]);

  const update = (key, value) =>
    setValues((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const required = isLogin
      ? isAdmin
        ? ["email", "password"]
        : ["shopId", "email", "password"]
      : isAdmin
        ? ["fullName", "email", "password"]
        : ["shopName", "ownerName", "businessEmail", "password", "phone", "category"];

    return required.every((key) => String(values[key] || "").trim());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) setSubmitted(true);
    else setSubmitted(false);
  };

  if (submitted) {
    const registerShop = !isLogin && !isAdmin;

    return (
      <div className="py-8 text-center animate-in zoom-in-95 duration-200">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="mt-5 text-2xl font-black text-textPrimary">
          {isLogin ? "Welcome Back, Shop Owner!" : "Shop Owner Profile Created!"}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-textSecondary">
          {registerShop
            ? "Your official shop owner credentials are ready. Next, configure your store catalog and start receiving orders."
            : "Your credentials have been verified. You can now access your management portal."}
        </p>

        {registerShop ? (
          <Link
            to="/shop-owner/dashboard"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brandRed px-7 text-sm font-bold text-white shadow-lg shadow-brandRed/25 transition hover:bg-brandRedDark active:scale-95"
          >
            <Store size={18} />
            Go to Shop Owner Dashboard
          </Link>
        ) : (
          <Link
            to={isAdmin ? "/admin/dashboard" : "/shop-owner/dashboard"}
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brandRed px-7 text-sm font-bold text-white shadow-lg shadow-brandRed/25 transition hover:bg-brandRedDark active:scale-95"
          >
            <ArrowRight size={18} />
            Enter Portal
          </Link>
        )}

        <div>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline"
          >
            Edit form details
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Role Indicator Banner */}
      {isAdmin ? (
        <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-2.5 text-white">
          <div className="flex items-center gap-2 text-xs font-bold">
            <ShieldCheck size={16} className="text-amber-400" />
            <span>Platform Admin Access</span>
          </div>
          <Link to="/login" className="text-[11px] text-rose-300 hover:underline">
            Switch to Shop Owner
          </Link>
        </div>
      ) : null}

      <div>
        <div className="flex items-center gap-2">
          {!isAdmin && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-brandRed">
              <Sparkles size={11} />
              Merchant Portal
            </span>
          )}
        </div>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-textPrimary sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 text-xs leading-relaxed text-textSecondary">
          {isAdmin
            ? "Access the SeroFast overall platform management system."
            : isLogin
              ? "Sign in with your store credentials to view orders, stock & payouts."
              : "Register your store profile to sell directly to campus students with 0% fees."}
        </p>
      </div>

      {isLogin ? (
        <>
          {!isAdmin ? (
            <Field label="Shop ID / Store Identifier" icon={Store}>
              <input
                value={values.shopId || ""}
                onChange={(event) => update("shopId", event.target.value)}
                placeholder="e.g. SHOP-1042 or UrbanStyles"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-textPrimary outline-none placeholder:text-[#95A5BD]"
              />
            </Field>
          ) : null}

          <Field label="Business Email" icon={Mail}>
            <input
              value={values.email || ""}
              onChange={(event) => update("email", event.target.value)}
              type="email"
              placeholder="owner@yourshop.com"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-textPrimary outline-none placeholder:text-[#95A5BD]"
              autoComplete="email"
            />
          </Field>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.08em] text-[#6b7c96]">
                Password
              </span>
              <a href="#forgot" className="text-xs font-semibold text-brandRed hover:underline">
                Forgot?
              </a>
            </div>
            <PasswordInput
              name="current-password"
              value={values.password || ""}
              onChange={(value) => update("password", value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-brandRed px-5 text-sm font-bold text-white shadow-lg shadow-brandRed/25 transition-all duration-200 hover:bg-brandRedDark hover:shadow-xl active:scale-95"
          >
            <span>{isAdmin ? "Admin Sign In" : "Sign In to Shop Owner Portal"}</span>
            <ArrowRight size={18} />
          </button>

          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-[#A6B4C8]">
            <span className="h-px flex-1 bg-[#E6EBF1]" />
            <span>Or Quick Login</span>
            <span className="h-px flex-1 bg-[#E6EBF1]" />
          </div>

          <button
            type="button"
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[14px] border border-[#DCE4EE] bg-white text-xs font-semibold text-textPrimary shadow-2xs transition hover:border-brandRed hover:bg-rose-50/50"
          >
            <Chrome size={18} className="text-rose-600" />
            Continue with Google WorkSpace
          </button>

          <p className="text-center text-xs text-textSecondary pt-2">
            {!isAdmin ? (
              <>
                New store merchant?{" "}
                <Link
                  to="/become-shop-owner"
                  className="font-bold text-brandRed hover:underline"
                >
                  Become a Shop Owner
                </Link>
              </>
            ) : null}
          </p>
        </>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Shop Name" icon={Store}>
              <input
                value={values.shopName || ""}
                onChange={(event) => update("shopName", event.target.value)}
                placeholder="e.g. Campus Corner Store"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#95A5BD]"
              />
            </Field>

            <Field label="Owner Full Name" icon={UserRound}>
              <input
                value={values.ownerName || ""}
                onChange={(event) => update("ownerName", event.target.value)}
                placeholder="Full legal name"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#95A5BD]"
                autoComplete="name"
              />
            </Field>
          </div>

          <Field label="Business Email" icon={Mail}>
            <input
              value={values.businessEmail || ""}
              onChange={(event) => update("businessEmail", event.target.value)}
              type="email"
              placeholder="contact@yourshop.com"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#95A5BD]"
              autoComplete="email"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <PasswordInput
              name="new-password"
              value={values.password || ""}
              onChange={(value) => update("password", value)}
              placeholder="••••••••"
            />

            <Field label="Mobile Phone (for order SMS)" icon={Phone}>
              <input
                value={values.phone || ""}
                onChange={(event) => update("phone", event.target.value)}
                type="tel"
                placeholder="+91 98765 43210"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#95A5BD]"
                autoComplete="tel"
              />
            </Field>
          </div>

          <Field label="Shop Category" icon={Tag}>
            <select
              value={values.category || ""}
              onChange={(event) => update("category", event.target.value)}
              className="min-w-0 flex-1 appearance-none border-0 bg-transparent text-sm outline-none text-textPrimary"
            >
              <option value="">Select your shop category</option>
              {shopCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </Field>

          <button
            type="submit"
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-brandRed to-rose-600 px-5 text-sm font-extrabold text-white shadow-lg shadow-brandRed/30 transition-all duration-200 hover:shadow-xl active:scale-95"
          >
            <span>Become a Shop Owner</span>
            <ArrowRight size={18} />
          </button>

          <p className="text-center text-xs text-textSecondary pt-1">
            Already registered as a Shop Owner?{" "}
            <Link
              to="/login"
              className="font-bold text-brandRed hover:underline"
            >
              Shop Owner Sign In
            </Link>
          </p>
        </>
      )}
    </form>
  );
}
