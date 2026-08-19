import { useState } from "react";
import { CheckCircle2, Clock3, PackageCheck, Truck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  ConfirmDialog,
  Drawer,
  PageHeader,
  StatusBadge,
  Toast,
} from "../../shared/ui";
import { orders, shipments } from "../../shared/adminData";

const statusSequence = ["New", "Processing", "Packed", "Shipped", "Delivered"];

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const source = orders.find((item) => item.id === orderId) ?? orders[0];
  const [order, setOrder] = useState(source);
  const [itemsOpen, setItemsOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [toast, setToast] = useState("");
  const shipment = shipments.find((item) => item.order === order.id);
  const currentIndex = statusSequence.indexOf(order.status);
  const nextStatus = currentIndex >= 0 ? statusSequence[currentIndex + 1] : null;

  const shopOrders = [
    {
      id: `${order.id}-A`,
      shop: order.shop,
      items: Math.max(1, Math.ceil(order.items / 2)),
      status: order.status,
    },
    ...(order.items > 1
      ? [
          {
            id: `${order.id}-B`,
            shop: "Marketplace partner shop",
            items: Math.floor(order.items / 2),
            status: order.status,
          },
        ]
      : []),
  ];

  function confirmStatus() {
    setOrder((current) => ({ ...current, status: pendingStatus }));
    setToast(`Order marked ${pendingStatus.toLowerCase()}.`);
    setPendingStatus(null);
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          Order {order.id}
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Customer order, shop orders, payment, fulfillment, and timeline.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 sm:p-7 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
            <div>
              <p className="text-base font-normal text-slate-800">Customer Order</p>
              <p className="text-[11px] text-slate-500 font-normal">
                {order.customer} · {order.items} items · {order.date}
              </p>
            </div>
            <StatusBadge value={order.status} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Summary label="Payment" value={order.payment} />
            <Summary label="Amount" value={order.amount} />
            <Summary label="Shop orders" value={shopOrders.length} />
            <Summary label="Delivery" value={shipment?.status ?? "Not assigned"} />
          </div>
        </div>

        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 sm:p-7 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-normal text-slate-800">Marketplace fulfillment</h3>
            <p className="mt-1 text-[11px] text-slate-500 font-normal">
              One customer order can contain independently fulfilled shop orders.
            </p>
          </div>
          <div className="space-y-3">
            {shopOrders.map((shopOrder) => (
              <div
                key={shopOrder.id}
                className="flex flex-col gap-3 rounded-[24px] border border-slate-100 bg-[#FAF8F5] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs font-medium text-slate-900">{shopOrder.shop}</p>
                  <p className="mt-1 text-[11px] text-slate-500 font-normal">
                    {shopOrder.id} · {shopOrder.items} item(s)
                  </p>
                </div>
                <StatusBadge value={shopOrder.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 sm:p-7 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-normal text-slate-800">Order timeline</h3>
          </div>
          <div className="space-y-4">
            {statusSequence.map((label, index) => {
              const complete = currentIndex >= index || order.status === "Delivered";

              return (
                <div key={label} className="flex items-center gap-3">
                  {complete ? (
                    <CheckCircle2 size={18} className="text-brandRed" />
                  ) : (
                    <Clock3 size={18} className="text-slate-400" />
                  )}
                  <span className={`text-xs ${complete ? "font-medium text-slate-900" : "text-slate-500 font-normal"}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 sm:p-7 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
          <h3 className="text-base font-normal text-slate-800 border-b border-slate-100 pb-3">Order control</h3>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setItemsOpen(true)}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium text-slate-700 hover:border-slate-300 transition cursor-pointer"
            >
              <PackageCheck size={15} /> Review Items
            </button>
            <button
              type="button"
              disabled={!shipment}
              onClick={() => shipment && navigate(`/admin/delivery/${shipment.id}`)}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium text-slate-700 hover:border-slate-300 transition cursor-pointer disabled:opacity-50"
            >
              <Truck size={15} /> Open Shipment
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/finance/refunds?order=${encodeURIComponent(order.id)}`)}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-[30px] border border-brandRed bg-white px-4 text-xs font-semibold text-brandRed hover:bg-rose-50 transition cursor-pointer"
            >
              Manage Refund
            </button>
            {nextStatus && (
              <button
                type="button"
                onClick={() => setPendingStatus(nextStatus)}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer"
              >
                Mark {nextStatus}
              </button>
            )}
          </div>
        </div>
      </div>

      <Drawer open={itemsOpen} onClose={() => setItemsOpen(false)} title="Order items">
        <div className="space-y-3">
          {shopOrders.map((shopOrder, shopIndex) => (
            <div key={shopOrder.id} className="rounded-xl border border-lightBorder p-4">
              <p className="font-semibold">{shopOrder.shop}</p>
              {Array.from({ length: shopOrder.items }, (_, itemIndex) => (
                <div
                  key={itemIndex}
                  className="mt-3 flex justify-between gap-4 text-sm text-textSecondary"
                >
                  <span>Marketplace item {shopIndex + 1}.{itemIndex + 1}</span>
                  <span>Qty 1</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Drawer>

      <ConfirmDialog
        open={Boolean(pendingStatus)}
        title={`Advance order to ${pendingStatus}`}
        description="This updates the Phase 4 frontend lifecycle. Backend fulfillment rules must validate the transition later."
        confirmLabel={`Mark ${pendingStatus}`}
        tone="success"
        onConfirm={confirmStatus}
        onClose={() => setPendingStatus(null)}
      />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div className="rounded-[24px] bg-[#FAF8F5] p-4 border border-[#F3E5E5]">
      <p className="text-[11px] text-slate-500 font-normal">{label}</p>
      <p className="mt-1 text-xs font-medium text-slate-900">{value}</p>
    </div>
  );
}
