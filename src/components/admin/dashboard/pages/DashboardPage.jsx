import { useMemo, useState } from "react";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  Kpi,
  StatGrid,
  StatusBadge,
  StatusCard,
  DonutChart,
  ProgressCircle,
} from "../../shared/ui";
import {
  auditLogs,
  dashboardStats,
  inventory,
  orders,
  refunds,
  returns,
  riskAlerts,
  salesSeries,
  supportTickets,
  withdrawals,
} from "../../shared/adminData";

const ranges = ["Today", "7 Days", "30 Days", "3 Months", "1 Year"];

const statRoutes = {
  "Today's Orders": "/admin/orders",
  "Active Shops": "/admin/shops",
  "Registered Customers": "/admin/customers",
  "Pending Orders": "/admin/orders",
  "Pending Shop Approvals": "/admin/shops/approvals",
  "Total Sales": "/admin/finance/transactions",
};

export default function DashboardPage() {
  const [range, setRange] = useState("30 Days");
  const maximumSale = Math.max(...salesSeries, 1);

  const attentionStats = useMemo(
    () => [
      {
        label: "Pending returns",
        value: returns.filter((item) => item.status === "Requested").length,
        href: "/admin/returns?status=Requested",
        description: "Review needed",
      },
      {
        label: "Pending refunds",
        value: refunds.filter((item) => item.status === "Pending").length,
        href: "/admin/finance/refunds?status=Pending",
        description: "Process funds",
      },
      {
        label: "Pending payouts",
        value: withdrawals.filter((item) => item.status === "Pending").length,
        href: "/admin/finance/withdrawals",
        description: "Seller withdrawals",
      },
      {
        label: "Low stock",
        value: inventory.filter((item) => item.status !== "Active").length,
        href: "/admin/inventory?status=Low%20Stock",
        description: "Stock alert",
      },
      {
        label: "Open tickets",
        value: supportTickets.filter((item) => item.status !== "Resolved").length,
        href: "/admin/support",
        description: "Support queue",
      },
      {
        label: "Risk alerts",
        value: riskAlerts.filter((item) => item.status !== "Dismissed").length,
        href: "/admin/risk",
        description: "Safety review",
      },
    ],
    [],
  );

  const orderStatusDonutData = useMemo(() => {
    const counts = {
      Delivered: orders.filter((o) => o.status === "Delivered").length,
      Shipped: orders.filter((o) => o.status === "Shipped").length,
      Processing: orders.filter((o) => o.status === "Processing" || o.status === "Packed").length,
      Pending: orders.filter((o) => o.status === "Pending" || o.status === "New").length,
    };
    return [
      { label: "Delivered", value: counts.Delivered || 12, color: "#059669" },
      { label: "Shipped", value: counts.Shipped || 8, color: "#0284C7" },
      { label: "Processing", value: counts.Processing || 5, color: "#D97706" },
      { label: "Pending", value: counts.Pending || 3, color: "#D32F2F" },
    ];
  }, []);

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            SeroFast operational health & performance overview.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
          <CalendarDays size={14} />
          16 Aug 2026
        </div>
      </div>

      {/* Primary KPI Metrics Cards */}
      <StatGrid>
        {dashboardStats.map((item) => (
          <Link
            key={item.label}
            to={statRoutes[item.label] ?? "/admin/analytics"}
            className="block h-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-brandRed/30"
          >
            <Kpi {...item} />
          </Link>
        ))}
      </StatGrid>

      {/* Visual Diagrams Grid: Circular Donut Diagram & Operational Gauge Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Circular Order Status Donut Chart */}
        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-normal text-slate-800">Order Breakdown</h3>
              <p className="text-[11px] text-slate-400 font-normal">Live status distribution</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-normal text-brandRed hover:underline flex items-center gap-1">
              <span>Orders</span>
              <ArrowRight size={12} />
            </Link>
          </div>
          <div className="pt-2">
            <DonutChart data={orderStatusDonutData} centerText={`${orders.length}`} centerSubtext="Total Orders" />
          </div>
        </div>

        {/* Operational Health Visual Gauges */}
        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-normal text-slate-800">Fulfillment Efficiency</h3>
              <p className="text-[11px] text-slate-400 font-normal">Platform target metrics</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2 text-center">
            <div className="flex flex-col items-center gap-2 p-3 rounded-[24px] bg-[#FAF8F5] border border-slate-100">
              <ProgressCircle percentage={92} color="#059669" size={56} />
              <span className="text-[11px] font-medium text-slate-700">On-Time Dispatch</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-[24px] bg-[#FAF8F5] border border-slate-100">
              <ProgressCircle percentage={85} color="#2563EB" size={56} />
              <span className="text-[11px] font-medium text-slate-700">Verified Shops</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-[24px] bg-[#FAF8F5] border border-slate-100">
              <ProgressCircle percentage={78} color="#D32F2F" size={56} />
              <span className="text-[11px] font-medium text-slate-700">Revenue Goal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Requires Attention Section */}
      <section aria-labelledby="attention-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="attention-heading" className="text-base font-normal text-slate-800">
            Action items
          </h2>
          <span className="text-xs text-slate-400 font-normal">Live queue</span>
        </div>
        <StatGrid>
          {attentionStats.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="block h-full rounded-2xl focus:outline-none focus:ring-2 focus:ring-brandRed/30"
            >
              <StatusCard
                label={item.label}
                value={item.value}
                description={item.description}
                tone={item.value > 0 ? "rose" : "green"}
              />
            </Link>
          ))}
        </StatGrid>
      </section>

      {/* Sales Trend Chart Container */}
      <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-normal text-slate-800">Gross revenue</h3>
            <p className="text-xs text-slate-400 font-normal">Sales trend chart</p>
          </div>
          <select
            aria-label="Sales date range"
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="h-9 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs outline-none focus:border-brandRed cursor-pointer"
          >
            {ranges.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="flex h-44 items-end gap-2" aria-label={`Sales chart for ${range}`}>
          {salesSeries.map((value, index) => (
            <div key={`${index}-${value}`} className="flex h-full flex-1 flex-col justify-end">
              <div className="relative flex-1">
                <div
                  title={`Period ${index + 1}: ${value}`}
                  className="absolute inset-x-0 bottom-0 min-h-1 rounded-t-lg bg-brandRed transition hover:bg-brandRedDark"
                  style={{ height: `${(value / maximumSale) * 100}%` }}
                />
              </div>
              <span className="pt-2 text-center text-[10px] text-slate-400">
                {index + 1}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 sm:grid-cols-3 lg:grid-cols-6 pt-2 border-t border-slate-100">
          {[
            ["Gross", "₹12.48L"],
            ["Net", "₹11.82L"],
            ["Orders", "428"],
            ["AOV", "₹2,916"],
            ["Refunds", "₹26,400"],
            ["Commission", "₹1.24L"],
          ].map(([label, value]) => (
            <div key={label} className="bg-[#FAF8F5] p-2.5 rounded-2xl border border-slate-100 text-center">
              <span className="text-slate-400 text-[10px] uppercase block">{label}</span>
              <span className="font-semibold text-slate-900 text-xs block mt-0.5">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-normal text-slate-800">Recent orders</h3>
            <Link to="/admin/orders" className="text-xs font-normal text-brandRed hover:underline flex items-center gap-1">
              <span>All</span>
              <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {orders.slice(0, 3).map((order) => (
              <Link
                key={order.id}
                to={`/admin/orders/${encodeURIComponent(order.id)}`}
                className="flex items-center justify-between gap-3 rounded-[24px] border border-slate-100 bg-[#FAF8F5] p-3 text-xs hover:bg-slate-50 transition"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{order.id}</p>
                  <p className="truncate text-[10px] text-slate-400 font-normal">
                    {order.customer} · {order.amount}
                  </p>
                </div>
                <StatusBadge value={order.status} />
              </Link>
            ))}
          </div>
        </div>

        {/* Audit Activity */}
        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-normal text-slate-800">Recent activity</h3>
            <Link to="/admin/audit-logs" className="text-xs font-normal text-brandRed hover:underline flex items-center gap-1">
              <span>Logs</span>
              <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {auditLogs.slice(0, 3).map((entry) => (
              <div key={entry.id} className="rounded-[24px] border border-slate-100 bg-[#FAF8F5] p-3 text-xs">
                <p className="font-medium text-slate-900 truncate">{entry.action}</p>
                <p className="mt-0.5 text-[10px] text-slate-400 font-normal truncate">
                  {entry.actor} · {entry.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
