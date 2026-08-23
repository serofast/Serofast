import { useState, useEffect } from 'react';
import ResourcePage from '../../shared/resource/ResourcePage';
import { fetchAdminSupportTickets, subscribeToAdminTableChanges } from '../../../../lib/supabase';

const columns = ['id', 'subject', 'requester', 'category', 'priority', 'status', 'created'].map(key => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));

export default function SupportTicketsPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function loadTickets() {
      const data = await fetchAdminSupportTickets();
      if (data) {
        const mapped = data.map((t) => ({
          id: t.id,
          subject: t.subject,
          requester: t.profiles?.full_name || t.profiles?.email || 'Customer',
          category: t.category || 'General',
          priority: t.priority || 'MEDIUM',
          status: t.status || 'OPEN',
          created: new Date(t.created_at).toLocaleDateString('en-IN'),
        }));
        setRows(mapped);
      }
    }

    loadTickets();
    const unsubscribe = subscribeToAdminTableChanges('support_tickets', () => loadTickets());
    return () => unsubscribe();
  }, []);

  return (
    <ResourcePage
      title="Support Tickets"
      description="Manage customer and seller support tickets, complaints and escalations."
      seed={rows}
      columns={columns}
      viewPath={(row) => `/admin/support/${encodeURIComponent(row.id)}`}
    />
  );
}
