import { useState } from "react";
import {
  Card,
  ConfirmDialog,
  Kpi,
  PageHeader,
  StatusBadge,
  Toast,
} from "../../shared/ui";
import { riskAlerts as seed } from "../../shared/adminData";

export default function RiskDashboardPage() {
  const [rows, setRows] = useState(seed);
  const [pendingAction, setPendingAction] = useState(null);
  const [toast, setToast] = useState("");

  function updateAlert(id, status) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, status } : row)),
    );
    setToast(`Risk alert marked ${status.toLowerCase()}.`);
  }

  function confirmAction() {
    updateAlert(pendingAction.row.id, pendingAction.status);
    setPendingAction(null);
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">Risk & Fraud</h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Review frontend risk signals. Actual detection and enforcement belong to backend security services.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          ["Open Alerts", rows.filter((row) => row.status === "Open").length],
          ["High Risk", rows.filter((row) => row.score === "High").length],
          ["Critical", rows.filter((row) => row.score === "Critical").length],
          ["Investigating", rows.filter((row) => row.status === "Investigating").length],
          ["Blocked", rows.filter((row) => row.status === "Blocked").length],
        ].map(([label, value]) => (
          <Kpi key={label} label={label} value={value} change="Current alerts" />
        ))}
      </div>

      <div className="rounded-[35px] bg-white border border-[#F3E5E5] shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] overflow-hidden">
        <div className="divide-y divide-slate-100">
          {rows.map((row) => (
            <article
              key={row.id}
              className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="text-xs font-medium text-slate-900">{row.type}</p>
                <p className="mt-1 text-[11px] text-slate-600 font-normal">{row.entity}</p>
                <p className="mt-1 text-[11px] text-slate-500 font-normal">{row.time}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge value={row.score} />
                <StatusBadge value={row.status} />
                <button
                  type="button"
                  onClick={() => updateAlert(row.id, "Investigating")}
                  className="flex h-9 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-[11px] font-medium text-slate-600 hover:border-brandRed transition cursor-pointer"
                >
                  Investigate
                </button>
                <button
                  type="button"
                  onClick={() => setPendingAction({ row, status: "Dismissed" })}
                  className="flex h-9 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-[11px] font-medium text-slate-600 hover:border-brandRed transition cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => setPendingAction({ row, status: "Blocked" })}
                  className="flex h-9 items-center justify-center rounded-[30px] bg-brandRed px-4 text-[11px] font-semibold text-white shadow-[0_4px_12px_rgba(211,47,47,0.3)] hover:bg-brandRedDark transition cursor-pointer"
                >
                  Block
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={`${pendingAction?.status} risk entity`}
        description={`${pendingAction?.row?.entity ?? "This entity"} will be marked ${pendingAction?.status?.toLowerCase() ?? ""} in local Admin state.`}
        confirmLabel={`Confirm ${pendingAction?.status ?? "action"}`}
        tone="danger"
        onConfirm={confirmAction}
        onClose={() => setPendingAction(null)}
      />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
