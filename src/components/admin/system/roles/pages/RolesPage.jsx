import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, PageHeader, Toast } from "../../../shared/ui";
import { roles } from "../../../shared/adminData";

const permissionGroups = {
  Shops: ["shops.view", "shops.approve", "shops.suspend"],
  Products: ["products.view", "products.edit", "products.approve"],
  Orders: ["orders.view", "orders.cancel", "orders.refund"],
  Payments: ["payments.view", "payments.approve"],
  Platform: ["marketing.manage", "users.manage"],
};

function normalizePermissions(role) {
  const text = role.permissions.join(" ").toLowerCase();
  return Object.values(permissionGroups)
    .flat()
    .filter((permission) => {
      const domain = permission.split(".")[0];
      return role.name === "Super Admin" || text.includes(domain);
    });
}

export default function RolesPage() {
  const { roleId } = useParams();
  const initialRole = roles.find((role) => role.id === roleId) ?? roles[0];
  const [selectedId, setSelectedId] = useState(initialRole.id);
  const [rolePermissions, setRolePermissions] = useState(() =>
    Object.fromEntries(roles.map((role) => [role.id, normalizePermissions(role)])),
  );
  const [toast, setToast] = useState("");
  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedId) ?? roles[0],
    [selectedId],
  );

  function togglePermission(permission) {
    setRolePermissions((current) => {
      const permissions = current[selectedId] ?? [];
      const nextPermissions = permissions.includes(permission)
        ? permissions.filter((item) => item !== permission)
        : [...permissions, permission];

      return { ...current, [selectedId]: nextPermissions };
    });
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          Roles & Permissions
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Configure readable RBAC permissions for internal Admin roles. Backend authorization remains mandatory.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-3 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]">
          <div className="flex gap-2 overflow-x-auto scrollbar-none lg:block lg:space-y-1">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedId(role.id)}
                className={`min-w-max rounded-[30px] px-4 py-2.5 text-left text-xs font-medium lg:w-full transition-all cursor-pointer ${
                  selectedId === role.id
                    ? "bg-brandRed text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)]"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {role.name}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-5 sm:p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-normal text-brandRed tracking-tight">{selectedRole.name}</h2>
              <p className="mt-0.5 text-[11px] text-slate-500 font-normal">
                Permission matrix for this internal role.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setToast(`${selectedRole.name} permissions saved locally.`)}
              className="flex h-10 items-center justify-center gap-1.5 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer"
            >
              Save Changes
            </button>
          </div>

          <div className="mt-5 space-y-6">
            {Object.entries(permissionGroups).map(([group, permissions]) => (
              <fieldset key={group}>
                <legend className="mb-3 text-xs font-medium text-slate-800">{group}</legend>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {permissions.map((permission) => (
                    <label
                      key={permission}
                      className="flex min-h-12 items-center gap-3 rounded-[20px] border border-[#F3E5E5] bg-[#FAF8F5] p-3 text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={rolePermissions[selectedId]?.includes(permission) ?? false}
                        onChange={() => togglePermission(permission)}
                        className="h-4 w-4 shrink-0 accent-brandRed"
                      />
                      <span className="break-all font-mono text-[11px] text-slate-600">{permission}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
