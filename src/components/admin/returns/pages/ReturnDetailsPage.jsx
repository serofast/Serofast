import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, PageHeader, StatusBadge, Toast } from "../../shared/ui";
import { returns as fallbackReturns } from "../../shared/adminData";
import {
  fetchAdminReturnsList,
  updateAdminReturnStatus,
} from "../../../../services/adminSupabaseService";

export default function ReturnDetailsPage() {
  const params = useParams();
  const [record, setRecord] = useState(
    fallbackReturns.find((item) => item.id === params.returnId) || fallbackReturns[0]
  );
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadReturn() {
      const list = await fetchAdminReturnsList();
      if (list && list.length > 0) {
        const found = list.find((item) => item.id === params.returnId);
        if (found) {
          setRecord({
            id: found.id,
            order: found.orders?.order_number || found.order_id,
            customer: found.profiles?.full_name || found.user_id || "Customer",
            shop: found.shops?.name || "Shop",
            product: found.product_name,
            reason: found.reason,
            refund: `₹${found.refund_amount || 0}`,
            status: found.status,
            customerNotes: found.customer_notes || "None provided",
            adminNotes: found.admin_notes || "",
            created: new Date(found.created_at).toLocaleDateString("en-IN"),
          });
          setNotes(found.admin_notes || "");
        }
      }
    }
    loadReturn();
  }, [params.returnId]);

  async function handleStatusChange(newStatus) {
    if (record.id) {
      await updateAdminReturnStatus(record.id, newStatus, notes);
      setToast(`Return marked as ${newStatus} in Supabase.`);
    } else {
      setToast(`Return marked as ${newStatus} locally.`);
    }
    setRecord((curr) => ({ ...curr, status: newStatus, adminNotes: notes }));
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          Return Details ({record.id})
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Operational review, evidence validation, and refund processing.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_300px]">
        <Card className="p-6">
          <div className="space-y-4">
            {Object.entries(record)
              .filter(([key]) => !["adminNotes"].includes(key))
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between gap-5 border-b border-slate-100 pb-3 text-xs"
                >
                  <span className="capitalize text-slate-500 font-normal">{key}</span>
                  <span className="font-medium text-slate-900">
                    {key === "status" ? <StatusBadge value={value} /> : String(value)}
                  </span>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 border-b pb-2">
            Return Moderation
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">
                Admin Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add verification notes..."
                className="w-full p-2.5 border rounded-xl text-xs outline-none focus:border-brandRed"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleStatusChange("Approved")}
                className="w-full h-9 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
              >
                Approve Return
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("Refund Processed")}
                className="w-full h-9 rounded-xl bg-brandRed text-white text-xs font-semibold hover:bg-brandRed/90"
              >
                Process Refund
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("Rejected")}
                className="w-full h-9 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Reject Request
              </button>
            </div>
          </div>
        </Card>
      </div>
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
