import { useState, useEffect } from "react";
import { Card, Kpi, PageHeader, Toast } from "../../shared/ui";
import {
  fetchAdminCommissionRules,
  saveAdminCommissionRule,
  subscribeAdminRealtime,
} from "../../../../services/adminSupabaseService";

const initialRules = [
  { id: "COM-01", scope: "Category", name: "Fashion", rate: 8 },
  { id: "COM-02", scope: "Category", name: "Electronics", rate: 9 },
  { id: "COM-03", scope: "Shop", name: "Urban Styles", rate: 6 },
  { id: "COM-04", scope: "Promotion", name: "Seller Launch Offer", rate: 4 },
];

export default function CommissionsPage() {
  const [defaultRate, setDefaultRate] = useState("10");
  const [rules, setRules] = useState(initialRules);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadRules() {
      const data = await fetchAdminCommissionRules();
      if (data && data.length > 0) {
        const defaultRule = data.find((r) => r.scope === "Default");
        if (defaultRule) {
          setDefaultRate(String(defaultRule.rate_percentage));
        }
        const overrides = data
          .filter((r) => r.scope !== "Default")
          .map((r) => ({
            id: r.id,
            scope: r.scope,
            name: r.scope_name,
            rate: Number(r.rate_percentage),
          }));
        if (overrides.length > 0) {
          setRules(overrides);
        }
      }
    }

    loadRules();
    const unsub = subscribeAdminRealtime("commission_rules", () => loadRules());
    return () => unsub();
  }, []);

  function validateRate(value) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0 || number > 100) {
      return "Commission must be between 0 and 100%.";
    }
    return "";
  }

  async function saveDefaultRate() {
    const nextError = validateRate(defaultRate);
    setError(nextError);
    if (!nextError) {
      try {
        await saveAdminCommissionRule("DEFAULT_RULE", Number(defaultRate));
        setToast(`Default commission updated to ${defaultRate}% in Supabase.`);
      } catch {
        setToast("Failed to save default commission in Supabase.");
      }
    }
  }

  async function updateRule(id, value) {
    if (validateRate(value)) {
      return;
    }

    await saveAdminCommissionRule(id, value);
    setRules((current) =>
      current.map((rule) =>
        rule.id === id ? { ...rule, rate: Number(value) } : rule
      )
    );
    setToast("Commission override updated in Supabase.");
  }

  return (
    <div className="space-y-6 font-sans font-sansation">
      <PageHeader
        title="Commissions & Platform Fees"
        description="Manage marketplace default commission rate and category, shop, or promotional overrides."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Kpi label="Gross Marketplace Sales" value="₹12.48L" change="+12.4%" />
        <Kpi label="Platform Commission" value="₹1.24L" change="+8.4%" />
        <Kpi label="Seller Earnings" value="₹11.24L" change="+10.2%" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(280px,.7fr)_1fr]">
        <Card className="p-5 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900">Default commission</h2>
          <p className="mt-1 text-xs text-slate-500">
            Applied when no category, shop, or promotional override exists.
          </p>
          <label className="mt-5 block">
            <span className="mb-1.5 block text-xs font-semibold">Rate (%)</span>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={defaultRate}
                onChange={(event) => {
                  setDefaultRate(event.target.value);
                  setError("");
                }}
                aria-invalid={Boolean(error)}
                className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brandRed"
              />
              <button
                type="button"
                onClick={saveDefaultRate}
                className="rounded-xl bg-brandRed px-4 text-xs font-semibold text-white hover:bg-brandRed/90"
              >
                Save
              </button>
            </div>
          </label>
          {error && (
            <p className="mt-2 text-xs font-semibold text-brandRed">
              {error}
            </p>
          )}
          <p className="mt-4 rounded-xl bg-[#FAF8F5] border p-3 text-xs text-slate-600">
            At {defaultRate || 0}%, a ₹1,000 net order yields ₹
            {(1000 * (1 - (Number(defaultRate) || 0) / 100)).toFixed(0)} to the seller.
          </p>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-base font-semibold text-slate-900">Commission overrides</h2>
            <p className="mt-1 text-xs text-slate-500">
              More specific rules take precedence over the marketplace default.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{rule.name}</p>
                  <p className="text-xs text-slate-400">{rule.scope} override</p>
                </div>
                <label className="flex items-center gap-2">
                  <span className="sr-only">Commission for {rule.name}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={rule.rate}
                    onBlur={(event) => updateRule(rule.id, event.target.value)}
                    className="h-9 w-20 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-brandRed"
                  />
                  <span className="font-semibold text-xs text-slate-700">%</span>
                </label>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
