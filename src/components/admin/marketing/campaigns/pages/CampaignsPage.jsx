import { useState, useEffect } from "react";
import ResourcePage from "../../../shared/resource/ResourcePage";
import {
  fetchAdminCampaigns,
  subscribeAdminRealtime,
} from "../../../../../services/adminSupabaseService";

const columns = [
  "id",
  "name",
  "audience",
  "budget",
  "reach",
  "status",
  "starts",
  "ends",
].map((key) => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));

export default function CampaignsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCampaigns() {
    try {
      const data = await fetchAdminCampaigns();
      if (Array.isArray(data)) {
        const mapped = data.map((c) => ({
          id: c.id,
          name: c.name,
          audience: c.audience || "All Customers",
          budget: `₹${c.budget || 0}`,
          reach: `${(c.reach || 0).toLocaleString()} users`,
          status: c.status || "Active",
          starts: c.starts_at ? new Date(c.starts_at).toLocaleDateString("en-IN") : "Immediate",
          ends: c.ends_at ? new Date(c.ends_at).toLocaleDateString("en-IN") : "Ongoing",
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
    loadCampaigns();
    const unsub = subscribeAdminRealtime("campaigns", () => loadCampaigns());
    return () => unsub();
  }, []);

  return (
    <ResourcePage
      title="Marketing Campaigns"
      description="Live promotional campaigns, student audience targeting, and marketing budgets from Supabase."
      seed={rows}
      columns={columns}
      createLabel="Add New"
      createPath="/admin/marketing/campaigns/new"
      editPath={(row) => `/admin/marketing/campaigns/${encodeURIComponent(row.id)}/edit`}
      emptyTitle={loading ? "Loading campaigns..." : "No active campaigns found"}
      emptyDescription="Launch seasonal campaigns and promotional banners for your marketplace."
    />
  );
}
