import { useState } from "react";
import { Check, Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, ConfirmDialog, EmptyState, PageHeader, StatusBadge, Toast } from "../../shared/ui";
import { useProducts } from "../hooks/useProducts";
import { productService } from "../services/productService";

export default function ProductApprovalPage() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const rows = products.filter((product) => product.approvalStatus === "Pending Approval");
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
    try {
      productService.review(pendingAction.product.id, pendingAction.status, reason);
      setToast(`${pendingAction.product.name} ${pendingAction.status.toLowerCase()} in local approval history.`);
      setPendingAction(null);
    } catch (error) {
      setReasonError(error.message);
    }
  }

  return (
    <div>
      <PageHeader title="Product Approval Queue" description="Review local catalog submissions before products become active marketplace inventory." />
      <div className="mb-4 rounded-[24px] border border-[#F3E5E5] bg-[#FAF8F5] p-4 text-[11px] text-slate-500">Approval decisions in this phase are stored locally. They do not publish data to Supabase or another production backend.</div>
      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState title="Product queue is clear" description="There are no catalog submissions waiting for moderation." />
        ) : (
          <div className="divide-y divide-lightBorder">
            {rows.map((product) => (
              <article key={product.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <img src={product.images[0]?.url} alt="" className="h-14 w-14 rounded-2xl object-cover" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3"><h2 className="truncate font-semibold">{product.name}</h2><StatusBadge value="Pending Approval" /></div>
                    <p className="mt-1 text-sm text-textSecondary">{product.shopName} · {product.categoryName} · ₹{Number(product.price).toLocaleString("en-IN")}</p>
                    <p className="mt-1 text-xs text-textMuted">Submitted {new Date(product.updatedAt).toLocaleString("en-IN")} · SKU {product.sku}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => navigate(`/admin/products/${product.id}`)} className="inline-flex min-h-10 items-center gap-2 rounded-[30px] border border-lightBorder px-3 text-xs font-semibold"><Eye size={15} /> View</button>
                  <button type="button" onClick={() => requestAction(product, "Rejected")} className="inline-flex min-h-10 items-center gap-2 rounded-[30px] border border-lightBorder px-3 text-xs font-semibold"><X size={15} /> Reject</button>
                  <button type="button" onClick={() => requestAction(product, "Approved")} className="inline-flex min-h-10 items-center gap-2 rounded-[30px] bg-brandRed px-3 text-xs font-semibold text-white"><Check size={15} /> Approve</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog open={Boolean(pendingAction)} title={`${pendingAction?.status ?? "Review"} product`} description={`${pendingAction?.product?.name ?? "This product"} will be recorded as ${pendingAction?.status?.toLowerCase() ?? "reviewed"}.`} confirmLabel={`Confirm ${pendingAction?.status ?? "decision"}`} tone={pendingAction?.status === "Approved" ? "success" : "danger"} onConfirm={confirmAction} onClose={() => setPendingAction(null)}>
        {pendingAction?.status === "Rejected" && <label className="block"><span className="mb-1.5 block text-sm font-semibold">Rejection reason</span><textarea value={reason} onChange={(event) => { setReason(event.target.value); setReasonError(""); }} rows={3} aria-invalid={Boolean(reasonError)} className="w-full rounded-[20px] border border-lightBorder p-3 text-sm outline-none focus:border-brandRed" />{reasonError && <span className="mt-1 block text-xs font-semibold text-brandRed">{reasonError}</span>}</label>}
      </ConfirmDialog>
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
