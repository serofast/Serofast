import { useMemo, useState } from "react";
import { Download, Eye, PackageCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AdminDatePicker, AdminSelect, BulkActionBar, ConfirmDialog, FilterBar, PageHeader, StatGrid, StatusBadge, StatusCard, Toast } from "../../shared/ui";
import ResourceTable from "../../shared/resource/ResourceTable";
import { useResourceList } from "../../shared/resource/useResourceList";
import { useOrders } from "../hooks/useOrders";
import { ORDER_STATUSES, orderService } from "../services/orderService";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const inputClass = "h-11 min-w-0 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs outline-none focus:border-brandRed";

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const [payment, setPayment] = useState("");
  const [shop, setShop] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pendingBulk, setPendingBulk] = useState(null);
  const [toast, setToast] = useState("");
  const shops = [...new Set(orders.map((order) => order.shopName))];
  const payments = [...new Set(orders.map((order) => order.paymentStatus))];
  const rows = useMemo(() => orders.filter((order) => {
    const created = new Date(order.createdAt);
    return (!payment || order.paymentStatus === payment) && (!shop || order.shopName === shop) && (!minAmount || order.amount >= Number(minAmount)) && (!maxAmount || order.amount <= Number(maxAmount)) && (!dateFrom || created >= new Date(`${dateFrom}T00:00:00`)) && (!dateTo || created <= new Date(`${dateTo}T23:59:59`));
  }).map((order) => ({ ...order, customer: order.customerName, shop: order.shopName, items: order.itemsCount, amountDisplay: currency.format(order.amount), payment: order.paymentStatus, date: new Date(order.createdAt).toLocaleString("en-IN"), searchText: [order.id, order.customerName, order.customerEmail, order.shopName, ...order.lines.flatMap((line) => [line.productName, line.sku])].join(" ") })), [dateFrom, dateTo, maxAmount, minAmount, orders, payment, shop]);
  const resource = useResourceList(rows);

  const columns = [
    { key: "id", label: "Order ID" },
    { key: "customer", label: "Customer", minWidth: 190, render: (row) => <div><p className="font-medium text-slate-900">{row.customerName}</p><p className="text-[10px] text-slate-400">{row.customerEmail}</p></div> },
    { key: "shop", label: "Shop" }, { key: "items", label: "Items" }, { key: "amount", label: "Amount", render: (row) => currency.format(row.amount) }, { key: "payment", label: "Payment", render: (row) => <StatusBadge value={row.paymentStatus} /> }, { key: "status", label: "Status" }, { key: "createdAt", label: "Date", render: (row) => row.date },
  ];

  function clearAll() {
    resource.clearFilters(); setPayment(""); setShop(""); setMinAmount(""); setMaxAmount(""); setDateFrom(""); setDateTo("");
  }

  function confirmBulk() {
    try {
      orderService.bulkTransition(resource.selectedIds, pendingBulk);
      setToast(`${resource.selectedIds.length} orders marked ${pendingBulk.toLowerCase()} with history entries.`);
      resource.setSelectedIds([]);
      setPendingBulk(null);
    } catch (error) {
      setToast(error.message);
      setPendingBulk(null);
    }
  }

  function exportSelected() {
    const selected = orders.filter((order) => resource.selectedIds.length === 0 || resource.selectedIds.includes(order.id));
    const blob = new Blob([orderService.exportOrders(selected)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "serofast-orders-local.csv"; anchor.click(); URL.revokeObjectURL(url);
    setToast(`${selected.length} local orders exported.`);
  }

  return (
    <div className="min-w-0">
      <PageHeader title="Orders" description="Operate the local order lifecycle with explicit transitions, confirmations, and status history." />
      <div className="mb-4 rounded-[24px] border border-[#F3E5E5] bg-[#FAF8F5] p-4 text-[11px] text-slate-500">Order and refund states recorded here are local workflow simulations. They do not process fulfillment or return money through a payment provider.</div>
      <StatGrid className="mb-5">
        <StatusCard label="All Orders" value={orders.length} tone="blue" onClick={clearAll} />
        <StatusCard label="Pending" value={orders.filter((order) => order.status === "Pending").length} tone="amber" onClick={() => resource.setStatus("Pending")} />
        <StatusCard label="In Fulfillment" value={orders.filter((order) => ["Confirmed", "Processing", "Packed", "Shipped", "Out for Delivery"].includes(order.status)).length} tone="blue" onClick={() => resource.setQuickFilter((order) => ["Confirmed", "Processing", "Packed", "Shipped", "Out for Delivery"].includes(order.status))} />
        <StatusCard label="Delivered" value={orders.filter((order) => order.status === "Delivered").length} tone="green" onClick={() => resource.setStatus("Delivered")} />
        <StatusCard label="Payment Failed" value={orders.filter((order) => order.status === "Payment Failed" || order.paymentStatus === "Failed").length} tone="rose" onClick={() => resource.setQuickFilter((order) => order.status === "Payment Failed" || order.paymentStatus === "Failed")} />
      </StatGrid>

      <FilterBar value={resource.search} setValue={resource.setSearch} placeholder="Search order ID, customer, email, SKU, product..." status={resource.status} setStatus={resource.setStatus} options={ORDER_STATUSES} onClear={clearAll} />
      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
        <AdminSelect value={payment} onChange={setPayment} options={[{ value: "", label: "All payments" }, ...payments]} ariaLabel="Payment status" buttonClassName="h-11" />
        <AdminSelect value={shop} onChange={setShop} options={[{ value: "", label: "All shops" }, ...shops]} ariaLabel="Shop" buttonClassName="h-11" />
        <input type="number" min="0" value={minAmount} onChange={(event) => setMinAmount(event.target.value)} placeholder="Minimum amount" aria-label="Minimum amount" className={inputClass} />
        <input type="number" min="0" value={maxAmount} onChange={(event) => setMaxAmount(event.target.value)} placeholder="Maximum amount" aria-label="Maximum amount" className={inputClass} />
        <AdminDatePicker value={dateFrom} onChange={setDateFrom} max={dateTo || undefined} placeholder="From date" ariaLabel="Orders from date" />
        <AdminDatePicker value={dateTo} onChange={setDateTo} min={dateFrom || undefined} placeholder="To date" ariaLabel="Orders to date" />
      </div>

      <BulkActionBar count={resource.selectedIds.length} actions={[{ label: "Mark Confirmed", tone: "success", onClick: () => setPendingBulk("Confirmed") }, { label: "Mark Processing", onClick: () => setPendingBulk("Processing") }, { label: "Export", onClick: exportSelected }]} onClear={() => resource.setSelectedIds([])} />
      <div className="mb-3 flex justify-end"><button type="button" onClick={exportSelected} className="inline-flex h-10 items-center gap-2 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium"><Download size={14} /> Export Current Orders</button></div>
      <ResourceTable columns={columns} rows={resource.visibleRows} rowActions={(row) => [{ label: "View Order", shortLabel: "View", icon: Eye, tone: "primary", onClick: () => navigate(`/admin/orders/${encodeURIComponent(row.id)}`) }, { label: "Open Workflow", shortLabel: "Workflow", icon: PackageCheck, onClick: () => navigate(`/admin/orders/${encodeURIComponent(row.id)}`) }]} onView={(row) => navigate(`/admin/orders/${encodeURIComponent(row.id)}`)} sortKey={resource.sortKey} sortDirection={resource.sortDirection} onSort={resource.changeSort} selectedIds={resource.selectedIds} onToggleSelected={resource.toggleSelected} onToggleAll={resource.toggleVisibleRows} page={resource.page} pageCount={resource.pageCount} pageSize={resource.pageSize} totalCount={resource.totalCount} onPageChange={resource.setPage} onPageSizeChange={resource.changePageSize} onClearFilters={clearAll} emptyTitle={resource.search ? "No orders match your search" : "No orders found"} />

      <ConfirmDialog open={Boolean(pendingBulk)} title={`Mark selected orders ${pendingBulk}?`} description="The change is applied only when every selected order supports this transition. Each successful order receives a local status-history entry." confirmLabel={`Mark ${pendingBulk ?? "orders"}`} tone="success" onConfirm={confirmBulk} onClose={() => setPendingBulk(null)} />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
