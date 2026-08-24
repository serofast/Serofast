import { useState, useEffect } from "react";
import { Card, PageHeader, Tabs, Toast } from "../../../shared/ui";
import {
  saveAdminSystemSetting,
  fetchAdminSystemSettings,
  subscribeAdminRealtime,
} from "../../../../../services/adminSupabaseService";

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
    { id: "integrationStatus", label: "Integration mode", type: "text", value: "Supabase Integrated" },
  ],
};

export default function SettingsPage() {
  const [activeGroup, setActiveGroup] = useState("General");
  const [settings, setSettings] = useState(settingsByGroup);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState("");
  const rows = settings[activeGroup];

  useEffect(() => {
    async function loadSettings() {
      const data = await fetchAdminSystemSettings();
      if (data && data.length > 0) {
        // Map database settings
      }
    }
    loadSettings();
    const unsub = subscribeAdminRealtime("system_settings", () => loadSettings());
    return () => unsub();
  }, []);

  function updateSetting(id, value) {
    setSettings((current) => ({
      ...current,
      [activeGroup]: current[activeGroup].map((setting) =>
        setting.id === id ? { ...setting, value } : setting,
      ),
    }));
    setErrors((current) => ({ ...current, [id]: "" }));
  }

  async function saveSettings() {
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
      for (const setting of rows) {
        await saveAdminSystemSetting(setting.id, setting.value);
      }
      setToast(`${activeGroup} settings saved in Supabase.`);
    }
  }

  return (
    <div className="min-w-0 space-y-6 pb-6 font-sans font-sansation animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          Settings
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Configure marketplace defaults without exposing secret credentials in the browser.
        </p>
      </div>

      <div className="rounded-[35px] bg-white border border-[#F3E5E5] shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] overflow-hidden">
        <Tabs tabs={groups} activeTab={activeGroup} onChange={setActiveGroup} />
        <div className="space-y-3 p-5 sm:p-6">
          {rows.map((setting) => (
            <div
              key={setting.id}
              className="flex flex-col gap-3 rounded-[24px] border border-[#F3E5E5] bg-[#FAF8F5] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs font-medium text-slate-800">{setting.label}</p>
                <p className="mt-0.5 text-[11px] text-slate-500 font-normal">{activeGroup} setting</p>
              </div>
              {setting.type === "toggle" ? (
                <button
                  type="button"
                  role="switch"
                  aria-checked={setting.value}
                  aria-label={setting.label}
                  onClick={() => updateSetting(setting.id, !setting.value)}
                  className={`relative h-8 w-14 rounded-full transition cursor-pointer ${setting.value ? "bg-brandRed" : "bg-slate-300"}`}
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
                    className="h-10 w-full rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs outline-none focus:border-brandRed"
                  />
                  {errors[setting.id] && (
                    <span className="mt-1 block text-[11px] font-medium text-brandRed">
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
              className="flex h-10 items-center justify-center gap-1.5 rounded-[30px] bg-brandRed px-5 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer"
            >
              Save {activeGroup}
            </button>
          </div>
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
