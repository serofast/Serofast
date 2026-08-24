import { useState, useEffect } from "react";
import ResourcePage from "../../../shared/resource/ResourcePage";
import { adminUsers as seed } from "../../../shared/adminData";
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
  const [rows, setRows] = useState(seed);

  useEffect(() => {
    async function loadAdminUsers() {
      const data = await fetchAdminUsersList();
      if (data && data.length > 0) {
        const mapped = data.map((u) => ({
          id: u.id,
          name: u.full_name || "Admin User",
          email: u.email,
          role: "Super Admin",
          status: "Active",
          lastLogin: new Date(u.updated_at || u.created_at).toLocaleDateString("en-IN"),
        }));
        setRows(mapped);
      } else {
        setRows(seed);
      }
    }
    loadAdminUsers();
    const unsub = subscribeAdminRealtime("profiles", () => loadAdminUsers());
    return () => unsub();
  }, []);

  return (
    <ResourcePage
      title="Admin Users"
      description="Manage internal administrator accounts, security credentials, and system staff access."
      seed={rows}
      columns={columns}
      createLabel="Add New"
      viewPath={(row) => `/admin/admin-users/${encodeURIComponent(row.id)}`}
      routeParam="adminId"
      basePath="/admin/admin-users"
    />
  );
}
