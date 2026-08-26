import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminDatePicker, AdminSelect, Card, PageHeader, Toast } from "../../../shared/ui";
import { fetchAdminCampaigns, saveAdminCampaign } from "../../../../../services/adminSupabaseService";

const initialForm = {
  name: "",
  audience: "All Customers",
  budget: "",
  start: "2026-08-16",
  end: "2026-08-31",
  status: "Active",
};

function toInputDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export default function CampaignFormPage() {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadDbCampaign() {
      if (!campaignId) return;
      try {
        const list = await fetchAdminCampaigns();
        const found = (list || []).find((c) => String(c.id) === String(campaignId));
        if (found) {
          setForm({
            name: found.name || "",
            audience: found.audience || "All Customers",
            budget: String(found.budget || ""),
            start: toInputDate(found.starts_at),
            end: toInputDate(found.ends_at),
            status: found.status || "Active",
          });
        }
      } catch {}
    }
    loadDbCampaign();
  }, [campaignId]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    const budget = Number(form.budget);

    if (!form.name.trim()) {
      nextErrors.name = "Campaign name is required.";
    }
    if (!Number.isFinite(budget) || budget <= 0) {
      nextErrors.budget = "Budget must be greater than zero.";
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

    try {
      await saveAdminCampaign({
        id: campaignId,
        name: form.name,
        audience: form.audience,
        budget,
        status: form.status,
        starts_at: form.start,
        ends_at: form.end,
      });

      setToast(
        campaignId
          ? "Campaign updated in Supabase."
          : "Campaign created in Supabase."
      );
      window.setTimeout(() => navigate("/admin/marketing/campaigns"), 350);
    } catch {
      setToast("Error saving campaign to database.");
    }
  }

  return (
    <div className="font-sans font-sansation">
      <PageHeader
        title={campaignId ? "Edit Campaign" : "Create Campaign"}
        description="Configure the audience, budget, schedule, and live promotional campaigns in Supabase."
      />
      <Card className="max-w-3xl p-5 sm:p-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <ValidatedInput
            label="Campaign Name"
            value={form.name}
            error={errors.name}
            onChange={(value) => updateField("name", value)}
          />

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Audience</span>
            <AdminSelect
              value={form.audience}
              onChange={(value) => updateField("audience", value)}
              options={["All Customers", "Students", "New Customers", "High Value Customers"]}
              ariaLabel="Audience"
              buttonClassName="h-11 text-sm"
            />
          </label>

          <ValidatedInput
            label="Budget"
            type="number"
            min="1"
            value={form.budget}
            error={errors.budget}
            placeholder="25000"
            onChange={(value) => updateField("budget", value)}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <ValidatedInput
              label="Start Date"
              type="date"
              value={form.start}
              max={form.end || undefined}
              error={errors.start}
              onChange={(value) => updateField("start", value)}
            />
            <ValidatedInput
              label="End Date"
              type="date"
              value={form.end}
              min={form.start || undefined}
              error={errors.end}
              onChange={(value) => updateField("end", value)}
            />
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Status</span>
            <AdminSelect
              value={form.status}
              onChange={(value) => updateField("status", value)}
              options={["Draft", "Scheduled", "Active", "Paused"]}
              ariaLabel="Status"
              buttonClassName="h-11 text-sm"
            />
          </label>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/marketing/campaigns")}
              className="min-h-11 rounded-lg border border-lightBorder px-4 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-11 rounded-lg bg-brandRed px-4 text-sm font-semibold text-white hover:bg-brandRedDark"
            >
              Save Campaign
            </button>
          </div>
        </form>
      </Card>
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function ValidatedInput({ label, error, onChange, type = "text", ...props }) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {type === "date" ? (
        <AdminDatePicker
          value={props.value}
          onChange={onChange}
          min={props.min}
          max={props.max}
          ariaLabel={label}
          placeholder={`Select ${label.toLowerCase()}`}
          buttonClassName="h-11 text-sm"
        />
      ) : (
        <input
          id={id}
          type={type}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-11 w-full rounded-lg border border-lightBorder px-3 text-sm outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
          {...props}
        />
      )}
      {error && (
        <span id={`${id}-error`} className="mt-1 block text-xs font-semibold text-brandRed">
          {error}
        </span>
      )}
    </label>
  );
}
