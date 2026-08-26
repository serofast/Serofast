import { useMemo, useState, useEffect } from "react";
import { Check, FileCheck2, MessageSquareWarning, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  ConfirmDialog,
  EmptyState,
  Kpi,
  PageHeader,
  StatusBadge,
  Toast,
} from "../../shared/ui";
import { fetchAdminShops, updateShopStatusInSupabase, subscribeToAdminTableChanges } from "../../../../lib/supabase";
import { shops as shopSeed } from "../../shared/adminData";

const fallbackApprovals = shopSeed
  .filter((shop) => shop.status === "Pending")
  .map((shop) => ({
    id: shop.id,
    name: shop.shop,
    owner: shop.owner,
    category: shop.category,
    verification: "Business & Bank submitted",
    submitted: shop.joined,
    status: "Pending",
  }));

export default function ShopApprovalPage() {
  const [rows, setRows] = useState(fallbackApprovals);
  const [pendingAction, setPendingAction] = useState(null);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadShops() {
      const dbShops = await fetchAdminShops();
      if (dbShops?.length) {
        const pending = dbShops
          .filter((s) => s.status === "pending_review" || s.status === "draft" || s.status === "pending")
          .map((s) => ({
            id: s.id,
            name: s.name || "Untitled Shop",
            owner: s.owner_name || s.shop_owners?.full_name || "Shop Owner",
            category: s.category_id || "Fashion",
            verification: "Business & Bank submitted",
            submitted: new Date(s.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
            status: s.status,
          }));
        setRows(pending.length ? pending : fallbackApprovals);
      } else {
        setRows(fallbackApprovals);
      }
    }

    loadShops();
    const unsubscribe = subscribeToAdminTableChanges("shops", () => {
      loadShops();
    });

    return () => unsubscribe();
  }, []);

  const stats = useMemo(
    () => [
      ["Pending", rows.length],
      ["Identity pending", rows.filter((row) => row.verification.includes("Identity")).length],
      ["Business pending", rows.filter((row) => row.verification.includes("Business")).length],
      ["Bank pending", rows.filter((row) => row.verification.includes("Bank")).length],
      ["Ready for review", rows.filter((row) => row.verification.includes("submitted")).length],
    ],
    [rows],
  );

  function requestAction(shop, status) {
    setReason("");
    setReasonError("");
    setPendingAction({ shop, status });
  }

  async function confirmAction() {
    if (pendingAction.status !== "Active" && !reason.trim()) {
      setReasonError("Explain why this application cannot be approved yet.");
      return;
    }

    const newStatus = pendingAction.status === "Active" ? "active" : "rejected";
    await updateShopStatusInSupabase(pendingAction.shop.id, newStatus);

    setRows((current) => current.filter((item) => item.id !== pendingAction.shop.id));
    setToast(
      pendingAction.status === "Active"
        ? `${pendingAction.shop.name} approved.`
        : `${pendingAction.shop.name} marked ${pendingAction.status.toLowerCase()}.`,
    );
    setPendingAction(null);
  }

  return (
    <div>
      <PageHeader
        title="Shop Approval Queue"
        description="Review seller applications, documents, verification, and business information."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {stats.map(([label, value]) => (
          <Kpi key={label} label={label} value={value} change="Current queue" />
        ))}
      </div>

      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState
            title="Approval queue is clear"
            description="There are no seller applications waiting for review."
          />
        ) : (
          <div className="divide-y divide-lightBorder">
            {rows.map((shop) => (
              <article
                key={shop.id}
                className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-semibold">{shop.name}</h2>
                    <StatusBadge value="Pending" />
                  </div>
                  <p className="mt-1 text-sm text-textSecondary">
                    {shop.owner} · {shop.category}
                  </p>
                  <p className="mt-1 text-xs text-textMuted">
                    {shop.verification} · Submitted {shop.submitted}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/shops/${shop.id}`)}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-lightBorder px-3 text-xs font-semibold"
                  >
                    <FileCheck2 size={15} /> Review
                  </button>
                  <button
                    type="button"
                    onClick={() => requestAction(shop, "Changes Requested")}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-lightBorder px-3 text-xs font-semibold"
                  >
                    <MessageSquareWarning size={15} /> Request changes
                  </button>
                  <button
                    type="button"
                    onClick={() => requestAction(shop, "Rejected")}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-lightBorder px-3 text-xs font-semibold hover:border-brandRed hover:text-brandRed"
                  >
                    <X size={15} /> Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => requestAction(shop, "Active")}
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
        title={`${pendingAction?.status === "Active" ? "Approve" : pendingAction?.status} shop`}
        description={`${pendingAction?.shop?.name ?? "This shop"} will leave the pending queue.`}
        confirmLabel={pendingAction?.status === "Active" ? "Approve shop" : "Confirm decision"}
        tone={pendingAction?.status === "Active" ? "success" : "danger"}
        onConfirm={confirmAction}
        onClose={() => setPendingAction(null)}
      >
        {pendingAction?.status !== "Active" && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Reason</span>
            <textarea
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                setReasonError("");
              }}
              rows={4}
              aria-invalid={Boolean(reasonError)}
              placeholder="Provide a clear reason for the seller."
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
