import { useState } from "react";
import { Card, Kpi, StatGrid, DonutChart, ProgressCircle } from "../../shared/ui";
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

const categoryDonutData = [
  { label: "Fashion", value: 450, color: "#D32F2F" },
  { label: "Electronics", value: 320, color: "#0284C7" },
  { label: "Beauty", value: 210, color: "#059669" },
  { label: "Home", value: 140, color: "#D97706" },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState("30 Days");
  const [shop, setShop] = useState("");
  const [category, setCategory] = useState("");
  const maximum = Math.max(...salesSeries, 1);

  return (
    <div className="min-w-0 space-y-6 pb-6 font-sans font-sansation animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          Marketplace Analytics
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Track revenue, orders, customer retention, and shop performance.
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
        <Kpi label="Revenue" value="₹12.48L" change={`For ${range}`} tone="red" />
        <Kpi label="Orders" value="428" change="+8.2%" tone="green" />
        <Kpi label="Customers" value="18,492" change="+9.8%" tone="blue" />
        <Kpi label="AOV" value="₹2,916" change="+3.4%" tone="amber" />
        <Kpi label="Conversion" value="4.82%" change="+0.6%" tone="green" />
        <Kpi label="Refund Rate" value="1.46%" change="-0.2%" tone="amber" />
      </StatGrid>

      {/* Category Sales Circular Donut & Target Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-normal text-slate-800">Category Share</h3>
            <p className="text-[11px] text-slate-400 font-normal">Revenue distribution by category</p>
          </div>
          <div className="pt-2">
            <DonutChart data={categoryDonutData} centerText="1,120" centerSubtext="Sales Count" />
          </div>
        </div>

        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-normal text-slate-800">Retention & Growth</h3>
            <p className="text-[11px] text-slate-400 font-normal">User engagement gauges</p>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2 text-center">
            <div className="flex flex-col items-center gap-2 p-3 rounded-[24px] bg-[#FAF8F5] border border-slate-100">
              <ProgressCircle percentage={84} color="#059669" size={56} />
              <span className="text-[11px] font-medium text-slate-700">Repeat Orders</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-[24px] bg-[#FAF8F5] border border-slate-100">
              <ProgressCircle percentage={72} color="#0284C7" size={56} />
              <span className="text-[11px] font-medium text-slate-700">Shop Growth</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-[24px] bg-[#FAF8F5] border border-slate-100">
              <ProgressCircle percentage={95} color="#D32F2F" size={56} />
              <span className="text-[11px] font-medium text-slate-700">App Uptime</span>
            </div>
          </div>
        </div>
      </div>

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
        <div className="flex h-44 items-end gap-2">
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
