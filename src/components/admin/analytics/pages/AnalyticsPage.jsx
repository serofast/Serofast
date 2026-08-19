import { useState } from "react";
import { Card, Kpi, PageHeader, StatGrid } from "../../shared/ui";
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
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          Marketplace Analytics
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Track revenue, orders, customers, shops, products, conversion, and refunds.
        </p>
      </div>

      <Card className="grid gap-3 p-4 sm:grid-cols-3">
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

      <StatGrid>
        <Kpi label="Revenue" value="₹12.48L" change={`For ${range}`} />
        <Kpi label="Orders" value="428" change="+8.2%" />
        <Kpi label="Customers" value="18,492" change="+9.8%" />
        <Kpi label="AOV" value="₹2,916" change="+3.4%" />
        <Kpi label="Conversion" value="4.82%" change="+0.6%" />
        <Kpi label="Refund Rate" value="1.46%" change="-0.2%" />
      </StatGrid>

      <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-normal text-slate-800">Revenue trend</h3>
            <p className="text-[11px] text-slate-500 font-normal">
              {shop || "All shops"} · {category || "All categories"}
            </p>
          </div>
          <span className="text-xs font-medium text-brandRed">{range}</span>
        </div>
        <div className="flex h-48 items-end gap-2">
          {salesSeries.map((value, index) => (
            <div key={`${value}-${index}`} className="flex h-full flex-1 items-end">
              <div
                title={`${value} revenue index`}
                className="w-full min-w-1 rounded-t-lg bg-brandRed transition hover:bg-brandRedDark"
                style={{ height: `${(value / maximum) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MetricGroup title="Customer analytics" metrics={customerMetrics} />
        <MetricGroup title="Shop analytics" metrics={shopMetrics} />
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, emptyLabel }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
        {label}
      </span>
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

function MetricGroup({ title, metrics }) {
  return (
    <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-normal text-slate-800">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {metrics.map(([label, value]) => (
          <div key={label} className="rounded-[24px] bg-[#FAF8F5] p-4 border border-[#F3E5E5]">
            <p className="text-[11px] text-slate-500 font-normal">{label}</p>
            <p className="mt-1 text-xl font-normal text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
