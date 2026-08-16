import { useState } from "react";
import {
  Card,
  ConfirmDialog,
  Drawer,
  EmptyState,
  Kpi,
  PageHeader,
  StatusBadge,
  Toast,
} from "../../shared/ui";
import { withdrawals } from "../../shared/adminData";

const statuses = ["Pending", "Approved", "Processing", "Completed", "Rejected"];

export default function WithdrawalsPage() {
  const [rows, setRows] = useState(withdrawals);
  const [selected, setSelected] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [toast, setToast] = useState("");

  function requestAction(row, status) {
    setReason("");
    setReasonError("");
    setPendingAction({ row, status });
  }

  function confirmAction() {
    if (pendingAction.status === "Rejected" && !reason.trim()) {
      setReasonError("A rejection reason is required.");
      return;
    }

    setRows((current) =>
      current.map((row) =>
        row.id === pendingAction.row.id
          ? { ...row, status: pendingAction.status, reason: reason.trim() }
          : row,
      ),
    );
    setToast(`Withdrawal ${pendingAction.row.id} marked ${pendingAction.status.toLowerCase()}.`);
    setPendingAction(null);
  }

  return (
    <div>
      <PageHeader
        title="Withdrawals"
        description="Review, approve, reject, and monitor seller payout requests."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statuses.map((status) => (
          <Kpi
            key={status}
            label={status}
            value={rows.filter((row) => row.status === status).length}
            change={status === "Pending" ? "Needs review" : "Current requests"}
          />
        ))}
      </div>

      <Card className="mt-6 overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState title="No withdrawal requests" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] text-left">
              <thead className="bg-lightBackground">
                <tr>
                  {["Request", "Shop", "Owner", "Amount", "Method", "Status", "Actions"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-textMuted"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-lightBorder">
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-5 py-4 text-sm font-semibold">{row.id}</td>
                    <td className="px-5 py-4 text-sm">{row.shop}</td>
                    <td className="px-5 py-4 text-sm text-textSecondary">{row.owner}</td>
                    <td className="px-5 py-4 text-sm font-semibold">{row.amount}</td>
                    <td className="px-5 py-4 text-sm text-textSecondary">{row.method}</td>
                    <td className="px-5 py-4">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex min-w-max gap-2">
                        <button
                          type="button"
                          onClick={() => setSelected(row)}
                          className="min-h-10 rounded-lg border border-lightBorder px-3 text-xs font-semibold"
                        >
                          Review
                        </button>
                        {row.status === "Pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => requestAction(row, "Approved")}
                              className="min-h-10 rounded-lg bg-brandRed px-3 text-xs font-semibold text-white"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => requestAction(row, "Rejected")}
                              className="min-h-10 rounded-lg border border-lightBorder px-3 text-xs font-semibold"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Withdrawal review"
      >
        <div className="space-y-4">
          {selected &&
            Object.entries(selected).map(([key, value]) => (
              <div
                key={key}
                className="flex items-start justify-between gap-5 border-b border-lightBorder pb-3 text-sm"
              >
                <span className="capitalize text-textMuted">{key}</span>
                <span className="text-right font-semibold">{String(value)}</span>
              </div>
            ))}
          <div className="rounded-xl bg-promoHighlight p-4 text-sm text-textSecondary">
            Bank details are intentionally masked in Phase 4. Production access must
            be permission-controlled and audited by the backend.
          </div>
        </div>
      </Drawer>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={`${pendingAction?.status} withdrawal`}
        description={`${pendingAction?.row?.id ?? "This request"} for ${pendingAction?.row?.amount ?? ""} will be marked ${pendingAction?.status?.toLowerCase() ?? ""}.`}
        confirmLabel={pendingAction?.status === "Approved" ? "Approve withdrawal" : "Reject withdrawal"}
        tone={pendingAction?.status === "Approved" ? "success" : "danger"}
        onConfirm={confirmAction}
        onClose={() => setPendingAction(null)}
      >
        {pendingAction?.status === "Rejected" && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Rejection reason</span>
            <textarea
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                setReasonError("");
              }}
              rows={3}
              aria-invalid={Boolean(reasonError)}
              className="w-full rounded-lg border border-lightBorder p-3 text-sm outline-none focus:border-brandRed"
            />
            {reasonError && (
              <span className="mt-1 block text-xs font-semibold text-brandRed">
                {reasonError}
              </span>
            )}
          </label>
        )}
      </ConfirmDialog>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
