import { useState } from "react";
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
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { shopCategories } from "../data";

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
        autoComplete="new-password"
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

export default function RegisterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({});

  const update = (key, value) =>
    setValues((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const required = ["shopName", "ownerName", "businessEmail", "password", "phone", "category"];
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
        <h2 className="mt-4 text-xl font-extrabold text-slate-900">
          Shop Registered 🎉
        </h2>
        <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
          Your shop owner profile is ready.
        </p>

        <Link
          to="/shop-owner/dashboard"
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brandRed px-6 text-xs font-bold text-white shadow-md shadow-brandRed/20 transition hover:bg-brandRedDark active:scale-95"
        >
          <Store size={16} />
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          Become a Shop Owner
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Register your campus shop to sell directly with 0% commission.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Shop Name" icon={Store}>
          <input
            value={values.shopName || ""}
            onChange={(event) => update("shopName", event.target.value)}
            placeholder="e.g. Campus Books"
            className="min-w-0 flex-1 border-0 bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
          />
        </Field>

        <Field label="Owner Name" icon={UserRound}>
          <input
            value={values.ownerName || ""}
            onChange={(event) => update("ownerName", event.target.value)}
            placeholder="Full legal name"
            className="min-w-0 flex-1 border-0 bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
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
          className="min-w-0 flex-1 border-0 bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
          autoComplete="email"
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <PasswordInput
          name="new-password"
          value={values.password || ""}
          onChange={(value) => update("password", value)}
          placeholder="••••••••"
        />

        <Field label="Phone Number" icon={Phone}>
          <input
            value={values.phone || ""}
            onChange={(event) => update("phone", event.target.value)}
            type="tel"
            placeholder="+91 98765 43210"
            className="min-w-0 flex-1 border-0 bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
            autoComplete="tel"
          />
        </Field>
      </div>

      <Field label="Category" icon={Tag}>
        <select
          value={values.category || ""}
          onChange={(event) => update("category", event.target.value)}
          className="min-w-0 flex-1 appearance-none border-0 bg-transparent text-xs font-medium text-slate-900 outline-none"
        >
          <option value="">Select category</option>
          {shopCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </Field>

      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brandRed text-xs font-bold text-white shadow-md shadow-brandRed/20 transition hover:bg-brandRedDark active:scale-95"
      >
        <span>Become a Shop Owner</span>
        <ArrowRight size={16} />
      </button>

      <p className="text-center text-xs text-slate-500 pt-1">
        Already registered?{" "}
        <Link
          to="/login"
          className="font-bold text-brandRed hover:underline"
        >
          Shop Owner Sign In
        </Link>
      </p>
    </form>
  );
}
