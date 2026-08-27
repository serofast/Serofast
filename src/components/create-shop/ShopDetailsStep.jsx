import { useRef, useState } from "react";
import {
  ChevronDown,
  ImagePlus,
  ShieldCheck,
  Clock3,
  Headphones,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { categories, subCategories } from "./data";

const inputBase =
  "h-11 lg:h-12 w-full rounded-lg border bg-lightSurface px-4 text-sm text-textPrimary outline-none transition focus:border-brandRed focus:ring-2 focus:ring-brandRed/10";

const inputValid = `${inputBase} border-[#d9d9d9]`;
const inputInvalid = `${inputBase} border-brandRed bg-promoHighlight`;

const MAX_UPLOAD_MB = 2;

function UploadBox({ kind, label, hint, value, error, onFile, onRemove, inputRef }) {
  return (
    <div>
      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-lightBorder bg-lightSurface">
          <img
            src={value.url}
            alt={`${label} preview`}
            className="h-[150px] w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-2">
            <span className="min-w-0 truncate text-xs font-medium text-white">{value.name}</span>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="min-h-[34px] rounded-md bg-white/95 px-3 text-xs font-semibold text-textPrimary transition hover:bg-white"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="min-h-[34px] rounded-md bg-white/95 px-3 text-xs font-semibold text-brandRed transition hover:bg-white"
                aria-label={`Remove ${label}`}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-[150px] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brandRed/30 bg-promoHighlight px-4 text-center transition hover:border-brandRed/60"
        >
          <ImagePlus size={28} className="text-brandRed" />
          <strong className="text-sm font-semibold text-textPrimary">{label}</strong>
          <span className="text-xs text-textMuted">{hint}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFile}
        className="sr-only"
        aria-label={label}
      />

      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-brandRed">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ShopDetailsStep({ form, updateForm, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const [uploadError, setUploadError] = useState({ logo: "", cover: "" });
  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const previewName = form.shopName || "Your Shop Name";
  const previewCategory = form.category
    ? form.subCategory
      ? `${form.category} · ${form.subCategory}`
      : form.category
    : "Fashion · Women's Clothing";

  const updateField = (key, value) => {
    updateForm({ [key]: value });
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  };

  const readFile = (file, kind) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError((cur) => ({
        ...cur,
        [kind]: "Please upload an image file (JPG, PNG).",
      }));
      return;
    }

    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setUploadError((cur) => ({
        ...cur,
        [kind]: `Image must be smaller than ${MAX_UPLOAD_MB}MB.`,
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateForm({ [kind]: { url: reader.result, name: file.name } });
      setUploadError((cur) => ({ ...cur, [kind]: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (kind) => (event) => {
    readFile(event.target.files?.[0], kind);
    // Allow re-selecting the same file later.
    event.target.value = "";
  };

  const removeUpload = (kind) => {
    updateForm({ [kind]: null });
    setUploadError((cur) => ({ ...cur, [kind]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.shopName.trim()) {
      nextErrors.shopName = "Shop name is required.";
    } else if (form.shopName.trim().length < 2) {
      nextErrors.shopName = "Shop name must be at least 2 characters.";
    }

    if (!form.category) {
      nextErrors.category = "Please select a category.";
    }

    const email = form.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    const digits = form.contact.replace(/\D/g, "");
    if (form.contact.trim() && (digits.length < 7 || digits.length > 15)) {
      nextErrors.contact = "Please enter a valid contact number.";
    }

    return nextErrors;
  };

  const handleContinue = () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onNext();
    }
  };

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.62fr)] lg:gap-8">
      <div className="rounded-bento-sm border border-lightBorder bg-lightSurface p-5 shadow-bento lg:p-6">
        <div>
          <h1 className="mb-1.5 mt-0 text-2xl font-bold md:text-3xl lg:text-4xl">Shop Information</h1>
          <p className="m-0 text-sm text-textSecondary lg:text-base">
            Let's start with some basic information about your shop.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="shopName" className="mb-1.5 block text-sm font-semibold">
              Shop Name <span className="text-brandRed">*</span>
            </label>
            <input
              id="shopName"
              value={form.shopName}
              onChange={(e) => updateField("shopName", e.target.value)}
              placeholder="Enter your shop name"
              aria-invalid={Boolean(errors.shopName)}
              aria-describedby={errors.shopName ? "shopName-error" : undefined}
              className={errors.shopName ? inputInvalid : inputValid}
            />
            {errors.shopName && (
              <p id="shopName-error" role="alert" className="mt-1.5 text-xs font-medium text-brandRed">
                {errors.shopName}
              </p>
            )}
            <small className="mt-1.5 block text-xs text-textMuted">
              Choose a unique name for your shop
            </small>
          </div>

          <div>
            <label htmlFor="shopCategory" className="mb-1.5 block text-sm font-semibold">
              Shop Category <span className="text-brandRed">*</span>
            </label>
            <div className="relative">
              <select
                id="shopCategory"
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                aria-invalid={Boolean(errors.category)}
                aria-describedby={errors.category ? "category-error" : undefined}
                className={`${errors.category ? inputInvalid : inputValid} appearance-none pr-10`}
              >
                <option value="">Select a category</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-textSecondary"
              />
            </div>
            {errors.category && (
              <p id="category-error" role="alert" className="mt-1.5 text-xs font-medium text-brandRed">
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="shopSubCategory" className="mb-1.5 block text-sm font-semibold">
              Shop Sub Category{" "}
              <em className="font-normal text-textMuted">(Optional)</em>
            </label>
            <div className="relative">
              <select
                id="shopSubCategory"
                value={form.subCategory}
                onChange={(e) => updateField("subCategory", e.target.value)}
                className={`${inputValid} appearance-none pr-10`}
              >
                <option value="">Select sub category</option>
                {subCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-textSecondary"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold">Shop Logo & Cover Image</span>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <UploadBox
                kind="logo"
                label="Upload Logo"
                hint="JPG, PNG · Max 2MB"
                value={form.logo}
                error={uploadError.logo}
                onFile={handleFileChange("logo")}
                onRemove={() => removeUpload("logo")}
                inputRef={logoInputRef}
              />
              <UploadBox
                kind="cover"
                label="Upload Cover Image"
                hint="JPG, PNG · Recommended 1200×400px"
                value={form.cover}
                error={uploadError.cover}
                onFile={handleFileChange("cover")}
                onRemove={() => removeUpload("cover")}
                inputRef={coverInputRef}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <label htmlFor="shopDescription" className="block text-sm font-semibold">
                Shop Description
              </label>
              <span className="text-xs text-textMuted">{form.description.length}/500</span>
            </div>
            <textarea
              id="shopDescription"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              maxLength={500}
              placeholder="Write a short description about your shop, products and what makes you unique..."
              className="min-h-[120px] w-full resize-y rounded-lg border border-[#d9d9d9] bg-lightSurface px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-brandRed focus:ring-2 focus:ring-brandRed/10 lg:min-h-[140px]"
            />
          </div>

          <div>
            <label htmlFor="shopEmail" className="mb-1.5 block text-sm font-semibold">
              Shop Email
            </label>
            <input
              id="shopEmail"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="Enter email address"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={errors.email ? inputInvalid : inputValid}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1.5 text-xs font-medium text-brandRed">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="shopContact" className="mb-1.5 block text-sm font-semibold">
              Contact Number
            </label>
            <input
              id="shopContact"
              value={form.contact}
              onChange={(e) => updateField("contact", e.target.value)}
              placeholder="Enter contact number"
              type="tel"
              autoComplete="tel"
              aria-invalid={Boolean(errors.contact)}
              aria-describedby={errors.contact ? "contact-error" : undefined}
              className={errors.contact ? inputInvalid : inputValid}
            />
            {errors.contact && (
              <p id="contact-error" role="alert" className="mt-1.5 text-xs font-medium text-brandRed">
                {errors.contact}
              </p>
            )}
          </div>

          <div className="rounded-bento-sm border border-lightBorder bg-promoHighlight p-5 md:col-span-2 lg:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-bold lg:text-base">
                <Clock3 size={18} className="text-brandRed" />
                Entry Charge
              </span>
              <strong className="rounded-full bg-brandRed px-3 py-1 text-xs font-bold text-white">
                ONE TIME
              </strong>
            </div>

            <div role="radiogroup" aria-label="Entry charge" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { value: "standard", price: "₹49", label: "Standard Entry Fee" },
                { value: "offer", price: "₹0", label: "Limited Time Offer" },
              ].map((option) => {
                const active = form.entryFee === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => updateForm({ entryFee: option.value })}
                    className={`flex min-h-[72px] items-center gap-3 rounded-lg border-2 px-4 text-left transition ${
                      active
                        ? "border-brandRed bg-lightSurface ring-2 ring-brandRed/10"
                        : "border-lightBorder bg-lightSurface hover:border-brandRed/40"
                    }`}
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                        active ? "border-brandRed" : "border-[#c9ced6]"
                      }`}
                    >
                      {active && <span className="h-2.5 w-2.5 rounded-full bg-brandRed" />}
                    </span>
                    <span>
                      <strong className="block text-base font-bold text-textPrimary">
                        {option.price}
                      </strong>
                      <span className="block text-xs text-textSecondary">{option.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-lightBorder pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[#d9d9d9] bg-lightSurface px-5 text-sm font-semibold text-textPrimary transition hover:border-brandRed hover:text-brandRed sm:w-auto"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-brandRed px-6 text-sm font-semibold text-white transition hover:bg-brandRedDark sm:w-auto"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-textSecondary">
          <ShieldCheck size={14} className="text-brandRed" />
          Your information is safe with us. We never share your data.
        </p>
      </div>

      <aside className="grid content-start gap-4 md:grid-cols-3 lg:sticky lg:top-24 lg:grid-cols-1">
        <div className="rounded-bento-sm border border-lightBorder bg-lightSurface p-4 shadow-bento lg:p-5">
          <div className="mb-3 grid gap-1">
            <strong className="text-base font-bold lg:text-lg">Shop Preview</strong>
            <span className="text-xs text-textSecondary">
              This is how your shop will look to customers.
            </span>
          </div>

          <div className="overflow-hidden rounded-bento-sm border border-lightBorder">
            <div className="relative h-28 lg:h-32">
              {form.cover?.url ? (
                <img
                  src={form.cover.url}
                  alt="Shop cover preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-r from-[#FDD8E9] to-[#F7B7DC]" />
              )}
            </div>
            <div className="p-4">
              <div className="-mt-10 mb-3">
                {form.logo?.url ? (
                  <img
                    src={form.logo.url}
                    alt="Shop logo preview"
                    className="h-16 w-16 rounded-full border-4 border-lightSurface object-cover shadow-sm"
                  />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-full border-4 border-lightSurface bg-brandRed text-xl font-bold text-white shadow-sm">
                    S
                  </div>
                )}
              </div>
              <strong className="block text-base font-bold lg:text-lg">{previewName}</strong>
              <span className="mt-0.5 block text-sm text-textSecondary">{previewCategory}</span>
              <div className="mt-2 text-xs text-amber-600">★★★★★ 4.8 (128 reviews)</div>
              <p className="mt-2 text-xs text-textSecondary">Fast Delivery &nbsp; Easy Returns</p>
              <p className="mt-0.5 text-xs text-textSecondary">▣ Secure Payment</p>
              <div className="mt-3 flex gap-3 border-t border-lightBorder pt-3 text-xs font-semibold text-textSecondary">
                <span className="text-brandRed">Home</span>
                <span>Products</span>
                <span>About</span>
                <span>Reviews</span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                <i className="h-[38px] rounded-md bg-[#FFD6E5]" />
                <i className="h-[38px] rounded-md bg-[#EAD8FF]" />
                <i className="h-[38px] rounded-md bg-[#D2ECFF]" />
                <i className="h-[38px] rounded-md bg-[#FFF0B1]" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-bento-sm border border-lightBorder bg-lightSurface p-4 shadow-bento lg:p-5">
          <strong className="text-base font-bold lg:text-lg">Why Sell on SEROFAST?</strong>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              ["Millions of Customers", "Reach a wide customer base across the country."],
              ["Grow Your Business", "Powerful tools to manage and grow your business."],
              ["Secure & Trusted", "100% secure payments and trusted by thousands."],
              ["24/7 Support", "Get help whenever you need it."],
            ].map(([title, text]) => (
              <div key={title} className="flex gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-promoHighlight text-brandRed">
                  <TrendingUp size={18} />
                </span>
                <span className="text-xs leading-[1.5] text-textSecondary">
                  <b className="mb-0.5 block text-sm font-semibold text-textPrimary">{title}</b>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-bento-sm border border-brandRed/20 bg-promoHighlight p-5 lg:p-6">
          <Headphones size={22} className="text-brandRed" />
          <strong className="mt-2 block text-base font-semibold lg:text-lg">Need Help?</strong>
          <p className="my-2 text-sm leading-[1.55] text-textSecondary">
            Our support team is here to help you set up your shop.
          </p>
          <button
            type="button"
            className="min-h-[44px] w-full rounded-lg border border-brandRed/30 bg-lightSurface px-4 text-sm font-semibold text-brandRed transition hover:border-brandRed"
          >
            Contact Support
          </button>
        </div>
      </aside>
    </section>
  );
}
