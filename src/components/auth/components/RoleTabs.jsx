import { ShieldCheck, Store } from "lucide-react";
import { Link } from "react-router-dom";

export default function RoleTabs({ role, onChange }) {
  if (role === "admin") {
    return (
      <div className="rounded-[15px] bg-slate-900 p-2 text-white shadow-md">
        <div className="flex items-center justify-between px-3 py-1">
          <div className="flex items-center gap-2 font-bold text-xs">
            <ShieldCheck size={18} className="text-amber-400" />
            <span>Platform Administration Portal</span>
          </div>
          <Link
            to="/login"
            className="text-[11px] font-semibold text-rose-300 hover:text-white hover:underline"
          >
            Switch to Shop Owner
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[15px] bg-rose-50/80 border border-rose-100 p-2.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-brandRed font-extrabold text-sm">
          <Store size={19} className="animate-bounce" />
          <span>Shop Owner Portal</span>
        </div>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-700 shadow-xs border border-rose-100">
          Official Merchant Access
        </span>
      </div>
    </div>
  );
}
