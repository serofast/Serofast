import { useState } from "react";
import { CheckCircle2, Building2, ShieldCheck } from "lucide-react";
import { initialSellerPayouts } from "../../data/sellerData";

export default function ShopOwnerPayoutsPage() {
  const [payouts] = useState(initialSellerPayouts);
  const [upiVpa, setUpiVpa] = useState("urbanstyles@hdfcbank");
  const [accountName, setAccountName] = useState("Urban Styles Retail LLP");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payouts &amp; Bank Settlement</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Direct instant UPI settlements for your store orders (0% commission).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Balance</span>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600">₹4,497</div>
          <span className="text-[11px] text-slate-400 font-medium">Settling in next batch</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Settled (Lifetime)</span>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">₹11,487</div>
          <span className="text-[11px] text-emerald-600 font-bold">100% Retained Profit</span>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-xs">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Platform Commission Fee</span>
          <div className="mt-2 text-3xl font-extrabold text-emerald-700">₹0 (0%)</div>
          <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
            <ShieldCheck size={13} /> ₹50 One-Time Shop Owner Setup
          </span>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Building2 size={18} className="text-brandRed" /> Bank Account &amp; UPI VPA Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700">Beneficiary Business Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-brandRed"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700">Instant UPI VPA Handle</label>
            <input
              type="text"
              value={upiVpa}
              onChange={(e) => setUpiVpa(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-brandRed font-mono"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="p-4 border-b border-slate-100 font-extrabold text-slate-900 text-sm">
          Recent Settlement History
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 font-bold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Settlement ID</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Method</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-4 font-mono font-bold text-slate-900">{p.id}</td>
                  <td className="px-5 py-4 text-slate-600">{p.date}</td>
                  <td className="px-5 py-4 font-extrabold text-slate-900">₹{p.amount}</td>
                  <td className="px-5 py-4 text-slate-600">{p.method}</td>
                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 size={12} /> {p.status}
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
