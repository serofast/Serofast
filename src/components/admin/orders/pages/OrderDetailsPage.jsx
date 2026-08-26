import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, Clock3, PackageCheck } from "lucide-react";
import { useParams } from "react-router-dom";
import { Card, ConfirmDialog, Drawer, PageHeader, StatusBadge, Toast } from "../../shared/ui";
import { useOrders } from "../hooks/useOrders";
import { orderService } from "../services/orderService";
import { fetchAdminOrderDetails, updateAdminOrderStatus } from "../../../../services/adminSupabaseService";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const primaryFlow = ["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Out for Delivery", "Delivered"];

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const { order: localOrder } = useOrders(orderId);
  const [order, setOrder] = useState(localOrder);
  const [itemsOpen, setItemsOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadDbOrder() {
      if (!orderId) return;
      const data = await fetchAdminOrderDetails(orderId);
      if (data) {
        setOrder({
          id: data.order_number || data.id,
          rawId: data.id,
          customerName: data.profiles?.full_name || "Guest Customer",
          customerEmail: data.profiles?.email || data.customer_phone || "customer@serofast.com",
          shopName: data.shops?.name || "SeroFast Store",
          itemsCount: data.order_items?.length || 1,
          amount: Number(data.total_amount) || 0,
          paymentStatus: data.payment_status || "Pending",
          status: data.order_status || data.status || "Pending",
          updatedAt: data.updated_at || data.created_at || new Date().toISOString(),
          lines: (data.order_items || []).map((item) => ({
            id: item.id,
            productName: item.product_title || "Item",
            sku: `SKU-${item.id.slice(0, 6)}`,
            quantity: item.quantity || 1,
            unitPrice: Number(item.unit_price) || 0,
          })),
          history: [
            {
              id: `H-${data.id}`,
              fromStatus: null,
              toStatus: data.order_status || data.status || "Pending",
              changedBy: "Supabase System",
              changedAt: data.created_at || new Date().toISOString(),
              note: `Order placed (${data.payment_method || "COD"})`,
            },
          ],
        });
      } else if (localOrder) {
        setOrder(localOrder);
      }
    }
    loadDbOrder();
  }, [orderId, localOrder]);

  if (!order) {
    return (
      <div className="rounded-[35px] border border-[#F3E5E5] bg-white p-8 text-center text-sm text-slate-500">
        Order not found.
      </div>
    );
  }

  const nextStatuses = orderService.nextStatuses(order.status);
  const currentIndex = primaryFlow.indexOf(order.status);

  function requestTransition(status) {
    setPendingStatus(status);
    setNote("");
    setError("");
  }

  async function confirmTransition() {
    try {
      await updateAdminOrderStatus(order.rawId || order.id, pendingStatus, note);
      try {
        orderService.changeStatus(order.id, pendingStatus, { note });
      } catch {}

      setOrder((current) => ({
        ...current,
        status: pendingStatus,
        history: [
          {
            id: `H-${Date.now()}`,
            fromStatus: current.status,
            toStatus: pendingStatus,
            changedBy: "Admin",
            changedAt: new Date().toISOString(),
            note: note || `Status changed to ${pendingStatus}`,
          },
          ...(current.history || []),
        ],
      }));

      setToast(
        pendingStatus === "Refunded"
          ? "Refund status recorded in Supabase."
          : `Order marked ${pendingStatus.toLowerCase()} in Supabase.`
      );
      setPendingStatus(null);
      setNote("");
    } catch (caught) {
      setError(caught.message);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-8 font-sans font-sansation">
      <PageHeader
        title={`Order ${order.id}`}
        description="Customer order, products, payment state, live fulfillment transitions, and immutable audit timeline."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Card className="p-5 sm:p-6">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base text-slate-900">{order.customerName}</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {order.customerEmail} · {order.shopName}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={order.status} />
                <StatusBadge value={order.paymentStatus} />
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Summary label="Amount" value={currency.format(order.amount)} />
              <Summary label="Items" value={order.itemsCount} />
              <Summary label="Payment" value={order.paymentStatus} />
              <Summary label="Updated" value={new Date(order.updatedAt).toLocaleString("en-IN")} />
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-normal text-slate-900">Fulfillment progress</h2>
              <p className="mt-1 text-[11px] text-slate-500">
                Live database fulfillment milestones.
              </p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {primaryFlow.map((status, index) => {
                const complete = currentIndex >= index;
                const current = order.status === status;
                return (
                  <div
                    key={status}
                    className={`flex items-center gap-3 rounded-[20px] border p-3 ${current ? "border-brandRed bg-rose-50" : "border-slate-100"}`}
                  >
                    {complete ? (
                      <CheckCircle2 size={17} className="text-brandRed" />
                    ) : (
                      <Clock3 size={17} className="text-slate-300" />
                    )}
                    <span
                      className={`text-xs ${current ? "font-semibold text-brandRed" : complete ? "text-slate-800" : "text-slate-400"}`}
                    >
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-normal text-slate-900">Order timeline</h2>
              <p className="mt-1 text-[11px] text-slate-500">
                Status transitions recorded in database.
              </p>
            </div>
            <div className="mt-5 space-y-4">
              {[...(order.history || [])]
                .sort((a, b) => (b.changedAt || "").localeCompare(a.changedAt || ""))
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="relative pl-7 before:absolute before:left-[7px] before:top-5 before:h-[calc(100%+8px)] before:w-px before:bg-slate-200 last:before:hidden"
                  >
                    <span className="absolute left-0 top-1 h-4 w-4 rounded-full border-4 border-rose-100 bg-brandRed" />
                    <div className="rounded-[20px] border border-[#F3E5E5] bg-[#FAF8F5] p-4">
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900">{entry.toStatus}</span>
                        <time className="text-[10px] text-slate-400">
                          {new Date(entry.changedAt).toLocaleString("en-IN")}
                        </time>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {entry.fromStatus ? `${entry.fromStatus} → ${entry.toStatus}` : "Initial state"} · {entry.changedBy}
                      </p>
                      <p className="mt-2 text-xs text-slate-700">{entry.note}</p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="border-b border-slate-100 pb-3 text-base font-normal text-slate-900">
              Order control
            </h2>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => setItemsOpen(true)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium"
              >
                <PackageCheck size={15} /> Review Items ({order.lines?.length || 0})
              </button>
              {nextStatuses.length === 0 ? (
                <div className="rounded-[20px] bg-[#FAF8F5] p-4 text-center text-xs text-slate-500">
                  No further workflow actions are available for {order.status}.
                </div>
              ) : (
                nextStatuses.map((status, index) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => requestTransition(status)}
                    className={`flex h-11 w-full items-center justify-center rounded-[30px] px-4 text-xs font-semibold ${index === 0 && !["Cancelled", "Payment Failed"].includes(status) ? "bg-brandRed text-white shadow-[0_6px_16px_rgba(211,47,47,0.25)]" : "border border-[#E5E7EB] bg-white text-slate-700"}`}
                  >
                    {actionLabel(status)}
                  </button>
                ))
              )}
            </div>
          </Card>
          {order.status === "Payment Failed" && (
            <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-xs text-brandRed">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle size={15} /> Payment Failed
              </div>
              <p className="mt-2">This is a payment exception, not a cancellation.</p>
            </div>
          )}
        </div>
      </div>

      <Drawer open={itemsOpen} onClose={() => setItemsOpen(false)} title="Order items">
        <div className="space-y-3">
          {(order.lines || []).map((line) => (
            <div key={line.id} className="rounded-[24px] border border-lightBorder p-4">
              <p className="font-semibold text-slate-900">{line.productName}</p>
              <p className="mt-1 text-xs text-slate-500">SKU {line.sku}</p>
              <div className="mt-3 flex justify-between text-sm text-slate-600">
                <span>Qty {line.quantity}</span>
                <span>{currency.format(line.unitPrice)} each</span>
              </div>
            </div>
          ))}
        </div>
      </Drawer>

      <ConfirmDialog
        open={Boolean(pendingStatus)}
        title={confirmTitle(pendingStatus)}
        description={confirmDescription(order.status, pendingStatus)}
        confirmLabel={actionLabel(pendingStatus)}
        tone={["Cancelled", "Payment Failed", "Returned", "Refunded"].includes(pendingStatus) ? "danger" : "success"}
        onConfirm={confirmTransition}
        onClose={() => setPendingStatus(null)}
      >
        {(pendingStatus === "Cancelled" || ["Returned", "Refund Requested", "Refunded"].includes(pendingStatus)) && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">
              {pendingStatus === "Cancelled" ? "Cancellation reason (required)" : "Note / reason"}
            </span>
            <textarea
              rows={3}
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
                setError("");
              }}
              className="w-full rounded-[20px] border border-[#E5E7EB] p-3 text-xs outline-none focus:border-brandRed"
            />
            {error && <span className="mt-1 block text-[11px] text-brandRed">{error}</span>}
          </label>
        )}
      </ConfirmDialog>
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function actionLabel(status) {
  if (!status) return "Confirm";
  return status === "Confirmed" ? "Confirm Order" : `Mark as ${status}`;
}
function confirmTitle(status) {
  if (status === "Cancelled") return "Cancel Order?";
  if (status === "Refunded") return "Record Refund Status?";
  return `Mark Order as ${status}?`;
}
function confirmDescription(from, to) {
  if (to === "Refunded") return `This records a transition from ${from} to Refunded in Supabase.`;
  return `This will move the order from ${from} to ${to} in Supabase.`;
}
function Summary({ label, value }) {
  return (
    <div className="rounded-[20px] border border-[#F3E5E5] bg-[#FAF8F5] p-4">
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-xs font-medium text-slate-900">{value}</p>
    </div>
  );
}
