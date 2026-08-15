import { useState } from "react";
import { CheckCircle2, Building2, ShieldCheck } from "lucide-react";
import { initialSellerPayouts } from "../../data/sellerData";

export default function ShopOwnerPayoutsPage() {
  const [payouts] = useState(initialSellerPayouts);
  const [upiVpa, setUpiVpa] = useState("urbanstyles@hdfcbank");
  const [accountName, setAccountName] = useState("Urban Styles Retail LLP");

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in font-sans">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Payouts &amp; Bank Settlement</h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">Instant UPI settlements for your store orders (0% commission).</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Available Balance</span>
          <div className="mt-1.5 text-xl font-bold text-emerald-600">₹4,497</div>
          <span className="text-[11px] text-slate-400 font-normal">Next batch settlement</span>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Lifetime Settled</span>
          <div className="mt-1.5 text-xl font-bold text-slate-900">₹11,487</div>
          <span className="text-[11px] text-emerald-600 font-medium">100% Retained</span>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-2xs">
          <span className="text-[11px] font-medium text-emerald-800 uppercase tracking-wider">Commission Fee</span>
          <div className="mt-1.5 text-xl font-bold text-emerald-700">0%</div>
          <span className="text-[11px] text-emerald-800 font-normal flex items-center gap-1">
            <ShieldCheck size={12} /> ₹50 Setup
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Building2 size={16} className="text-brandRed" /> UPI Settlement Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-medium text-slate-700">Business Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-slate-400 font-medium"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700">Instant UPI VPA Handle</label>
            <input
              type="text"
              value={upiVpa}
              onChange={(e) => setUpiVpa(e.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-slate-400 font-mono font-medium"
            />
          </div>
        </div>
      </div>

      {/* Mobile Card Stack (< sm) */}
      <div className="space-y-3 sm:hidden">
        <div className="font-bold text-slate-900 text-xs px-1">Settlement History</div>
        {payouts.map((p) => (
          <div key={p.id} className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-mono text-slate-900 font-bold">{p.id}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                <CheckCircle2 size={11} /> {p.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>{p.date}</span>
              <span className="font-bold text-slate-900 text-sm">₹{p.amount}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table (>= sm) */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs">
        <div className="p-3.5 border-b border-slate-100 font-bold text-slate-900 text-xs">
          Settlement History
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Settlement ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-mono text-slate-900">{p.id}</td>
                  <td className="px-4 py-3 text-slate-600">{p.date}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">₹{p.amount}</td>
                  <td className="px-4 py-3 text-slate-600">{p.method}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                      <CheckCircle2 size={11} /> {p.status}
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
