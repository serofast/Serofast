import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  Pencil,
  Plus,
  Power,
  Trash2,
} from "lucide-react";
import {
  BulkActionBar,
  Card,
  ConfirmDialog,
  FilterBar,
  Modal,
  PageHeader,
  StatusBadge,
  Toast,
} from "../../shared/ui";
import ResourceTable from "../../shared/resource/ResourceTable";
import { useResourceList } from "../../shared/resource/useResourceList";
import { categories as seed } from "../../shared/adminData";

const columns = [
  { key: "name", label: "Category", minWidth: 190 },
  { key: "parent", label: "Parent", minWidth: 160 },
  { key: "children", label: "Subcategories" },
  { key: "shops", label: "Shops" },
  { key: "products", label: "Products" },
  { key: "status", label: "Status" },
];

export default function CategoriesPage() {
  const resource = useResourceList(seed);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingToggle, setPendingToggle] = useState(null);
  const [toast, setToast] = useState("");

  function addCategory(event) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError("Category name is required.");
      return;
    }
    if (
      resource.rows.some(
        (row) => row.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      setNameError("A category with this name already exists.");
      return;
    }

    resource.createRow({
      id: `CAT-${String(resource.rows.length + 1).padStart(2, "0")}`,
      name: trimmedName,
      parent: "—",
      children: 0,
      shops: 0,
      products: 0,
      status: "Draft",
    });
    setName("");
    setToast("Category created as Draft.");
  }

  function saveCategory(event) {
    event.preventDefault();
    if (!editing?.name.trim()) return;

    resource.updateRow(editing.id, editing);
    setEditing(null);
    setToast("Category updated.");
  }

  function move(row, direction) {
    resource.reorderRow(row.id, direction);
    setToast("Category order updated.");
  }

  function confirmToggle() {
    if (!pendingToggle) return;
    const nextStatus = pendingToggle.status === "Active" ? "Inactive" : "Active";
    resource.updateRow(pendingToggle.id, { status: nextStatus });
    setToast(`${pendingToggle.name} marked ${nextStatus.toLowerCase()}.`);
    setPendingToggle(null);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    resource.removeRows([pendingDelete.id]);
    setToast(`${pendingDelete.name} category deleted.`);
    setPendingDelete(null);
  }

  function updateSelected(status) {
    resource.updateRows(resource.selectedIds, { status });
    setToast(`Selected categories marked ${status.toLowerCase()}.`);
  }

  function categoryActions(row) {
    const index = resource.rows.findIndex((item) => item.id === row.id);
    return [
      {
        label: "View Category",
        shortLabel: "View",
        icon: Eye,
        tone: "primary",
        onClick: () => setViewing(row),
      },
      {
        label: "Edit Category",
        shortLabel: "Edit",
        icon: Pencil,
        onClick: () => setEditing({ ...row }),
      },
      {
        label: "Move Up",
        icon: ArrowUp,
        disabled: index === 0,
        onClick: () => move(row, -1),
      },
      {
        label: "Move Down",
        icon: ArrowDown,
        disabled: index === resource.rows.length - 1,
        onClick: () => move(row, 1),
      },
      {
        label: row.status === "Active" ? "Deactivate Category" : "Activate Category",
        shortLabel: row.status === "Active" ? "Deactivate" : "Activate",
        icon: Power,
        tone: row.status === "Active" ? "warning" : "success",
        onClick: () => setPendingToggle(row),
      },
      {
        label: "Delete Category",
        shortLabel: "Delete",
        icon: Trash2,
        tone: "danger",
        onClick: () => setPendingDelete(row),
      },
    ];
  }

  return (
    <div className="min-w-0">
      <PageHeader
        title="Categories"
        description="Manage marketplace taxonomy, hierarchy, status, and navigation order."
      />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0">
          <FilterBar
            value={resource.search}
            setValue={resource.setSearch}
            placeholder="Search categories..."
            status={resource.status}
            setStatus={resource.setStatus}
            options={resource.statuses}
            onClear={resource.clearFilters}
          />

          <BulkActionBar
            count={resource.selectedIds.length}
            actions={[
              { label: "Activate", tone: "success", onClick: () => updateSelected("Active") },
              { label: "Deactivate", onClick: () => updateSelected("Inactive") },
              {
                label: "Delete",
                tone: "danger",
                onClick: () => {
                  resource.removeRows(resource.selectedIds);
                  setToast("Selected categories deleted.");
                },
              },
            ]}
            onClear={() => resource.setSelectedIds([])}
          />

          <ResourceTable
            columns={columns}
            rows={resource.visibleRows}
            rowActions={categoryActions}
            onView={setViewing}
            sortKey={resource.sortKey}
            sortDirection={resource.sortDirection}
            onSort={resource.changeSort}
            selectedIds={resource.selectedIds}
            onToggleSelected={resource.toggleSelected}
            onToggleAll={resource.toggleVisibleRows}
            page={resource.page}
            pageCount={resource.pageCount}
            pageSize={resource.pageSize}
            totalCount={resource.totalCount}
            onPageChange={resource.setPage}
            onPageSizeChange={resource.changePageSize}
            onClearFilters={resource.clearFilters}
            loading={resource.loading}
            error={resource.error}
            onRetry={resource.retry}
            emptyTitle="No categories match your filters"
          />
        </div>

        <Card className="h-fit p-5">
          <h2 className="text-base font-normal text-slate-800">Add category</h2>
          <p className="mt-1 text-xs font-normal text-slate-500">
            New categories begin as Draft until activated.
          </p>
          <form onSubmit={addCategory} noValidate>
            <label className="mt-5 block">
              <span className="sr-only">Category name</span>
              <input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setNameError("");
                }}
                aria-invalid={Boolean(nameError)}
                placeholder="Category name"
                className="h-11 w-full rounded-[30px] border border-[#E5E7EB] px-4 text-xs outline-none focus:border-brandRed"
              />
              {nameError && (
                <span className="mt-1 block text-xs font-semibold text-brandRed">
                  {nameError}
                </span>
              )}
            </label>
            <button
              type="submit"
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[30px] bg-brandRed text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark"
            >
              <Plus size={16} /> Add Category
            </button>
          </form>
        </Card>
      </div>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit category"
      >
        {editing && (
          <form onSubmit={saveCategory} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                Category name
              </span>
              <input
                value={editing.name}
                onChange={(event) =>
                  setEditing((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-[30px] border border-[#E5E7EB] px-4 text-xs outline-none focus:border-brandRed"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">
                Parent category
              </span>
              <select
                value={editing.parent}
                onChange={(event) =>
                  setEditing((current) => ({
                    ...current,
                    parent: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs outline-none focus:border-brandRed"
              >
                <option>—</option>
                {resource.rows
                  .filter((row) => row.id !== editing.id)
                  .map((row) => (
                    <option key={row.id}>{row.name}</option>
                  ))}
              </select>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="h-10 rounded-[30px] border border-[#E5E7EB] px-4 text-xs font-medium text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white"
              >
                Save Category
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="Category Details"
      >
        {viewing && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between rounded-[20px] border border-[#F3E5E5] bg-[#FAF8F5] p-4">
              <div>
                <h4 className="text-base font-semibold text-slate-900">
                  {viewing.name}
                </h4>
                <p className="mt-0.5 text-slate-500">ID: {viewing.id}</p>
              </div>
              <StatusBadge value={viewing.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Parent Category", viewing.parent],
                ["Subcategories", viewing.children],
                ["Associated Shops", viewing.shops],
                ["Total Products", viewing.products],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="block text-[10px] text-slate-400">{label}</span>
                  <span className="mt-0.5 block text-xs font-semibold text-slate-800">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingToggle)}
        title={`${pendingToggle?.status === "Active" ? "Deactivate" : "Activate"} category`}
        description={`${pendingToggle?.name ?? "This category"} will ${pendingToggle?.status === "Active" ? "stop appearing in active marketplace taxonomy" : "become available to the marketplace"}.`}
        confirmLabel="Confirm status change"
        tone={pendingToggle?.status === "Active" ? "danger" : "success"}
        onConfirm={confirmToggle}
        onClose={() => setPendingToggle(null)}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete category ${pendingDelete?.name ?? ""}`}
        description={`Are you sure you want to delete ${pendingDelete?.name ?? "this category"}? This will remove it from the taxonomy.`}
        confirmLabel="Delete Category"
        tone="danger"
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
