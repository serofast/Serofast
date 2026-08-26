import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, PageHeader, StatusBadge, Toast } from "../../shared/ui";
import {
  fetchAdminReturnsList,
  updateAdminReturnStatus,
} from "../../../../services/adminSupabaseService";

export default function ReturnDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadReturn() {
      setLoading(true);
      try {
        const list = await fetchAdminReturnsList();
        if (Array.isArray(list)) {
          const found = list.find((item) => String(item.id) === String(params.returnId));
          if (found) {
            setRecord({
              id: found.id,
              order: found.orders?.order_number || found.order_id || "Direct Request",
              customer: found.profiles?.full_name || found.user_id || "Customer",
              shop: found.shops?.name || "Shop",
              product: found.product_name || "Item",
              reason: found.reason || "Return Requested",
              refund: `₹${found.refund_amount || 0}`,
              status: found.status || "Requested",
              customerNotes: found.customer_notes || "None provided",
              adminNotes: found.admin_notes || "",
              created: new Date(found.created_at).toLocaleDateString("en-IN"),
            });
            setNotes(found.admin_notes || "");
          } else {
            setRecord(null);
          }
        }
      } catch {
        setRecord(null);
      } finally {
        setLoading(false);
      }
    }
    loadReturn();
  }, [params.returnId]);

  async function handleStatusChange(newStatus) {
    if (!record?.id) return;
    try {
      await updateAdminReturnStatus(record.id, newStatus, notes);
      setRecord((curr) => ({ ...curr, status: newStatus, adminNotes: notes }));
      setToast(`Return marked as ${newStatus} in Supabase.`);
    } catch {
      setToast("Failed to update return status in database.");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-8 text-center text-xs text-slate-500 font-sans font-sansation">
        Loading return record from database...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-8 text-center font-sans font-sansation">
        <div className="rounded-[24px] border border-slate-100 bg-white p-8">
          <p className="text-sm font-semibold text-slate-800">Return request not found in database</p>
          <p className="mt-1 text-xs text-slate-500">The requested return record ({params.returnId}) does not exist in Supabase.</p>
          <button
            type="button"
            onClick={() => navigate("/admin/returns")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brandRed px-4 py-2 text-xs font-semibold text-white"
          >
            <ArrowLeft size={14} /> Back to Returns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/returns")}
            className="mb-2 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brandRed"
          >
            <ArrowLeft size={14} /> Back to Returns
          </button>
          <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
            Return Request ({record.id})
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Operational review, customer evidence, and refund resolution.
          </p>
        </div>
        <StatusBadge value={record.status} />
      </div>

      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-slate-900 border-b pb-3 mb-4">
            Return Details
          </h2>
          <div className="space-y-3">
            {Object.entries(record)
              .filter(([key]) => !["adminNotes"].includes(key))
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between gap-5 border-b border-slate-100 pb-2.5 text-xs"
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
                Admin Resolution Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add verification and approval notes..."
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
