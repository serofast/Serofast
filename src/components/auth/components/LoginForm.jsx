import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  Store,
  Chrome,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

function Field({ label, icon: Icon, children, error }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <div
        className={`relative flex min-h-[48px] items-center rounded-xl border bg-white px-3.5 transition-all duration-200 ${
          error
            ? "border-red-400 ring-2 ring-red-500/10"
            : "border-slate-200 focus-within:border-brandRed focus-within:ring-2 focus-within:ring-brandRed/10"
        }`}
      >
        <Icon size={18} className="mr-2.5 shrink-0 text-slate-400" />
        {children}
      </div>
      {error ? (
        <span className="mt-1 block text-xs text-red-500">{error}</span>
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
        className="min-w-0 flex-1 border-0 bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
        autoComplete="current-password"
      />
      <button
        type="button"
        onClick={() => setShow((current) => !current)}
        className="ml-2 grid h-7 w-7 place-items-center rounded-full text-slate-400 hover:text-brandRed"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </Field>
  );
}

export default function LoginForm() {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({});

  const update = (key, value) =>
    setValues((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const required = ["shopId", "email", "password"];
    return required.every((key) => String(values[key] || "").trim());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="py-6 text-center animate-in zoom-in-95 duration-200">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-md shadow-emerald-500/20">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">
          Welcome Back, Shop Owner
        </h2>
        <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
          Loading your store workspace...
        </p>

        <Link
          to="/shop-owner/dashboard"
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brandRed px-6 text-xs font-bold text-white shadow-md shadow-brandRed/20 transition hover:bg-brandRedDark active:scale-95"
        >
          <span>Enter Workspace</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Shop Owner Sign In
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Sign in to manage store catalog, orders &amp; payouts.
        </p>
      </div>

      <Field label="Shop ID" icon={Store}>
        <input
          value={values.shopId || ""}
          onChange={(event) => update("shopId", event.target.value)}
          placeholder="e.g. SHOP-1042"
          className="min-w-0 flex-1 border-0 bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
        />
      </Field>

      <Field label="Email Address" icon={Mail}>
        <input
          value={values.email || ""}
          onChange={(event) => update("email", event.target.value)}
          type="email"
          placeholder="owner@yourshop.com"
          className="min-w-0 flex-1 border-0 bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
          autoComplete="email"
        />
      </Field>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
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
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brandRed text-xs font-bold text-white shadow-md shadow-brandRed/20 transition hover:bg-brandRedDark active:scale-95"
      >
        <span>Sign In</span>
        <ArrowRight size={16} />
      </button>

      <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-slate-400 pt-1">
        <span className="h-px flex-1 bg-slate-100" />
        <span>Or</span>
        <span className="h-px flex-1 bg-slate-100" />
      </div>

      <button
        type="button"
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        <Chrome size={16} className="text-rose-600" />
        Continue with Google
      </button>

      <p className="text-center text-xs text-slate-500 pt-1">
        New store owner?{" "}
        <Link
          to="/signup"
          className="font-bold text-brandRed hover:underline"
        >
          Become a Shop Owner
        </Link>
      </p>
    </form>
  );
}
