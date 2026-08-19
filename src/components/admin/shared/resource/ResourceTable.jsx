import { useState } from "react";
import { Card, EmptyState, Pagination, StatusBadge } from "../ui";

const compactKeys = /^(id|status|stock|orders|items|quantity|rating|priority)$/i;
const dateKeys = /(date|created|updated|joined|last|eta|time)$/i;
const numericKeys = /(amount|price|revenue|value|total|sales|stock|orders|items|quantity|rating)$/i;
const wideKeys = /(name|product|shop|customer|email|subject|review|reason|description|address)$/i;

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

export default function ResourceTable({
  columns = [], rows = [], onView = () => {}, onToggle = () => {}, sortKey,
  sortDirection, onSort = () => {}, selectedIds = [], onToggleSelected = () => {},
  onToggleAll = () => {}, page, pageCount, pageSize, totalCount, onPageChange,
  onPageSizeChange, onClearFilters,
}) {
  const [expandedActionsId, setExpandedActionsId] = useState(null);
  const renderableColumns = columns.map((column) => ({
    ...column,
    width: columnWidth(column),
    render: column.render || ((row) =>
      column.key === "status" ? <StatusBadge value={row[column.key]} /> : rawCellValue(row, column)),
  }));
  const mobileCandidates = renderableColumns
    .filter((column) => column.mobile !== false && column.key !== "status");
  const primaryMobileColumn = mobileCandidates.find((column) => wideKeys.test(column.key))
    ?? mobileCandidates.find((column) => column.key !== "id")
    ?? mobileCandidates[0]
    ?? { key: "id", label: "ID", render: (row) => row.id };
  const mobileColumns = mobileCandidates
    .filter((column) => column.key !== primaryMobileColumn.key && column.key !== "id")
    .slice(0, 3);
  const tableMinWidth = 64 + renderableColumns.reduce((total, column) => total + column.width, 0) + 190;
  const allVisibleSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));

  return (
    <div className="rounded-[35px] bg-white border border-[#F3E5E5] shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] overflow-hidden">
      {rows.length === 0 ? (
        <EmptyState action="Clear filters" onAction={onClearFilters} />
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-xs" style={{ minWidth: tableMinWidth }}>
              <thead className="bg-[#FAF8F5] border-b border-slate-100">
                <tr>
                  <th className="sticky left-0 top-0 z-20 w-14 bg-[#FAF8F5] px-4 py-3.5">
                    <input type="checkbox" aria-label="Select all visible rows" checked={allVisibleSelected}
                      onChange={onToggleAll} className="h-4 w-4 accent-brandRed" />
                  </th>
                  {renderableColumns.map((column) => (
                    <th key={column.key} className="sticky top-0 z-10 bg-[#FAF8F5] px-4 py-3.5"
                      style={{ minWidth: column.width }}>
                      <button type="button" onClick={() => onSort(column.key)}
                        className="inline-flex min-h-8 items-center gap-1 whitespace-nowrap font-normal text-slate-600 hover:text-slate-900">
                        {column.label}
                        <span className="w-4 text-center" aria-hidden="true">
                          {sortKey === column.key ? (sortDirection === "asc" ? "\u2191" : "\u2193") : "\u2195"}
                        </span>
                      </button>
                    </th>
                  ))}
                  <th className="sticky right-0 top-0 z-20 min-w-[190px] bg-[#FAF8F5] px-4 py-3.5 font-normal text-slate-600 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {rows.map((row) => (
                  <tr key={row.id} onClick={() => onView(row)}
                    className="cursor-pointer transition hover:bg-slate-50/50">
                    <td className="sticky left-0 z-10 bg-white px-4 py-4"
                      onClick={(event) => event.stopPropagation()}>
                      <input type="checkbox" aria-label={`Select ${row.id}`}
                        checked={selectedIds.includes(row.id)} onChange={() => onToggleSelected(row.id)}
                        className="h-4 w-4 accent-brandRed" />
                    </td>
                    {renderableColumns.map((column) => (
                      <td key={column.key}
                        className={`px-4 py-4 text-sm text-slate-600 ${cellClassName(column)} ${column.cellClassName ?? ""}`}>
                        <div className={wideKeys.test(column.key) ? "max-w-[260px] truncate" : ""}
                          title={typeof rawCellValue(row, column) === "string" ? rawCellValue(row, column) : undefined}>
                          {column.render(row)}
                        </div>
                      </td>
                    ))}
                    <td className="sticky right-0 z-10 bg-white px-4 py-4"
                      onClick={(event) => event.stopPropagation()}>
                      <div className="flex min-w-max gap-2 justify-end">
                        <button type="button" onClick={() => onView(row)}
                          className="flex h-9 items-center justify-center rounded-[30px] bg-brandRed px-4 text-[11px] font-semibold text-white shadow-[0_4px_12px_rgba(211,47,47,0.3)] hover:bg-brandRedDark transition cursor-pointer">
                          View
                        </button>
                        {row.status && (
                          <button type="button" onClick={() => onToggle(row)}
                            className="flex h-9 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-[11px] font-medium text-slate-600 hover:border-brandRed hover:text-brandRed transition cursor-pointer">
                            {row.status === "Active" ? "Suspend" : "Activate"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {rows.map((row) => (
              <article key={row.id} className="p-4">
                <div className="flex items-start gap-3">
                  <input type="checkbox" aria-label={`Select ${row.id}`}
                    checked={selectedIds.includes(row.id)} onChange={() => onToggleSelected(row.id)}
                    className="mt-1 h-4 w-4 shrink-0 accent-brandRed" />
                  <button type="button" onClick={() => onView(row)} className="min-w-0 flex-1 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900 text-xs">
                          {rawCellValue(row, primaryMobileColumn)}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-slate-500 font-normal">{row.id}</p>
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
                      <dd className="mt-0.5 truncate text-xs text-slate-600 font-normal">{column.render(row)}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => onView(row)}
                    className="min-h-9 flex-1 rounded-[30px] bg-brandRed px-3 text-[11px] font-semibold text-white shadow-[0_4px_12px_rgba(211,47,47,0.3)]">View</button>
                  {row.status && (
                    <button type="button" aria-expanded={expandedActionsId === row.id}
                      onClick={() => setExpandedActionsId((current) => current === row.id ? null : row.id)}
                      className="min-h-9 flex-1 rounded-[30px] border border-[#E5E7EB] px-3 text-[11px] font-medium text-slate-600">More</button>
                  )}
                </div>
                {expandedActionsId === row.id && row.status && (
                  <div className="mt-2 rounded-[20px] bg-[#FAF8F5] p-3 border border-[#F3E5E5]">
                    <button type="button" onClick={() => onToggle(row)}
                      className="min-h-9 w-full rounded-[30px] border border-brandRed bg-white px-3 text-[11px] font-semibold text-brandRed">
                      {row.status === "Active" ? "Suspend record" : "Activate record"}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      )}
      <Pagination page={page} pageCount={pageCount} pageSize={pageSize} totalCount={totalCount}
        onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
    </div>
  );
}
