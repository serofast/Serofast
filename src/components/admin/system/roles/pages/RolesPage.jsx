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
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Configure readable RBAC permissions for internal Admin roles. Backend authorization remains mandatory."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="min-w-0 overflow-hidden p-3">
          <div className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedId(role.id)}
                className={`min-h-11 min-w-max rounded-lg px-3 py-3 text-left text-sm font-semibold lg:w-full ${
                  selectedId === role.id
                    ? "bg-promoHighlight text-brandRed"
                    : "text-textSecondary hover:bg-lightBackground"
                }`}
              >
                {role.name}
              </button>
            ))}
          </div>
        </Card>

        <Card className="min-w-0 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">{selectedRole.name}</h2>
              <p className="mt-1 text-sm text-textSecondary">
                Permission matrix for this internal role.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setToast(`${selectedRole.name} permissions saved locally.`)}
              className="min-h-11 rounded-lg bg-brandRed px-4 text-sm font-semibold text-white hover:bg-brandRedDark"
            >
              Save Changes
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {Object.entries(permissionGroups).map(([group, permissions]) => (
              <fieldset key={group}>
                <legend className="mb-3 text-sm font-bold">{group}</legend>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {permissions.map((permission) => (
                    <label
                      key={permission}
                      className="flex min-h-12 items-center gap-3 rounded-xl border border-lightBorder p-3 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={rolePermissions[selectedId]?.includes(permission) ?? false}
                        onChange={() => togglePermission(permission)}
                        className="h-4 w-4 shrink-0 accent-brandRed"
                      />
                      <span className="break-all font-mono text-xs">{permission}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </Card>
      </div>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
