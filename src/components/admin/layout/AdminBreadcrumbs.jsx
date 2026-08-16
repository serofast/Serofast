import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

const labels = {
  admin: "Dashboard",
  "admin-users": "Admin Users",
  "audit-logs": "Audit Logs",
  finance: "Finance",
  marketing: "Marketing",
};

function formatSegment(segment) {
  if (labels[segment]) {
    return labels[segment];
  }

  return decodeURIComponent(segment)
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function AdminBreadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="mb-4 overflow-x-auto">
      <ol className="flex min-w-max items-center gap-2 text-xs text-textMuted">
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isCurrent = index === segments.length - 1;

          return (
            <Fragment key={href}>
              {index > 0 && <li aria-hidden="true">/</li>}
              <li>
                {isCurrent ? (
                  <span aria-current="page" className="font-semibold text-textSecondary">
                    {formatSegment(segment)}
                  </span>
                ) : (
                  <Link to={href} className="hover:text-brandRed">
                    {formatSegment(segment)}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
