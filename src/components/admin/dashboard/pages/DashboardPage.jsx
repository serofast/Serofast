import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, Kpi, PageHeader, StatGrid, StatusBadge, StatusCard } from "../../shared/ui";
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

const ranges = [
  "Today",
  "7 Days",
  "30 Days",
  "3 Months",
  "6 Months",
  "1 Year",
  "Custom",
];

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
        description: "Awaiting operations review",
      },
      {
        label: "Pending refunds",
        value: refunds.filter((item) => item.status === "Pending").length,
        href: "/admin/finance/refunds?status=Pending",
        description: "Customer funds to process",
      },
      {
        label: "Pending withdrawals",
        value: withdrawals.filter((item) => item.status === "Pending").length,
        href: "/admin/finance/withdrawals",
        description: "Seller payouts to review",
      },
      {
        label: "Low stock",
        value: inventory.filter((item) => item.status !== "Active").length,
        href: "/admin/inventory?status=Low%20Stock",
        description: "Stock needs replenishment",
      },
      {
        label: "Support tickets",
        value: supportTickets.filter((item) => item.status !== "Resolved").length,
        href: "/admin/support",
        description: "Open operational conversations",
      },
      {
        label: "Risk alerts",
        value: riskAlerts.filter((item) => item.status !== "Dismissed").length,
        href: "/admin/risk",
        description: "Marketplace safety review",
      },
    ],
    [],
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
            Good evening, Admin
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            See what needs attention across the <span className="text-slate-800 font-medium">SeroFast marketplace</span>.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
          <CalendarDays size={14} />
          16 Aug 2026
        </div>
      </div>

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

      <section className="mt-6" aria-labelledby="attention-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="attention-heading" className="text-base font-normal text-slate-800">
            Requires attention
          </h2>
          <span className="text-xs text-slate-500 font-normal">Live frontend snapshot</span>
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

      <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-normal text-slate-800">Sales overview</h3>
            <p className="text-xs text-slate-500 font-normal">
              Gross marketplace revenue trend
            </p>
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

        <div
          className="flex h-56 items-end gap-2"
          aria-label={`Sales chart for ${range}`}
        >
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

        <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["Gross", "₹12.48L"],
            ["Net", "₹11.82L"],
            ["Orders", "428"],
            ["AOV", "₹2,916"],
            ["Refunds", "₹26,400"],
            ["Commission", "₹1.24L"],
          ].map(([label, value]) => (
            <span key={label}>
              {label} <b className="block text-slate-900">{value}</b>
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-normal text-slate-800">Order overview</h3>
        </div>
        <div className="space-y-3">
          {["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"].map(
            (status) => (
              <Link
                key={status}
                to={`/admin/orders?status=${encodeURIComponent(status)}`}
                className="flex items-center justify-between rounded-[24px] bg-[#FAF8F5] px-4 py-3 text-xs transition hover:bg-slate-50"
              >
                <StatusBadge value={status} />
                <span className="font-semibold text-slate-900">
                  {orders.filter((order) => order.status === status).length}
                </span>
              </Link>
            ),
          )}
        </div>
      </div>

      <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-normal text-slate-800">Recent orders</h3>
          <Link to="/admin/orders" className="text-xs font-normal text-brandRed hover:underline flex items-center gap-1">
            <span>View All</span>
          </Link>
        </div>
        <div className="space-y-3">
          {orders.slice(0, 4).map((order) => (
            <Link
              key={order.id}
              to={`/admin/orders/${encodeURIComponent(order.id)}`}
              className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-100 bg-[#FAF8F5] p-4 text-xs"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{order.id}</p>
                <p className="truncate text-[11px] text-slate-500 font-normal">
                  {order.customer} · {order.amount}
                </p>
              </div>
              <StatusBadge value={order.status} />
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-normal text-slate-800">Recent Admin activity</h3>
          <Link to="/admin/audit-logs" className="text-xs font-normal text-brandRed hover:underline flex items-center gap-1">
            <span>Audit logs</span>
          </Link>
        </div>
        <div className="space-y-3">
          {auditLogs.slice(0, 4).map((entry) => (
            <div key={entry.id} className="rounded-[24px] border border-slate-100 bg-[#FAF8F5] p-4">
              <p className="text-xs font-medium text-slate-900">{entry.action}</p>
              <p className="mt-1 text-[11px] text-slate-500 font-normal">
                {entry.actor} · {entry.target} · {entry.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
