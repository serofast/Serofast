import { useState, useEffect } from 'react';
import ResourcePage from '../../shared/resource/ResourcePage';
import { shops as fallbackRows } from '../../shared/adminData';
import { fetchAdminShops, subscribeToAdminTableChanges } from '../../../../lib/supabase';

const columns = [{ key: 'shop', label: 'Shop' }, { key: 'owner', label: 'Owner' }, { key: 'category', label: 'Category' }, { key: 'products', label: 'Products' }, { key: 'orders', label: 'Orders' }, { key: 'revenue', label: 'Revenue' }, { key: 'rating', label: 'Rating' }, { key: 'status', label: 'Status' }, { key: 'joined', label: 'Joined' }];

export default function ShopsPage() {
  const [rows, setRows] = useState(fallbackRows);

  useEffect(() => {
    async function loadDbShops() {
      const dbShops = await fetchAdminShops();
      if (dbShops?.length) {
        const mapped = dbShops.map((s) => ({
          id: s.id,
          shop: s.name || 'Untitled Shop',
          owner: s.owner_name || s.shop_owners?.full_name || 'Shop Owner',
          category: s.category_id || 'Fashion',
          products: 0,
          orders: 0,
          revenue: '₹0',
          rating: s.rating ? `${s.rating} / 5.0` : '4.8 / 5.0',
          status: s.status === 'active' ? 'Active' : s.status === 'pending_review' ? 'Pending' : 'Active',
          joined: new Date(s.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
        }));
        setRows(mapped);
      } else {
        setRows(fallbackRows);
      }
    }

    loadDbShops();
    const unsubscribe = subscribeToAdminTableChanges("shops", () => {
      loadDbShops();
    });

    return () => unsubscribe();
  }, []);

  return (
    <ResourcePage
      title="Shops"
      description="Manage marketplace sellers, verification, status and performance."
      seed={rows}
      columns={columns}
      viewPath={(row) => `/admin/shops/${encodeURIComponent(row.id)}`}
      headerActions={[{ label: 'Open Approval Queue', path: '/admin/shops/approvals' }]}
    />
  );
}
