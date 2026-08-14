import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthShell from "./components/AuthShell";
import RoleTabs from "./components/RoleTabs";
import AuthForm from "./components/AuthForm";

export default function AuthPage({ mode = "login" }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialRole =
    searchParams.get("role") === "shop-owner" ? "shop-owner" : "admin";

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
      return role === "admin" ? "SeroFast Admin" : "SeroFast Shop Owner";
    }
    return role === "admin" ? "Create Admin Account" : "Create Your Shop";
  }, [isLogin, role]);

  return (
    <AuthShell mode={mode}>
      <div className="mb-7 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9AA8BB]">
          {isLogin ? "Welcome Back" : "Get Started"}
        </span>
        <h1 className="mt-2 text-2xl font-bold text-textPrimary sm:text-[28px]">
          {heading}
        </h1>
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-[#EACBCA]" />
      </div>

      <RoleTabs role={role} onChange={handleRoleChange} />

      <div className="mt-7">
        <AuthForm mode={mode} role={role} />
      </div>
    </AuthShell>
  );
}
