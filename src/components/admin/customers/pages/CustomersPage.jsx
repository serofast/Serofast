import { useState, useEffect } from "react";
import ResourcePage from "../../shared/resource/ResourcePage";
import { fetchAdminProfiles, subscribeToAdminTableChanges } from "../../../../lib/supabase";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "orders", label: "Orders" },
  { key: "spent", label: "Total Spent" },
  { key: "avgOrder", label: "Avg Order" },
  { key: "returns", label: "Returns" },
  { key: "status", label: "Status" },
  { key: "joined", label: "Joined" },
];

export default function CustomersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadProfiles() {
    try {
      const data = await fetchAdminProfiles();
      if (Array.isArray(data)) {
        const mapped = data.map((p) => ({
          id: p.id,
          name: p.full_name || "Registered User",
          email: p.email || "user@serofast.com",
          orders: 0,
          spent: "₹0",
          avgOrder: "₹0",
          returns: 0,
          status: "Active",
          joined: new Date(p.created_at || Date.now()).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
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
    loadProfiles();
    const unsubscribe = subscribeToAdminTableChanges("profiles", () => {
      loadProfiles();
    });

    return () => unsubscribe();
  }, []);

  return (
    <ResourcePage
      title="Customers & Users"
      description="Live registered student accounts, customer activity, and profile management from Supabase."
      seed={rows}
      columns={columns}
      viewPath={(row) => `/admin/customers/${encodeURIComponent(row.id)}`}
      emptyTitle={loading ? "Loading customers..." : "No customer accounts found"}
      emptyDescription="When users sign up on the platform, their profiles will appear here."
    />
  );
}
