import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import AuthShell from "./components/AuthShell";
import RoleTabs from "./components/RoleTabs";
import AuthForm from "./components/AuthForm";

export default function LoginPage({ mode = "login", defaultRole }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Default role to shop-owner unless explicitly specified as admin
  const initialRole =
    defaultRole || (searchParams.get("role") === "admin" ? "admin" : "shop-owner");

  const [role, setRole] = useState(initialRole);

  const isLogin = mode === "login";

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setSearchParams(
      (current) => {
        current.set("role", nextRole);
        return current;
      },
      { replace: true }
    );
  };

  const heading = useMemo(() => {
    if (isLogin) {
      return role === "admin" ? "SeroFast Platform Admin Login" : "Shop Owner Login";
    }
    return role === "admin" ? "Create Admin Account" : "Become a Shop Owner";
  }, [isLogin, role]);

  return (
    <AuthShell mode={mode}>
      <div className="mb-6 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-brandRed">
          {isLogin ? "Official Merchant Portal" : "Campus Store Registration"}
        </span>
        <h1 className="mt-1 text-2xl font-black text-textPrimary sm:text-[28px]">
          {heading}
        </h1>
        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-brandRed/30" />
      </div>

      <RoleTabs role={role} onChange={handleRoleChange} />

      <div className="mt-6">
        <AuthForm mode={mode} role={role} />
      </div>

      {/* Discrete Admin Footer Link when in Shop Owner mode */}
      {role === "shop-owner" && (
        <div className="mt-8 border-t border-slate-100 pt-4 text-center">
          <Link
            to="/login?role=admin"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-700 hover:underline"
          >
            <ShieldCheck size={13} />
            Platform Admin Portal Access
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
