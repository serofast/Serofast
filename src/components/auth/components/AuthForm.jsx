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
} from "lucide-react";
import { Link } from "react-router-dom";
import { shopCategories } from "../data";

function Field({ label, icon: Icon, children, error }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium uppercase tracking-[0.08em] text-[#8AA0BF]">
        {label}
      </span>
      <div
        className={`relative flex min-h-[52px] items-center rounded-[14px] border bg-white px-4 transition ${
          error
            ? "border-red-400 ring-2 ring-red-500/10"
            : "border-[#DCE4EE] focus-within:border-brandRed focus-within:ring-2 focus-within:ring-brandRed/10"
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
    if (isLogin && isAdmin) return "Admin Sign In";
    if (isLogin) return "Shop Owner Sign In";
    if (isAdmin) return "Create Admin Account";
    return "Register Your Shop";
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
    // Shop-owner signup continues into the shop creation flow.
    const registerShop = !isLogin && !isAdmin;

    return (
      <div className="py-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#FFF1F2] text-brandRed">
          <Store size={24} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-textPrimary">
          {isLogin ? "Ready to continue" : "Account details captured"}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-textSecondary">
          {registerShop
            ? "Your shop owner profile is ready. Next, let's set up your shop on SeroFast."
            : "This frontend flow is ready for your authentication API or Supabase integration."}
        </p>
        {registerShop ? (
          <Link
            to="/create-shop"
            className="mt-6 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brandRed px-6 text-sm font-semibold text-white transition hover:bg-brandRedDark"
          >
            <Store size={18} />
            Register your Shop
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className={`mt-4 min-h-11 rounded-lg border px-6 text-sm font-semibold transition ${
            registerShop
              ? "border-[#DCE4EE] bg-white text-textSecondary hover:border-brandRed hover:text-brandRed"
              : "border-transparent bg-brandRed text-white hover:bg-brandRedDark"
          }`}
        >
          Back to form
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isLogin ? (
        <>
          {isAdmin ? (
            <div className="grid grid-cols-2 rounded-[15px] bg-[#F5F7FA] p-1.5 text-sm font-medium">
              <div className="rounded-[11px] bg-white px-4 py-3 text-center text-brandRed shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
                Admin
              </div>
              <Link
                to="/login?role=shop-owner"
                className="rounded-[11px] px-4 py-3 text-center text-[#51627C] hover:text-textPrimary"
              >
                Shop Owner
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 rounded-[15px] bg-[#F5F7FA] p-1.5 text-sm font-medium">
              <Link
                to="/login?role=admin"
                className="rounded-[11px] px-4 py-3 text-center text-[#51627C] hover:text-textPrimary"
              >
                Admin
              </Link>
              <div className="rounded-[11px] bg-white px-4 py-3 text-center text-brandRed shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
                Shop Owner
              </div>
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-textPrimary sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-textSecondary">
              {isAdmin
                ? "Access the SeroFast marketplace administration workspace."
                : "Enter your shop credentials to access your seller workspace."}
            </p>
          </div>

          {isAdmin ? (
            <Field label="Email Address" icon={Mail}>
              <input
                value={values.email || ""}
                onChange={(event) => update("email", event.target.value)}
                type="email"
                placeholder="name@example.com"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-textPrimary outline-none placeholder:text-[#95A5BD]"
                autoComplete="email"
              />
            </Field>
          ) : (
            <>
              <Field label="Shop ID" icon={Store}>
                <input
                  value={values.shopId || ""}
                  onChange={(event) => update("shopId", event.target.value)}
                  placeholder="Enter your unique shop ID"
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm text-textPrimary outline-none placeholder:text-[#95A5BD]"
                />
              </Field>

              <Field label="Email Address" icon={Mail}>
                <input
                  value={values.email || ""}
                  onChange={(event) => update("email", event.target.value)}
                  type="email"
                  placeholder="name@example.com"
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm text-textPrimary outline-none placeholder:text-[#95A5BD]"
                  autoComplete="email"
                />
              </Field>
            </>
          )}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-[0.08em] text-[#8AA0BF]">
                Password
              </span>
              <Link to="/forgot-password" className="text-sm font-medium text-brandRed hover:text-brandRedDark">
                Forgot?
              </Link>
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
            className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[14px] bg-brandRed px-5 text-base font-semibold text-white transition hover:bg-brandRedDark"
          >
            {isAdmin ? "Sign In" : "Enter Workspace"}
            <ArrowRight size={20} />
          </button>

          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[#A6B4C8]">
            <span className="h-px flex-1 bg-[#E6EBF1]" />
            <span>Or Continue With</span>
            <span className="h-px flex-1 bg-[#E6EBF1]" />
          </div>

          <button
            type="button"
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[14px] border border-[#DCE4EE] bg-white text-sm font-medium text-textPrimary hover:border-brandRed"
          >
            <Chrome size={19} />
            Google Account
          </button>

          <p className="text-center text-sm text-textSecondary">
            {isAdmin ? "New here?" : "Want to join SeroFast?"}{" "}
            <Link
              to={`/signup?role=${isAdmin ? "admin" : "shop-owner"}`}
              className="font-semibold text-brandRed hover:text-brandRedDark"
            >
              {isAdmin ? "Sign up today" : "Register your Shop"}
            </Link>
          </p>
        </>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-textPrimary sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-textSecondary">
              {isAdmin
                ? "Create an administrator account for SeroFast."
                : "Set up your shop owner account and merchant profile."}
            </p>
          </div>

          <button
            type="button"
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[14px] border border-[#DCE4EE] bg-white text-sm font-medium text-textPrimary hover:border-brandRed"
          >
            <Chrome size={19} />
            {isAdmin ? "Sign up with Google" : "Pre-fill with Google"}
          </button>

          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[#A6B4C8]">
            <span className="h-px flex-1 bg-[#E6EBF1]" />
            <span>Or Fill Details</span>
            <span className="h-px flex-1 bg-[#E6EBF1]" />
          </div>

          {isAdmin ? (
            <>
              <Field label="Full Name" icon={UserRound}>
                <input
                  value={values.fullName || ""}
                  onChange={(event) => update("fullName", event.target.value)}
                  placeholder="What should we call you?"
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#95A5BD]"
                  autoComplete="name"
                />
              </Field>

              <Field label="Email Address" icon={Mail}>
                <input
                  value={values.email || ""}
                  onChange={(event) => update("email", event.target.value)}
                  type="email"
                  placeholder="name@example.com"
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#95A5BD]"
                  autoComplete="email"
                />
              </Field>

              <PasswordInput
                name="new-password"
                value={values.password || ""}
                onChange={(value) => update("password", value)}
                placeholder="Min. 8 characters"
              />
            </>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Shop Name" icon={Store}>
                  <input
                    value={values.shopName || ""}
                    onChange={(event) => update("shopName", event.target.value)}
                    placeholder="e.g. Elegant Weaves"
                    className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#95A5BD]"
                  />
                </Field>

                <Field label="Owner Name" icon={UserRound}>
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

              <div className="grid gap-5 sm:grid-cols-2">
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
                    placeholder="+91 00000 00000"
                    className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#95A5BD]"
                    autoComplete="tel"
                  />
                </Field>
              </div>

              <Field label="Shop Category" icon={Tag}>
                <select
                  value={values.category || ""}
                  onChange={(event) => update("category", event.target.value)}
                  className="min-w-0 flex-1 appearance-none border-0 bg-transparent text-sm outline-none"
                >
                  <option value="">Select category</option>
                  {shopCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          )}

          <button
            type="submit"
            className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[14px] bg-brandRed px-5 text-base font-semibold text-white transition hover:bg-brandRedDark"
          >
            {isAdmin ? "Get Started" : "Create Merchant Account"}
            <ArrowRight size={20} />
          </button>

          <p className="text-center text-sm text-textSecondary">
            {isAdmin ? "Already have an account?" : "Already have an account?"}{" "}
            <Link
              to={`/login?role=${isAdmin ? "admin" : "shop-owner"}`}
              className="font-semibold text-brandRed hover:text-brandRedDark"
            >
              Log in
            </Link>
          </p>
        </>
      )}
    </form>
  );
}
