import { useState, useEffect } from "react";
import ResourcePage from "../../shared/resource/ResourcePage";
import { fetchAdminSupportTickets, subscribeToAdminTableChanges } from "../../../../lib/supabase";

const columns = [
  "id",
  "subject",
  "requester",
  "type",
  "priority",
  "status",
  "updated",
].map((key) => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));

export default function SupportTicketsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTickets() {
    try {
      const data = await fetchAdminSupportTickets();
      if (Array.isArray(data)) {
        const mapped = data.map((t) => ({
          id: t.ticket_number || t.id,
          rawId: t.id,
          subject: t.subject || "Support Inquiry",
          requester: t.profiles?.full_name || t.profiles?.email || "Customer",
          type: t.category || "General",
          priority: t.priority || "MEDIUM",
          status: t.status || "OPEN",
          updated: new Date(t.updated_at || t.created_at || Date.now()).toLocaleDateString("en-IN"),
        }));
        setRows(mapped);
      } else {
        setRows([]);
      }
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
    const unsubscribe = subscribeToAdminTableChanges("support_tickets", () => loadTickets());
    return () => unsubscribe();
  }, []);

  return (
    <ResourcePage
      title="Support Tickets"
      description="Live customer and merchant dispute resolution tickets and helpdesk queue from Supabase."
      seed={rows}
      columns={columns}
      viewPath={(row) => `/admin/support/${encodeURIComponent(row.rawId || row.id)}`}
      emptyTitle={loading ? "Loading support tickets..." : "No support tickets in database"}
      emptyDescription="When customers submit support inquiries or dispute tickets, they will appear here in real-time."
    />
  );
}
