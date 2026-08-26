import { useEffect, useMemo, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Eye, SlidersHorizontal, Store } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdminDatePicker, AdminSelect, BulkActionBar, Card, ConfirmDialog, FilterBar, Modal, PageHeader, StatGrid, StatusBadge, StatusCard, Tabs, Toast } from "../../shared/ui";
import ResourceTable from "../../shared/resource/ResourceTable";
import { useResourceList } from "../../shared/resource/useResourceList";
import { useInventory } from "../hooks/useInventory";
import { INVENTORY_TYPES, inventoryService } from "../services/inventoryService";
import { shops as shopDirectory } from "../../shared/adminData";

const fieldClass = "h-11 w-full rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs outline-none focus:border-brandRed";

export default function InventoryPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { inventory, movements } = useInventory();
  const [activeTab, setActiveTab] = useState("Inventory");
  const [shop, setShop] = useState("");
  const [operation, setOperation] = useState(null);
  const [bulkDraft, setBulkDraft] = useState(null);
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [historyShop, setHistoryShop] = useState("");
  const [historyProduct, setHistoryProduct] = useState("");
  const [historyFrom, setHistoryFrom] = useState("");
  const [historyTo, setHistoryTo] = useState("");
  const [toast, setToast] = useState("");
  const shops = [...new Set(inventory.map((record) => record.shopName))];
  const inventoryRows = useMemo(() => inventory.filter((record) => !shop || record.shopName === shop).map((record) => ({ ...record, product: record.productName, variant: record.variantLabel, shop: record.shopName, stock: record.quantity, threshold: record.lowStockThreshold, updated: new Date(record.updatedAt).toLocaleString("en-IN"), searchText: `${record.productName} ${record.sku} ${record.variantLabel} ${record.shopName}` })), [inventory, shop]);
  const resource = useResourceList(inventoryRows);
  const movementRows = useMemo(() => [...movements].filter((movement) => {
    const created = new Date(movement.createdAt);
    return (!historyShop || movement.shopName === historyShop) && (!historyProduct || movement.productId === historyProduct) && (!historyFrom || created >= new Date(`${historyFrom}T00:00:00`)) && (!historyTo || created <= new Date(`${historyTo}T23:59:59`));
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((movement) => ({ ...movement, product: movement.productName, variant: movement.variantLabel, shop: movement.shopName, previous: movement.previousQuantity, next: movement.newQuantity, date: new Date(movement.createdAt).toLocaleString("en-IN"), actor: movement.performedBy, status: movement.type, searchText: `${movement.productName} ${movement.sku} ${movement.shopName} ${movement.reason} ${movement.reference}` })), [historyFrom, historyProduct, historyShop, historyTo, movements]);
  const historyResource = useResourceList(movementRows);

  useEffect(() => {
    const requestedTab = searchParams.get("tab");
    setActiveTab(requestedTab === "history" ? "Movement History" : "Inventory");
    resource.setSearch(searchParams.get("search") ?? "");
    resource.setStatus(searchParams.get("status") ?? "");
    // Apply direct dashboard links when their query parameters change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const inventoryColumns = [
    { key: "product", label: "Product", minWidth: 210, render: (row) => <div><p className="font-medium text-slate-900">{row.productName}</p><p className="text-[10px] text-slate-400">{row.sku}</p></div> },
    { key: "variant", label: "Variant" }, { key: "shop", label: "Shop" }, { key: "stock", label: "Stock" }, { key: "threshold", label: "Threshold" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" },
  ];
  const movementColumns = [
    { key: "date", label: "Date" }, { key: "product", label: "Product" }, { key: "variant", label: "Variant" }, { key: "shop", label: "Shop" }, { key: "status", label: "Type" }, { key: "quantity", label: "Change", render: (row) => <span className={row.quantity > 0 ? "text-emerald-600" : row.quantity < 0 ? "text-brandRed" : "text-slate-500"}>{row.quantity > 0 ? "+" : ""}{row.quantity}</span> }, { key: "previous", label: "Previous" }, { key: "next", label: "New Stock" }, { key: "reason", label: "Reason", minWidth: 220 }, { key: "actor", label: "Performed By" },
  ];

  function rowActions(row) {
    return [
      { label: "View Product", shortLabel: "Product", icon: Eye, tone: "primary", onClick: () => navigate(`/admin/products/${encodeURIComponent(row.productId)}`) },
      { label: "View Shop", shortLabel: "Shop", icon: Store, onClick: () => openShop(row) },
      { label: "Stock In", shortLabel: "Stock In", icon: ArrowUpCircle, tone: "success", onClick: () => setOperation({ record: row, type: "Stock In" }) },
      { label: "Stock Out", shortLabel: "Stock Out", icon: ArrowDownCircle, tone: "danger", onClick: () => setOperation({ record: row, type: "Stock Out" }) },
      { label: "Adjust Count", shortLabel: "Adjust", icon: SlidersHorizontal, onClick: () => setOperation({ record: row, type: "Adjustment" }) },
    ];
  }

  function movementActions(row) {
    return [
      { label: "View Product", shortLabel: "Product", icon: Eye, tone: "primary", onClick: () => navigate(`/admin/products/${encodeURIComponent(row.productId)}`) },
      { label: "View Shop", shortLabel: "Shop", icon: Store, onClick: () => openShop(row) },
    ];
  }

  function openShop(row) {
    const shopRecord = shopDirectory.find((item) => item.shop === row.shopName);
    if (!shopRecord) {
      setToast("The linked shop is not available in the current Admin dataset.");
      return;
    }
    navigate(`/admin/shops/${encodeURIComponent(shopRecord.id)}`);
  }

  function updateRoute(values) {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(values).forEach(([key, value]) => {
      if (value) nextParams.set(key, value);
      else nextParams.delete(key);
    });
    setSearchParams(nextParams, { replace: true });
  }

  function changeTab(tab) {
    setActiveTab(tab);
    updateRoute({ tab: tab === "Movement History" ? "history" : "" });
  }

  function changeInventoryStatus(status) {
    setActiveTab("Inventory");
    resource.setStatus(status);
    updateRoute({ tab: "", status });
  }

  function clearInventoryFilters() {
    resource.clearFilters();
    setShop("");
    updateRoute({ status: "", search: "" });
  }

  function openBulk() {
    setBulkDraft({ mode: "add", value: "", reason: "" });
  }

  async function confirmBulk() {
    try {
      await inventoryService.bulkUpdate(resource.selectedIds, bulkDraft);
      setToast(`${resource.selectedIds.length} inventory records updated in Supabase.`);
      resource.setSelectedIds([]);
      setBulkConfirm(false);
      setBulkDraft(null);
    } catch (error) {
      setToast(error.message);
      setBulkConfirm(false);
    }
  }

  return (
    <div className="min-w-0">
      <PageHeader title="Inventory" description="Operate per-shop product and variant stock with a complete local movement audit trail." />
      <div className="mb-4 rounded-[24px] border border-[#F3E5E5] bg-[#FAF8F5] p-4 text-[11px] text-slate-500">Stock operations are persisted in the Phase 1 local repository. No warehouse or Supabase inventory is changed.</div>
      <StatGrid className="mb-5">
        <StatusCard label="Tracked Records" value={inventory.length} tone="blue" description="Shop/product/variant records" onClick={() => { setActiveTab("Inventory"); resource.clearFilters(); setShop(""); updateRoute({ tab: "", status: "", search: "" }); }} />
        <StatusCard label="In Stock" value={inventory.filter((record) => record.status === "In Stock").length} tone="green" onClick={() => changeInventoryStatus("In Stock")} />
        <StatusCard label="Low Stock" value={inventory.filter((record) => record.status === "Low Stock").length} tone="amber" onClick={() => changeInventoryStatus("Low Stock")} />
        <StatusCard label="Out of Stock" value={inventory.filter((record) => record.status === "Out of Stock").length} tone="rose" onClick={() => changeInventoryStatus("Out of Stock")} />
        <StatusCard label="Movements" value={movements.length} tone="blue" description="Local audit entries" onClick={() => { historyResource.clearFilters(); changeTab("Movement History"); }} />
      </StatGrid>

      <Card className="mb-5 overflow-hidden"><Tabs tabs={["Inventory", "Movement History"]} activeTab={activeTab} onChange={changeTab} /></Card>
      {activeTab === "Inventory" ? (
        <>
          <div className="mb-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
            <FilterBar value={resource.search} setValue={resource.setSearch} placeholder="Search product, SKU, variant, shop..." status={resource.status} setStatus={changeInventoryStatus} options={resource.statuses} onClear={clearInventoryFilters} />
            <AdminSelect value={shop} onChange={setShop} options={[{ value: "", label: "All shops" }, ...shops]} ariaLabel="Filter inventory by shop" buttonClassName="h-[54px]" />
          </div>
          <BulkActionBar count={resource.selectedIds.length} actions={[{ label: "Bulk Stock Update", tone: "success", onClick: openBulk }]} onClear={() => resource.setSelectedIds([])} />
          <ResourceTable columns={inventoryColumns} rows={resource.visibleRows} rowActions={rowActions} onView={(row) => navigate(`/admin/products/${encodeURIComponent(row.productId)}`)} sortKey={resource.sortKey} sortDirection={resource.sortDirection} onSort={resource.changeSort} selectedIds={resource.selectedIds} onToggleSelected={resource.toggleSelected} onToggleAll={resource.toggleVisibleRows} page={resource.page} pageCount={resource.pageCount} pageSize={resource.pageSize} totalCount={resource.totalCount} onPageChange={resource.setPage} onPageSizeChange={resource.changePageSize} onClearFilters={clearInventoryFilters} emptyTitle={resource.search ? "No inventory matches your search" : "No inventory records found"} />
        </>
      ) : (
        <>
          <FilterBar value={historyResource.search} setValue={historyResource.setSearch} placeholder="Search movement history..." status={historyResource.status} setStatus={historyResource.setStatus} options={INVENTORY_TYPES} onClear={() => { historyResource.clearFilters(); setHistoryShop(""); setHistoryProduct(""); setHistoryFrom(""); setHistoryTo(""); }} />
          <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <AdminSelect value={historyShop} onChange={setHistoryShop} options={[{ value: "", label: "All shops" }, ...shops]} ariaLabel="Movement shop" buttonClassName="h-11" />
            <AdminSelect value={historyProduct} onChange={setHistoryProduct} options={[{ value: "", label: "All products" }, ...[...new Map(inventory.map((record) => [record.productId, { value: record.productId, label: record.productName }])).values()]]} ariaLabel="Movement product" buttonClassName="h-11" />
            <AdminDatePicker value={historyFrom} onChange={setHistoryFrom} max={historyTo || undefined} placeholder="From date" ariaLabel="Movement history from date" />
            <AdminDatePicker value={historyTo} onChange={setHistoryTo} min={historyFrom || undefined} placeholder="To date" ariaLabel="Movement history to date" />
          </div>
          <ResourceTable columns={movementColumns} rows={historyResource.visibleRows} selectable={false} rowActions={movementActions} onView={(row) => navigate(`/admin/products/${encodeURIComponent(row.productId)}`)} sortKey={historyResource.sortKey} sortDirection={historyResource.sortDirection} onSort={historyResource.changeSort} page={historyResource.page} pageCount={historyResource.pageCount} pageSize={historyResource.pageSize} totalCount={historyResource.totalCount} onPageChange={historyResource.setPage} onPageSizeChange={historyResource.changePageSize} onClearFilters={historyResource.clearFilters} emptyTitle="No stock movements recorded" emptyDescription="Stock-in, stock-out, adjustment, sale, return, damage, and other operations will appear here." />
        </>
      )}

      <StockOperationModal key={operation ? `${operation.record.id}-${operation.type}` : "closed"} operation={operation} onClose={() => setOperation(null)} onSuccess={(message) => { setOperation(null); setToast(message); }} />
      <Modal open={Boolean(bulkDraft) && !bulkConfirm} onClose={() => setBulkDraft(null)} title="Bulk Stock Update">
        {bulkDraft && <div className="space-y-4"><p className="text-xs text-slate-500">{resource.selectedIds.length} records selected. Review the preview before applying.</p><label className="block"><span className="mb-1.5 block text-xs font-medium">Update method</span><AdminSelect value={bulkDraft.mode} onChange={(mode) => setBulkDraft((current) => ({ ...current, mode }))} options={[{ value: "add", label: "Add the same quantity" }, { value: "set", label: "Set an exact quantity" }]} ariaLabel="Bulk update method" /></label><label className="block"><span className="mb-1.5 block text-xs font-medium">{bulkDraft.mode === "add" ? "Quantity to add" : "New quantity"}</span><input type="number" min={bulkDraft.mode === "add" ? 1 : 0} step="1" value={bulkDraft.value} onChange={(event) => setBulkDraft((current) => ({ ...current, value: event.target.value }))} className={fieldClass} /></label><label className="block"><span className="mb-1.5 block text-xs font-medium">Reason</span><input value={bulkDraft.reason} onChange={(event) => setBulkDraft((current) => ({ ...current, reason: event.target.value }))} placeholder="Required audit reason" className={fieldClass} /></label><div className="max-h-48 space-y-2 overflow-auto rounded-[20px] bg-[#FAF8F5] p-3">{inventory.filter((record) => resource.selectedIds.includes(record.id)).map((record) => { const next = bulkDraft.mode === "add" ? Number(record.quantity) + Number(bulkDraft.value || 0) : Number(bulkDraft.value || 0); return <div key={record.id} className="flex justify-between gap-3 text-[11px]"><span className="truncate">{record.productName} · {record.variantLabel}</span><span className="shrink-0 font-medium">{record.quantity} → {next}</span></div>; })}</div><div className="flex justify-end gap-2"><button type="button" onClick={() => setBulkDraft(null)} className="h-10 rounded-[30px] border border-[#E5E7EB] px-4 text-xs">Cancel</button><button type="button" onClick={() => setBulkConfirm(true)} className="h-10 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white">Review Change</button></div></div>}
      </Modal>
      <ConfirmDialog open={bulkConfirm} title="Apply Bulk Stock Update?" description="Every selected row will be changed exactly as previewed, and each change will create its own local movement record." confirmLabel="Apply Stock Changes" tone="success" onConfirm={confirmBulk} onClose={() => setBulkConfirm(false)} />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function StockOperationModal({ operation, onClose, onSuccess }) {
  const [draft, setDraft] = useState({ quantity: "", actualCount: "", reason: "", reference: "", type: operation?.type ?? "Stock In" });
  if (!operation) return null;
  const type = draft.type;
  const current = Number(operation.record.quantity);
  const entered = type === "Adjustment" ? Number(draft.actualCount || current) : Number(draft.quantity || 0);
  const preview = type === "Adjustment" ? entered : current + (["Stock In", "Return"].includes(type) ? entered : -entered);
  async function submit(event) {
    event.preventDefault();
    try {
      await inventoryService.applyOperation({ inventoryId: operation.record.id, type, ...draft });
      onSuccess(`${type} recorded in Supabase: ${current} → ${preview}.`);
    } catch (error) { onSuccess(error.message); }
  }
  return <Modal open onClose={onClose} title={type}><form onSubmit={submit} className="space-y-4"><div className="rounded-[20px] bg-[#FAF8F5] p-4 text-xs"><p className="font-medium text-slate-900">{operation.record.productName}</p><p className="mt-1 text-slate-500">{operation.record.sku} · {operation.record.variantLabel} · {operation.record.shopName}</p><p className="mt-3">Current stock: <strong>{current}</strong> · New stock: <strong className={preview < 0 ? "text-brandRed" : "text-slate-900"}>{preview}</strong></p></div>{operation.type !== "Adjustment" && <label className="block"><span className="mb-1.5 block text-xs font-medium">Movement Type</span><AdminSelect value={type} onChange={(value) => setDraft((currentDraft) => ({ ...currentDraft, type: value }))} options={operation.type === "Stock In" ? ["Stock In", "Return"] : ["Stock Out", "Sale", "Damage", "Other"]} ariaLabel="Inventory movement type" /></label>}{type === "Adjustment" ? <label className="block"><span className="mb-1.5 block text-xs font-medium">Actual Count</span><input type="number" min="0" step="1" value={draft.actualCount} onChange={(event) => setDraft((value) => ({ ...value, actualCount: event.target.value }))} className={fieldClass} /></label> : <label className="block"><span className="mb-1.5 block text-xs font-medium">Quantity</span><input type="number" min="1" step="1" value={draft.quantity} onChange={(event) => setDraft((value) => ({ ...value, quantity: event.target.value }))} className={fieldClass} /></label>}<label className="block"><span className="mb-1.5 block text-xs font-medium">Reason</span><input value={draft.reason} onChange={(event) => setDraft((value) => ({ ...value, reason: event.target.value }))} placeholder={["Stock Out", "Sale", "Damage", "Other"].includes(type) ? "Sale, damaged, expired, supplier return, other..." : "Purchase, restock, physical count..."} className={fieldClass} /></label><label className="block"><span className="mb-1.5 block text-xs font-medium">Reference (optional)</span><input value={draft.reference} onChange={(event) => setDraft((value) => ({ ...value, reference: event.target.value }))} className={fieldClass} /></label><div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="h-10 rounded-[30px] border border-[#E5E7EB] px-4 text-xs">Cancel</button><button type="submit" className="h-10 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white">Record {type}</button></div></form></Modal>;
}
