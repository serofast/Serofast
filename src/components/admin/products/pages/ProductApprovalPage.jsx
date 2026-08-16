import { useState } from "react";
import { Check, X } from "lucide-react";
import {
  Card,
  ConfirmDialog,
  EmptyState,
  PageHeader,
  StatusBadge,
  Toast,
} from "../../shared/ui";
import { productApprovals } from "../../shared/adminData";

export default function ProductApprovalPage() {
  const [rows, setRows] = useState(productApprovals);
  const [pendingAction, setPendingAction] = useState(null);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [toast, setToast] = useState("");

  function requestAction(product, status) {
    setReason("");
    setReasonError("");
    setPendingAction({ product, status });
  }

  function confirmAction() {
    if (pendingAction.status === "Rejected" && !reason.trim()) {
      setReasonError("A rejection reason is required.");
      return;
    }

    setRows((current) =>
      current.filter((item) => item.id !== pendingAction.product.id),
    );
    setToast(`${pendingAction.product.name} ${pendingAction.status.toLowerCase()}.`);
    setPendingAction(null);
  }

  return (
    <div>
      <PageHeader
        title="Product Approval Queue"
        description="Review catalog submissions before products become active marketplace inventory."
      />
      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState
            title="Product queue is clear"
            description="There are no catalog submissions waiting for moderation."
          />
        ) : (
          <div className="divide-y divide-lightBorder">
            {rows.map((product) => (
              <article
                key={product.id}
                className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-semibold">{product.name}</h2>
                    <StatusBadge value="Pending" />
                  </div>
                  <p className="mt-1 text-sm text-textSecondary">
                    {product.shop} · {product.category} · {product.price}
                  </p>
                  <p className="mt-1 text-xs text-textMuted">
                    Submitted {product.submitted}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => requestAction(product, "Rejected")}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-lightBorder px-3 text-xs font-semibold"
                  >
                    <X size={15} /> Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => requestAction(product, "Approved")}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-brandRed px-3 text-xs font-semibold text-white"
                  >
                    <Check size={15} /> Approve
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={`${pendingAction?.status} product`}
        description={`${pendingAction?.product?.name ?? "This product"} will leave the approval queue.`}
        confirmLabel={`Confirm ${pendingAction?.status ?? "decision"}`}
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
              className="w-full rounded-lg border border-lightBorder p-3 text-sm"
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
