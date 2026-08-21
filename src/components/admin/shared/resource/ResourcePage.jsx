import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  AdminSelect,
  Card,
  BulkActionBar,
  ConfirmDialog,
  Drawer,
  ErrorState,
  FilterBar,
  LoadingState,
  PageHeader,
  StatGrid,
  StatusCard,
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

const moneyValue = (value) => Number(String(value ?? "").replace(/[^0-9.]/g, "")) || 0;

const controlledFields = {
  Shops: {
    category: ["Fashion", "Electronics", "Beauty", "Home"],
    status: ["Active", "Pending", "Suspended"],
  },
  Customers: {
    status: ["Active", "Blocked", "Suspended"],
  },
  Products: {
    shop: [],
    category: ["Fashion", "Electronics", "Beauty", "Home"],
    status: ["Active", "Suspended", "Low Stock", "Out of Stock"],
  },
  Orders: {
    customer: [],
    shop: [],
    payment: ["Paid", "Pending", "Failed", "Refunded"],
    status: ["Processing", "Shipped", "Delivered", "Returned", "Cancelled"],
  },
  Inventory: {
    product: [],
    shop: [],
    velocity: ["Fast", "Medium", "Slow"],
    status: ["In Stock", "Low Stock", "Out of Stock"],
  },
  Returns: {
    order: [],
    customer: [],
    shop: [],
    product: [],
    status: ["Requested", "Approved", "Rejected", "Completed"],
  },
  Reviews: {
    rating: ["1", "2", "3", "4", "5"],
    customer: [],
    product: [],
    shop: [],
    status: ["Published", "Reported", "Hidden"],
  },
  Delivery: {
    order: [],
    shop: [],
    customer: [],
    courier: ["SeroFast Express", "Delhivery", "Blue Dart", "India Post"],
    status: ["Processing", "Shipped", "Delivered", "Delayed", "Returned"],
  },
  Transactions: {
    type: ["Order Payment", "Withdrawal", "Refund", "Commission"],
    order: [],
    user: [],
    status: ["Completed", "Pending", "Failed"],
  },
  Refunds: {
    order: [],
    customer: [],
    shop: [],
    status: ["Pending", "Processed", "Rejected"],
  },
  Support: {
    requester: [],
    type: ["Customer", "Seller", "Internal"],
    priority: ["Low", "Medium", "High", "Critical"],
    status: ["Open", "In Progress", "Escalated", "Resolved", "Closed"],
  },
  "Admin Users": {
    role: ["Super Admin", "Operations Admin", "Finance Admin", "Support Admin", "Marketing Admin", "Catalog Admin"],
    status: ["Active", "Inactive", "Suspended"],
  },
  Coupons: {
    type: ["Fixed", "Percent"],
    status: ["Draft", "Active", "Inactive", "Expired"],
  },
  Campaigns: {
    audience: ["All Customers", "New Customers", "Returning Customers", "Students", "Sellers"],
    status: ["Draft", "Scheduled", "Running", "Paused", "Completed"],
  },
  Banners: {
    placement: ["Hero", "Promotion", "Category", "Checkout"],
    status: ["Draft", "Scheduled", "Active", "Disabled"],
  },
  "Audit Logs": {
    module: ["Dashboard", "Shops", "Products", "Orders", "Finance", "Marketing", "System"],
  },
};

const numericFields = new Set([
  "products",
  "orders",
  "returns",
  "items",
  "stock",
  "threshold",
  "priority",
]);

function optionsForField(title, column, rows) {
  const configuredOptions = controlledFields[title]?.[column.key];
  if (!configuredOptions) return null;

  const existingOptions = rows
    .map((row) => row[column.key])
    .filter((value) => value !== undefined && value !== null && String(value).trim());

  return [...new Set([...configuredOptions, ...existingOptions])];
}

const defaultSummaryCards = {
  Shops: [
    { label: "Total Shops", predicate: () => true, tone: "blue", description: "All seller accounts" },
    { label: "Active", status: "Active", tone: "green", description: "Currently selling" },
    { label: "Pending Approval", status: "Pending", tone: "amber", description: "Documents need review" },
    { label: "Suspended", status: "Suspended", tone: "rose", description: "Selling access restricted" },
  ],
  Customers: [
    { label: "Total Customers", predicate: () => true, tone: "blue" },
    { label: "Active", status: "Active", tone: "green" },
    { label: "High Value", predicate: (row) => moneyValue(row.spent) >= 40000, tone: "purple", description: "Spend above ₹40,000" },
    { label: "Blocked", status: "Blocked", tone: "rose", description: "Account access restricted" },
  ],
  Products: [
    { label: "Total Products", predicate: () => true, tone: "blue" },
    { label: "Active", status: "Active", tone: "green" },
    { label: "Low Stock", status: "Low Stock", tone: "amber", description: "Replenishment needed" },
    { label: "Out of Stock", status: "Out of Stock", tone: "rose", description: "Unavailable for sale" },
  ],
  Orders: [
    { label: "All Orders", predicate: () => true, tone: "blue" },
    { label: "Processing", status: "Processing", tone: "amber" },
    { label: "Shipped", status: "Shipped", tone: "blue" },
    { label: "Delivered", status: "Delivered", tone: "green" },
    { label: "Returned", status: "Returned", tone: "rose" },
  ],
  Inventory: [
    { label: "Tracked Items", predicate: () => true, tone: "blue" },
    { label: "Low Stock", status: "Low Stock", tone: "amber" },
    { label: "Out of Stock", status: "Out of Stock", tone: "rose" },
    { label: "Fast Moving", predicate: (row) => row.velocity === "Fast", tone: "green" },
    { label: "Slow Moving", predicate: (row) => row.velocity === "Slow", tone: "purple" },
  ],
  Returns: [
    { label: "Requested", status: "Requested", tone: "amber" },
    { label: "Approved", status: "Approved", tone: "green" },
    { label: "Refund Value", value: (rows) => `₹${rows.reduce((sum, row) => sum + moneyValue(row.refund), 0).toLocaleString("en-IN")}`, tone: "purple", description: "Across current requests" },
  ],
  Reviews: [
    { label: "Total Reviews", predicate: () => true, tone: "blue" },
    { label: "Published", status: "Published", tone: "green" },
    { label: "Reported", status: "Reported", tone: "rose", description: "Moderation required" },
    { label: "Average Rating", value: (rows) => rows.length ? (rows.reduce((sum, row) => sum + Number(row.rating || 0), 0) / rows.length).toFixed(1) : "0.0", tone: "amber" },
  ],
  Delivery: [
    { label: "All Shipments", predicate: () => true, tone: "blue" },
    { label: "Processing", status: "Processing", tone: "amber" },
    { label: "Shipped", status: "Shipped", tone: "blue" },
    { label: "Delayed", status: "Delayed", tone: "rose", description: "Needs intervention" },
  ],
  Transactions: [
    { label: "All Transactions", predicate: () => true, tone: "blue" },
    { label: "Completed", status: "Completed", tone: "green" },
    { label: "Pending", status: "Pending", tone: "amber" },
    { label: "Gross Value", value: (rows) => `₹${rows.reduce((sum, row) => sum + moneyValue(row.amount), 0).toLocaleString("en-IN")}`, tone: "purple" },
  ],
  Refunds: [
    { label: "All Refunds", predicate: () => true, tone: "blue" },
    { label: "Pending", status: "Pending", tone: "amber" },
    { label: "Processed", status: "Processed", tone: "green" },
    { label: "Refund Value", value: (rows) => `₹${rows.reduce((sum, row) => sum + moneyValue(row.amount), 0).toLocaleString("en-IN")}`, tone: "purple" },
  ],
  Support: [
    { label: "All Tickets", predicate: () => true, tone: "blue" },
    { label: "Open", status: "Open", tone: "amber" },
    { label: "In Progress", status: "In Progress", tone: "blue" },
    { label: "High Priority", predicate: (row) => row.priority === "High", tone: "rose", description: "Needs prompt response" },
  ],
  "Admin Users": [
    { label: "Total Admins", predicate: () => true, tone: "blue" },
    { label: "Active", status: "Active", tone: "green" },
    { label: "Inactive", status: "Inactive", tone: "rose" },
    { label: "Recently Active", predicate: (row) => Boolean(row.lastLogin), tone: "purple" },
  ],
};

export default function ResourcePage({
  title,
  description,
  seed = [],
  columns = [],
  createLabel,
  createPath,
  viewPath,
  editPath,
  headerActions = [],
  routeParam,
  basePath,
  searchPlaceholder,
  summaryCards = [],
}) {
  const [drawerState, setDrawerState] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [toast, setToast] = useState("");
  const resource = useResourceList(seed);
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const entityName = singularize(title);
  const operationalCards = summaryCards.length > 0
    ? summaryCards
    : (defaultSummaryCards[title] ?? []);

  useEffect(() => {
    const requestedStatus = searchParams.get("status") ?? "";
    const requestedSearch = searchParams.get("search") ?? "";
    if (requestedStatus !== resource.status) {
      resource.setStatus(requestedStatus);
    }
    if (requestedSearch !== resource.search) {
      resource.setSearch(requestedSearch);
    }
    // Apply direct dashboard links when the URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const requestedId = routeParam ? params[routeParam] : null;
    if (requestedId && resource.rows.some((row) => String(row.id) === requestedId)) {
      setDrawerState({ mode: "edit", id: requestedId });
    }
  }, [params, resource.rows, routeParam]);

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

    closeDrawer();
  }

  function resolvePath(path, row) {
    return typeof path === "function" ? path(row) : path;
  }

  function openView(row) {
    if (viewPath) {
      navigate(resolvePath(viewPath, row));
      return;
    }
    setDrawerState({ mode: "edit", id: row.id });
  }

  function openEdit(row) {
    if (editPath) {
      navigate(resolvePath(editPath, row));
      return;
    }
    setDrawerState({ mode: "edit", id: row.id });
  }

  function closeDrawer() {
    setDrawerState(null);
    if (routeParam && params[routeParam] && basePath) {
      navigate(basePath, { replace: true });
    }
  }

  function rowActions(row) {
    return [
      {
        label: "View Details",
        shortLabel: "View",
        icon: Eye,
        tone: "primary",
        onClick: () => openView(row),
      },
      {
        label: "Edit Record",
        shortLabel: "Edit",
        icon: Pencil,
        onClick: () => openEdit(row),
      },
      {
        label: row.status === "Active" ? "Suspend Record" : "Activate Record",
        shortLabel: row.status === "Active" ? "Suspend" : "Activate",
        hidden: !row.status,
        tone: row.status === "Active" ? "success" : "warning",
        onClick: () => requestStatusToggle(row),
      },
    ];
  }

  function selectSummary(card) {
    if (card.status) {
      resource.setStatus(card.status);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("status", card.status);
      setSearchParams(nextParams, { replace: true });
      return;
    }
    if (card.predicate) {
      resource.setQuickFilter(card.predicate);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("status");
      setSearchParams(nextParams, { replace: true });
    }
  }

  function changeStatus(value) {
    resource.setStatus(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set("status", value);
    else nextParams.delete("status");
    setSearchParams(nextParams, { replace: true });
  }

  function summaryValue(card) {
    if (typeof card.value === "function") return card.value(resource.rows);
    if (card.value !== undefined) return card.value;
    if (card.predicate) return resource.rows.filter(card.predicate).length;
    if (card.status) return resource.rows.filter((row) => row.status === card.status).length;
    return resource.rows.length;
  }

  return (
    <div className="min-w-0">
      <PageHeader
        title={title}
        description={description}
        action={createLabel}
        onAction={() =>
          createPath
            ? navigate(resolvePath(createPath))
            : setDrawerState({ mode: "create" })
        }
      />

      {headerActions.length > 0 && (
        <nav aria-label={`${title} related pages`} className="mb-5 flex flex-wrap justify-end gap-2">
          {headerActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => action.onClick ? action.onClick() : navigate(action.path)}
              className="flex h-10 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium text-slate-700 transition hover:border-brandRed hover:text-brandRed"
            >
              {action.label}
            </button>
          ))}
        </nav>
      )}

      {operationalCards.length > 0 && (
        <StatGrid className="mb-5">
          {operationalCards.map((card) => (
            <StatusCard
              key={card.label}
              label={card.label}
              value={summaryValue(card)}
              description={card.description}
              tone={card.tone}
              onClick={card.status || card.predicate ? () => selectSummary(card) : undefined}
            />
          ))}
        </StatGrid>
      )}

      <FilterBar
        value={resource.search}
        setValue={resource.setSearch}
        status={resource.status}
        setStatus={changeStatus}
        options={resource.statuses}
        onClear={resource.clearFilters}
        placeholder={searchPlaceholder}
      />

      <BulkActionBar
        count={resource.selectedIds.length}
        actions={[
          { label: "Activate", tone: "success", onClick: () => requestBulkStatus("Active") },
          { label: "Suspend", onClick: () => requestBulkStatus("Suspended") },
          { label: "Remove", tone: "danger", onClick: requestBulkDelete },
        ]}
        onClear={() => resource.setSelectedIds([])}
      />

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
          onView={openView}
          rowActions={rowActions}
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
        onClose={closeDrawer}
        title={drawerState?.mode === "create" ? `Create ${entityName}` : `Manage ${entityName}`}
      >
      <ResourceForm
        title={title}
        columns={columns}
        rows={resource.rows}
        record={selectedRecord}
        mode={drawerState?.mode}
        onCancel={closeDrawer}
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

function ResourceForm({ title, columns, rows, record, mode, onCancel, onSave }) {
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

    editableColumns.forEach((column) => {
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
      <p className="rounded-[20px] bg-[#FAF8F5] border border-[#F3E5E5] p-3 text-xs text-slate-600 font-normal">
        Changes are stored in local Phase 4 state. Backend persistence and audit
        logging will be connected in a later phase.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
      {editableColumns.map((column) => {
        const selectOptions = optionsForField(title, column, rows);
        const isLongText = /(description|reason|review|address|subject)/i.test(column.key);
        const isNumeric = numericFields.has(column.key) || typeof record?.[column.key] === "number";

        return (
        <label
          key={column.key}
          className={`block ${isLongText ? "sm:col-span-2" : ""}`}
        >
          <span className="mb-1.5 block text-xs font-medium text-slate-700">
            {column.label}
          </span>
          {selectOptions ? (
            <AdminSelect
              value={values[column.key] ?? ""}
              onChange={(nextValue) => {
              setValues((current) => ({
                ...current,
                  [column.key]: nextValue,
              }));
              setErrors((current) => ({ ...current, [column.key]: "" }));
              }}
              options={selectOptions}
              placeholder={`Select ${column.label.toLowerCase()}`}
              ariaLabel={column.label}
              buttonClassName={`h-10 ${errors[column.key] ? "border-brandRed" : ""}`}
            />
          ) : isLongText ? (
            <textarea
              value={values[column.key] ?? ""}
              onChange={(event) => {
                setValues((current) => ({ ...current, [column.key]: event.target.value }));
                setErrors((current) => ({ ...current, [column.key]: "" }));
              }}
              rows={4}
              aria-invalid={Boolean(errors[column.key])}
              aria-describedby={`${column.key}-error`}
              className="w-full rounded-[20px] border border-[#E5E7EB] bg-white p-3 text-xs outline-none focus:border-brandRed"
            />
          ) : (
            <input
              type={isNumeric ? "number" : "text"}
              min={isNumeric ? "0" : undefined}
              value={values[column.key] ?? ""}
              onChange={(event) => {
                setValues((current) => ({ ...current, [column.key]: event.target.value }));
                setErrors((current) => ({ ...current, [column.key]: "" }));
              }}
              aria-invalid={Boolean(errors[column.key])}
              aria-describedby={`${column.key}-error`}
              className="h-10 w-full rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs outline-none focus:border-brandRed"
            />
          )}
          {errors[column.key] && (
            <span
              id={`${column.key}-error`}
              className="mt-1 block text-[11px] font-medium text-brandRed"
            >
              {errors[column.key]}
            </span>
          )}
        </label>
        );
      })}
      </div>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-10 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex h-10 items-center justify-center rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer"
        >
          {mode === "create" ? "Create record" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
