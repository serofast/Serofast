import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";

export default function CreatableDropdown({
  value = "",
  onChange = () => {},
  options = [],
  placeholder = "Select or type new...",
  multiple = false,
  allowCustom = true,
  className = "",
  buttonClassName = "h-11",
  disabled = false,
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [placement, setPlacement] = useState("bottom");
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listboxId = useId();

  // Normalize options to string list
  const normalizedOptions = options.map((opt) =>
    typeof opt === "object" && opt !== null ? opt.label || opt.value : String(opt)
  );

  // Selected values array
  const selectedValues = multiple
    ? Array.isArray(value)
      ? value
      : value ? [value] : []
    : value ? [String(value)] : [];

  // Filtered options based on search query
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase().trim())
  );

  const searchTrimmed = search.trim();
  const isExactMatch = normalizedOptions.some(
    (opt) => opt.toLowerCase() === searchTrimmed.toLowerCase()
  );
  const showCreateOption =
    allowCustom && searchTrimmed.length > 0 && !isExactMatch && !selectedValues.includes(searchTrimmed);

  useEffect(() => {
    if (!open) {
      setSearch("");
      return undefined;
    }

    // Auto-calculate placement based on viewport position
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 280 && rect.top > 280) {
        setPlacement("top");
      } else {
        setPlacement("bottom");
      }
    }

    function handlePointerDown(e) {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleSelect(item) {
    if (multiple) {
      const exists = selectedValues.includes(item);
      const next = exists
        ? selectedValues.filter((v) => v !== item)
        : [...selectedValues, item];
      onChange(next);
    } else {
      onChange(item);
      setOpen(false);
      setSearch("");
    }
  }

  function handleRemove(item, e) {
    e.stopPropagation();
    if (multiple) {
      onChange(selectedValues.filter((v) => v !== item));
    } else {
      onChange("");
    }
  }

  function handleCreateNew() {
    if (!searchTrimmed) return;
    if (multiple) {
      const itemsToAdd = searchTrimmed
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0 && !selectedValues.includes(item));

      if (itemsToAdd.length > 0) {
        onChange([...selectedValues, ...itemsToAdd]);
      }
    } else {
      onChange(searchTrimmed);
      setOpen(false);
    }
    setSearch("");
  }

  return (
    <div
      ref={containerRef}
      className={`relative min-w-0 ${open ? "z-[60]" : "z-[1]"} ${className}`}
    >
      {/* Dropdown Trigger Button */}
      <div
        onClick={() => {
          if (!disabled) {
            setOpen((prev) => !prev);
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-[30px] border bg-white px-3.5 text-left text-xs transition-all ${
          open
            ? "border-brandRed ring-2 ring-brandRed/10 shadow-xs"
            : "border-[#E5E7EB] hover:border-slate-300"
        } ${disabled ? "cursor-not-allowed bg-slate-50 opacity-60" : ""} ${buttonClassName}`}
        role="combobox"
        aria-label={ariaLabel}
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 py-1">
          {selectedValues.length === 0 ? (
            <span className="truncate text-slate-400 font-normal">{placeholder}</span>
          ) : multiple ? (
            selectedValues.map((val) => (
              <span
                key={val}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-800"
              >
                <span className="truncate max-w-[140px]">{val}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemove(val, e)}
                  className="rounded-full text-slate-400 hover:text-brandRed cursor-pointer"
                >
                  <X size={11} />
                </button>
              </span>
            ))
          ) : (
            <span className="truncate font-medium text-slate-800">{selectedValues[0]}</span>
          )}
        </div>

        <ChevronDown
          size={15}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180 text-brandRed" : ""
          }`}
        />
      </div>

      {/* Floating Overlay Menu */}
      {open && (
        <div
          id={listboxId}
          role="listbox"
          className={`absolute left-0 right-0 z-[120] max-h-72 overflow-hidden rounded-[22px] border border-[#F3E5E5] bg-white p-2 shadow-[0_16px_36px_rgba(0,0,0,0.18),0_4px_16px_rgba(211,47,47,0.08)] ${
            placement === "top" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]"
          }`}
        >
          {/* Search / Type Input */}
          <div className="relative mb-2 px-1">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (showCreateOption) {
                    handleCreateNew();
                  } else if (filteredOptions.length > 0) {
                    handleSelect(filteredOptions[0]);
                  }
                }
              }}
              placeholder="Search or type custom value..."
              className="h-9 w-full rounded-[16px] border border-[#E5E7EB] bg-slate-50 pl-8 pr-3 text-xs text-slate-800 outline-none transition-colors focus:border-brandRed focus:bg-white"
            />
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto space-y-0.5 px-0.5 scrollbar-thin">
            {showCreateOption && (
              <button
                type="button"
                onClick={handleCreateNew}
                className="flex min-h-9 w-full items-center gap-2 rounded-[14px] bg-rose-50/90 px-3 py-1.5 text-left text-xs font-semibold text-brandRed transition hover:bg-rose-100 cursor-pointer"
              >
                <Plus size={13} strokeWidth={2.5} />
                <span className="truncate">Add &quot;{searchTrimmed}&quot;</span>
              </button>
            )}

            {filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                  className={`flex min-h-9 w-full items-center justify-between gap-2 rounded-[14px] px-3 py-1.5 text-left text-xs transition cursor-pointer ${
                    isSelected
                      ? "bg-rose-50 font-semibold text-brandRed"
                      : "text-slate-700 hover:bg-[#FAF8F5] hover:text-slate-900"
                  }`}
                >
                  <span className="truncate">{option}</span>
                  {isSelected && <Check size={13} className="shrink-0 text-brandRed" strokeWidth={2.5} />}
                </button>
              );
            })}

            {filteredOptions.length === 0 && !showCreateOption && (
              <div className="p-3 text-center text-xs text-slate-400">
                No matching options. Type to add custom value.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
