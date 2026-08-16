import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, PageHeader, Toast } from "../../../shared/ui";

const initialForm = {
  title: "",
  placement: "Hero",
  priority: "1",
  cta: "Shop now",
  targetUrl: "/",
  start: "2026-08-16",
  end: "2026-08-31",
  status: "Scheduled",
};

function isValidTarget(value) {
  if (value.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

export default function BannerFormPage() {
  const navigate = useNavigate();
  const { bannerId } = useParams();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");
  const [toast, setToast] = useState("");

  useEffect(
    () => () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl],
  );

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
    setErrors((current) => ({ ...current, image: "" }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    const priority = Number(form.priority);

    if (!form.title.trim()) {
      nextErrors.title = "Banner title is required.";
    }
    if (!Number.isInteger(priority) || priority < 1) {
      nextErrors.priority = "Priority must be a whole number greater than zero.";
    }
    if (!form.cta.trim()) {
      nextErrors.cta = "CTA label is required.";
    }
    if (!isValidTarget(form.targetUrl)) {
      nextErrors.targetUrl = "Use a valid https:// URL or an internal /path.";
    }
    if (!bannerId && !previewUrl) {
      nextErrors.image = "Select an image for the new banner.";
    }
    if (!form.start) {
      nextErrors.start = "Start date is required.";
    }
    if (!form.end) {
      nextErrors.end = "End date is required.";
    } else if (form.start && form.end <= form.start) {
      nextErrors.end = "End date must be after the start date.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setToast(bannerId ? "Banner updated." : "Banner created in local Admin state.");
  }

  return (
    <div>
      <PageHeader
        title={bannerId ? "Edit Banner" : "Create Banner"}
        description="Configure banner media, placement, priority, destination, and schedule."
      />

      <Card className="max-w-4xl p-5 sm:p-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Title"
              value={form.title}
              error={errors.title}
              onChange={(value) => updateField("title", value)}
            />
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Placement</span>
              <select
                value={form.placement}
                onChange={(event) => updateField("placement", event.target.value)}
                className="h-11 w-full rounded-lg border border-lightBorder bg-white px-3 text-sm"
              >
                {["Hero", "Promotion", "Category", "Homepage"].map((placement) => (
                  <option key={placement}>{placement}</option>
                ))}
              </select>
            </label>
            <InputField
              label="Priority"
              type="number"
              min="1"
              value={form.priority}
              error={errors.priority}
              onChange={(value) => updateField("priority", value)}
            />
            <InputField
              label="CTA Label"
              value={form.cta}
              error={errors.cta}
              onChange={(value) => updateField("cta", value)}
            />
            <div className="sm:col-span-2">
              <InputField
                label="Target URL"
                value={form.targetUrl}
                error={errors.targetUrl}
                placeholder="/products or https://example.com"
                onChange={(value) => updateField("targetUrl", value)}
              />
            </div>
            <InputField
              label="Start Date"
              type="date"
              value={form.start}
              error={errors.start}
              onChange={(value) => updateField("start", value)}
            />
            <InputField
              label="End Date"
              type="date"
              value={form.end}
              error={errors.end}
              onChange={(value) => updateField("end", value)}
            />
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Banner Image</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              aria-invalid={Boolean(errors.image)}
              className="block min-h-12 w-full rounded-lg border border-dashed border-lightBorder p-3 text-sm"
            />
            {errors.image && (
              <span className="mt-1 block text-xs font-semibold text-brandRed">
                {errors.image}
              </span>
            )}
          </label>

          {previewUrl && (
            <div>
              <p className="mb-2 text-sm font-semibold">Image preview</p>
              <img
                src={previewUrl}
                alt="Selected banner preview"
                className="aspect-[16/6] w-full rounded-xl border border-lightBorder object-cover"
              />
            </div>
          )}

          <label className="block max-w-xs">
            <span className="mb-1.5 block text-sm font-semibold">Status</span>
            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              className="h-11 w-full rounded-lg border border-lightBorder bg-white px-3 text-sm"
            >
              {["Draft", "Scheduled", "Active", "Disabled"].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/marketing/banners")}
              className="min-h-11 rounded-lg border border-lightBorder px-4 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-11 rounded-lg bg-brandRed px-4 text-sm font-semibold text-white hover:bg-brandRedDark"
            >
              Save Banner
            </button>
          </div>
        </form>
      </Card>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function InputField({ label, error, onChange, type = "text", ...props }) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <input
        id={id}
        type={type}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className="h-11 w-full rounded-lg border border-lightBorder px-3 text-sm outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
        {...props}
      />
      {error && (
        <span className="mt-1 block text-xs font-semibold text-brandRed">
          {error}
        </span>
      )}
    </label>
  );
}
