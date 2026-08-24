import { useState, useEffect } from "react";
import { Eye, SearchCheck, ShieldBan, ShieldX } from "lucide-react";
import {
  BulkActionBar,
  ConfirmDialog,
  Drawer,
  FilterBar,
  Kpi,
  PageHeader,
  ProgressCircle,
  StatusBadge,
  Toast,
} from "../../shared/ui";
import ResourceTable from "../../shared/resource/ResourceTable";
import { useResourceList } from "../../shared/resource/useResourceList";
import {
  fetchAdminRiskAlerts,
  updateAdminRiskAlertStatus,
  subscribeAdminRealtime,
} from "../../../../services/adminSupabaseService";

const columns = [
  { key: "id", label: "Alert ID" },
  { key: "type", label: "Risk Type", minWidth: 190 },
  { key: "entity", label: "Entity", minWidth: 210 },
  {
    key: "score",
    label: "Risk Level",
    render: (row) => <StatusBadge value={row.score} />,
  },
  { key: "status", label: "Status" },
  { key: "time", label: "Detected" },
];

export default function RiskDashboardPage() {
  const [rows, setRows] = useState([]);
  const resource = useResourceList(rows);
  const [selected, setSelected] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [toast, setToast] = useState("");

  async function loadAlerts() {
    try {
      const data = await fetchAdminRiskAlerts();
      if (Array.isArray(data)) {
        const mapped = data.map((a) => ({
          id: a.id,
          type: a.type || "Risk Alert",
          entity: `${a.entity_type || "System"}: ${a.entity_name || "Target"}`,
          score: a.score || "LOW",
          status: a.status || "Open",
          time: new Date(a.created_at || Date.now()).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        }));
        setRows(mapped);
        resource.setRows(mapped);
      }
    } catch {}
  }

  useEffect(() => {
    loadAlerts();
    const unsub = subscribeAdminRealtime("risk_alerts", () => loadAlerts());
    return () => unsub();
  }, []);

  async function updateAlert(row, status) {
    try {
      await updateAdminRiskAlertStatus(row.id, status);
    } catch {}
    resource.updateRow(row.id, { status });
    if (selected?.id === row.id) {
      setSelected((current) => ({ ...current, status }));
    }
    setToast(`Risk alert marked ${status.toLowerCase()} in Supabase.`);
  }

  function confirmAction() {
    if (!pendingAction) return;
    updateAlert(pendingAction.row, pendingAction.status);
    setPendingAction(null);
  }

  function alertActions(row) {
    return [
      {
        label: "View Alert",
        shortLabel: "View",
        icon: Eye,
        tone: "primary",
        onClick: () => setSelected(row),
      },
      {
        label: "Investigate Alert",
        shortLabel: "Investigate",
        icon: SearchCheck,
        tone: "warning",
        onClick: () => updateAlert(row, "Investigating"),
      },
      {
        label: "Dismiss Alert",
        shortLabel: "Dismiss",
        icon: ShieldX,
        onClick: () => setPendingAction({ row, status: "Dismissed" }),
      },
      {
        label: "Block Entity",
        shortLabel: "Block",
        icon: ShieldBan,
        tone: "danger",
        onClick: () => setPendingAction({ row, status: "Blocked" }),
      },
    ];
  }

  const openCount = resource.rows.filter((row) => row.status === "Open").length;
  const safetyScore = Math.max(10, 100 - openCount * 18);

  return (
    <div className="min-w-0 space-y-6 pb-6 font-sans font-sansation animate-fade-in">
      <PageHeader
        title="Risk & Safety"
        description="Marketplace risk signals and threat mitigation center."
      />

      <div className="flex flex-col items-center justify-between gap-6 rounded-[35px] border border-[#F3E5E5] bg-white p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] sm:flex-row">
        <div className="space-y-1 text-center sm:text-left">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Marketplace Safety Health
          </span>
          <h3 className="text-2xl font-normal text-slate-900">
            {safetyScore >= 80 ? "Low Risk Status" : "Attention Required"}
          </h3>
          <p className="text-xs font-normal text-slate-500">
            {openCount} active alerts pending operational resolution.
          </p>
        </div>
        <div className="flex items-center gap-6 rounded-[24px] border border-slate-100 bg-[#FAF8F5] p-4">
          <div className="text-center">
            <ProgressCircle
              percentage={safetyScore}
              size={64}
              color={safetyScore >= 80 ? "#059669" : "#D32F2F"}
            />
            <span className="mt-1 block text-[10px] font-medium text-slate-400">
              Safety Gauge
            </span>
          </div>
          <div className="space-y-1 text-xs text-slate-600">
            <p>Shield Protection: Active</p>
            <p>Threat Alerts: {openCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          ["Open Alerts", resource.rows.filter((row) => row.status === "Open").length],
          ["High Risk", resource.rows.filter((row) => row.score === "High").length],
          ["Critical", resource.rows.filter((row) => row.score === "Critical").length],
          ["Investigating", resource.rows.filter((row) => row.status === "Investigating").length],
          ["Blocked", resource.rows.filter((row) => row.status === "Blocked").length],
        ].map(([label, value]) => (
          <Kpi key={label} label={label} value={value} change="Alerts" />
        ))}
      </div>

      <div>
        <FilterBar
          value={resource.search}
          setValue={resource.setSearch}
          placeholder="Search risk alerts..."
          status={resource.status}
          setStatus={resource.setStatus}
          options={resource.statuses}
          onClear={resource.clearFilters}
        />
        <BulkActionBar
          count={resource.selectedIds.length}
          actions={[]}
          onClear={() => resource.setSelectedIds([])}
        />
        <ResourceTable
          columns={columns}
          rows={resource.visibleRows}
          rowActions={alertActions}
          onView={setSelected}
          sortKey={resource.sortKey}
          sortDirection={resource.sortDirection}
          onSort={resource.changeSort}
          selectedIds={resource.selectedIds}
          onToggleSelected={resource.toggleSelected}
          onToggleAll={resource.toggleVisibleRows}
          page={resource.page}
          pageCount={resource.pageCount}
          pageSize={resource.pageSize}
          totalCount={resource.totalCount}
          onPageChange={resource.setPage}
          onPageSizeChange={resource.changePageSize}
          onClearFilters={resource.clearFilters}
          loading={resource.loading}
          error={resource.error}
          onRetry={resource.retry}
          emptyTitle="No risk alerts match your filters"
        />
      </div>

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Risk alert details"
      >
        {selected && (
          <div className="space-y-4">
            {columns.map((column) => (
              <div
                key={column.key}
                className="flex items-start justify-between gap-4 border-b border-lightBorder pb-3 text-sm"
              >
                <span className="text-textMuted">{column.label}</span>
                <span className="text-right font-semibold">
                  {column.key === "score" || column.key === "status" ? (
                    <StatusBadge value={selected[column.key]} />
                  ) : (
                    selected[column.key]
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={`${pendingAction?.status ?? "Update"} risk entity`}
        description={`${pendingAction?.row?.entity ?? "This entity"} will be marked ${pendingAction?.status?.toLowerCase() ?? ""} in local Admin state.`}
        confirmLabel={`Confirm ${pendingAction?.status ?? "action"}`}
        tone="danger"
        onConfirm={confirmAction}
        onClose={() => setPendingAction(null)}
      />

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
