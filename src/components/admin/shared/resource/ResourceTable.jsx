import { Card, EmptyState, Pagination, StatusBadge } from "../ui";

export default function ResourceTable({
  columns = [],
  rows = [],
  onView = () => {},
  onToggle = () => {},
  sortKey,
  sortDirection,
  onSort = () => {},
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
}) {
  const renderableColumns = columns.map((column) => ({
    ...column,
    render:
      column.render ||
      ((row) =>
        column.key === "status" ? (
          <StatusBadge value={row[column.key]} />
        ) : (
          (row[column.key] ?? "—")
        )),
  }));

  const allVisibleSelected =
    rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));

  return (
    <Card className="overflow-hidden">
      {rows.length === 0 ? (
        <EmptyState action="Clear filters" onAction={onClearFilters} />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[900px] text-left">
            <thead className="bg-lightBackground">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Select all visible rows"
                    checked={allVisibleSelected}
                    onChange={onToggleAll}
                    className="h-4 w-4 accent-brandRed"
                  />
                </th>
                {renderableColumns.map((column) => (
                  <th key={column.key} className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onSort(column.key)}
                      className="inline-flex min-h-8 items-center gap-1 whitespace-nowrap text-xs font-bold uppercase tracking-wide text-textMuted hover:text-textPrimary"
                    >
                      {column.label}
                      <span aria-hidden="true">
                        {sortKey === column.key
                          ? sortDirection === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-textMuted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lightBorder">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onView(row)}
                  className="cursor-pointer transition hover:bg-promoHighlight/40"
                >
                  <td
                    className="px-4 py-4"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      aria-label={`Select ${row.id}`}
                      checked={selectedIds.includes(row.id)}
                      onChange={() => onToggleSelected(row.id)}
                      className="h-4 w-4 accent-brandRed"
                    />
                  </td>
                  {renderableColumns.map((column) => (
                    <td
                      key={column.key}
                      className="max-w-64 px-4 py-4 text-sm text-textSecondary"
                    >
                      <div className="truncate">{column.render(row)}</div>
                    </td>
                  ))}
                  <td
                    className="px-4 py-4"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex min-w-max gap-2">
                      <button
                        type="button"
                        onClick={() => onView(row)}
                        className="min-h-10 rounded-lg bg-brandRed px-3 text-xs font-semibold text-white hover:bg-brandRedDark"
                      >
                        View
                      </button>
                      {row.status && (
                        <button
                          type="button"
                          onClick={() => onToggle(row)}
                          className="min-h-10 rounded-lg border border-lightBorder px-3 text-xs font-semibold text-textSecondary hover:border-brandRed hover:text-brandRed"
                        >
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
      )}

      <Pagination
        page={page}
        pageCount={pageCount}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </Card>
  );
}
