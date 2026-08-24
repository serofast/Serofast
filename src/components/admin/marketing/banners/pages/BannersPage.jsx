import { useState, useEffect } from 'react';
import ResourcePage from '../../../shared/resource/ResourcePage';
import { banners as fallbackRows } from '../../../shared/adminData';
import { fetchAdminBanners, subscribeToAdminTableChanges } from '../../../../../lib/supabase';

const columns = ['id', 'title', 'placement', 'status', 'priority', 'start', 'end'].map(key => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));

export default function BannersPage() {
  const [rows, setRows] = useState(fallbackRows);

  useEffect(() => {
    async function loadBanners() {
      const data = await fetchAdminBanners();
      if (data?.length) {
        const mapped = data.map((b) => ({
          id: b.id,
          title: b.title,
          placement: b.placement || b.badge_text || 'Hero',
          priority: b.sort_order || 0,
          status: b.is_active ? 'Active' : 'Inactive',
          start: b.starts_at ? new Date(b.starts_at).toLocaleDateString('en-IN') : 'Immediate',
          end: b.ends_at ? new Date(b.ends_at).toLocaleDateString('en-IN') : 'No expiry',
        }));
        setRows(mapped);
      } else {
        setRows(fallbackRows);
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
