import { useState } from "react";
import { Store, Search, CheckCircle2, ShieldCheck, XCircle, ExternalLink } from "lucide-react";
import { adminShops as initialShops } from "../../data/adminData";

export default function AdminShopsPage() {
  const [shops, setShops] = useState(initialShops);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleVerification = (id) => {
    setShops((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status.includes("Verified")
                ? "Pending Payment Verification"
                : "Verified (₹50 Paid)",
            }
          : s
      )
    );
  };

  const filteredShops = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Merchant Shops Directory</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">Review onboarding local stores, ₹50 setup payments &amp; verification status.</p>
      </div>

      {/* Search Input */}
      <div className="flex items-center rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2.5">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search merchant by shop name, owner name or location..."
          className="w-full border-0 bg-transparent px-3 text-xs text-white outline-none placeholder:text-slate-500"
        />
      </div>

      {/* Merchant Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950 font-bold uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Store Details</th>
                <th className="px-5 py-3.5">Owner Contact</th>
                <th className="px-5 py-3.5">Category &amp; Region</th>
                <th className="px-5 py-3.5">Registered Date</th>
                <th className="px-5 py-3.5">₹50 Onboarding Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {filteredShops.map((shop) => (
                <tr key={shop.id} className="hover:bg-slate-850 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brandRed/20 text-brandRed font-bold text-sm">
                        <Store size={18} />
                      </div>
                      <div>
                        <span className="font-bold text-white block text-sm">{shop.name}</span>
                        <span className="text-[11px] text-slate-400">ID: {shop.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-slate-200 font-semibold">{shop.owner}</div>
                    <div className="text-[11px] text-slate-400">{shop.phone}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-slate-300 font-semibold">{shop.category}</div>
                    <div className="text-[11px] text-slate-400">{shop.location}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-400">{shop.registeredAt}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        shop.status.includes("Verified")
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                      }`}
                    >
                      {shop.status.includes("Verified") ? <ShieldCheck size={13} /> : <XCircle size={13} />}
                      <span>{shop.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleVerification(shop.id)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                        shop.status.includes("Verified")
                          ? "bg-slate-800 text-slate-300 hover:bg-rose-900/30 hover:text-rose-400"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {shop.status.includes("Verified") ? "Suspend Listing" : "Approve ₹50 Payment"}
                    </button>
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
