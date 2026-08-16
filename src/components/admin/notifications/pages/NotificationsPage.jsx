import { useState } from "react";
import { Card, Modal, PageHeader, Toast } from "../../shared/ui";
import { notificationTemplates as seed } from "../../shared/adminData";

export default function NotificationsPage() {
  const [rows, setRows] = useState(seed);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");

  function toggleTemplate(id) {
    setRows((current) =>
      current.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
    setToast("Notification template state updated.");
  }

  function saveTemplate(event) {
    event.preventDefault();
    setRows((current) =>
      current.map((item) => (item.id === editing.id ? editing : item)),
    );
    setEditing(null);
    setToast("Notification template updated.");
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Manage Push, Email, SMS, and In-App template behavior."
      />

      <Card className="overflow-hidden">
        <div className="divide-y divide-lightBorder">
          {rows.map((row) => (
            <article
              key={row.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">{row.name}</p>
                <p className="mt-1 text-sm text-textSecondary">
                  {row.channels} · {row.audience}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditing({ ...row, subject: row.subject ?? row.name, body: row.body ?? "Hello {{name}}, your SeroFast update is ready." })}
                  className="min-h-10 rounded-lg border border-lightBorder px-3 text-xs font-semibold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  role="switch"
                  aria-checked={row.enabled}
                  aria-label={`${row.enabled ? "Disable" : "Enable"} ${row.name}`}
                  onClick={() => toggleTemplate(row.id)}
                  className={`relative h-8 w-14 rounded-full ${row.enabled ? "bg-brandRed" : "bg-slate-300"}`}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${row.enabled ? "left-7" : "left-1"}`}
                  />
                </button>
              </div>
            </article>
          ))}
        </div>
      </Card>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit notification template">
        {editing && (
          <form onSubmit={saveTemplate} className="space-y-4">
            {[
              ["subject", "Subject", "input"],
              ["body", "Body", "textarea"],
            ].map(([key, label, control]) => (
              <label key={key} className="block">
                <span className="mb-1.5 block text-sm font-semibold">{label}</span>
                {control === "textarea" ? (
                  <textarea
                    value={editing[key]}
                    onChange={(event) => setEditing((current) => ({ ...current, [key]: event.target.value }))}
                    rows={5}
                    className="w-full rounded-lg border border-lightBorder p-3 text-sm"
                  />
                ) : (
                  <input
                    value={editing[key]}
                    onChange={(event) => setEditing((current) => ({ ...current, [key]: event.target.value }))}
                    className="h-11 w-full rounded-lg border border-lightBorder px-3 text-sm"
                  />
                )}
              </label>
            ))}
            <p className="text-xs text-textMuted">Supported variable example: {"{{name}}"}</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="min-h-11 rounded-lg border border-lightBorder px-4 text-sm font-semibold">
                Cancel
              </button>
              <button type="submit" className="min-h-11 rounded-lg bg-brandRed px-4 text-sm font-semibold text-white">
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
