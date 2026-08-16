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
    <div>
      <PageHeader
        title={`Order ${order.id}`}
        description="Customer order, shop orders, payment, fulfillment, and timeline."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold">Customer Order</p>
                <p className="text-sm text-textSecondary">
                  {order.customer} · {order.items} items · {order.date}
                </p>
              </div>
              <StatusBadge value={order.status} />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Summary label="Payment" value={order.payment} />
              <Summary label="Amount" value={order.amount} />
              <Summary label="Shop orders" value={shopOrders.length} />
              <Summary label="Delivery" value={shipment?.status ?? "Not assigned"} />
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Marketplace fulfillment</h2>
            <p className="mt-1 text-sm text-textSecondary">
              One customer order can contain independently fulfilled shop orders.
            </p>
            <div className="mt-5 space-y-3">
              {shopOrders.map((shopOrder) => (
                <div
                  key={shopOrder.id}
                  className="flex flex-col gap-3 rounded-xl border border-lightBorder p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">{shopOrder.shop}</p>
                    <p className="mt-1 text-xs text-textMuted">
                      {shopOrder.id} · {shopOrder.items} item(s)
                    </p>
                  </div>
                  <StatusBadge value={shopOrder.status} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Order timeline</h2>
            <div className="mt-5 space-y-4">
              {statusSequence.map((label, index) => {
                const complete = currentIndex >= index || order.status === "Delivered";

                return (
                  <div key={label} className="flex items-center gap-3">
                    {complete ? (
                      <CheckCircle2 size={19} className="text-emerald-600" />
                    ) : (
                      <Clock3 size={19} className="text-textMuted" />
                    )}
                    <span className={complete ? "font-semibold" : "text-textMuted"}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <Card className="h-fit p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Order control</h2>
          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={() => setItemsOpen(true)}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-lightBorder text-sm font-semibold"
            >
              <PackageCheck size={16} /> Review Items
            </button>
            <button
              type="button"
              disabled={!shipment}
              onClick={() => shipment && navigate(`/admin/delivery/${shipment.id}`)}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-lightBorder text-sm font-semibold disabled:opacity-50"
            >
              <Truck size={16} /> Open Shipment
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/finance/refunds?order=${encodeURIComponent(order.id)}`)}
              className="min-h-11 w-full rounded-lg border border-brandRed text-sm font-semibold text-brandRed"
            >
              Manage Refund
            </button>
            {nextStatus && (
              <button
                type="button"
                onClick={() => setPendingStatus(nextStatus)}
                className="min-h-11 w-full rounded-lg bg-brandRed text-sm font-semibold text-white"
              >
                Mark {nextStatus}
              </button>
            )}
          </div>
        </Card>
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
    <div className="rounded-xl bg-lightBackground p-4">
      <p className="text-xs text-textMuted">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
