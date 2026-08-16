import { useState } from "react";
import { Card, PageHeader, Tabs, Toast } from "../../../shared/ui";

const groups = [
  "General",
  "Marketplace",
  "Payments",
  "Orders",
  "Delivery",
  "Taxes",
  "Commission",
  "Notifications",
  "Security",
  "Integrations",
];

const settingsByGroup = {
  General: [
    { id: "platformName", label: "Platform name", type: "text", value: "SeroFast" },
    { id: "currency", label: "Currency", type: "text", value: "INR" },
  ],
  Marketplace: [
    { id: "maintenance", label: "Marketplace maintenance mode", type: "toggle", value: false },
    { id: "registrationFee", label: "Shop registration fee", type: "number", value: "499" },
  ],
  Payments: [
    { id: "automaticPayouts", label: "Automatic seller payouts", type: "toggle", value: true },
  ],
  Orders: [
    { id: "returnWindow", label: "Return window (days)", type: "number", value: "7" },
  ],
  Delivery: [
    { id: "deliverySla", label: "Default delivery SLA (days)", type: "number", value: "5" },
  ],
  Taxes: [
    { id: "taxInclusive", label: "Prices include applicable tax", type: "toggle", value: true },
  ],
  Commission: [
    { id: "commission", label: "Default commission (%)", type: "number", value: "10" },
  ],
  Notifications: [
    { id: "adminAlerts", label: "Send operational Admin alerts", type: "toggle", value: true },
  ],
  Security: [
    { id: "twoFactor", label: "Require two-factor authentication", type: "toggle", value: true },
  ],
  Integrations: [
    { id: "integrationStatus", label: "Integration mode", type: "text", value: "Phase 4 frontend only" },
  ],
};

export default function SettingsPage() {
  const [activeGroup, setActiveGroup] = useState("General");
  const [settings, setSettings] = useState(settingsByGroup);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");
  const rows = settings[activeGroup];

  function updateSetting(id, value) {
    setSettings((current) => ({
      ...current,
      [activeGroup]: current[activeGroup].map((setting) =>
        setting.id === id ? { ...setting, value } : setting,
      ),
    }));
    setErrors((current) => ({ ...current, [id]: "" }));
  }

  function saveSettings() {
    const nextErrors = {};

    rows.forEach((setting) => {
      if (setting.type === "text" && !String(setting.value).trim()) {
        nextErrors[setting.id] = `${setting.label} is required.`;
      }
      if (setting.type === "number") {
        const value = Number(setting.value);
        if (!Number.isFinite(value) || value < 0) {
          nextErrors[setting.id] = `${setting.label} must be zero or greater.`;
        }
        if (setting.id === "commission" && value > 100) {
          nextErrors[setting.id] = "Commission must be between 0 and 100%.";
        }
      }
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setToast(`${activeGroup} settings saved locally.`);
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure marketplace defaults without exposing secret credentials in the browser."
      />

      <Card className="min-w-0 overflow-hidden">
        <Tabs tabs={groups} activeTab={activeGroup} onChange={setActiveGroup} />
        <div className="space-y-4 p-5 sm:p-6">
          {rows.map((setting) => (
            <div
              key={setting.id}
              className="flex flex-col gap-3 rounded-xl border border-lightBorder p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">{setting.label}</p>
                <p className="mt-1 text-xs text-textMuted">{activeGroup} setting</p>
              </div>
              {setting.type === "toggle" ? (
                <button
                  type="button"
                  role="switch"
                  aria-checked={setting.value}
                  aria-label={setting.label}
                  onClick={() => updateSetting(setting.id, !setting.value)}
                  className={`relative h-8 w-14 rounded-full ${setting.value ? "bg-brandRed" : "bg-slate-300"}`}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${setting.value ? "left-7" : "left-1"}`}
                  />
                </button>
              ) : (
                <label className="w-full sm:max-w-xs">
                  <span className="sr-only">{setting.label}</span>
                  <input
                    type={setting.type}
                    value={setting.value}
                    onChange={(event) => updateSetting(setting.id, event.target.value)}
                    aria-invalid={Boolean(errors[setting.id])}
                    className="h-11 w-full rounded-lg border border-lightBorder px-3 text-sm outline-none focus:border-brandRed"
                  />
                  {errors[setting.id] && (
                    <span className="mt-1 block text-xs font-semibold text-brandRed">
                      {errors[setting.id]}
                    </span>
                  )}
                </label>
              )}
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={saveSettings}
              className="min-h-11 rounded-lg bg-brandRed px-5 text-sm font-semibold text-white hover:bg-brandRedDark"
            >
              Save {activeGroup}
            </button>
          </div>
        </div>
      </Card>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
