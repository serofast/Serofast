import { useState } from "react";
import { ShoppingBag, Clock, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { adminGlobalOrders as initialOrders } from "../../data/adminData";

export default function AdminOrdersPage() {
  const [orders] = useState(initialOrders);

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Global Platform Order Monitor</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">Live order dispatch stream across all connected cities &amp; student hubs.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950 font-bold uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Merchant Shop</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Location Zone</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Placed At</th>
                <th className="px-5 py-3.5 text-right">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-850 transition">
                  <td className="px-5 py-4 font-mono font-bold text-brandRed">{ord.id}</td>
                  <td className="px-5 py-4 font-bold text-white">{ord.shopName}</td>
                  <td className="px-5 py-4 text-slate-300">{ord.customerName}</td>
                  <td className="px-5 py-4 text-slate-400">{ord.location}</td>
                  <td className="px-5 py-4 font-extrabold text-white">{ord.amount}</td>
                  <td className="px-5 py-4 text-slate-400">{ord.time}</td>
                  <td className="px-5 py-4 text-right">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        ord.status === "Delivered"
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                      }`}
                    >
                      {ord.status}
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
