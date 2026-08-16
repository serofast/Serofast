import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  ConfirmDialog,
  PageHeader,
  StatusBadge,
  Toast,
} from "../../shared/ui";
import { supportTickets } from "../../shared/adminData";

export default function TicketDetailsPage() {
  const { ticketId } = useParams();
  const ticket = supportTickets.find((item) => item.id === ticketId) ?? supportTickets[0];
  const [status, setStatus] = useState(ticket.status);
  const [assignedTo, setAssignedTo] = useState("Unassigned");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, author: ticket.requester, body: "Please help me resolve this issue." },
  ]);
  const [internalNote, setInternalNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [toast, setToast] = useState("");

  function sendReply() {
    if (!message.trim()) {
      return;
    }

    setMessages((current) => [
      ...current,
      { id: Date.now(), author: "Admin", body: message.trim() },
    ]);
    setMessage("");
    setStatus("In Progress");
    setToast("Reply added to the local conversation.");
  }

  function addNote() {
    if (!internalNote.trim()) {
      return;
    }

    setNotes((current) => [...current, internalNote.trim()]);
    setInternalNote("");
    setToast("Internal note added.");
  }

  function confirmStatus() {
    setStatus(pendingStatus);
    setToast(`Ticket marked ${pendingStatus.toLowerCase()}.`);
    setPendingStatus(null);
  }

  return (
    <div>
      <PageHeader
        title={ticket.subject}
        description={`Ticket ${ticket.id} · ${ticket.requester}`}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Conversation</h2>
              <StatusBadge value={status} />
            </div>
            <div className="mt-5 space-y-3">
              {messages.map((entry) => (
                <div
                  key={entry.id}
                  className={`max-w-[90%] rounded-xl p-4 text-sm ${
                    entry.author === "Admin"
                      ? "ml-auto bg-promoHighlight"
                      : "bg-lightBackground"
                  }`}
                >
                  <p className="mb-1 text-xs font-bold text-textMuted">{entry.author}</p>
                  <p>{entry.body}</p>
                </div>
              ))}
            </div>
            <label className="mt-5 block">
              <span className="mb-1.5 block text-sm font-semibold">Reply</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                placeholder="Write a clear response…"
                className="w-full rounded-lg border border-lightBorder p-3 text-sm outline-none focus:border-brandRed"
              />
            </label>
            <button
              type="button"
              disabled={!message.trim()}
              onClick={sendReply}
              className="mt-3 min-h-11 rounded-lg bg-brandRed px-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              Send Reply
            </button>
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Internal notes</h2>
            {notes.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm text-textSecondary">
                {notes.map((note, index) => (
                  <li key={`${index}-${note}`} className="rounded-lg bg-amber-50 p-3">
                    {note}
                  </li>
                ))}
              </ul>
            )}
            <textarea
              value={internalNote}
              onChange={(event) => setInternalNote(event.target.value)}
              rows={3}
              aria-label="Internal note"
              placeholder="Visible only to Admin users"
              className="mt-4 w-full rounded-lg border border-lightBorder p-3 text-sm outline-none focus:border-brandRed"
            />
            <button
              type="button"
              disabled={!internalNote.trim()}
              onClick={addNote}
              className="mt-3 min-h-10 rounded-lg border border-lightBorder px-4 text-sm font-semibold disabled:opacity-50"
            >
              Add Internal Note
            </button>
          </Card>
        </div>

        <Card className="h-fit p-5">
          <h2 className="text-lg font-semibold">Ticket control</h2>
          <label className="mt-5 block">
            <span className="mb-1.5 block text-sm font-semibold">Assigned Admin</span>
            <select
              value={assignedTo}
              onChange={(event) => {
                setAssignedTo(event.target.value);
                setToast(`Ticket assigned to ${event.target.value}.`);
              }}
              className="h-11 w-full rounded-lg border border-lightBorder bg-white px-3 text-sm"
            >
              {["Unassigned", "Rohan Support", "Operations Admin", "Finance Admin"].map(
                (admin) => <option key={admin}>{admin}</option>,
              )}
            </select>
          </label>
          <div className="mt-5 grid gap-2">
            {[
              ["Escalate", "Escalated"],
              ["Resolve", "Resolved"],
              ["Close ticket", "Closed"],
            ].map(([label, nextStatus]) => (
              <button
                key={nextStatus}
                type="button"
                onClick={() => setPendingStatus(nextStatus)}
                className={`min-h-11 rounded-lg px-4 text-sm font-semibold ${
                  nextStatus === "Closed"
                    ? "bg-brandRed text-white"
                    : "border border-lightBorder"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(pendingStatus)}
        title={`${pendingStatus} ticket`}
        description={`Ticket ${ticket.id} will be marked ${pendingStatus?.toLowerCase() ?? ""}.`}
        confirmLabel={`Mark ${pendingStatus ?? ""}`}
        tone={pendingStatus === "Closed" ? "danger" : "success"}
        onConfirm={confirmStatus}
        onClose={() => setPendingStatus(null)}
      />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
