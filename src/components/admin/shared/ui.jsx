import Icon from "./legacyIcon";

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700",
  Verified: "bg-emerald-50 text-emerald-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Published: "bg-emerald-50 text-emerald-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Paid: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Processing: "bg-blue-50 text-blue-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Shipped: "bg-sky-50 text-sky-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Returned: "bg-orange-50 text-orange-700",
  Rejected: "bg-rose-50 text-rose-700",
  Blocked: "bg-rose-50 text-rose-700",
  Suspended: "bg-rose-50 text-rose-700",
  "Out of Stock": "bg-rose-50 text-rose-700",
  "Low Stock": "bg-orange-50 text-orange-700",
  Reported: "bg-rose-50 text-rose-700",
  Requested: "bg-amber-50 text-amber-700",
  Draft: "bg-slate-100 text-slate-700",
  Scheduled: "bg-violet-50 text-violet-700",
  Running: "bg-blue-50 text-blue-700",
  Open: "bg-amber-50 text-amber-700",
  Escalated: "bg-rose-50 text-rose-700",
  Resolved: "bg-emerald-50 text-emerald-700",
  Closed: "bg-slate-100 text-slate-700",
  Hidden: "bg-slate-100 text-slate-700",
  Disabled: "bg-slate-100 text-slate-700",
  Inactive: "bg-slate-100 text-slate-700",
  Flagged: "bg-rose-50 text-rose-700",
  Critical: "bg-rose-50 text-rose-700",
  High: "bg-orange-50 text-orange-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-blue-50 text-blue-700",
  "Changes Requested": "bg-amber-50 text-amber-700",
};

const kpiTones = {
  red: "bg-[#FFF1F2] text-brandRed",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  purple: "bg-violet-50 text-violet-700",
  rose: "bg-rose-50 text-rose-700",
};

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-lightBorder bg-lightSurface shadow-bento ${className}`}
    >
      {children}
    </div>
  );
}

export function Header({
  title,
  desc,
  description,
  action,
  actionLabel,
  onAction,
}) {
  const supportingText = desc ?? description;
  const actionText = action ?? actionLabel;

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-brandRed">
          SEROFAST ADMIN
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h1>
        {supportingText && (
          <p className="mt-1 max-w-3xl text-sm text-textSecondary">
            {supportingText}
          </p>
        )}
      </div>

      {actionText && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brandRed px-4 text-sm font-semibold text-white hover:bg-brandRedDark"
        >
          <Icon name="plus" size={16} />
          {actionText}
        </button>
      )}
    </div>
  );
}

export const PageHeader = Header;

export function Badge({ value }) {
  const className = statusStyles[value] ?? "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {value ?? "Unknown"}
    </span>
  );
}

export const StatusBadge = Badge;

export function Kpi({ label, value, change, tone = "red" }) {
  const toneClassName = kpiTones[tone] ?? kpiTones.red;

  return (
    <Card className="flex h-full min-h-[164px] flex-col p-5">
      <div className="flex flex-1 justify-between gap-3">
        <div className="min-w-0">
          <p className="min-h-10 text-sm leading-5 text-textSecondary">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneClassName}`}>
          <Icon name="activity" />
        </div>
      </div>
      {change && (
        <p className="mt-auto pt-3 text-xs font-semibold text-emerald-600">{change}</p>
      )}
    </Card>
  );
}

export function SearchBar({
  value = "",
  setValue = () => {},
  placeholder = "Search...",
}) {
  return (
    <div className="flex h-11 flex-1 items-center gap-2 rounded-lg border border-lightBorder bg-white px-3 focus-within:border-brandRed focus-within:ring-2 focus-within:ring-brandRed/10">
      <Icon name="search" size={16} className="text-textMuted" />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-textMuted"
      />
    </div>
  );
}

export function Table({
  columns = [],
  rows = [],
  onSelect,
  actions,
}) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[#FAF8F5]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-textMuted"
                >
                  {column.label}
                </th>
              ))}
              {actions && (
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-textMuted">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-lightBorder">
            {rows.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                onClick={() => onSelect?.(row)}
                className={onSelect ? "cursor-pointer hover:bg-[#FFF1F2]/40" : ""}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="max-w-xs px-5 py-4 text-sm text-textSecondary"
                  >
                    <div className="truncate">
                      {column.render ? column.render(row) : row[column.key] ?? "—"}
                    </div>
                  </td>
                ))}
                {actions && (
                  <td
                    className="px-5 py-4"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex gap-1.5">{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-lightBorder px-5 py-3 text-xs text-textMuted">
        {rows.length} records
      </div>
    </Card>
  );
}

export function Drawer({ open, onClose, title, children }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 bg-black/25"
        onClick={onClose}
      />
      <aside className="absolute inset-x-0 bottom-0 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border-t border-lightBorder bg-white p-5 shadow-float sm:p-6 md:inset-y-0 md:left-auto md:right-0 md:h-full md:max-h-none md:max-w-xl md:rounded-none md:border-l md:border-t-0 md:p-8">
        <div className="mb-6 flex justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            type="button"
            aria-label="Close drawer"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-lg border border-lightBorder"
          >
            <Icon name="x" />
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}

export function Actions({ onView, onApprove, onReject }) {
  return (
    <>
      {onView && (
        <button
          type="button"
          aria-label="View"
          onClick={onView}
          className="grid h-9 w-9 place-items-center rounded-lg border border-lightBorder hover:border-brandRed"
        >
          <Icon name="eye" size={15} />
        </button>
      )}
      {onApprove && (
        <button
          type="button"
          aria-label="Approve"
          onClick={onApprove}
          className="grid h-9 w-9 place-items-center rounded-lg border border-lightBorder text-emerald-600 hover:bg-emerald-50"
        >
          <Icon name="check" size={15} />
        </button>
      )}
      {onReject && (
        <button
          type="button"
          aria-label="Reject"
          onClick={onReject}
          className="grid h-9 w-9 place-items-center rounded-lg border border-lightBorder text-rose-600 hover:bg-rose-50"
        >
          <Icon name="ban" size={15} />
        </button>
      )}
    </>
  );
}

export function FilterBar({
  value = "",
  setValue = () => {},
  placeholder = "Search records...",
  status = "",
  setStatus = () => {},
  options = [],
  onClear = () => {},
}) {
  return (
    <div className="mb-4 flex min-w-0 flex-col gap-3 lg:flex-row">
      <SearchBar value={value} setValue={setValue} placeholder={placeholder} />
      <div className="flex min-w-0 gap-2 sm:min-w-[260px]">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-11 min-w-0 flex-1 rounded-lg border border-lightBorder bg-white px-3 text-sm"
        >
          <option value="">All statuses</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          aria-label="Clear filters"
          onClick={onClear}
          className="grid h-11 w-11 place-items-center rounded-lg border border-lightBorder"
        >
          <Icon name="refresh" size={16} />
        </button>
      </div>
    </div>
  );
}

export function StatGrid({ children, className = "" }) {
  return (
    <div
      className={`grid grid-cols-2 items-stretch gap-3 xl:grid-cols-3 2xl:grid-cols-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function StatusCard({
  label,
  value,
  description,
  tone = "red",
  onClick,
}) {
  const toneClassName = kpiTones[tone] ?? kpiTones.red;
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`flex h-full min-h-[126px] w-full flex-col rounded-2xl border border-lightBorder bg-lightSurface p-4 text-left shadow-bento transition ${
        onClick
          ? "cursor-pointer hover:-translate-y-0.5 hover:border-brandRed/40 hover:shadow-float focus:outline-none focus:ring-2 focus:ring-brandRed/20"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="min-h-10 text-sm font-semibold leading-5 text-textSecondary">
          {label}
        </p>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${toneClassName}`}>
          <Icon name="activity" size={16} />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold text-textPrimary">{value}</p>
      {description && (
        <p className="mt-auto pt-2 text-xs leading-5 text-textMuted">{description}</p>
      )}
    </Component>
  );
}

export function Pagination({
  page = 1,
  pageCount = 1,
  pageSize = 5,
  totalCount = 0,
  onPageChange = () => {},
  onPageSizeChange = () => {},
}) {
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex min-w-0 flex-col gap-3 border-t border-lightBorder px-4 py-3 text-sm lg:flex-row lg:items-center lg:justify-between">
      <p className="text-textMuted">
        Showing {start}–{end} of {totalCount}
      </p>

      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 sm:justify-start">
        <label className="flex items-center gap-2 text-textSecondary">
          <span className="sr-only sm:not-sr-only">Rows</span>
          <select
            aria-label="Rows per page"
            value={pageSize}
            onChange={(event) => onPageSizeChange(event.target.value)}
            className="h-10 rounded-lg border border-lightBorder bg-white px-2 outline-none focus:border-brandRed"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
          className="hidden h-10 rounded-lg border border-lightBorder px-3 font-semibold disabled:cursor-not-allowed disabled:opacity-40 lg:inline-flex lg:items-center"
        >
          First
        </button>
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-10 rounded-lg border border-lightBorder px-3 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="min-w-16 text-center text-textSecondary">
          {page} / {pageCount}
        </span>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="h-10 rounded-lg border border-lightBorder px-3 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(pageCount)}
          className="hidden h-10 rounded-lg border border-lightBorder px-3 font-semibold disabled:cursor-not-allowed disabled:opacity-40 lg:inline-flex lg:items-center"
        >
          Last
        </button>
      </div>
    </div>
  );
}

export function EmptyState({
  title = "No records found",
  description = "Try changing or clearing the current filters.",
  action,
  onAction,
}) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-promoHighlight text-brandRed">
        <Icon name="search" size={20} />
      </div>
      <h3 className="mt-4 font-semibold text-textPrimary">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-textSecondary">
        {description}
      </p>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 min-h-10 rounded-lg border border-brandRed px-4 text-sm font-semibold text-brandRed"
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function LoadingState({ label = "Loading records…" }) {
  return (
    <div className="flex min-h-48 items-center justify-center gap-3 p-8 text-sm text-textSecondary">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-lightBorder border-t-brandRed" />
      {label}
    </div>
  );
}

export function ErrorState({
  title = "Unable to load data",
  message = "The Admin data could not be loaded. Please try again.",
  onRetry,
}) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-rose-700">
        <Icon name="xcircle" size={20} />
      </div>
      <h3 className="mt-4 font-semibold text-textPrimary">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-textSecondary">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 min-h-10 rounded-lg bg-brandRed px-4 text-sm font-semibold text-white hover:bg-brandRedDark"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function Modal({ open, onClose, title, description, children }) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />
      <Card className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto p-5 shadow-float sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="admin-modal-title" className="text-xl font-bold">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-textSecondary">{description}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-lightBorder"
          >
            <Icon name="x" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </Card>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  tone = "danger",
  onConfirm,
  onClose,
  children,
}) {
  const confirmClassName =
    tone === "danger"
      ? "bg-brandRed text-white hover:bg-brandRedDark"
      : "bg-emerald-600 text-white hover:bg-emerald-700";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
    >
      {children}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 rounded-lg border border-lightBorder px-4 text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`min-h-11 rounded-lg px-4 text-sm font-semibold ${confirmClassName}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export function Toast({ message, onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      className="fixed bottom-5 right-5 z-[100] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-xl bg-textPrimary px-4 py-3 text-sm font-semibold text-white shadow-float"
    >
      <Icon name="check" size={17} className="text-emerald-400" />
      <span>{message}</span>
      <button type="button" aria-label="Dismiss notification" onClick={onClose}>
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}

export function Tabs({ tabs = [], activeTab, onChange = () => {} }) {
  return (
    <div className="overflow-x-auto border-b border-lightBorder" role="tablist">
      <div className="flex min-w-max gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => onChange(tab)}
            className={`min-h-11 border-b-2 px-4 text-sm font-semibold transition ${
              activeTab === tab
                ? "border-brandRed text-brandRed"
                : "border-transparent text-textSecondary hover:text-textPrimary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PermissionGate({ allowed, children, fallback = null }) {
  return allowed ? children : fallback;
}
