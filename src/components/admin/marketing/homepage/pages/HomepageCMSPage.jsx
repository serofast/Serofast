import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Card,
  Modal,
  PageHeader,
  StatusBadge,
  Toast,
} from "../../../shared/ui";
import { homepageSections as seed } from "../../../shared/adminData";

export default function HomepageCMSPage() {
  const [sections, setSections] = useState(seed);
  const [editorOpen, setEditorOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [toast, setToast] = useState("");

  function move(index, direction) {
    setSections((current) => {
      const next = [...current];
      const target = index + direction;

      if (target < 0 || target >= next.length) {
        return current;
      }

      [next[index], next[target]] = [next[target], next[index]];
      return next.map((item, itemIndex) => ({ ...item, priority: itemIndex + 1 }));
    });
    setToast("Homepage section order updated.");
  }

  function toggleSection(id) {
    setSections((current) =>
      current.map((section) =>
        section.id === id
          ? { ...section, status: section.status === "Active" ? "Disabled" : "Active" }
          : section,
      ),
    );
    setToast("Homepage visibility updated.");
  }

  function addSection(event) {
    event.preventDefault();

    if (!name.trim()) {
      setNameError("Section name is required.");
      return;
    }

    setSections((current) => [
      ...current,
      {
        id: `HOME-${String(current.length + 1).padStart(2, "0")}`,
        name: name.trim(),
        priority: current.length + 1,
        status: "Disabled",
      },
    ]);
    setName("");
    setEditorOpen(false);
    setToast("Homepage section added in local Admin state.");
  }

  return (
    <div>
      <PageHeader
        title="Homepage CMS"
        description="Manage homepage sections, visibility, and ordering without editing React source."
        action="Add Section"
        onAction={() => setEditorOpen(true)}
      />

      <Card className="p-4 sm:p-5">
        <div className="space-y-3">
          {sections.map((section, index) => (
            <article
              key={section.id}
              className="flex flex-col gap-3 rounded-xl border border-lightBorder p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">
                  {section.priority}. {section.name}
                </p>
                <p className="mt-1 text-xs text-textMuted">{section.id}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge value={section.status} />
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="min-h-10 rounded-lg border border-lightBorder px-3 text-xs font-semibold"
                >
                  {section.status === "Active" ? "Disable" : "Enable"}
                </button>
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  aria-label={`Move ${section.name} up`}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-lightBorder disabled:opacity-40"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  type="button"
                  disabled={index === sections.length - 1}
                  onClick={() => move(index, 1)}
                  aria-label={`Move ${section.name} down`}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-lightBorder disabled:opacity-40"
                >
                  <ArrowDown size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </Card>

      <Modal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title="Add homepage section"
        description="New sections begin disabled until their content is ready."
      >
        <form onSubmit={addSection} noValidate>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Section name</span>
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setNameError("");
              }}
              aria-invalid={Boolean(nameError)}
              className="h-11 w-full rounded-lg border border-lightBorder px-3 text-sm outline-none focus:border-brandRed"
            />
            {nameError && (
              <span className="mt-1 block text-xs font-semibold text-brandRed">
                {nameError}
              </span>
            )}
          </label>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setEditorOpen(false)}
              className="min-h-11 rounded-lg border border-lightBorder px-4 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-11 rounded-lg bg-brandRed px-4 text-sm font-semibold text-white"
            >
              Add Section
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
