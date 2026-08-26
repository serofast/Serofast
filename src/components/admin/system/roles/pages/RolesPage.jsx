import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "../../../shared/ui";
import { roles as fallbackRoles } from "../../../shared/adminData";
import {
  fetchAdminRolesList,
  updateAdminRolePermissions,
  subscribeAdminRealtime,
} from "../../../../../services/adminSupabaseService";

const permissionGroups = {
  Shops: ["shops.view", "shops.approve", "shops.suspend"],
  Products: ["products.view", "products.edit", "products.approve"],
  Orders: ["orders.view", "orders.cancel", "orders.refund"],
  Payments: ["payments.view", "payments.approve"],
  Platform: ["marketing.manage", "users.manage"],
};

function normalizePermissions(role) {
  const text = (role.permissions || []).join(" ").toLowerCase();
  return Object.values(permissionGroups)
    .flat()
    .filter((permission) => {
      const domain = permission.split(".")[0];
      return role.name === "Super Admin" || text.includes(domain);
    });
}

export default function RolesPage() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [roleList, setRoleList] = useState(fallbackRoles);
  const initialRole = roleList.find((role) => role.id === roleId) ?? roleList[0];
  const [selectedId, setSelectedId] = useState(initialRole.id);
  const [rolePermissions, setRolePermissions] = useState(() =>
    Object.fromEntries(roleList.map((role) => [role.id, normalizePermissions(role)]))
  );
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadRoles() {
      const data = await fetchAdminRolesList();
      if (data && data.length > 0) {
        setRoleList(data);
        setRolePermissions(
          Object.fromEntries(data.map((r) => [r.id, r.permissions || []]))
        );
        if (!selectedId || !data.some((r) => r.id === selectedId)) {
          setSelectedId(data[0].id);
        }
      }
    }
    loadRoles();
    const unsub = subscribeAdminRealtime("roles", () => loadRoles());
    return () => unsub();
  }, []);

  const selectedRole = useMemo(
    () => roleList.find((role) => role.id === selectedId) ?? roleList[0],
    [selectedId, roleList]
  );

  useEffect(() => {
    const routedRole = roleList.find((role) => role.id === roleId);
    if (routedRole) setSelectedId(routedRole.id);
  }, [roleId, roleList]);

  async function togglePermission(permission) {
    const permissions = rolePermissions[selectedId] ?? [];
    const nextPermissions = permissions.includes(permission)
      ? permissions.filter((item) => item !== permission)
      : [...permissions, permission];

    setRolePermissions((current) => ({
      ...current,
      [selectedId]: nextPermissions,
    }));

    await updateAdminRolePermissions(selectedId, nextPermissions);
    setToast("Role permissions updated in Supabase.");
  }

  return (
    <div className="min-w-0 space-y-6 pb-6 font-sans font-sansation animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          Roles & Permissions
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Role definitions, access control, and granular platform permission matrix in Supabase.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
          <p className="px-3 py-2 text-[11px] font-semibold text-slate-400">ROLES</p>
          <div className="space-y-1">
            {roleList.map((role) => {
              const active = role.id === selectedId;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(role.id);
                    navigate(`/admin/roles/${role.id}`);
                  }}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${
                    active
                      ? "bg-rose-50 font-semibold text-brandRed"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <p className="text-xs font-semibold">{role.name}</p>
                  <p className="mt-0.5 truncate text-[10px] text-slate-400">
                    {role.description || "System Role"}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">{selectedRole.name}</h2>
            <p className="mt-1 text-xs text-slate-500">{selectedRole.description}</p>
          </div>

          <div className="mt-6 space-y-6">
            {Object.entries(permissionGroups).map(([groupName, permissions]) => (
              <div key={groupName} className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {groupName}
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {permissions.map((permission) => {
                    const active = (rolePermissions[selectedId] ?? []).includes(permission);
                    return (
                      <label
                        key={permission}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-xs cursor-pointer transition-colors ${
                          active
                            ? "border-rose-200 bg-rose-50/50 text-slate-900"
                            : "border-slate-100 text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => togglePermission(permission)}
                          className="rounded text-brandRed focus:ring-brandRed"
                        />
                        <span className="font-mono text-[11px]">{permission}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
