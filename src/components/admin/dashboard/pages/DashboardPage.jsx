import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, Kpi, PageHeader, StatusBadge } from "../../shared/ui";
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
        href: "/admin/returns",
      },
      {
        label: "Pending refunds",
        value: refunds.filter((item) => item.status === "Pending").length,
        href: "/admin/finance/refunds",
      },
      {
        label: "Pending withdrawals",
        value: withdrawals.filter((item) => item.status === "Pending").length,
        href: "/admin/finance/withdrawals",
      },
      {
        label: "Low stock",
        value: inventory.filter((item) => item.status !== "Active").length,
        href: "/admin/inventory",
      },
      {
        label: "Support tickets",
        value: supportTickets.filter((item) => item.status !== "Resolved").length,
        href: "/admin/support",
      },
      {
        label: "Risk alerts",
        value: riskAlerts.filter((item) => item.status !== "Dismissed").length,
        href: "/admin/risk",
      },
    ],
    [],
  );

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Good evening, Admin"
          description="See what needs attention across the SeroFast marketplace."
        />
        <div className="inline-flex items-center gap-2 text-xs text-textMuted">
          <CalendarDays size={15} />
          16 Aug 2026
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {dashboardStats.map((item) => (
          <Link
            key={item.label}
            to={statRoutes[item.label] ?? "/admin/analytics"}
            className="rounded-2xl focus:outline-none focus:ring-2 focus:ring-brandRed/30"
          >
            <Kpi {...item} />
          </Link>
        ))}
      </div>

      <section className="mt-6" aria-labelledby="attention-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="attention-heading" className="text-lg font-bold">
            Requires attention
          </h2>
          <span className="text-xs text-textMuted">Live frontend snapshot</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {attentionStats.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="rounded-xl border border-lightBorder bg-white p-4 shadow-bento transition hover:border-brandRed hover:shadow-hover"
            >
              <p className="text-xs text-textMuted">{item.label}</p>
              <p className="mt-2 text-2xl font-bold">{item.value}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,.7fr)]">
        <Card className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Sales overview</h2>
              <p className="text-xs text-textMuted">
                Gross marketplace revenue trend
              </p>
            </div>
            <select
              aria-label="Sales date range"
              value={range}
              onChange={(event) => setRange(event.target.value)}
              className="h-10 rounded-lg border border-lightBorder bg-white px-3 text-sm outline-none focus:border-brandRed"
            >
              {ranges.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div
            className="mt-6 flex h-64 items-end gap-2"
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
                <span className="pt-2 text-center text-[10px] text-textMuted">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-textSecondary sm:grid-cols-3 lg:grid-cols-6">
            {[
              ["Gross", "₹12.48L"],
              ["Net", "₹11.82L"],
              ["Orders", "428"],
              ["AOV", "₹2,916"],
              ["Refunds", "₹26,400"],
              ["Commission", "₹1.24L"],
            ].map(([label, value]) => (
              <span key={label}>
                {label} <b className="block text-textPrimary">{value}</b>
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold">Order overview</h2>
          <div className="mt-5 space-y-4">
            {["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"].map(
              (status) => (
                <Link
                  key={status}
                  to={`/admin/orders?status=${encodeURIComponent(status)}`}
                  className="flex min-h-10 items-center justify-between rounded-lg px-2 hover:bg-lightBackground"
                >
                  <StatusBadge value={status} />
                  <span className="font-semibold">
                    {orders.filter((order) => order.status === status).length}
                  </span>
                </Link>
              ),
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <Link to="/admin/orders" className="text-sm font-semibold text-brandRed">
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-lightBorder">
            {orders.slice(0, 4).map((order) => (
              <Link
                key={order.id}
                to={`/admin/orders/${encodeURIComponent(order.id)}`}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{order.id}</p>
                  <p className="truncate text-xs text-textMuted">
                    {order.customer} · {order.amount}
                  </p>
                </div>
                <StatusBadge value={order.status} />
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Admin activity</h2>
            <Link to="/admin/audit-logs" className="text-sm font-semibold text-brandRed">
              Audit logs
            </Link>
          </div>
          <div className="mt-4 divide-y divide-lightBorder">
            {auditLogs.slice(0, 4).map((entry) => (
              <div key={entry.id} className="py-3">
                <p className="text-sm font-semibold">{entry.action}</p>
                <p className="mt-1 text-xs text-textMuted">
                  {entry.actor} · {entry.target} · {entry.time}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
