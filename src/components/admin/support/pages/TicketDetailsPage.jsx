import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  ConfirmDialog,
  StatusBadge,
  Toast,
} from "../../shared/ui";
import {
  fetchAdminSupportTicketDetails,
  addAdminSupportMessage,
  updateAdminTicketStatus,
  subscribeAdminRealtime,
} from "../../../../services/adminSupabaseService";

export default function TicketDetailsPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("OPEN");
  const [assignedTo, setAssignedTo] = useState("Unassigned");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [internalNote, setInternalNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [toast, setToast] = useState("");

  async function loadTicket() {
    if (!ticketId) return;
    setLoading(true);
    try {
      const data = await fetchAdminSupportTicketDetails(ticketId);
      if (data) {
        setTicket({
          id: data.ticket_number || data.id,
          rawId: data.id,
          subject: data.subject || "Support Inquiry",
          requester: data.profiles?.full_name || data.profiles?.email || "Customer",
          type: data.category || "General",
          priority: data.priority || "MEDIUM",
          status: data.status || "OPEN",
          updated: new Date(data.updated_at || data.created_at || Date.now()).toLocaleDateString("en-IN"),
        });
        setStatus(data.status || "OPEN");
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

          setMessages(publicMsgs.length > 0 ? publicMsgs : [{ id: 1, author: data.profiles?.full_name || "Customer", body: data.subject }]);
          setNotes(internalMsgs);
        } else {
          setMessages([{ id: 1, author: data.profiles?.full_name || "Customer", body: data.subject || "Customer ticket created." }]);
          setNotes([]);
        }
      } else {
        setTicket(null);
      }
    } catch {
      setTicket(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTicket();
    const unsub = subscribeAdminRealtime("support_messages", () => loadTicket());
    return () => unsub();
  }, [ticketId]);

  async function sendReply() {
    if (!message.trim() || !ticket?.rawId) return;

    try {
      await addAdminSupportMessage(ticket.rawId, message.trim(), false);
      setMessages((current) => [
        ...current,
        { id: Date.now(), author: "SeroFast Support Lead", body: message.trim(), time: "Just now" },
      ]);
      setMessage("");
      setStatus("IN_PROGRESS");
      setToast("Reply sent and logged in Supabase.");
    } catch {
      setToast("Failed to send reply to Supabase.");
    }
  }

  async function addNote() {
    if (!internalNote.trim() || !ticket?.rawId) return;

    try {
      await addAdminSupportMessage(ticket.rawId, internalNote.trim(), true);
      setNotes((current) => [...current, internalNote.trim()]);
      setInternalNote("");
      setToast("Internal staff note saved in Supabase.");
    } catch {
      setToast("Failed to save note in database.");
    }
  }

  async function confirmStatus() {
    if (!ticket?.rawId) return;
    try {
      await updateAdminTicketStatus(ticket.rawId, pendingStatus, assignedTo);
      setStatus(pendingStatus);
      setToast(`Ticket marked ${pendingStatus.toLowerCase()} in Supabase.`);
    } catch {
      setToast("Failed to update status in database.");
    }
    setPendingStatus(null);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-8 text-center text-xs text-slate-500 font-sans font-sansation">
        Loading support ticket from database...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 p-8 text-center font-sans font-sansation">
        <div className="rounded-[24px] border border-slate-100 bg-white p-8">
          <p className="text-sm font-semibold text-slate-800">Support ticket not found in database</p>
          <p className="mt-1 text-xs text-slate-500">The requested ticket ({ticketId}) does not exist in Supabase.</p>
          <button
            type="button"
            onClick={() => navigate("/admin/support")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brandRed px-4 py-2 text-xs font-semibold text-white"
          >
            <ArrowLeft size={14} /> Back to Support
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div>
        <button
          type="button"
          onClick={() => navigate("/admin/support")}
          className="mb-2 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brandRed"
        >
          <ArrowLeft size={14} /> Back to Support
        </button>
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
