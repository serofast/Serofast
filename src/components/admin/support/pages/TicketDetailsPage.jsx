import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  AdminSelect,
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
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          {ticket.subject}
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Ticket {ticket.id} · {ticket.requester}
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 sm:p-7 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="text-base font-normal text-slate-800">Conversation</h3>
            <StatusBadge value={status} />
          </div>
          <div className="space-y-3">
            {messages.map((entry) => (
              <div
                key={entry.id}
                className={`max-w-[90%] rounded-[20px] p-4 text-xs ${
                  entry.author === "Admin"
                    ? "ml-auto bg-rose-50 border border-rose-100"
                    : "bg-[#FAF8F5] border border-[#F3E5E5]"
                }`}
              >
                <p className="mb-1 text-[10px] font-medium text-slate-500">{entry.author}</p>
                <p className="text-slate-700 font-normal">{entry.body}</p>
              </div>
            ))}
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-700">Reply</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              placeholder="Write a clear response…"
              className="w-full rounded-[20px] border border-[#E5E7EB] p-3 text-xs outline-none focus:border-brandRed"
            />
          </label>
          <button
            type="button"
            disabled={!message.trim()}
            onClick={sendReply}
            className="flex h-10 items-center justify-center gap-1.5 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer disabled:opacity-50"
          >
            Send Reply
          </button>
        </div>

        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 sm:p-7 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
          <h3 className="text-base font-normal text-slate-800 border-b border-slate-100 pb-3">Internal notes</h3>
          {notes.length > 0 && (
            <ul className="space-y-2 text-xs text-slate-600">
              {notes.map((note, index) => (
                <li key={`${index}-${note}`} className="rounded-[20px] bg-amber-50 border border-amber-100 p-3">
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
            className="w-full rounded-[20px] border border-[#E5E7EB] p-3 text-xs outline-none focus:border-brandRed"
          />
          <button
            type="button"
            disabled={!internalNote.trim()}
            onClick={addNote}
            className="flex h-10 items-center justify-center gap-1.5 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium text-slate-700 hover:border-slate-300 transition cursor-pointer disabled:opacity-50"
          >
            Add Internal Note
          </button>
        </div>
      </div>

      <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
        <h3 className="text-base font-normal text-slate-800 border-b border-slate-100 pb-3">Ticket control</h3>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-slate-700">Assigned Admin</span>
          <AdminSelect
            value={assignedTo}
            onChange={(value) => {
              setAssignedTo(value);
              setToast(`Ticket assigned to ${value}.`);
            }}
            options={["Unassigned", "Rohan Support", "Operations Admin", "Finance Admin"]}
            ariaLabel="Assigned Admin"
            buttonClassName="h-10"
          />
        </label>
        <div className="space-y-2">
          {[
            ["Escalate", "Escalated"],
            ["Resolve", "Resolved"],
            ["Close ticket", "Closed"],
          ].map(([label, nextStatus]) => (
            <button
              key={nextStatus}
              type="button"
              onClick={() => setPendingStatus(nextStatus)}
              className={`flex h-10 w-full items-center justify-center gap-1.5 rounded-[30px] px-4 text-xs font-semibold transition cursor-pointer ${
                nextStatus === "Closed"
                  ? "bg-brandRed text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)]"
                  : "border border-[#E5E7EB] bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
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
