import { useState, useEffect } from 'react';
import ResourcePage from '../../shared/resource/ResourcePage';
import { customers as fallbackRows } from '../../shared/adminData';
import { fetchAdminProfiles, subscribeToAdminTableChanges } from '../../../../lib/supabase';

const columns = [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'orders', label: 'Orders' }, { key: 'spent', label: 'Total Spent' }, { key: 'avgOrder', label: 'Avg Order' }, { key: 'returns', label: 'Returns' }, { key: 'status', label: 'Status' }, { key: 'joined', label: 'Joined' }];

export default function CustomersPage() {
  const [rows, setRows] = useState(fallbackRows);

  useEffect(() => {
    async function loadProfiles() {
      const data = await fetchAdminProfiles();
      if (data?.length) {
        const mapped = data.map((p) => ({
          id: p.id,
          name: p.full_name || 'Registered User',
          email: p.email || 'user@serofast.com',
          orders: 0,
          spent: '₹0',
          avgOrder: '₹0',
          returns: 0,
          status: 'Active',
          joined: new Date(p.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        }));
        setRows(mapped);
      } else {
        setRows(fallbackRows);
      }
    }

    loadProfiles();
    const unsubscribe = subscribeToAdminTableChanges("profiles", () => {
      loadProfiles();
    });

    return () => unsubscribe();
  }, []);

  return (
    <ResourcePage
      title="Customers"
      description="View customers, order history, account status and customer value."
      seed={rows}
      columns={columns}
      viewPath={(row) => `/admin/customers/${encodeURIComponent(row.id)}`}
    />
  );
}
