import { useEffect, useMemo, useState } from "react";
import {
  Card,
  ConfirmDialog,
  Drawer,
  ErrorState,
  FilterBar,
  LoadingState,
  PageHeader,
  Toast,
} from "../ui";
import ResourceTable from "./ResourceTable";
import { useResourceList } from "./useResourceList";

function singularize(title) {
  if (title.endsWith("ies")) {
    return `${title.slice(0, -3)}y`;
  }

  return title.endsWith("s") ? title.slice(0, -1) : title;
}

function createStableId(title) {
  const prefix = title.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

export default function ResourcePage({
  title,
  description,
  seed = [],
  columns = [],
  createLabel,
  searchPlaceholder,
}) {
  const [drawerState, setDrawerState] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [toast, setToast] = useState("");
  const resource = useResourceList(seed);
  const entityName = singularize(title);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const selectedRecord = useMemo(
    () =>
      drawerState?.id
        ? resource.rows.find((row) => row.id === drawerState.id)
        : null,
    [drawerState, resource.rows],
  );

  function requestStatusToggle(row) {
    const nextStatus = row.status === "Active" ? "Suspended" : "Active";
    setPendingAction({
      type: "status",
      ids: [row.id],
      nextStatus,
      title: `${nextStatus === "Active" ? "Activate" : "Suspend"} ${entityName}`,
      description: `${row.id} will be marked ${nextStatus.toLowerCase()}. This frontend state can be changed again later.`,
    });
  }

  function requestBulkStatus(nextStatus) {
    setPendingAction({
      type: "status",
      ids: resource.selectedIds,
      nextStatus,
      title: `${nextStatus} selected ${title.toLowerCase()}`,
      description: `${resource.selectedIds.length} selected record(s) will be updated.`,
    });
  }

  function requestBulkDelete() {
    setPendingAction({
      type: "delete",
      ids: resource.selectedIds,
      title: `Remove selected ${title.toLowerCase()}`,
      description:
        "The selected records will be removed from this frontend session. A production backend must enforce and audit this action.",
    });
  }

  function confirmAction() {
    if (pendingAction.type === "delete") {
      resource.removeRows(pendingAction.ids);
      setToast(`${pendingAction.ids.length} ${title.toLowerCase()} removed.`);
    } else {
      resource.updateRows(pendingAction.ids, {
        status: pendingAction.nextStatus,
      });
      setToast(
        `${pendingAction.ids.length} record(s) marked ${pendingAction.nextStatus.toLowerCase()}.`,
      );
    }

    setPendingAction(null);
  }

  function saveRecord(values) {
    if (drawerState?.mode === "create") {
      const record = {
        id: createStableId(title),
        ...values,
      };
      resource.createRow(record);
      setToast(`${entityName} created in local Admin state.`);
    } else {
      resource.updateRow(drawerState.id, values);
      setToast(`${entityName} updated.`);
    }

    setDrawerState(null);
  }

  return (
    <div className="min-w-0">
      <PageHeader
        title={title}
        description={description}
        action={createLabel}
        onAction={() => setDrawerState({ mode: "create" })}
      />

      <FilterBar
        value={resource.search}
        setValue={resource.setSearch}
        status={resource.status}
        setStatus={resource.setStatus}
        options={resource.statuses}
        onClear={resource.clearFilters}
        placeholder={searchPlaceholder}
      />

      {resource.selectedIds.length > 0 && (
        <Card className="mb-4 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold">
            {resource.selectedIds.length} selected
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => requestBulkStatus("Active")}
              className="min-h-10 rounded-lg border border-lightBorder px-3 text-xs font-semibold hover:border-emerald-500 hover:text-emerald-700"
            >
              Activate
            </button>
            <button
              type="button"
              onClick={() => requestBulkStatus("Suspended")}
              className="min-h-10 rounded-lg border border-lightBorder px-3 text-xs font-semibold hover:border-brandRed hover:text-brandRed"
            >
              Suspend
            </button>
            <button
              type="button"
              onClick={requestBulkDelete}
              className="min-h-10 rounded-lg bg-brandRed px-3 text-xs font-semibold text-white hover:bg-brandRedDark"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={() => resource.setSelectedIds([])}
              className="min-h-10 px-3 text-xs font-semibold text-textSecondary"
            >
              Clear selection
            </button>
          </div>
        </Card>
      )}

      {resource.loading ? (
        <Card>
          <LoadingState />
        </Card>
      ) : resource.error ? (
        <Card>
          <ErrorState message={resource.error} onRetry={resource.retry} />
        </Card>
      ) : (
        <ResourceTable
          columns={columns}
          rows={resource.visibleRows}
          onView={(row) => setDrawerState({ mode: "edit", id: row.id })}
          onToggle={requestStatusToggle}
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
        />
      )}

      <Drawer
        open={Boolean(drawerState)}
        onClose={() => setDrawerState(null)}
        title={drawerState?.mode === "create" ? `Create ${entityName}` : `Manage ${entityName}`}
      >
        <ResourceForm
          columns={columns}
          record={selectedRecord}
          mode={drawerState?.mode}
          onCancel={() => setDrawerState(null)}
          onSave={saveRecord}
        />
      </Drawer>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.title}
        description={pendingAction?.description}
        confirmLabel={pendingAction?.type === "delete" ? "Remove" : "Confirm change"}
        tone={pendingAction?.nextStatus === "Active" ? "success" : "danger"}
        onConfirm={confirmAction}
        onClose={() => setPendingAction(null)}
      />

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function ResourceForm({ columns, record, mode, onCancel, onSave }) {
  const editableColumns = columns.filter(
    (column) => !["id", "created", "joined", "updated", "date"].includes(column.key),
  );
  const [values, setValues] = useState(() => ({ ...record }));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues({ ...record });
    setErrors({});
  }, [record, mode]);

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    editableColumns.slice(0, 6).forEach((column) => {
      if (!String(values[column.key] ?? "").trim()) {
        nextErrors[column.key] = `${column.label} is required.`;
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave(values);
  }

  if (editableColumns.length === 0) {
    return (
      <p className="text-sm text-textSecondary">
        This record has no editable fields in the current frontend schema.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <p className="rounded-xl bg-promoHighlight p-3 text-sm text-textSecondary">
        Changes are stored in local Phase 4 state. Backend persistence and audit
        logging will be connected in a later phase.
      </p>

      {editableColumns.slice(0, 6).map((column) => (
        <label key={column.key} className="block">
          <span className="mb-1.5 block text-sm font-semibold">
            {column.label}
          </span>
          <input
            value={values[column.key] ?? ""}
            onChange={(event) => {
              setValues((current) => ({
                ...current,
                [column.key]: event.target.value,
              }));
              setErrors((current) => ({ ...current, [column.key]: "" }));
            }}
            aria-invalid={Boolean(errors[column.key])}
            aria-describedby={`${column.key}-error`}
            className="h-11 w-full rounded-lg border border-lightBorder px-3 text-sm outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
          />
          {errors[column.key] && (
            <span
              id={`${column.key}-error`}
              className="mt-1 block text-xs font-semibold text-brandRed"
            >
              {errors[column.key]}
            </span>
          )}
        </label>
      ))}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-11 rounded-lg border border-lightBorder px-4 text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="min-h-11 rounded-lg bg-brandRed px-4 text-sm font-semibold text-white hover:bg-brandRedDark"
        >
          {mode === "create" ? "Create record" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
