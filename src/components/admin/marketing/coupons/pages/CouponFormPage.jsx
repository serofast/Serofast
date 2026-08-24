import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminDatePicker, AdminSelect, Card, PageHeader, Toast } from "../../../shared/ui";
import { coupons } from "../../../shared/adminData";
import { saveAdminCoupon } from "../../../../../services/adminSupabaseService";

const initialForm = {
  code: "",
  type: "Percent",
  value: "10",
  minOrder: "999",
  maxDiscount: "300",
  usageLimit: "500",
  audience: "All Customers",
  scope: "Marketplace",
  start: "2026-08-16",
  end: "2026-08-31",
  status: "Active",
};

function validateCoupon(form) {
  const errors = {};
  const value = Number(form.value);
  const minimumOrder = Number(form.minOrder);
  const maximumDiscount = Number(form.maxDiscount);
  const usageLimit = Number(form.usageLimit);

  if (!/^[A-Z0-9_-]{3,20}$/.test(form.code)) {
    errors.code = "Use 3–20 uppercase letters, numbers, hyphens, or underscores.";
  }
  if (!Number.isFinite(value) || value <= 0) {
    errors.value = "Discount value must be greater than zero.";
  } else if (form.type === "Percent" && value > 100) {
    errors.value = "Percentage discount cannot exceed 100%.";
  }
  if (!Number.isFinite(minimumOrder) || minimumOrder < 0) {
    errors.minOrder = "Minimum order must be zero or greater.";
  }
  if (!Number.isFinite(maximumDiscount) || maximumDiscount < 0) {
    errors.maxDiscount = "Maximum discount must be zero or greater.";
  }
  if (!Number.isInteger(usageLimit) || usageLimit < 1) {
    errors.usageLimit = "Usage limit must be a whole number greater than zero.";
  }
  if (!form.start) {
    errors.start = "Start date is required.";
  }
  if (!form.end) {
    errors.end = "End date is required.";
  } else if (form.start && form.end <= form.start) {
    errors.end = "End date must be after the start date.";
  }

  return errors;
}

export default function CouponFormPage() {
  const navigate = useNavigate();
  const { couponId } = useParams();
  const existingCoupon = coupons.find((coupon) => coupon.id === couponId);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!existingCoupon) {
      return;
    }

    setForm((current) => ({
      ...current,
      code: existingCoupon.code,
      type: existingCoupon.type,
      value: String(existingCoupon.value).replace(/[^\d.]/g, ""),
      minOrder: String(existingCoupon.minOrder).replace(/[^\d.]/g, ""),
      status: existingCoupon.status,
    }));
  }, [existingCoupon]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateCoupon(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      await saveAdminCoupon({
        id: couponId,
        code: form.code,
        type: form.type,
        value: form.value,
        minOrder: form.minOrder,
        status: form.status,
        end: form.end,
      });

      setToast(
        couponId
          ? "Coupon successfully updated in Supabase."
          : "Coupon successfully created in Supabase."
      );
      window.setTimeout(() => navigate("/admin/marketing/coupons"), 350);
    } catch {
      setToast("Error saving coupon to Supabase.");
    }
  }

  return (
    <div>
      <PageHeader
        title={couponId ? "Edit Coupon" : "Create Coupon"}
        description="Define discount value, eligibility, usage, and scheduling rules."
      />

      <Card className="max-w-4xl p-5 sm:p-6">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Coupon Code"
              value={form.code}
              error={errors.code}
              placeholder="SAVE100"
              onChange={(value) => updateField("code", value.toUpperCase())}
            />
            <SelectField
              label="Discount Type"
              value={form.type}
              options={["Percent", "Fixed"]}
              onChange={(value) => updateField("type", value)}
            />
            <Field
              label="Discount Value"
              type="number"
              value={form.value}
              error={errors.value}
              onChange={(value) => updateField("value", value)}
            />
            <Field
              label="Minimum Order"
              type="number"
              value={form.minOrder}
              error={errors.minOrder}
              onChange={(value) => updateField("minOrder", value)}
            />
            <Field
              label="Maximum Discount"
              type="number"
              value={form.maxDiscount}
              error={errors.maxDiscount}
              onChange={(value) => updateField("maxDiscount", value)}
            />
            <Field
              label="Usage Limit"
              type="number"
              value={form.usageLimit}
              error={errors.usageLimit}
              onChange={(value) => updateField("usageLimit", value)}
            />
            <SelectField
              label="Audience"
              value={form.audience}
              options={["All Customers", "New Customers", "High Value Customers"]}
              onChange={(value) => updateField("audience", value)}
            />
            <SelectField
              label="Applies To"
              value={form.scope}
              options={["Marketplace", "Specific Shop", "Category", "Product"]}
              onChange={(value) => updateField("scope", value)}
            />
            <Field
              label="Start Date"
              type="date"
              value={form.start}
              max={form.end || undefined}
              error={errors.start}
              onChange={(value) => updateField("start", value)}
            />
            <Field
              label="End Date"
              type="date"
              value={form.end}
              min={form.start || undefined}
              error={errors.end}
              onChange={(value) => updateField("end", value)}
            />
            <SelectField
              label="Status"
              value={form.status}
              options={["Active", "Scheduled", "Disabled"]}
              onChange={(value) => updateField("status", value)}
            />
          </div>

          <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/marketing/coupons")}
              className="min-h-11 rounded-lg border border-lightBorder px-4 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-11 rounded-lg bg-brandRed px-4 text-sm font-semibold text-white hover:bg-brandRedDark"
            >
              Save Coupon
            </button>
          </div>
        </form>
      </Card>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function Field({ label, error, onChange, type = "text", ...inputProps }) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {type === "date" ? (
        <AdminDatePicker value={inputProps.value} onChange={onChange} min={inputProps.min} max={inputProps.max} ariaLabel={label} placeholder={`Select ${label.toLowerCase()}`} buttonClassName="h-11 text-sm" />
      ) : (
        <input id={id} type={type} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="h-11 w-full rounded-lg border border-lightBorder px-3 text-sm outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10" {...inputProps} />
      )}
      {error && (
        <span id={`${id}-error`} className="mt-1 block text-xs font-semibold text-brandRed">
          {error}
        </span>
      )}
    </label>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <AdminSelect
        value={value}
        onChange={onChange}
        options={options}
        ariaLabel={label}
        buttonClassName="h-11 text-sm"
      />
    </label>
  );
}
