import { useState } from "react";
import { Card, PageHeader, Toast } from "../../shared/ui";
import { reports } from "../../shared/adminData";

const additionalReports = [
  ["REP-04", "Orders", "Order lifecycle and fulfillment status."],
  ["REP-05", "Customers", "Customer activity and value segments."],
  ["REP-06", "Products", "Catalog, moderation, and inventory status."],
  ["REP-07", "Commissions", "Frontend commission-rule snapshot."],
  ["REP-08", "Withdrawals", "Seller payout request snapshot."],
  ["REP-09", "Refunds", "Refund status and value snapshot."],
].map(([id, name, description]) => ({ id, name, description, format: "CSV" }));

export default function ReportsPage() {
  const [format, setFormat] = useState("CSV");
  const [range, setRange] = useState("30 Days");
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState("");
  const availableReports = [...reports, ...additionalReports];

  function download(report) {
    const payload = {
      report: report.name,
      filters: { range, status: status || "All" },
      generatedAt: new Date().toISOString(),
      notice: "Phase 4 frontend export. Not an official or backend-verified report.",
    };
    const content =
      format === "CSV"
        ? `report,range,status,generated_at\n${report.name},${range},${status || "All"},${payload.generatedAt}\n`
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

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Prepare operational report snapshots. Exports remain frontend demos until backend reporting is connected."
      />

      <Card className="mb-6 grid gap-3 p-4 sm:grid-cols-3">
        <Select label="Date range" value={range} onChange={setRange} options={["Today", "7 Days", "30 Days", "3 Months", "1 Year"]} />
        <Select label="Status" value={status} onChange={setStatus} options={["", "Active", "Pending", "Completed", "Rejected"]} emptyLabel="All statuses" />
        <Select label="Export format" value={format} onChange={setFormat} options={["CSV", "Excel", "PDF"]} />
      </Card>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {availableReports.map((report) => (
          <Card key={report.id} className="p-5">
            <div className="flex h-11 w-14 items-center justify-center rounded-xl bg-promoHighlight text-xs font-bold text-brandRed">
              {format}
            </div>
            <h2 className="mt-4 text-lg font-semibold">{report.name}</h2>
            <p className="mt-1 text-sm text-textSecondary">{report.description}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs text-textMuted">Frontend demo export</span>
              <button
                type="button"
                onClick={() => download(report)}
                className="min-h-10 rounded-lg border border-lightBorder px-3 text-xs font-semibold hover:border-brandRed hover:text-brandRed"
              >
                Export {format}
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function Select({ label, value, onChange, options, emptyLabel }) {
  return (
    <label>
      <span className="mb-1.5 block text-xs font-bold uppercase text-textMuted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-lightBorder bg-white px-3 text-sm"
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
