import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  Phone,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { shopCategories } from "../data";
import { registerShopOwner } from "../../../lib/supabase";

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
        autoComplete="new-password"
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

export default function RegisterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const update = (key, value) =>
    setValues((current) => ({ ...current, [key]: value }));

  const validate = () => {
    const errs = {};
    if (!values.name?.trim()) errs.name = "Full name is required";
    if (!values.email?.trim()) errs.email = "Gmail / Email is required";
    if (!values.password?.trim()) errs.password = "Password is required";
    if (!values.phone?.trim()) errs.phone = "Phone number is required";
    if (!values.category) errs.category = "Please select a category";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      await registerShopOwner(values);
      setSubmitted(true);
      setTimeout(() => {
        navigate("/create-shop");
      }, 1000);
    }
  };

  if (submitted) {
    return (
      <div className="py-6 text-center animate-scale-up font-sans">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-md shadow-emerald-500/20">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="mt-4 text-xl font-extrabold text-slate-900">
          Account Created 🎉
        </h2>
        <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500 font-normal">
          Proceeding to 6-Step Shop Setup Wizard...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          Sign Up as Shop Owner
        </h2>
        <p className="mt-1 text-xs text-slate-500 font-normal">
          Create your account to start selling on SeroFast with 0% commission.
        </p>
      </div>

      {/* 1. Full Name */}
      <Field label="Full Name" icon={UserRound} error={errors.name}>
        <input
          value={values.name || ""}
          onChange={(event) => update("name", event.target.value)}
          placeholder="e.g. Ramesh Kumar"
          className="min-w-0 flex-1 border-0 bg-transparent text-xs sm:text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          autoComplete="name"
        />
      </Field>

      {/* 2. Gmail / Email */}
      <Field label="Gmail / Email Address" icon={Mail} error={errors.email}>
        <input
          value={values.email || ""}
          onChange={(event) => update("email", event.target.value)}
          type="email"
          placeholder="yourname@gmail.com"
          className="min-w-0 flex-1 border-0 bg-transparent text-xs sm:text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          autoComplete="email"
        />
      </Field>

      {/* 3. Password & 4. Phone Number */}
      <div className="grid gap-3 sm:grid-cols-2">
        <PasswordInput
          name="new-password"
          value={values.password || ""}
          onChange={(value) => update("password", value)}
          placeholder="••••••••"
          error={errors.password}
        />

        <Field label="Phone Number" icon={Phone} error={errors.phone}>
          <input
            value={values.phone || ""}
            onChange={(event) => update("phone", event.target.value)}
            type="tel"
            placeholder="+91 98765 43210"
            className="min-w-0 flex-1 border-0 bg-transparent text-xs sm:text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            autoComplete="tel"
          />
        </Field>
      </div>

      {/* 5. Category */}
      <Field label="Primary Shop Category" icon={Tag} error={errors.category}>
        <select
          value={values.category || ""}
          onChange={(event) => update("category", event.target.value)}
          className="min-w-0 flex-1 appearance-none border-0 bg-transparent text-xs sm:text-sm font-medium text-slate-900 outline-none cursor-pointer"
        >
          <option value="">Select Category</option>
          {shopCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </Field>

      <button
        type="submit"
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brandRed text-xs font-bold text-white shadow-md shadow-brandRed/20 transition hover:bg-brandRedDark active:scale-95 cursor-pointer mt-2"
      >
        <span>Continue to Shop Setup</span>
        <ArrowRight size={16} />
      </button>

      <p className="text-center text-xs text-slate-500 pt-1 font-normal">
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
