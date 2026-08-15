import { useMemo, useState } from "react";
import { PageHeader, FilterBar, Drawer } from "../ui";
import ResourceTable from "./ResourceTable";
import { useResourceList } from "./useResourceList";

export default function ResourcePage({
  title,
  description,
  seed = [],
  columns = [],
  createLabel,
}) {
  const [selected, setSelected] = useState(null);
  const {
    filteredRows,
    search,
    setSearch,
    status,
    setStatus,
    statuses,
    updateRow,
  } = useResourceList(seed);

  function handleToggle(row) {
    const nextStatus = row.status === "Active" ? "Suspended" : "Active";
    updateRow(row.id, { status: nextStatus });
  }

  return (
    <div>
      <PageHeader
        title={title}
        desc={description}
        action={createLabel}
        onAction={() => setSelected({ mode: "create" })}
      />

      <FilterBar
        value={search}
        setValue={setSearch}
        status={status}
        setStatus={setStatus}
        options={statuses}
        onClear={() => {
          setSearch("");
          setStatus("");
        }}
      />

      <ResourceTable
        columns={columns}
        rows={filteredRows}
        onView={setSelected}
        onToggle={handleToggle}
      />

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.mode === "create" ? `Create ${title.slice(0, -1)}` : `Manage ${title.slice(0, -1)}`}
      >
        {selected?.mode === "create" ? (
          <ResourceCreateForm title={title} />
        ) : (
          <ResourceDetails record={selected} />
        )}
      </Drawer>
    </div>
  );
}

function ResourceCreateForm({ title }) {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-textSecondary">
        This form is the Phase 4 frontend boundary. Connect its submit action
        to the domain service when the backend is implemented.
      </p>

      {['Name', 'Category', 'Status'].map((field) => (
        <label key={field} className="block">
          <span className="mb-1.5 block text-sm font-semibold">{field}</span>
          <input
            className="h-11 w-full rounded-lg border border-lightBorder px-3 text-sm outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
            placeholder={`Enter ${field.toLowerCase()}`}
          />
        </label>
      ))}

      <button className="min-h-11 w-full rounded-lg bg-brandRed text-sm font-semibold text-white">
        Save {title.slice(0, -1)}
      </button>
    </div>
  );
}

function ResourceDetails({ record }) {
  return (
    <div className="space-y-4">
      {Object.entries(record || {})
        .filter(([key]) => key !== "mode")
        .map(([key, value]) => (
          <div key={key} className="flex items-start justify-between gap-5 border-b border-lightBorder pb-3 text-sm">
            <span className="capitalize text-textMuted">{key.replace(/([A-Z])/g, " $1")}</span>
            <span className="max-w-[58%] text-right font-semibold">{String(value)}</span>
          </div>
        ))}
    </div>
  );
}
