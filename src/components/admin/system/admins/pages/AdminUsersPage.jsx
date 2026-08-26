import { useState, useEffect } from "react";
import ResourcePage from "../../../shared/resource/ResourcePage";
import {
  fetchAdminUsersList,
  subscribeAdminRealtime,
} from "../../../../../services/adminSupabaseService";

const columns = [
  "id",
  "name",
  "email",
  "role",
  "status",
  "lastLogin",
].map((key) => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));

export default function AdminUsersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAdminUsers() {
    try {
      const data = await fetchAdminUsersList();
      if (Array.isArray(data)) {
        const mapped = data.map((u) => ({
          id: u.id,
          name: u.full_name || "Admin Staff",
          email: u.email,
          role: u.role === "admin" ? "Super Admin" : "Staff",
          status: "Active",
          lastLogin: new Date(u.updated_at || u.created_at || Date.now()).toLocaleDateString("en-IN"),
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
    loadAdminUsers();
    const unsub = subscribeAdminRealtime("profiles", () => loadAdminUsers());
    return () => unsub();
  }, []);

  return (
    <ResourcePage
      title="Admin Users & Roles"
      description="Live administrator staff credentials, access levels, and security profiles from Supabase."
      seed={rows}
      columns={columns}
      createLabel="Add New"
      viewPath={(row) => `/admin/admin-users/${encodeURIComponent(row.id)}`}
      routeParam="adminId"
      basePath="/admin/admin-users"
      emptyTitle={loading ? "Loading admin users..." : "No administrator accounts found"}
      emptyDescription="Internal administrative accounts with role = 'admin' will appear here."
    />
  );
}
