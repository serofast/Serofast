import { useState, useEffect } from 'react';
import ResourcePage from '../../../shared/resource/ResourcePage';
import { fetchAdminBanners, subscribeToAdminTableChanges } from '../../../../../lib/supabase';

const columns = ['id', 'title', 'badge', 'subtitle', 'route', 'priority', 'status'].map(key => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));

export default function BannersPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function loadBanners() {
      const data = await fetchAdminBanners();
      if (data) {
        const mapped = data.map((b) => ({
          id: b.id,
          title: b.title,
          badge: b.badge_text,
          subtitle: b.subtitle,
          route: b.target_route || '/',
          priority: b.sort_order || 0,
          status: b.is_active ? 'Active' : 'Inactive',
        }));
        setRows(mapped);
      }
    }

    loadBanners();
    const unsubscribe = subscribeToAdminTableChanges('banners', () => loadBanners());
    return () => unsubscribe();
  }, []);

  return (
    <ResourcePage
      title="Banners"
      description="Manage hero and promotional banners."
      seed={rows}
      columns={columns}
      createLabel="Add New"
      createPath="/admin/marketing/banners/new"
      editPath={(row) => `/admin/marketing/banners/${encodeURIComponent(row.id)}/edit`}
    />
  );
}
