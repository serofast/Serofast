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
    <div>
      <PageHeader
        title="Risk & Fraud"
        description="Review frontend risk signals. Actual detection and enforcement belong to backend security services."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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

      <Card className="overflow-hidden">
        <div className="divide-y divide-lightBorder">
          {rows.map((row) => (
            <article
              key={row.id}
              className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="font-semibold">{row.type}</p>
                <p className="mt-1 text-sm text-textSecondary">{row.entity}</p>
                <p className="mt-1 text-xs text-textMuted">{row.time}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge value={row.score} />
                <StatusBadge value={row.status} />
                <button
                  type="button"
                  onClick={() => updateAlert(row.id, "Investigating")}
                  className="min-h-10 rounded-lg border border-lightBorder px-3 text-xs font-semibold"
                >
                  Investigate
                </button>
                <button
                  type="button"
                  onClick={() => setPendingAction({ row, status: "Dismissed" })}
                  className="min-h-10 rounded-lg border border-lightBorder px-3 text-xs font-semibold"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => setPendingAction({ row, status: "Blocked" })}
                  className="min-h-10 rounded-lg bg-brandRed px-3 text-xs font-semibold text-white"
                >
                  Block
                </button>
              </div>
            </article>
          ))}
        </div>
      </Card>

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
