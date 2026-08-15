import { Table, StatusBadge } from '../ui';

export default function ResourceTable({
  columns = [],
  rows = [],
  onView = () => {},
  onToggle = () => {},
}) {
  const renderableColumns = columns.map((column) => ({
    ...column,
    render: column.render || ((row) => column.key === 'status' ? <StatusBadge value={row[column.key]} /> : row[column.key]),
  }));

  return (
    <Table
      columns={renderableColumns}
      rows={rows}
      onSelect={onView}
      actions={(row) => (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onView(row)} className="rounded-lg bg-brandRed px-3 py-2 text-xs font-semibold text-white">View</button>
          {row.status && (
            <button type="button" onClick={() => onToggle(row)} className="rounded-lg border border-lightBorder px-3 py-2 text-xs font-semibold text-textSecondary hover:border-brandRed hover:text-brandRed">
              {row.status === 'Active' ? 'Suspend' : 'Activate'}
            </button>
          )}
        </div>
      )}
    />
  );
}
