import { DollarSign, Store, GraduationCap, ShoppingBag, TrendingUp, Award, Zap, ShieldCheck } from "lucide-react";
import { adminPlatformMetrics, adminShops, adminGlobalOrders } from "../../data/adminData";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Executive Platform Overview</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">Real-time SeroFast ecosystem metrics across all cities &amp; campuses.</p>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross GMV</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white">{adminPlatformMetrics.totalGMV}</div>
          <span className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
            <TrendingUp size={12} /> 100% Merchant Direct Settlement
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Merchants</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brandRed/20 text-brandRed">
              <Store size={20} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white">{adminPlatformMetrics.totalShopsCount} Shops</div>
          <span className="mt-1 text-[11px] text-rose-400 font-bold">₹50 Lifetime Setup Model</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Promoters</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
              <GraduationCap size={20} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white">{adminPlatformMetrics.activeStudentsCount} Active</div>
          <span className="mt-1 text-[11px] text-purple-400 font-bold">Certificates &amp; Commendations</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Orders Processed</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-white">{adminPlatformMetrics.totalOrdersCount}</div>
          <span className="mt-1 text-[11px] text-blue-400 font-bold">Avg ETA: {adminPlatformMetrics.averageDeliveryMins} mins</span>
        </div>
      </div>

      {/* Onboarding Revenue Breakdown */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <ShieldCheck size={18} className="text-brandRed" /> Platform Onboarding Ledger (₹50 Model)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-slate-400 font-medium">Onboarding Pool Revenue</span>
            <div className="text-xl font-extrabold text-emerald-400 mt-1">{adminPlatformMetrics.onboardingRevenue}</div>
            <p className="text-[10px] text-slate-500 mt-1">Collected from 542 shop listings at ₹50 each.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-slate-400 font-medium">Commission Tax charged to Merchants</span>
            <div className="text-xl font-extrabold text-white mt-1">₹0.00 (0%)</div>
            <p className="text-[10px] text-slate-500 mt-1">SeroFast promise: 100% of retail price goes to seller.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <span className="text-slate-400 font-medium">Student Partner Payout Pool</span>
            <div className="text-xl font-extrabold text-purple-400 mt-1">₹1,84,500</div>
            <p className="text-[10px] text-slate-500 mt-1">Distributed directly for verified orders driven.</p>
          </div>
        </div>
      </div>

      {/* Recent Merchant Registrations */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <h3 className="text-base font-extrabold text-white">Recent Merchant Registrations</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950 font-bold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Shop Name</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 text-right">₹50 Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {adminShops.map((shop) => (
                <tr key={shop.id}>
                  <td className="px-4 py-3.5 font-bold text-white">{shop.name}</td>
                  <td className="px-4 py-3.5 text-slate-300">{shop.owner}</td>
                  <td className="px-4 py-3.5 text-slate-400">{shop.category}</td>
                  <td className="px-4 py-3.5 text-slate-400">{shop.location}</td>
                  <td className="px-4 py-3.5 text-right">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        shop.status.includes("Verified")
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                      }`}
                    >
                      {shop.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
