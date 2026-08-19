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
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">Reports</h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Prepare operational report snapshots. Exports remain frontend demos until backend reporting is connected.
        </p>
      </div>

      <Card className="grid gap-3 p-4 sm:grid-cols-3">
        <Select label="Date range" value={range} onChange={setRange} options={["Today", "7 Days", "30 Days", "3 Months", "1 Year"]} />
        <Select label="Status" value={status} onChange={setStatus} options={["", "Active", "Pending", "Completed", "Rejected"]} emptyLabel="All statuses" />
        <Select label="Export format" value={format} onChange={setFormat} options={["CSV", "Excel", "PDF"]} />
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {availableReports.map((report) => (
          <div key={report.id} className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] space-y-3">
            <div className="grid h-10 w-14 place-items-center rounded-2xl bg-rose-50 text-xs font-semibold text-brandRed">
              {format}
            </div>
            <h3 className="text-xs font-medium text-slate-900">{report.name}</h3>
            <p className="text-[11px] text-slate-500 font-normal">{report.description}</p>
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 font-normal">Frontend demo export</span>
              <button
                type="button"
                onClick={() => download(report)}
                className="flex h-9 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-[11px] font-medium text-slate-600 hover:border-brandRed hover:text-brandRed transition cursor-pointer"
              >
                Export {format}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function Select({ label, value, onChange, options, emptyLabel }) {
  return (
    <label>
      <span className="mb-1.5 block text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs outline-none focus:border-brandRed cursor-pointer"
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
