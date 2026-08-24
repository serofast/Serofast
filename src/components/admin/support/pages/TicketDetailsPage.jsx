import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  AdminSelect,
  Card,
  ConfirmDialog,
  PageHeader,
  StatusBadge,
  Toast,
} from "../../shared/ui";
import { supportTickets as fallbackTickets } from "../../shared/adminData";
import {
  fetchAdminSupportTicketDetails,
  addAdminSupportMessage,
  updateAdminTicketStatus,
  subscribeAdminRealtime,
} from "../../../../services/adminSupabaseService";

export default function TicketDetailsPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(
    fallbackTickets.find((item) => item.id === ticketId) ?? fallbackTickets[0]
  );
  const [status, setStatus] = useState(ticket.status || "OPEN");
  const [assignedTo, setAssignedTo] = useState(ticket.assigned_to || "Unassigned");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, author: ticket.requester || "User", body: "Please help me resolve this issue." },
  ]);
  const [internalNote, setInternalNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [toast, setToast] = useState("");

  async function loadTicket() {
    if (!ticketId) return;
    const data = await fetchAdminSupportTicketDetails(ticketId);
    if (data) {
      setTicket({
        id: data.ticket_number || data.id,
        rawId: data.id,
        subject: data.subject,
        requester: data.profiles?.full_name || data.profiles?.email || "Customer",
        type: data.category,
        priority: data.priority,
        status: data.status,
        updated: new Date(data.updated_at).toLocaleDateString("en-IN"),
      });
      setStatus(data.status);
      setAssignedTo(data.assigned_to || "Unassigned");
      if (data.support_messages && data.support_messages.length > 0) {
        const publicMsgs = data.support_messages
          .filter((m) => !m.is_internal_note)
          .map((m) => ({
            id: m.id,
            author: m.sender_name,
            body: m.message,
            time: new Date(m.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          }));
        const internalMsgs = data.support_messages
          .filter((m) => m.is_internal_note)
          .map((m) => m.message);

        setMessages(publicMsgs.length > 0 ? publicMsgs : [{ id: 1, author: data.profiles?.full_name || "User", body: data.subject }]);
        setNotes(internalMsgs);
      }
    }
  }

  useEffect(() => {
    loadTicket();
    const unsub = subscribeAdminRealtime("support_messages", () => loadTicket());
    return () => unsub();
  }, [ticketId]);

  async function sendReply() {
    if (!message.trim()) return;

    if (ticket.rawId) {
      await addAdminSupportMessage(ticket.rawId, message.trim(), false);
    }

    setMessages((current) => [
      ...current,
      { id: Date.now(), author: "SeroFast Support Lead", body: message.trim(), time: "Just now" },
    ]);
    setMessage("");
    setStatus("IN_PROGRESS");
    setToast("Reply sent and logged in Supabase.");
  }

  async function addNote() {
    if (!internalNote.trim()) return;

    if (ticket.rawId) {
      await addAdminSupportMessage(ticket.rawId, internalNote.trim(), true);
    }

    setNotes((current) => [...current, internalNote.trim()]);
    setInternalNote("");
    setToast("Internal staff note logged in Supabase.");
  }

  async function confirmStatus() {
    if (ticket.rawId) {
      await updateAdminTicketStatus(ticket.rawId, pendingStatus, assignedTo);
    }
    setStatus(pendingStatus);
    setToast(`Ticket marked ${pendingStatus.toLowerCase()} in Supabase.`);
    setPendingStatus(null);
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          Support Ticket {ticket.id}
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          {ticket.subject} · Requester: {ticket.requester}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 pb-2 border-b">
              Conversation History
            </h2>
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
              {messages.map((msg) => {
                const isAdmin = msg.author.includes("Admin") || msg.author.includes("Support");
                return (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl text-xs space-y-1 ${
                      isAdmin
                        ? "bg-rose-50 border border-rose-100 ml-8 text-slate-800"
                        : "bg-slate-50 border border-slate-100 mr-8 text-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span className="font-semibold text-slate-700">{msg.author}</span>
                      <span>{msg.time || "Recent"}</span>
                    </div>
                    <p className="text-xs leading-relaxed">{msg.body}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t space-y-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your official reply to the customer/seller..."
                rows={3}
                className="w-full p-3 border rounded-xl text-xs outline-none focus:border-brandRed"
              />
              <button
                type="button"
                onClick={sendReply}
                className="h-10 px-5 rounded-xl bg-brandRed text-white text-xs font-semibold hover:bg-brandRed/90 shadow-sm"
              >
                Send Reply
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Internal Staff Notes</h2>
            <p className="text-[11px] text-slate-500 mb-3">
              Visible to administrators and support staff only.
            </p>
            <div className="space-y-2 mb-4">
              {notes.map((noteText, idx) => (
                <div key={idx} className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-900">
                  📌 {noteText}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Add private staff note..."
                className="flex-1 h-10 px-3 border rounded-xl text-xs outline-none focus:border-brandRed"
              />
              <button
                type="button"
                onClick={addNote}
                className="h-10 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Add Note
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-900 border-b pb-2">
              Ticket Metadata
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Status</span>
                <StatusBadge value={status} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Priority</span>
                <span className="font-semibold text-brandRed">{ticket.priority || "MEDIUM"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category</span>
                <span className="font-medium text-slate-800">{ticket.type || "General"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Agent</span>
                <span className="font-medium text-slate-800">{assignedTo}</span>
              </div>
            </div>

            <div className="pt-3 border-t space-y-2">
              <label className="text-[11px] font-medium text-slate-500 block">
                Update Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["IN_PROGRESS", "RESOLVED", "WAITING_FOR_USER", "CLOSED"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPendingStatus(s)}
                    className={`h-8 rounded-lg text-[10px] font-semibold border ${
                      status === s
                        ? "border-brandRed bg-rose-50 text-brandRed"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pendingStatus)}
        title="Update Ticket Status"
        description={`Set this support ticket status to ${pendingStatus}?`}
        confirmLabel="Update Status"
        tone="success"
        onConfirm={confirmStatus}
        onClose={() => setPendingStatus(null)}
      />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
