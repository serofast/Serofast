import { useState } from "react";
import { Card, Kpi, PageHeader } from "../../shared/ui";
import { salesSeries, shops } from "../../shared/adminData";

const customerMetrics = [
  ["New Customers", "1,284"],
  ["Returning", "8,420"],
  ["Active Users", "11,204"],
  ["Retention", "42.8%"],
  ["Average Order", "₹2,916"],
  ["Lifetime Value", "₹14,420"],
];

const shopMetrics = [
  ["New Shops", "42"],
  ["Active Shops", "1,284"],
  ["Shop Revenue", "₹9.42L"],
  ["Orders / Shop", "38.4"],
  ["Top Sellers", "42"],
  ["Low Performers", "18"],
];

export default function AnalyticsPage() {
  const [range, setRange] = useState("30 Days");
  const [shop, setShop] = useState("");
  const [category, setCategory] = useState("");
  const maximum = Math.max(...salesSeries, 1);

  return (
    <div>
      <PageHeader
        title="Marketplace Analytics"
        description="Track revenue, orders, customers, shops, products, conversion, and refunds."
      />

      <Card className="mb-6 grid gap-3 p-4 sm:grid-cols-3">
        <FilterSelect
          label="Date range"
          value={range}
          onChange={setRange}
          options={["Today", "7 Days", "30 Days", "3 Months", "6 Months", "1 Year"]}
        />
        <FilterSelect
          label="Shop"
          value={shop}
          onChange={setShop}
          options={["", ...shops.map((item) => item.shop)]}
          emptyLabel="All shops"
        />
        <FilterSelect
          label="Category"
          value={category}
          onChange={setCategory}
          options={["", "Fashion", "Electronics", "Beauty", "Home"]}
          emptyLabel="All categories"
        />
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <Kpi label="Revenue" value="₹12.48L" change={`For ${range}`} />
        <Kpi label="Orders" value="428" change="+8.2%" />
        <Kpi label="Customers" value="18,492" change="+9.8%" />
        <Kpi label="AOV" value="₹2,916" change="+3.4%" />
        <Kpi label="Conversion" value="4.82%" change="+0.6%" />
        <Kpi label="Refund Rate" value="1.46%" change="-0.2%" />
      </div>

      <Card className="mt-6 p-5 sm:p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Revenue trend</h2>
            <p className="text-xs text-textMuted">
              {shop || "All shops"} · {category || "All categories"}
            </p>
          </div>
          <span className="text-xs font-semibold text-brandRed">{range}</span>
        </div>
        <div className="mt-6 flex h-56 items-end gap-2">
          {salesSeries.map((value, index) => (
            <div key={`${value}-${index}`} className="flex h-full flex-1 items-end">
              <div
                title={`${value} revenue index`}
                className="w-full min-w-1 rounded-t-md bg-brandRed"
                style={{ height: `${(value / maximum) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <MetricGroup title="Customer analytics" metrics={customerMetrics} />
        <MetricGroup title="Shop analytics" metrics={shopMetrics} />
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, emptyLabel }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase text-textMuted">
        {label}
      </span>
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

function MetricGroup({ title, metrics }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-lightBackground p-4">
            <p className="text-xs text-textMuted">{label}</p>
            <p className="mt-1 text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
