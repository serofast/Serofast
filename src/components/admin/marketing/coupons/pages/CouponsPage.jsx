import { useState, useEffect } from 'react';
import ResourcePage from '../../../shared/resource/ResourcePage';
import { fetchAdminCoupons, subscribeToAdminTableChanges } from '../../../../../lib/supabase';

const columns = ['id', 'code', 'type', 'value', 'minOrder', 'usage', 'status', 'expires'].map(key => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));

export default function CouponsPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function loadCoupons() {
      const data = await fetchAdminCoupons();
      if (data) {
        const mapped = data.map((c) => ({
          id: c.id,
          code: c.code,
          type: c.discount_type || 'FLAT',
          value: `₹${c.discount_value}`,
          minOrder: `₹${c.min_order_value || 0}`,
          usage: '0 uses',
          status: c.is_active ? 'Active' : 'Inactive',
          expires: c.valid_until ? new Date(c.valid_until).toLocaleDateString('en-IN') : 'No Expiry',
        }));
        setRows(mapped);
      }
    }

    loadCoupons();
    const unsubscribe = subscribeToAdminTableChanges('coupons', () => loadCoupons());
    return () => unsubscribe();
  }, []);

  return (
    <ResourcePage
      title="Coupons"
      description="Create and monitor marketplace coupon codes."
      seed={rows}
      columns={columns}
      createLabel="Add New"
      createPath="/admin/marketing/coupons/new"
      editPath={(row) => `/admin/marketing/coupons/${encodeURIComponent(row.id)}/edit`}
    />
  );
}
