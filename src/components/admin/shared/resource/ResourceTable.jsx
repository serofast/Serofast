import { useState } from "react";
import {
  CheckCircle2,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  Pagination,
  StatusBadge,
} from "../ui";

const compactKeys = /^(id|status|stock|orders|items|quantity|rating|priority)$/i;
const dateKeys = /(date|created|updated|joined|last|eta|time|requested)$/i;
const numericKeys = /(amount|price|revenue|value|total|sales|stock|orders|items|quantity|rating)$/i;
const wideKeys = /(name|product|shop|customer|email|subject|review|reason|description|address|entity|category)$/i;

function columnWidth(column) {
  if (column.minWidth) return column.minWidth;
  if (wideKeys.test(column.key)) return 210;
  if (dateKeys.test(column.key)) return 150;
  if (numericKeys.test(column.key)) return 120;
  if (compactKeys.test(column.key)) return 125;
  return 150;
}

function cellClassName(column) {
  return compactKeys.test(column.key) || dateKeys.test(column.key) || numericKeys.test(column.key)
    ? "whitespace-nowrap"
    : "min-w-0";
}

function rawCellValue(row, column) {
  const value = row[column.key];
  return value === null || value === undefined || value === "" ? "—" : value;
}

const actionToneClasses = {
  default: "text-slate-500 hover:bg-rose-50 hover:text-brandRed",
  primary: "text-brandRed hover:bg-rose-50",
  success: "text-emerald-600 hover:bg-emerald-50",
  warning: "text-amber-600 hover:bg-amber-50",
  danger: "text-rose-600 hover:bg-rose-50",
};

function defaultRowActions(row, { onView, onToggle, onDelete }) {
  const actions = [
    { label: "View Details", shortLabel: "View", icon: Eye, onClick: () => onView(row), tone: "primary" },
    { label: "Edit Record", shortLabel: "Edit", icon: Pencil, onClick: () => onView(row) },
  ];

  if (row.status) {
    actions.push({
      label: row.status === "Active" ? "Suspend Record" : "Activate Record",
      shortLabel: row.status === "Active" ? "Suspend" : "Activate",
      icon: row.status === "Active" ? CheckCircle2 : XCircle,
      onClick: () => onToggle(row),
      tone: row.status === "Active" ? "success" : "warning",
    });
  }

  if (onDelete) {
    actions.push({
      label: "Delete Record",
      shortLabel: "Delete",
      icon: Trash2,
      onClick: () => onDelete(row),
      tone: "danger",
    });
  }

  return actions;
}

function DesktopAction({ action }) {
  const ActionIcon = action.icon ?? MoreHorizontal;
  return (
    <button
      type="button"
      disabled={action.disabled}
      onClick={action.onClick}
      aria-label={action.label}
      title={action.label}
      className={`rounded-full p-2 transition disabled:cursor-not-allowed disabled:opacity-35 ${actionToneClasses[action.tone ?? "default"]}`}
    >
      <ActionIcon size={16} />
    </button>
  );
}

export default function ResourceTable({
  columns = [],
  rows = [],
  onView = () => {},
  onToggle = () => {},
  onDelete = null,
  rowActions,
  sortKey,
  sortDirection,
  onSort = () => {},
  selectable = true,
  selectedIds = [],
  onToggleSelected = () => {},
  onToggleAll = () => {},
  page,
  pageCount,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onClearFilters,
  loading = false,
  error = null,
  onRetry,
  emptyTitle = "No records found",
  emptyDescription = "Try changing or clearing the current filters.",
  showPagination = true,
}) {
  const [expandedActionsId, setExpandedActionsId] = useState(null);
  const renderableColumns = columns.map((column) => ({
    ...column,
    width: columnWidth(column),
    render:
      column.render ||
      ((row) =>
        column.key === "status" ? (
          <StatusBadge value={row[column.key]} />
        ) : (
          rawCellValue(row, column)
        )),
  }));
  const mobileCandidates = renderableColumns.filter(
    (column) => column.mobile !== false && column.key !== "status",
  );
  const primaryMobileColumn =
    mobileCandidates.find((column) => wideKeys.test(column.key)) ??
    mobileCandidates.find((column) => column.key !== "id") ??
    mobileCandidates[0] ??
    { key: "id", label: "ID", render: (row) => row.id };
  const mobileColumns = mobileCandidates
    .filter(
      (column) =>
        column.key !== primaryMobileColumn.key && column.key !== "id",
    )
    .slice(0, 3);
  const selectionWidth = selectable ? 64 : 0;
  const tableMinWidth =
    selectionWidth +
    renderableColumns.reduce((total, column) => total + column.width, 0) +
    200;
  const getActions = (row) =>
    (rowActions
      ? rowActions(row)
      : defaultRowActions(row, { onView, onToggle, onDelete })
    ).filter((action) => !action.hidden);

  return (
    <div className="overflow-hidden rounded-[35px] border border-[#F3E5E5] bg-white shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]">
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={onClearFilters ? "Clear filters" : undefined}
          onAction={onClearFilters}
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto smooth-scroll-x md:block">
            <table
              className="w-full text-left text-xs"
              style={{ minWidth: tableMinWidth }}
            >
              <thead className="border-b border-slate-100 bg-[#FAF8F5]">
                <tr>
                  {selectable && (
                    <th
                      aria-label="Row selection"
                      className="sticky left-0 top-0 z-20 w-14 bg-[#FAF8F5] px-4 py-3.5"
                    />
                  )}
                  {renderableColumns.map((column) => (
                    <th
                      key={column.key}
                      className="sticky top-0 z-10 bg-[#FAF8F5] px-4 py-3.5"
                      style={{ minWidth: column.width }}
                    >
                      <button
                        type="button"
                        onClick={() => onSort(column.key)}
                        className="inline-flex min-h-8 items-center gap-1 whitespace-nowrap font-normal text-slate-600 hover:text-slate-900"
                      >
                        {column.label}
                        <span className="w-4 text-center" aria-hidden="true">
                          {sortKey === column.key
                            ? sortDirection === "asc"
                              ? "↑"
                              : "↓"
                            : "↕"}
                        </span>
                      </button>
                    </th>
                  ))}
                  <th className="sticky right-0 top-0 z-20 min-w-[200px] bg-[#FAF8F5] px-4 py-3.5 text-right font-normal text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {rows.map((row) => {
                  const actions = getActions(row);
                  const isSelected = selectedIds.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      onClick={() => onView(row)}
                      className={`cursor-pointer transition ${
                        isSelected ? "bg-rose-50/60" : "hover:bg-slate-50/50"
                      }`}
                    >
                      {selectable && (
                        <td
                          className={`sticky left-0 z-10 px-4 py-4 ${
                            isSelected ? "bg-rose-50" : "bg-white"
                          }`}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            aria-label={`Select ${row.id}`}
                            checked={isSelected}
                            onChange={() => onToggleSelected(row.id)}
                            className="h-4 w-4 accent-brandRed"
                          />
                        </td>
                      )}
                      {renderableColumns.map((column) => (
                        <td
                          key={column.key}
                          className={`px-4 py-4 text-sm text-slate-600 ${cellClassName(column)} ${column.cellClassName ?? ""}`}
                        >
                          <div
                            className={
                              wideKeys.test(column.key)
                                ? "max-w-[260px] truncate"
                                : ""
                            }
                            title={
                              typeof rawCellValue(row, column) === "string"
                                ? rawCellValue(row, column)
                                : undefined
                            }
                          >
                            {column.render(row)}
                          </div>
                        </td>
                      ))}
                      <td
                        className={`sticky right-0 z-10 px-4 py-4 text-right ${
                          isSelected ? "bg-rose-50" : "bg-white"
                        }`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className="flex min-w-max items-center justify-end gap-1">
                          {actions.map((action) => (
                            <DesktopAction key={action.label} action={action} />
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {rows.map((row) => {
              const actions = getActions(row);
              const primaryAction = actions[0];
              const secondaryActions = actions.slice(1);
              return (
                <article key={row.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {selectable && (
                      <input
                        type="checkbox"
                        aria-label={`Select ${row.id}`}
                        checked={selectedIds.includes(row.id)}
                        onChange={() => onToggleSelected(row.id)}
                        className="mt-1 h-4 w-4 shrink-0 accent-brandRed"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => onView(row)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-slate-900">
                            {rawCellValue(row, primaryMobileColumn)}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] font-normal text-slate-500">
                            {row.id}
                          </p>
                        </div>
                        {row.status && <StatusBadge value={row.status} />}
                      </div>
                    </button>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                    {mobileColumns.map((column) => (
                      <div key={column.key} className="min-w-0">
                        <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                          {column.mobileLabel ?? column.label}
                        </dt>
                        <dd className="mt-0.5 truncate text-xs font-normal text-slate-600">
                          {column.render(row)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {actions.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {primaryAction && (
                        <button
                          type="button"
                          disabled={primaryAction.disabled}
                          onClick={primaryAction.onClick}
                          className="h-10 flex-1 rounded-[30px] bg-brandRed px-3 text-[11px] font-semibold text-white disabled:opacity-40"
                        >
                          {primaryAction.shortLabel ?? primaryAction.label}
                        </button>
                      )}
                      {secondaryActions.length > 0 && (
                        <button
                          type="button"
                          aria-expanded={expandedActionsId === row.id}
                          onClick={() =>
                            setExpandedActionsId((current) =>
                              current === row.id ? null : row.id,
                            )
                          }
                          className="h-10 flex-1 rounded-[30px] border border-[#E5E7EB] px-3 text-[11px] font-medium text-slate-600"
                        >
                          More
                        </button>
                      )}
                    </div>
                  )}
                  {expandedActionsId === row.id && secondaryActions.length > 0 && (
                    <div className="mt-2 grid gap-1 rounded-[20px] bg-[#FAF8F5] p-2">
                      {secondaryActions.map((action) => {
                        const ActionIcon = action.icon ?? MoreHorizontal;
                        return (
                          <button
                            key={action.label}
                            type="button"
                            disabled={action.disabled}
                            onClick={action.onClick}
                            className={`flex min-h-10 items-center gap-2 rounded-xl bg-white px-3 text-left text-[11px] font-medium disabled:opacity-40 ${actionToneClasses[action.tone ?? "default"]}`}
                          >
                            <ActionIcon size={15} />
                            {action.shortLabel ?? action.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}

      {showPagination && !loading && !error && (
        <Pagination
          page={page}
          pageCount={pageCount}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}
