import { useState, useEffect } from "react";
import ResourcePage from "../../../shared/resource/ResourcePage";
import { auditLogs as seed } from "../../../shared/adminData";
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
  const [rows, setRows] = useState(seed);

  useEffect(() => {
    async function loadAuditLogs() {
      const data = await fetchAdminAuditLogs();
      if (data && data.length > 0) {
        const mapped = data.map((l) => ({
          id: `LOG-${l.id.slice(0, 6).toUpperCase()}`,
          actor: l.actor_name,
          action: l.action,
          target: l.target_label || l.target_type,
          module: l.module,
          time: new Date(l.created_at).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        }));
        setRows(mapped);
      } else {
        setRows(seed);
      }
    }

    loadAuditLogs();
    const unsub = subscribeAdminRealtime("audit_logs", () => loadAuditLogs());
    return () => unsub();
  }, []);

  return (
    <ResourcePage
      title="Audit Logs"
      description="Immutable administrative action history and system mutation ledger."
      seed={rows}
      columns={columns}
    />
  );
}
