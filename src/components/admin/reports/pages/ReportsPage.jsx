import { useState } from "react";
import { Download } from "lucide-react";
import { AdminSelect, Card, FilterBar, PageHeader, Toast } from "../../shared/ui";
import ResourceTable from "../../shared/resource/ResourceTable";
import { useResourceList } from "../../shared/resource/useResourceList";
import { reports } from "../../shared/adminData";
import {
  fetchAdminOverviewStats,
  fetchAdminOrders,
  fetchAdminProfiles,
} from "../../../../lib/supabase";
import {
  fetchAdminWarehouseCatalog,
  fetchAdminWithdrawalsList,
} from "../../../../services/adminSupabaseService";

const additionalReports = [
  ["REP-04", "Orders", "Live order lifecycle and fulfillment records from database."],
  ["REP-05", "Customers", "Registered customer activity, spend, and account status."],
  ["REP-06", "Products", "Warehouse product inventory, pricing, and catalog SKU report."],
  ["REP-07", "Commissions", "Marketplace commission rules snapshot."],
  ["REP-08", "Withdrawals", "Seller payout requests and settlement status."],
  ["REP-09", "Refunds", "Customer return refunds and resolution ledger."],
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

  async function download(report) {
    let rowsData = [];
    try {
      if (report.name.includes("Order") || report.name.includes("Sales")) {
        const orders = await fetchAdminOrders();
        rowsData = (orders || []).map((o) => ({
          order_number: o.order_number || o.id,
          amount: o.total_amount,
          status: o.order_status || o.status,
          customer: o.customer_phone || o.user_id,
          date: o.created_at,
        }));
      } else if (report.name.includes("Customer")) {
        const customers = await fetchAdminProfiles();
        rowsData = (customers || []).map((c) => ({
          id: c.id,
          name: c.full_name,
          email: c.email,
          phone: c.phone,
          created_at: c.created_at,
        }));
      } else if (report.name.includes("Product")) {
        const prods = await fetchAdminWarehouseCatalog();
        rowsData = (prods || []).map((p) => ({
          sku: p.sku,
          title: p.title,
          category: p.category,
          price: p.retail_price || p.base_price,
          stock: p.warehouse_stock,
        }));
      } else if (report.name.includes("Withdrawal")) {
        const withs = await fetchAdminWithdrawalsList();
        rowsData = (withs || []).map((w) => ({
          payout_number: w.payout_number || w.id,
          amount: w.amount,
          status: w.status,
          method: w.payout_method,
        }));
      }
    } catch {}

    let content = "";
    if (format === "CSV") {
      if (rowsData.length > 0) {
        const headers = Object.keys(rowsData[0]).join(",");
        const lines = rowsData.map((row) =>
          Object.values(row)
            .map((val) => `"${String(val || "").replace(/"/g, '""')}"`)
            .join(",")
        );
        content = `${headers}\n${lines.join("\n")}`;
      } else {
        content = `report,range,status,generated_at\n"${report.name}","${range}","${reportStatus || "All"}","${new Date().toISOString()}"\n`;
      }
    } else {
      content = JSON.stringify(
        {
          report: report.name,
          range,
          data: rowsData,
          generatedAt: new Date().toISOString(),
        },
        null,
        2
      );
    }

    const blob = new Blob([content], {
      type: format === "CSV" ? "text/csv;charset=utf-8;" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${report.name.replaceAll(" ", "-").toLowerCase()}-export.${format.toLowerCase()}`;
    anchor.click();
    URL.revokeObjectURL(url);
    setToast(`${report.name} ${format} exported from Supabase.`);
  }

  const columns = [
    { key: "id", label: "Report ID" },
    { key: "name", label: "Report", minWidth: 190 },
    { key: "description", label: "Description", minWidth: 300 },
    {
      key: "format",
      label: "Export Format",
      render: () => (
        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
          {format}
        </span>
      ),
    },
  ];

  function reportActions(row) {
    return [
      {
        label: `Export ${format}`,
        shortLabel: "Export",
        icon: Download,
        tone: "primary",
        onClick: () => download(row),
      },
    ];
  }

  return (
    <div className="font-sans font-sansation">
      <PageHeader
        title="Reports & Data Export"
        description="Generate and download production database analytics and operational summaries in CSV or JSON format."
      />

      <Card className="mb-5 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">Format</span>
            <AdminSelect
              value={format}
              onChange={setFormat}
              options={["CSV", "JSON"]}
              ariaLabel="Report format"
              buttonClassName="h-11"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">Date Range</span>
            <AdminSelect
              value={range}
              onChange={setRange}
              options={["Today", "7 Days", "30 Days", "3 Months", "1 Year"]}
              ariaLabel="Date range"
              buttonClassName="h-11"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold">Status Scope</span>
            <AdminSelect
              value={reportStatus}
              onChange={setReportStatus}
              options={["All Statuses", "Completed", "Pending", "Active"]}
              emptyLabel="All Statuses"
              ariaLabel="Status scope"
              buttonClassName="h-11"
            />
          </label>
        </div>
      </Card>

      <div className="mb-4">
        <FilterBar
          value={resource.search}
          setValue={resource.setSearch}
          placeholder="Filter report categories..."
          onClear={resource.clearFilters}
        />
      </div>

      <ResourceTable
        columns={columns}
        rows={resource.visibleRows}
        rowActions={reportActions}
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
        emptyTitle="No reports match your search"
      />

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
