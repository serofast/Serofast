import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Eye,
  History,
  Landmark,
  XCircle,
} from "lucide-react";
import {
  BulkActionBar,
  ConfirmDialog,
  Drawer,
  FilterBar,
  PageHeader,
  StatGrid,
  StatusCard,
  Toast,
} from "../../shared/ui";
import ResourceTable from "../../shared/resource/ResourceTable";
import { useResourceList } from "../../shared/resource/useResourceList";
import { shops, withdrawals } from "../../shared/adminData";

const statuses = ["Pending", "Approved", "Processing", "Completed", "Rejected"];
const seed = withdrawals.map((row, index) => ({
  ...row,
  requested: row.requested ?? `${16 - index} Aug 2026`,
}));

const columns = [
  { key: "id", label: "Request", minWidth: 135 },
  { key: "shop", label: "Shop", minWidth: 190 },
  { key: "owner", label: "Owner", minWidth: 180 },
  { key: "amount", label: "Amount" },
  { key: "method", label: "Method" },
  { key: "status", label: "Status" },
  { key: "requested", label: "Requested" },
];

export default function WithdrawalsPage() {
  const navigate = useNavigate();
  const { withdrawalId } = useParams();
  const resource = useResourceList(seed);
  const [selected, setSelected] = useState(null);
  const [drawerSection, setDrawerSection] = useState("review");
  const [pendingAction, setPendingAction] = useState(null);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!withdrawalId) return;
    const routedWithdrawal = resource.rows.find(
      (item) => String(item.id) === withdrawalId,
    );
    if (routedWithdrawal) {
      setSelected(routedWithdrawal);
      setDrawerSection("review");
    }
  }, [resource.rows, withdrawalId]);

  function openDrawer(row, section = "review") {
    setSelected(resource.rows.find((item) => item.id === row.id) ?? row);
    setDrawerSection(section);
    if (section === "review") {
      navigate(`/admin/finance/withdrawals/${encodeURIComponent(row.id)}`);
    }
  }

  function closeDrawer() {
    setSelected(null);
    if (withdrawalId) navigate("/admin/finance/withdrawals", { replace: true });
  }

  function requestAction(row, status) {
    setReason("");
    setReasonError("");
    setPendingAction({ row, status });
  }

  function confirmAction() {
    if (!pendingAction) return;
    if (pendingAction.status === "Rejected" && !reason.trim()) {
      setReasonError("A rejection reason is required.");
      return;
    }

    const patch = {
      status: pendingAction.status,
      reason: reason.trim(),
    };
    resource.updateRow(pendingAction.row.id, patch);
    if (selected?.id === pendingAction.row.id) {
      setSelected((current) => ({ ...current, ...patch }));
    }
    setToast(
      `Withdrawal ${pendingAction.row.id} marked ${pendingAction.status.toLowerCase()}.`,
    );
    setPendingAction(null);
  }

  function viewShop(row) {
    const shop = shops.find((item) => item.shop === row.shop);
    if (shop) {
      navigate(`/admin/shops/${shop.id}`);
    } else {
      setToast("The linked shop record is not available in this frontend dataset.");
    }
  }

  function withdrawalActions(row) {
    return [
      {
        label: "Review Withdrawal",
        shortLabel: "Review",
        icon: Eye,
        tone: "primary",
        onClick: () => openDrawer(row),
      },
      {
        label: "Approve Withdrawal",
        shortLabel: "Approve",
        icon: CheckCircle2,
        tone: "success",
        hidden: row.status !== "Pending",
        onClick: () => requestAction(row, "Approved"),
      },
      {
        label: "Reject Withdrawal",
        shortLabel: "Reject",
        icon: XCircle,
        tone: "danger",
        hidden: row.status !== "Pending",
        onClick: () => requestAction(row, "Rejected"),
      },
      {
        label: "View Shop",
        icon: Building2,
        onClick: () => viewShop(row),
      },
      {
        label: "View Bank Details",
        icon: Landmark,
        onClick: () => openDrawer(row, "bank"),
      },
      {
        label: "View History",
        icon: History,
        onClick: () => openDrawer(row, "history"),
      },
    ];
  }

  return (
    <div className="min-w-0">
      <PageHeader
        title="Withdrawals"
        description="Review, approve, reject, and monitor seller payout requests."
      />

      <StatGrid className="mb-5">
        {statuses.map((status) => (
          <StatusCard
            key={status}
            label={status}
            value={resource.rows.filter((row) => row.status === status).length}
            description={status === "Pending" ? "Needs review" : "Current requests"}
            tone={
              status === "Pending"
                ? "amber"
                : status === "Rejected"
                  ? "rose"
                  : "green"
            }
            onClick={() =>
              resource.setStatus(resource.status === status ? "" : status)
            }
          />
        ))}
      </StatGrid>

      <FilterBar
        value={resource.search}
        setValue={resource.setSearch}
        placeholder="Search withdrawal requests..."
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
        rowActions={withdrawalActions}
        onView={(row) => openDrawer(row)}
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
        emptyTitle="No withdrawal requests match your filters"
      />

      <Drawer
        open={Boolean(selected)}
        onClose={closeDrawer}
        title={
          drawerSection === "bank"
            ? "Bank details"
            : drawerSection === "history"
              ? "Withdrawal history"
              : "Withdrawal review"
        }
      >
        {selected && drawerSection === "review" && (
          <div className="space-y-4">
            {Object.entries(selected).map(([key, value]) => (
              <div
                key={key}
                className="flex items-start justify-between gap-5 border-b border-lightBorder pb-3 text-sm"
              >
                <span className="capitalize text-textMuted">{key}</span>
                <span className="text-right font-semibold">{String(value)}</span>
              </div>
            ))}
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => viewShop(selected)}
                className="h-10 rounded-[30px] border border-lightBorder px-4 text-xs font-medium"
              >
                View Shop
              </button>
              <button
                type="button"
                onClick={() => setDrawerSection("bank")}
                className="h-10 rounded-[30px] border border-lightBorder px-4 text-xs font-medium"
              >
                View Bank Details
              </button>
            </div>
            {selected.status === "Pending" && (
              <div className="grid gap-2 border-t border-lightBorder pt-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => requestAction(selected, "Approved")}
                  className="h-10 rounded-[30px] bg-emerald-600 px-4 text-xs font-semibold text-white"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => requestAction(selected, "Rejected")}
                  className="h-10 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        )}

        {selected && drawerSection === "bank" && (
          <div className="space-y-4 text-sm">
            <p className="rounded-[20px] bg-promoHighlight p-4 text-textSecondary">
              Bank details are masked in Phase 4. Production access must be
              permission-controlled and audited by the backend.
            </p>
            {[
              ["Account holder", selected.owner],
              ["Bank", "SeroFast verified bank"],
              ["Account", "•••• •••• 4821"],
              ["IFSC", "SERO•••142"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-lightBorder pb-3">
                <span className="text-textMuted">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        )}

        {selected && drawerSection === "history" && (
          <div className="space-y-3 text-sm">
            {[
              [selected.requested, "Withdrawal request submitted"],
              ["Current", `Status: ${selected.status}`],
            ].map(([time, event]) => (
              <div key={`${time}-${event}`} className="rounded-[20px] border border-lightBorder p-4">
                <p className="font-semibold">{event}</p>
                <p className="mt-1 text-xs text-textMuted">{time}</p>
              </div>
            ))}
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={`${pendingAction?.status ?? "Update"} withdrawal`}
        description={`${pendingAction?.row?.id ?? "This request"} for ${pendingAction?.row?.amount ?? ""} will be marked ${pendingAction?.status?.toLowerCase() ?? ""}.`}
        confirmLabel={
          pendingAction?.status === "Approved"
            ? "Approve withdrawal"
            : "Reject withdrawal"
        }
        tone={pendingAction?.status === "Approved" ? "success" : "danger"}
        onConfirm={confirmAction}
        onClose={() => setPendingAction(null)}
      >
        {pendingAction?.status === "Rejected" && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">
              Rejection reason
            </span>
            <textarea
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                setReasonError("");
              }}
              rows={3}
              aria-invalid={Boolean(reasonError)}
              className="w-full rounded-[20px] border border-lightBorder p-3 text-sm outline-none focus:border-brandRed"
            />
            {reasonError && (
              <span className="mt-1 block text-xs font-semibold text-brandRed">
                {reasonError}
              </span>
            )}
          </label>
        )}
      </ConfirmDialog>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
