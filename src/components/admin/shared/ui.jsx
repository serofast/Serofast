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
    <Card className="p-5">
      <div className="flex justify-between gap-3">
        <div>
          <p className="text-sm text-textSecondary">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${toneClassName}`}>
          <Icon name="activity" />
        </div>
      </div>
      {change && (
        <p className="mt-3 text-xs font-semibold text-emerald-600">{change}</p>
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
      <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-lightBorder bg-white p-6 shadow-float sm:p-8">
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
  status = "",
  setStatus = () => {},
  options = [],
  onClear = () => {},
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row">
      <SearchBar value={value} setValue={setValue} />
      <div className="flex gap-2">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-11 rounded-lg border border-lightBorder bg-white px-3 text-sm"
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
