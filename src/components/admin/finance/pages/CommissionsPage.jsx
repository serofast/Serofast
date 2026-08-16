import { useState } from "react";
import { Card, Kpi, PageHeader, Toast } from "../../shared/ui";

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

  function validateRate(value) {
    const number = Number(value);

    if (!Number.isFinite(number) || number < 0 || number > 100) {
      return "Commission must be between 0 and 100%.";
    }

    return "";
  }

  function saveDefaultRate() {
    const nextError = validateRate(defaultRate);
    setError(nextError);

    if (!nextError) {
      setToast(`Default commission updated to ${defaultRate}%.`);
    }
  }

  function updateRule(id, value) {
    if (validateRate(value)) {
      return;
    }

    setRules((current) =>
      current.map((rule) =>
        rule.id === id ? { ...rule, rate: Number(value) } : rule,
      ),
    );
    setToast("Commission override updated.");
  }

  return (
    <div>
      <PageHeader
        title="Commissions"
        description="Manage marketplace defaults and category, shop, or promotional overrides."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Kpi label="Gross Marketplace Sales" value="₹12.48L" change="+12.4%" />
        <Kpi label="Platform Commission" value="₹1.24L" change="+8.4%" />
        <Kpi label="Seller Earnings" value="₹11.24L" change="+10.2%" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(280px,.7fr)_1fr]">
        <Card className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Default commission</h2>
          <p className="mt-1 text-sm text-textSecondary">
            Applied when no category, shop, or promotional override exists.
          </p>
          <label className="mt-5 block">
            <span className="mb-1.5 block text-sm font-semibold">Rate (%)</span>
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
                aria-describedby="commission-error commission-impact"
                className="h-11 min-w-0 flex-1 rounded-lg border border-lightBorder px-3 text-sm outline-none focus:border-brandRed"
              />
              <button
                type="button"
                onClick={saveDefaultRate}
                className="rounded-lg bg-brandRed px-4 text-sm font-semibold text-white hover:bg-brandRedDark"
              >
                Save
              </button>
            </div>
          </label>
          {error && (
            <p id="commission-error" className="mt-2 text-xs font-semibold text-brandRed">
              {error}
            </p>
          )}
          <p id="commission-impact" className="mt-4 rounded-xl bg-promoHighlight p-3 text-sm text-textSecondary">
            At {defaultRate || 0}%, a ₹1,000 net order yields ₹
            {(1000 * (1 - (Number(defaultRate) || 0) / 100)).toFixed(0)} to the seller.
          </p>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-lightBorder p-5">
            <h2 className="text-lg font-semibold">Commission overrides</h2>
            <p className="mt-1 text-sm text-textSecondary">
              More specific rules take precedence over the marketplace default.
            </p>
          </div>
          <div className="divide-y divide-lightBorder">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">{rule.name}</p>
                  <p className="text-xs text-textMuted">{rule.scope} override</p>
                </div>
                <label className="flex items-center gap-2">
                  <span className="sr-only">Commission for {rule.name}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={rule.rate}
                    onBlur={(event) => updateRule(rule.id, event.target.value)}
                    className="h-10 w-24 rounded-lg border border-lightBorder px-3 text-sm"
                  />
                  <span className="font-semibold">%</span>
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
