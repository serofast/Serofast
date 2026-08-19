import { useState } from "react";
import {
  Card,
  ConfirmDialog,
  Kpi,
  StatusBadge,
  Toast,
  ProgressCircle,
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

  const openCount = rows.filter((r) => r.status === "Open").length;
  const safetyScore = Math.max(10, 100 - openCount * 18);

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">Risk & Safety</h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Marketplace risk signals & threat mitigation center.
          </p>
        </div>
      </div>

      {/* Safety Score Gauge Diagram Card */}
      <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Marketplace Safety Health</span>
          <h3 className="text-2xl font-normal text-slate-900">{safetyScore >= 80 ? "Low Risk Status" : "Attention Required"}</h3>
          <p className="text-xs text-slate-500 font-normal">{openCount} active alerts pending operational resolution.</p>
        </div>

        <div className="flex items-center gap-6 bg-[#FAF8F5] p-4 rounded-[24px] border border-slate-100">
          <div className="text-center">
            <ProgressCircle percentage={safetyScore} size={64} color={safetyScore >= 80 ? "#059669" : "#D32F2F"} />
            <span className="text-[10px] text-slate-400 font-medium block mt-1">Safety Gauge</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Shield Protection: Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="text-slate-600">Threat Alerts: {openCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          ["Open Alerts", rows.filter((row) => row.status === "Open").length],
          ["High Risk", rows.filter((row) => row.score === "High").length],
          ["Critical", rows.filter((row) => row.score === "Critical").length],
          ["Investigating", rows.filter((row) => row.status === "Investigating").length],
          ["Blocked", rows.filter((row) => row.status === "Blocked").length],
        ].map(([label, value]) => (
          <Kpi key={label} label={label} value={value} change="Alerts" />
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
