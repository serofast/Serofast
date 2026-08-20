import { useState } from "react";
import { Download } from "lucide-react";
import { Card, FilterBar, PageHeader, Toast } from "../../shared/ui";
import ResourceTable from "../../shared/resource/ResourceTable";
import { useResourceList } from "../../shared/resource/useResourceList";
import { reports } from "../../shared/adminData";

const additionalReports = [
  ["REP-04", "Orders", "Order lifecycle and fulfillment status."],
  ["REP-05", "Customers", "Customer activity and value segments."],
  ["REP-06", "Products", "Catalog, moderation, and inventory status."],
  ["REP-07", "Commissions", "Frontend commission-rule snapshot."],
  ["REP-08", "Withdrawals", "Seller payout request snapshot."],
  ["REP-09", "Refunds", "Refund status and value snapshot."],
].map(([id, name, description]) => ({
  id,
  name,
  description,
  format: "CSV",
}));

const seed = [...reports, ...additionalReports];

export default function ReportsPage() {
  const resource = useResourceList(seed);
  const [format, setFormat] = useState("CSV");
  const [range, setRange] = useState("30 Days");
  const [reportStatus, setReportStatus] = useState("");
  const [toast, setToast] = useState("");

  function download(report) {
    const payload = {
      report: report.name,
      filters: { range, status: reportStatus || "All" },
      generatedAt: new Date().toISOString(),
      notice: "Phase 4 frontend export. Not an official or backend-verified report.",
    };
    const content =
      format === "CSV"
        ? `report,range,status,generated_at\n${report.name},${range},${reportStatus || "All"},${payload.generatedAt}\n`
        : JSON.stringify(payload, null, 2);
    const blob = new Blob([content], {
      type: format === "CSV" ? "text/csv" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${report.name.replaceAll(" ", "-").toLowerCase()}-${format.toLowerCase()}-demo.${format === "CSV" ? "csv" : "json"}`;
    anchor.click();
    URL.revokeObjectURL(url);
    setToast(`${report.name} ${format} demo export prepared.`);
  }

  const columns = [
    { key: "id", label: "Report ID" },
    { key: "name", label: "Report", minWidth: 190 },
    { key: "description", label: "Description", minWidth: 300 },
    {
      key: "format",
      label: "Export Format",
      render: () => format,
    },
  ];

  return (
    <div className="min-w-0 space-y-6 pb-6 font-sans font-sansation animate-fade-in">
      <PageHeader
        title="Reports"
        description="Prepare operational report snapshots. Exports remain frontend demos until backend reporting is connected."
      />

      <Card className="grid gap-3 p-4 sm:grid-cols-3">
        <Select
          label="Date range"
          value={range}
          onChange={setRange}
          options={["Today", "7 Days", "30 Days", "3 Months", "1 Year"]}
        />
        <Select
          label="Status"
          value={reportStatus}
          onChange={setReportStatus}
          options={["", "Active", "Pending", "Completed", "Rejected"]}
          emptyLabel="All statuses"
        />
        <Select
          label="Export format"
          value={format}
          onChange={setFormat}
          options={["CSV", "Excel", "PDF"]}
        />
      </Card>

      <div>
        <FilterBar
          value={resource.search}
          setValue={resource.setSearch}
          placeholder="Search reports..."
          onClear={resource.clearFilters}
          showStatus={false}
        />
        <ResourceTable
          columns={columns}
          rows={resource.visibleRows}
          rowActions={(row) => [
            {
              label: `Export ${row.name}`,
              shortLabel: `Export ${format}`,
              icon: Download,
              tone: "primary",
              onClick: () => download(row),
            },
          ]}
          onView={download}
          selectable={false}
          sortKey={resource.sortKey}
          sortDirection={resource.sortDirection}
          onSort={resource.changeSort}
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
          emptyTitle="No reports match your search"
        />
      </div>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function Select({ label, value, onChange, options, emptyLabel }) {
  return (
    <label>
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full cursor-pointer rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs outline-none focus:border-brandRed"
      >
        {options.map((option) => (
          <option key={option || "all"} value={option}>
            {option || emptyLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
