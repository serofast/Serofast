import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus } from "lucide-react";
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
  const [pendingToggle, setPendingToggle] = useState(null);
  const [toast, setToast] = useState("");

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
                      <div className="flex min-w-max gap-2">
                        <button
                          type="button"
                          onClick={() => setEditing({ ...row })}
                          aria-label={`Edit ${row.name}`}
                          className="grid h-10 w-10 place-items-center rounded-lg border border-lightBorder hover:border-brandRed"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => move(index, -1)}
                          aria-label={`Move ${row.name} up`}
                          className="grid h-10 w-10 place-items-center rounded-lg border border-lightBorder disabled:opacity-40"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          disabled={index === rows.length - 1}
                          onClick={() => move(index, 1)}
                          aria-label={`Move ${row.name} down`}
                          className="grid h-10 w-10 place-items-center rounded-lg border border-lightBorder disabled:opacity-40"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingToggle(row)}
                          className="min-h-10 rounded-lg border border-lightBorder px-3 text-xs font-semibold"
                        >
                          {row.status === "Active" ? "Deactivate" : "Activate"}
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
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setEditing({ ...row })}
                    className="min-h-10 rounded-lg bg-brandRed px-3 text-xs font-semibold text-white">
                    Edit
                  </button>
                  <button type="button" onClick={() => setPendingToggle(row)}
                    className="min-h-10 rounded-lg border border-lightBorder px-3 text-xs font-semibold">
                    {row.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button type="button" disabled={index === 0} onClick={() => move(index, -1)}
                    className="min-h-10 rounded-lg border border-lightBorder px-3 text-xs font-semibold disabled:opacity-40">
                    Move up
                  </button>
                  <button type="button" disabled={index === rows.length - 1} onClick={() => move(index, 1)}
                    className="min-h-10 rounded-lg border border-lightBorder px-3 text-xs font-semibold disabled:opacity-40">
                    Move down
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card className="h-fit p-5">
          <h2 className="text-lg font-semibold">Add category</h2>
          <p className="mt-1 text-sm text-textSecondary">
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
                className="h-11 w-full rounded-lg border border-lightBorder px-3 text-sm outline-none focus:border-brandRed"
              />
              {nameError && (
                <span className="mt-1 block text-xs font-semibold text-brandRed">
                  {nameError}
                </span>
              )}
            </label>
            <button
              type="submit"
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brandRed text-sm font-semibold text-white"
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
              <span className="mb-1.5 block text-sm font-semibold">Category name</span>
              <input
                value={editing.name}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, name: event.target.value }))
                }
                className="h-11 w-full rounded-lg border border-lightBorder px-3 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Parent category</span>
              <select
                value={editing.parent}
                onChange={(event) =>
                  setEditing((current) => ({ ...current, parent: event.target.value }))
                }
                className="h-11 w-full rounded-lg border border-lightBorder bg-white px-3 text-sm"
              >
                <option>—</option>
                {rows
                  .filter((row) => row.id !== editing.id)
                  .map((row) => <option key={row.id}>{row.name}</option>)}
              </select>
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="min-h-11 rounded-lg border border-lightBorder px-4 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-11 rounded-lg bg-brandRed px-4 text-sm font-semibold text-white"
              >
                Save Category
              </button>
            </div>
          </form>
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

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
