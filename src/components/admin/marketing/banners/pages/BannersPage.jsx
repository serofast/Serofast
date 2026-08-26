import { useState, useEffect } from "react";
import ResourcePage from "../../../shared/resource/ResourcePage";
import { fetchAdminBanners, subscribeToAdminTableChanges } from "../../../../../lib/supabase";

const columns = [
  "id",
  "title",
  "placement",
  "status",
  "priority",
  "start",
  "end",
].map((key) => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));

export default function BannersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadBanners() {
    try {
      const data = await fetchAdminBanners();
      if (Array.isArray(data)) {
        const mapped = data.map((b) => ({
          id: b.id,
          title: b.title,
          placement: b.placement || b.badge_text || "Hero",
          priority: b.sort_order || 0,
          status: b.is_active ? "Active" : "Inactive",
          start: b.starts_at ? new Date(b.starts_at).toLocaleDateString("en-IN") : "Immediate",
          end: b.ends_at ? new Date(b.ends_at).toLocaleDateString("en-IN") : "No expiry",
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
    loadBanners();
    const unsubscribe = subscribeToAdminTableChanges("banners", () => loadBanners());
    return () => unsubscribe();
  }, []);

  return (
    <ResourcePage
      title="Promotional Banners"
      description="Live homepage banner carousels, marketing slots, and campaign assets from Supabase."
      seed={rows}
      columns={columns}
      createLabel="Add New"
      createPath="/admin/marketing/banners/new"
      editPath={(row) => `/admin/marketing/banners/${encodeURIComponent(row.id)}/edit`}
      emptyTitle={loading ? "Loading banners..." : "No promotional banners found"}
      emptyDescription="Create hero banners and promotional cards to feature on the homepage."
    />
  );
}
