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
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">Notifications</h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Manage Push, Email, SMS, and In-App template behavior.
        </p>
      </div>

      <div className="rounded-[35px] bg-white border border-[#F3E5E5] shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] overflow-hidden">
        <div className="divide-y divide-slate-100">
          {rows.map((row) => (
            <article
              key={row.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs font-medium text-slate-900">{row.name}</p>
                <p className="mt-1 text-[11px] text-slate-500 font-normal">
                  {row.channels} · {row.audience}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditing({ ...row, subject: row.subject ?? row.name, body: row.body ?? "Hello {{name}}, your SeroFast update is ready." })}
                  className="flex h-9 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-[11px] font-medium text-slate-600 hover:border-brandRed transition cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  role="switch"
                  aria-checked={row.enabled}
                  aria-label={`${row.enabled ? "Disable" : "Enable"} ${row.name}`}
                  onClick={() => toggleTemplate(row.id)}
                  className={`relative h-8 w-14 rounded-full transition cursor-pointer ${row.enabled ? "bg-brandRed" : "bg-slate-300"}`}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${row.enabled ? "left-7" : "left-1"}`}
                  />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit notification template">
        {editing && (
          <form onSubmit={saveTemplate} className="space-y-4">
            {[
              ["subject", "Subject", "input"],
              ["body", "Body", "textarea"],
            ].map(([key, label, control]) => (
              <label key={key} className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-700">{label}</span>
                {control === "textarea" ? (
                  <textarea
                    value={editing[key]}
                    onChange={(event) => setEditing((current) => ({ ...current, [key]: event.target.value }))}
                    rows={5}
                    className="w-full rounded-[20px] border border-[#E5E7EB] p-3 text-xs outline-none focus:border-brandRed"
                  />
                ) : (
                  <input
                    value={editing[key]}
                    onChange={(event) => setEditing((current) => ({ ...current, [key]: event.target.value }))}
                    className="h-10 w-full rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs outline-none focus:border-brandRed"
                  />
                )}
              </label>
            ))}
            <p className="text-[11px] text-slate-400 font-normal">Supported variable example: {"{{name}}"}</p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="flex h-10 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium text-slate-700 transition cursor-pointer">
                Cancel
              </button>
              <button type="submit" className="flex h-10 items-center justify-center rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer">
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
