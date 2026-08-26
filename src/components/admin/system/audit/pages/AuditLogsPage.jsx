import { useState, useEffect } from "react";
import ResourcePage from "../../../shared/resource/ResourcePage";
import {
  fetchAdminAuditLogs,
  subscribeAdminRealtime,
} from "../../../../../services/adminSupabaseService";

const columns = [
  "id",
  "actor",
  "action",
  "target",
  "module",
  "time",
].map((key) => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));

export default function AuditLogsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAuditLogs() {
    try {
      const data = await fetchAdminAuditLogs();
      if (Array.isArray(data)) {
        const mapped = data.map((l) => ({
          id: `LOG-${l.id ? l.id.slice(0, 6).toUpperCase() : "1"}`,
          actor: l.actor_name || "Admin",
          action: l.action || "UPDATE",
          target: l.target_label || l.target_type || "System",
          module: l.module || "System",
          time: new Date(l.created_at || Date.now()).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
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
    loadAuditLogs();
    const unsub = subscribeAdminRealtime("audit_logs", () => loadAuditLogs());
    return () => unsub();
  }, []);

  return (
    <ResourcePage
      title="Audit Logs"
      description="Immutable administrative action history and system mutation ledger from Supabase."
      seed={rows}
      columns={columns}
      emptyTitle={loading ? "Loading audit logs..." : "No audit logs recorded yet"}
      emptyDescription="Administrative mutations, status changes, and approvals are automatically logged here."
    />
  );
}
