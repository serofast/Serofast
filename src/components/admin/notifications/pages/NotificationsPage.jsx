import { useState } from "react";
import { Bell, BellOff, Pencil } from "lucide-react";
import {
  BulkActionBar,
  FilterBar,
  Modal,
  PageHeader,
  Toast,
} from "../../shared/ui";
import ResourceTable from "../../shared/resource/ResourceTable";
import { useResourceList } from "../../shared/resource/useResourceList";
import { notificationTemplates } from "../../shared/adminData";

const seed = notificationTemplates.map((row) => ({
  ...row,
  status: row.enabled ? "Enabled" : "Disabled",
}));

const columns = [
  { key: "id", label: "Template ID" },
  { key: "name", label: "Template", minWidth: 220 },
  { key: "channels", label: "Channels", minWidth: 170 },
  { key: "audience", label: "Audience" },
  { key: "status", label: "Status" },
];

export default function NotificationsPage() {
  const resource = useResourceList(seed);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");

  function toggleTemplate(row) {
    const enabled = !row.enabled;
    resource.updateRow(row.id, {
      enabled,
      state: enabled ? "Enabled" : "Disabled",
      status: enabled ? "Enabled" : "Disabled",
    });
    setToast("Notification template state updated.");
  }

  function saveTemplate(event) {
    event.preventDefault();
    resource.updateRow(editing.id, editing);
    setEditing(null);
    setToast("Notification template updated.");
  }

  function editTemplate(row) {
    setEditing({
      ...row,
      subject: row.subject ?? row.name,
      body: row.body ?? "Hello {{name}}, your SeroFast update is ready.",
    });
  }

  function templateActions(row) {
    return [
      {
        label: "Edit Template",
        shortLabel: "Edit",
        icon: Pencil,
        tone: "primary",
        onClick: () => editTemplate(row),
      },
      {
        label: row.enabled ? "Disable Template" : "Enable Template",
        shortLabel: row.enabled ? "Disable" : "Enable",
        icon: row.enabled ? BellOff : Bell,
        tone: row.enabled ? "warning" : "success",
        onClick: () => toggleTemplate(row),
      },
    ];
  }

  function updateSelected(enabled) {
    resource.updateRows(resource.selectedIds, {
      enabled,
      state: enabled ? "Enabled" : "Disabled",
      status: enabled ? "Enabled" : "Disabled",
    });
    setToast(`Selected templates ${enabled ? "enabled" : "disabled"}.`);
  }

  return (
    <div className="min-w-0 pb-6 font-sans font-sansation animate-fade-in">
      <PageHeader
        title="Notifications"
        description="Manage Push, Email, SMS, and In-App template behavior."
      />

      <FilterBar
        value={resource.search}
        setValue={resource.setSearch}
        placeholder="Search notification templates..."
        status={resource.status}
        setStatus={resource.setStatus}
        options={resource.statuses}
        onClear={resource.clearFilters}
      />

      <BulkActionBar
        count={resource.selectedIds.length}
        actions={[
          { label: "Enable", tone: "success", onClick: () => updateSelected(true) },
          { label: "Disable", onClick: () => updateSelected(false) },
        ]}
        onClear={() => resource.setSelectedIds([])}
      />

      <ResourceTable
        columns={columns}
        rows={resource.visibleRows}
        rowActions={templateActions}
        onView={editTemplate}
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
        loading={resource.loading}
        error={resource.error}
        onRetry={resource.retry}
        emptyTitle="No notification templates match your filters"
      />

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit notification template"
      >
        {editing && (
          <form onSubmit={saveTemplate} className="space-y-4">
            {[
              ["subject", "Subject", "input"],
              ["body", "Body", "textarea"],
            ].map(([key, label, control]) => (
              <label key={key} className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-700">
                  {label}
                </span>
                {control === "textarea" ? (
                  <textarea
                    value={editing[key]}
                    onChange={(event) =>
                      setEditing((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    rows={5}
                    className="w-full rounded-[20px] border border-[#E5E7EB] p-3 text-xs outline-none focus:border-brandRed"
                  />
                ) : (
                  <input
                    value={editing[key]}
                    onChange={(event) =>
                      setEditing((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs outline-none focus:border-brandRed"
                  />
                )}
              </label>
            ))}
            <p className="text-[11px] font-normal text-slate-400">
              Supported variable example: {"{{name}}"}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="h-10 rounded-[30px] border border-[#E5E7EB] px-4 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white"
              >
                Save Template
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
