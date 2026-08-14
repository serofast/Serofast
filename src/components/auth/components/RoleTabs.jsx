import { ShieldCheck, Store } from "lucide-react";

export default function RoleTabs({ role, onChange }) {
  return (
    <div className="rounded-[15px] bg-[#F5F7FA] p-1.5">
      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => onChange("admin")}
          className={`flex min-h-[48px] items-center justify-center gap-2 rounded-[11px] px-3 text-sm font-medium transition ${
            role === "admin"
              ? "bg-white text-brandRed shadow-[0_2px_8px_rgba(15,23,42,0.05)]"
              : "text-[#51627C] hover:text-textPrimary"
          }`}
          aria-pressed={role === "admin"}
        >
          <ShieldCheck size={17} />
          <span>I am an Admin</span>
        </button>

        <button
          type="button"
          onClick={() => onChange("shop-owner")}
          className={`flex min-h-[48px] items-center justify-center gap-2 rounded-[11px] px-3 text-sm font-medium transition ${
            role === "shop-owner"
              ? "bg-white text-brandRed shadow-[0_2px_8px_rgba(15,23,42,0.05)]"
              : "text-[#51627C] hover:text-textPrimary"
          }`}
          aria-pressed={role === "shop-owner"}
        >
          <Store size={17} />
          <span>I am a Shop Owner</span>
        </button>
      </div>
    </div>
  );
}
