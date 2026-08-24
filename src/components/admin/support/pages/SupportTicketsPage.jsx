import { useState, useEffect } from 'react';
import ResourcePage from '../../shared/resource/ResourcePage';
import { supportTickets as fallbackRows } from '../../shared/adminData';
import { fetchAdminSupportTickets, subscribeToAdminTableChanges } from '../../../../lib/supabase';

const columns = ['id', 'subject', 'requester', 'type', 'priority', 'status', 'updated'].map(key => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));

export default function SupportTicketsPage() {
  const [rows, setRows] = useState(fallbackRows);

  useEffect(() => {
    async function loadTickets() {
      const data = await fetchAdminSupportTickets();
      if (data?.length) {
        const mapped = data.map((t) => ({
          id: t.id,
          subject: t.subject,
          requester: t.profiles?.full_name || t.profiles?.email || 'Customer',
          type: t.category || t.type || 'General',
          priority: t.priority || 'MEDIUM',
          status: t.status || 'OPEN',
          updated: new Date(t.updated_at || t.created_at).toLocaleDateString('en-IN'),
        }));
        setRows(mapped);
      } else {
        setRows(fallbackRows);
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
