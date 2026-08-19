import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Eye, Trash2 } from "lucide-react";
import {
  Card,
  ConfirmDialog,
  Modal,
  PageHeader,
  StatusBadge,
  Toast,
} from "../../shared/ui";
import { categories as seed } from "../../shared/adminData";

export default function CategoriesPage() {
  const [rows, setRows] = useState(seed);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingToggle, setPendingToggle] = useState(null);
  const [toast, setToast] = useState("");

  function confirmDelete() {
    if (!pendingDelete) return;
    setRows((current) => current.filter((r) => r.id !== pendingDelete.id));
    setToast(`${pendingDelete.name} category deleted.`);
    setPendingDelete(null);
  }

  function addCategory(event) {
    event.preventDefault();

    if (!name.trim()) {
      setNameError("Category name is required.");
      return;
    }
    if (rows.some((row) => row.name.toLowerCase() === name.trim().toLowerCase())) {
      setNameError("A category with this name already exists.");
      return;
    }

    setRows((current) => [
      ...current,
      {
        id: `CAT-${String(current.length + 1).padStart(2, "0")}`,
        name: name.trim(),
        parent: "—",
        children: 0,
        shops: 0,
        products: 0,
        status: "Draft",
      },
    ]);
    setName("");
    setToast("Category created as Draft.");
  }

  function saveCategory(event) {
    event.preventDefault();

    if (!editing.name.trim()) {
      return;
    }

    setRows((current) =>
      current.map((row) => (row.id === editing.id ? { ...row, ...editing } : row)),
    );
    setToast("Category updated.");
    setEditing(null);
  }

  function move(index, direction) {
    setRows((current) => {
      const next = [...current];
      const target = index + direction;

      if (target < 0 || target >= next.length) {
        return current;
      }

      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setToast("Category order updated.");
  }

  function confirmToggle() {
    const nextStatus = pendingToggle.status === "Active" ? "Inactive" : "Active";
    setRows((current) =>
      current.map((row) =>
        row.id === pendingToggle.id ? { ...row, status: nextStatus } : row,
      ),
    );
    setToast(`${pendingToggle.name} marked ${nextStatus.toLowerCase()}.`);
    setPendingToggle(null);
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage marketplace taxonomy, hierarchy, status, and navigation order."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <Card className="overflow-hidden">
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-[850px] text-left">
              <thead className="bg-lightBackground">
                <tr>
                  {["Category", "Parent", "Subcategories", "Shops", "Products", "Status", "Actions"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-textMuted"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-lightBorder">
                {rows.map((row, index) => (
                  <tr key={row.id}>
                    <td className="px-4 py-4 font-semibold">{row.name}</td>
                    <td className="px-4 py-4 text-sm text-textSecondary">{row.parent}</td>
                    <td className="px-4 py-4 text-sm">{row.children}</td>
                    <td className="px-4 py-4 text-sm">{row.shops}</td>
                    <td className="px-4 py-4 text-sm">{row.products}</td>
                    <td className="px-4 py-4">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex min-w-max items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewing(row)}
                          aria-label={`View ${row.name}`}
                          title={`View Details of ${row.name}`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-lightBorder text-slate-600 hover:border-brandRed hover:text-brandRed transition"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing({ ...row })}
                          aria-label={`Edit ${row.name}`}
                          title={`Edit ${row.name}`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-lightBorder text-slate-600 hover:border-brandRed hover:text-brandRed transition"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => move(index, -1)}
                          aria-label={`Move ${row.name} up`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-lightBorder text-slate-600 disabled:opacity-40 transition"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          disabled={index === rows.length - 1}
                          onClick={() => move(index, 1)}
                          aria-label={`Move ${row.name} down`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-lightBorder text-slate-600 disabled:opacity-40 transition"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingToggle(row)}
                          className="h-9 rounded-lg border border-lightBorder px-2.5 text-xs font-semibold text-slate-700 hover:border-brandRed transition"
                        >
                          {row.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(row)}
                          aria-label={`Delete ${row.name}`}
                          title={`Delete ${row.name}`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-lightBorder md:hidden">
            {rows.map((row, index) => (
              <article key={row.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{row.name}</p>
                    <p className="mt-1 text-xs text-textMuted">
                      {row.products} products · {row.shops} shops
                    </p>
                  </div>
                  <StatusBadge value={row.status} />
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setViewing(row)} className="p-2 rounded-lg border border-lightBorder text-slate-600">
                      <Eye size={15} />
                    </button>
                    <button type="button" onClick={() => setEditing({ ...row })} className="p-2 rounded-lg bg-brandRed text-white">
                      <Pencil size={15} />
                    </button>
                    <button type="button" onClick={() => setPendingDelete(row)} className="p-2 rounded-lg border border-rose-200 text-rose-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button type="button" disabled={index === 0} onClick={() => move(index, -1)} className="px-2 py-1 rounded-lg border text-xs disabled:opacity-40">
                      Up
                    </button>
                    <button type="button" disabled={index === rows.length - 1} onClick={() => move(index, 1)} className="px-2 py-1 rounded-lg border text-xs disabled:opacity-40">
                      Down
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card className="h-fit p-5">
          <h2 className="text-base font-normal text-slate-800">Add category</h2>
          <p className="mt-1 text-xs text-slate-500 font-normal">
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
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[30px] bg-brandRed text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer"
            >
              <Plus size={16} /> Add Category
            </button>
          </form>
        </Card>
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit category">
        {editing && (
          <form onSubmit={saveCategory} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Category name</span>
              <input
                value={editing.name}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, name: event.target.value }))
                }
                className="h-11 w-full rounded-[30px] border border-[#E5E7EB] px-4 text-xs outline-none focus:border-brandRed"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">Parent category</span>
              <select
                value={editing.parent}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, parent: event.target.value }))
                }
                className="h-11 w-full rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs outline-none focus:border-brandRed"
              >
                <option>—</option>
                {rows
                  .filter((row) => row.id !== editing.id)
                  .map((row) => <option key={row.id}>{row.name}</option>)}
              </select>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="h-10 rounded-[30px] border border-[#E5E7EB] px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer"
              >
                Save Category
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Category Details">
        {viewing && (
          <div className="space-y-4 text-xs">
            <div className="bg-[#FAF8F5] p-4 rounded-[20px] border border-[#F3E5E5] flex justify-between items-center">
              <div>
                <h4 className="text-base font-semibold text-slate-900">{viewing.name}</h4>
                <p className="text-slate-500 mt-0.5">ID: {viewing.id}</p>
              </div>
              <StatusBadge value={viewing.status} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Parent Category</span>
                <span className="font-semibold text-slate-800 text-xs block mt-0.5">{viewing.parent}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Subcategories Count</span>
                <span className="font-semibold text-slate-800 text-xs block mt-0.5">{viewing.children}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Associated Shops</span>
                <span className="font-semibold text-slate-800 text-xs block mt-0.5">{viewing.shops} Shops</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Total Products</span>
                <span className="font-semibold text-slate-800 text-xs block mt-0.5">{viewing.products} Products</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewing(null)}
                className="h-10 rounded-[25px] border border-[#E5E7EB] px-4 text-xs font-normal text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing({ ...viewing });
                  setViewing(null);
                }}
                className="h-10 rounded-[25px] bg-brandRed px-4 text-xs font-semibold text-white"
              >
                Edit Category
              </button>
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
