import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginShopOwner } from "../../../lib/supabase";

function Field({ label, icon: Icon, children, error }) {
  return (
    <label className="block font-sans">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
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
        <span className="mt-1 block text-xs text-red-500 font-medium">{error}</span>
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
        className="min-w-0 flex-1 border-0 bg-transparent text-xs sm:text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
        autoComplete="current-password"
      />
      <button
        type="button"
        onClick={() => setShow((current) => !current)}
        className="ml-2 grid h-7 w-7 place-items-center rounded-full text-slate-400 hover:text-brandRed transition"
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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const update = (key, value) =>
    setValues((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const errs = {};
    if (!values.email?.trim()) errs.email = "Email is required";
    if (!values.password?.trim()) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      const result = await loginShopOwner({ email: values.email, password: values.password });
      setSubmitted(true);
      setTimeout(() => {
        if (result.shop) {
          navigate("/shop-owner/dashboard");
        } else {
          navigate("/create-shop");
        }
      }, 900);
    }
  };

  if (submitted) {
    return (
      <div className="py-6 text-center animate-scale-up font-sans">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-md shadow-emerald-500/20">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">
          Welcome Back
        </h2>
        <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500 font-normal">
          Loading your store workspace...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          Shop Owner Sign In
        </h2>
        <p className="mt-1 text-xs text-slate-500 font-normal">
          Sign in to manage your campus shop catalog, orders &amp; payouts.
        </p>
      </div>

      <Field label="Email Address" icon={Mail} error={errors.email}>
        <input
          value={values.email || ""}
          onChange={(event) => update("email", event.target.value)}
          type="email"
          placeholder="yourname@gmail.com"
          className="min-w-0 flex-1 border-0 bg-transparent text-xs sm:text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          autoComplete="email"
        />
      </Field>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
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
          error={errors.password}
        />
      </div>

      <button
        type="submit"
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brandRed text-xs font-bold text-white shadow-md shadow-brandRed/20 transition hover:bg-brandRedDark active:scale-95 cursor-pointer mt-2"
      >
        <span>Sign In</span>
        <ArrowRight size={16} />
      </button>

      <p className="text-center text-xs text-slate-500 pt-2 font-normal">
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
