import { useEffect, useId, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import Icon from "./legacyIcon";

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700",
  Enabled: "bg-emerald-50 text-emerald-700",
  Verified: "bg-emerald-50 text-emerald-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Published: "bg-emerald-50 text-emerald-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Paid: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Processing: "bg-blue-50 text-blue-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Investigating: "bg-blue-50 text-blue-700",
  Shipped: "bg-sky-50 text-sky-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Returned: "bg-orange-50 text-orange-700",
  Rejected: "bg-rose-50 text-rose-700",
  Blocked: "bg-rose-50 text-rose-700",
  Suspended: "bg-rose-50 text-rose-700",
  "Out of Stock": "bg-rose-50 text-rose-700",
  "Low Stock": "bg-orange-50 text-orange-700",
  Reported: "bg-rose-50 text-rose-700",
  Requested: "bg-amber-50 text-amber-700",
  Draft: "bg-slate-100 text-slate-700",
  Scheduled: "bg-violet-50 text-violet-700",
  Running: "bg-blue-50 text-blue-700",
  Open: "bg-amber-50 text-amber-700",
  Escalated: "bg-rose-50 text-rose-700",
  Resolved: "bg-emerald-50 text-emerald-700",
  Closed: "bg-slate-100 text-slate-700",
  Hidden: "bg-slate-100 text-slate-700",
  Disabled: "bg-slate-100 text-slate-700",
  Dismissed: "bg-slate-100 text-slate-700",
  Inactive: "bg-slate-100 text-slate-700",
  Flagged: "bg-rose-50 text-rose-700",
  Critical: "bg-rose-50 text-rose-700",
  High: "bg-orange-50 text-orange-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-blue-50 text-blue-700",
  "Changes Requested": "bg-amber-50 text-amber-700",
};

const kpiTones = {
  red: "bg-[#FFF1F2] text-brandRed",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  purple: "bg-violet-50 text-violet-700",
  rose: "bg-rose-50 text-rose-700",
};

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-[28px] border border-[#F3E5E5] bg-white shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] ${className}`}
    >
      {children}
    </div>
  );
}

export function Header({
  title,
  desc,
  description,
  action,
  actionLabel,
  onAction,
}) {
  const supportingText = desc ?? description;
  const actionText = action ?? actionLabel;

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          {title}
        </h1>
        {supportingText && (
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            {supportingText}
          </p>
        )}
      </div>

      {actionText && (
        <button
          type="button"
          onClick={onAction}
          className="flex h-10 items-center justify-center gap-1.5 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer"
        >
          <Icon name="plus" size={15} />
          {actionText}
        </button>
      )}
    </div>
  );
}

export const PageHeader = Header;

export function Badge({ value }) {
  const className = statusStyles[value] ?? "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-normal ${className}`}
    >
      {value ?? "Unknown"}
    </span>
  );
}

export const StatusBadge = Badge;

function normalizeSelectOption(option) {
  if (typeof option === "object" && option !== null) {
    return {
      value: option.value,
      label: option.label ?? String(option.value),
    };
  }

  return { value: option, label: String(option) };
}

export function AdminSelect({
  value = "",
  onChange = () => {},
  options = [],
  placeholder = "Select an option",
  ariaLabel,
  className = "",
  buttonClassName = "h-11",
  menuPlacement = "bottom",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const listboxId = useId();
  const normalizedOptions = options.map(normalizeSelectOption);
  const selectedOption = normalizedOptions.find(
    (option) => String(option.value) === String(value),
  );

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-3 rounded-[30px] border bg-white px-4 text-left text-xs outline-none transition-all disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
          open
            ? "border-brandRed shadow-[-3px_4px_10px_rgba(211,47,47,0.16)]"
            : "border-[#E5E7EB] hover:border-red-200"
        } ${buttonClassName}`}
        role="combobox"
        aria-label={ariaLabel}
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={`truncate ${selectedOption ? "text-slate-700" : "text-[#8FA0B8]"}`}>
          {selectedOption?.label ?? placeholder}
        </span>
        <Icon
          name="chevron"
          size={16}
          className={`shrink-0 text-slate-500 transition-transform duration-200 ${open ? "rotate-180 text-brandRed" : ""}`}
        />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          className={`absolute left-0 right-0 z-[100] max-h-60 overflow-y-auto rounded-[22px] border border-[#F3E5E5] bg-white p-2 shadow-[-4px_8px_20px_rgba(31,41,55,0.12),-5px_9px_18px_rgba(211,47,47,0.10)] ${
            menuPlacement === "top" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
          }`}
        >
          {normalizedOptions.map((option) => {
            const selected = String(option.value) === String(value);
            return (
              <button
                key={String(option.value)}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left text-xs transition ${
                  selected
                    ? "bg-rose-50 font-semibold text-brandRed"
                    : "text-slate-600 hover:bg-[#FAF8F5] hover:text-slate-900"
                }`}
              >
                <span className="truncate">{option.label}</span>
                {selected && <Icon name="check" size={15} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const padDatePart = (value) => String(value).padStart(2, "0");

function parseDateValue(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return null;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toDateValue(date) {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
}

function dateLabel(value, placeholder) {
  const date = parseDateValue(value);
  if (!date) return placeholder;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function AdminDatePicker({
  value = "",
  onChange = () => {},
  placeholder = "Select date",
  ariaLabel = "Select date",
  min,
  max,
  disabled = false,
  className = "",
  buttonClassName = "h-11",
}) {
  const selectedDate = parseDateValue(value);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    () => selectedDate ?? new Date(),
  );
  const rootRef = useRef(null);
  const dialogId = useId();

  useEffect(() => {
    if (!open) return undefined;
    setVisibleMonth(selectedDate ?? new Date());

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, value]);

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstGridDate = new Date(year, month, 1 - new Date(year, month, 1).getDay());
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstGridDate);
    date.setDate(firstGridDate.getDate() + index);
    return date;
  });
  const todayValue = toDateValue(new Date());

  function isDisabled(date) {
    const dateValue = toDateValue(date);
    return (min && dateValue < min) || (max && dateValue > max);
  }

  function chooseDate(date) {
    if (isDisabled(date)) return;
    onChange(toDateValue(date));
    setOpen(false);
  }

  function moveMonth(offset) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={dialogId}
        className={`flex w-full items-center justify-between gap-3 rounded-[30px] border bg-white px-4 text-left text-xs outline-none transition-all disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
          open
            ? "border-brandRed shadow-[-3px_4px_10px_rgba(211,47,47,0.16)]"
            : "border-[#E5E7EB] hover:border-red-200"
        } ${buttonClassName}`}
      >
        <span className={value ? "truncate text-slate-700" : "truncate text-[#8FA0B8]"}>
          {dateLabel(value, placeholder)}
        </span>
        <CalendarDays size={16} className={`shrink-0 ${open ? "text-brandRed" : "text-slate-500"}`} />
      </button>

      {open && (
        <div
          id={dialogId}
          role="dialog"
          aria-label={ariaLabel}
          className="absolute right-0 top-[calc(100%+8px)] z-[120] w-[min(276px,calc(100vw-32px))] rounded-[24px] border border-[#F3E5E5] bg-white p-3 shadow-[-5px_10px_24px_rgba(31,41,55,0.14),-6px_12px_22px_rgba(211,47,47,0.14)]"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <p className="text-xs font-semibold text-slate-800">
              {new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(visibleMonth)}
            </p>
            <div className="flex gap-1">
              <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month" className="grid h-8 w-8 place-items-center rounded-full border border-[#E5E7EB] text-slate-500 transition hover:border-brandRed/30 hover:bg-rose-50 hover:text-brandRed"><ChevronLeft size={14} /></button>
              <button type="button" onClick={() => moveMonth(1)} aria-label="Next month" className="grid h-8 w-8 place-items-center rounded-full border border-[#E5E7EB] text-slate-500 transition hover:border-brandRed/30 hover:bg-rose-50 hover:text-brandRed"><ChevronRight size={14} /></button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-7 text-center" role="row">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <span key={day} className="py-0.5 text-[9px] font-semibold uppercase text-slate-400">{day}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-0.5" role="grid">
            {days.map((date) => {
              const dayValue = toDateValue(date);
              const selected = dayValue === value;
              const today = dayValue === todayValue;
              const outsideMonth = date.getMonth() !== month;
              const unavailable = isDisabled(date);
              return (
                <button
                  key={dayValue}
                  type="button"
                  role="gridcell"
                  disabled={unavailable}
                  aria-label={new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(date)}
                  aria-selected={selected}
                  onClick={() => chooseDate(date)}
                  className={`grid aspect-square place-items-center rounded-full text-[11px] transition disabled:cursor-not-allowed disabled:opacity-25 ${
                    selected
                      ? "bg-brandRed font-semibold text-white shadow-[0_4px_10px_rgba(211,47,47,0.30)]"
                      : today
                        ? "border border-brandRed bg-rose-50 font-semibold text-brandRed"
                        : outsideMonth
                          ? "text-slate-300 hover:bg-rose-50 hover:text-brandRed"
                          : "text-slate-700 hover:bg-rose-50 hover:text-brandRed"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
            <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="h-8 rounded-[30px] px-3 text-[10px] font-medium text-slate-500 hover:bg-slate-50">Clear</button>
            <button type="button" disabled={isDisabled(new Date())} onClick={() => chooseDate(new Date())} className="h-8 rounded-[30px] bg-rose-50 px-3 text-[10px] font-semibold text-brandRed transition hover:bg-rose-100 disabled:opacity-40">Today</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProgressCircle({
  percentage = 75,
  size = 54,
  strokeWidth = 5,
  color = "#D32F2F",
  trackColor = "#F3E5E5",
  label,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-slate-800">
        {label ?? `${Math.round(percentage)}%`}
      </span>
    </div>
  );
}

export function DonutChart({
  data = [],
  size = 130,
  strokeWidth = 14,
  centerText,
  centerSubtext,
}) {
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F3E5E5"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {data.map((item, index) => {
            const percent = (item.value || 0) / total;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativePercent * circumference;
            cumulativePercent += percent;

            return (
              <circle
                key={item.label || index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color || "#D32F2F"}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 ease-out"
              />
            );
          })}
        </svg>
        <div className="absolute text-center flex flex-col items-center justify-center">
          <span className="text-base font-bold text-slate-900 leading-none">
            {centerText ?? total}
          </span>
          {centerSubtext && (
            <span className="text-[9.5px] text-slate-400 font-normal mt-0.5">
              {centerSubtext}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 flex-1 w-full text-xs">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color || "#D32F2F" }}
            />
            <span className="text-slate-600 truncate">{item.label}</span>
            <span className="font-semibold text-slate-900 ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Kpi({ label, value, change, tone = "red" }) {
  const toneClassName = kpiTones[tone] ?? kpiTones.red;

  return (
    <Card className="flex h-full min-h-[130px] flex-col p-5">
      <div className="flex flex-1 justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</span>
          <p className="mt-2 text-2xl font-normal text-slate-900">{value}</p>
          {change && (
            <span className="mt-0.5 text-[11px] text-brandRed font-normal block">{change}</span>
          )}
        </div>
        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-2xl ${toneClassName}`}>
          <Icon name="activity" size={16} />
        </div>
      </div>
    </Card>
  );
}

export function SearchBar({
  value = "",
  setValue = () => {},
  placeholder = "Search...",
}) {
  return (
    <div className="flex h-12 w-full min-w-0 shrink-0 items-center rounded-[30px] border border-[#E5E7EB] bg-white px-4 shadow-[-4px_5px_8px_rgba(211,47,47,0.15),-7px_8px_15px_rgba(211,47,47,0.07)] transition-all duration-200 hover:border-slate-300 focus-within:border-[1.5px] focus-within:border-brandRed focus-within:shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] lg:flex-1">
      <Icon name="search" size={20} className="mr-2.5 shrink-0 text-[#8FA0B8]" />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 w-full border-0 bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-[13px] placeholder:font-medium placeholder:text-[#8FA0B8]"
      />
    </div>
  );
}

export function Drawer({ open, onClose, title, children }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close drawer"
        className="absolute inset-0 bg-black/25"
        onClick={onClose}
      />
      <aside className="absolute inset-x-0 bottom-0 max-h-[92vh] w-full overflow-y-auto rounded-t-[35px] border-t border-[#F3E5E5] bg-white p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] sm:p-6 md:inset-y-0 md:left-auto md:right-0 md:h-full md:max-h-none md:max-w-xl md:rounded-[35px] md:border-l md:border-t-0 md:p-8">
        <div className="mb-6 flex justify-between">
          <h2 className="text-lg font-normal text-brandRed tracking-tight">{title}</h2>
          <button
            type="button"
            aria-label="Close drawer"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-[#E5E7EB] hover:border-brandRed transition cursor-pointer"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}

export function Actions({ onView, onApprove, onReject }) {
  return (
    <>
      {onView && (
        <button
          type="button"
          aria-label="View"
          onClick={onView}
          className="grid h-8 w-8 place-items-center rounded-full border border-[#E5E7EB] hover:border-brandRed transition cursor-pointer"
        >
          <Icon name="eye" size={14} />
        </button>
      )}
      {onApprove && (
        <button
          type="button"
          aria-label="Approve"
          onClick={onApprove}
          className="grid h-8 w-8 place-items-center rounded-full border border-[#E5E7EB] text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
        >
          <Icon name="check" size={14} />
        </button>
      )}
      {onReject && (
        <button
          type="button"
          aria-label="Reject"
          onClick={onReject}
          className="grid h-8 w-8 place-items-center rounded-full border border-[#E5E7EB] text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <Icon name="ban" size={14} />
        </button>
      )}
    </>
  );
}

export function FilterBar({
  value = "",
  setValue = () => {},
  placeholder = "Search records...",
  status = "",
  setStatus = () => {},
  options = [],
  onClear = () => {},
  showStatus = true,
}) {
  return (
    <div className="mb-4 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <SearchBar value={value} setValue={setValue} placeholder={placeholder} />
      <div
        className={`grid min-w-0 gap-2 ${
          showStatus
            ? "grid-cols-[minmax(0,1fr)_48px] sm:min-w-[260px]"
            : "grid-cols-[48px] justify-end"
        }`}
      >
        {showStatus && (
          <AdminSelect
            value={status}
            onChange={setStatus}
            options={[{ value: "", label: "All statuses" }, ...options]}
            ariaLabel="Filter by status"
            buttonClassName="h-12 text-sm"
          />
        )}
        <button
          type="button"
          aria-label="Clear filters"
          onClick={onClear}
          className="grid h-12 w-12 place-items-center rounded-full border border-[#E5E7EB] hover:border-brandRed transition cursor-pointer"
        >
          <Icon name="refresh" size={16} />
        </button>
      </div>
    </div>
  );
}

export function BulkActionBar({ count = 0, actions = [], onClear = () => {} }) {
  if (count === 0) return null;

  const toneClasses = {
    default: "border border-[#E5E7EB] bg-white text-slate-600 hover:border-brandRed hover:text-brandRed",
    success: "border border-[#E5E7EB] bg-white text-slate-600 hover:border-emerald-500 hover:text-emerald-700",
    danger: "bg-brandRed text-white shadow-[0_4px_12px_rgba(211,47,47,0.3)] hover:bg-brandRedDark",
  };

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-[28px] border border-[#F3E5E5] bg-white p-4 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-medium text-slate-700">{count} selected</p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            disabled={action.disabled}
            onClick={action.onClick}
            className={`flex h-9 items-center justify-center rounded-[30px] px-3 text-[11px] font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${toneClasses[action.tone ?? "default"]}`}
          >
            {action.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onClear}
          className="flex h-9 items-center justify-center px-3 text-[11px] font-medium text-slate-500"
        >
          Clear selection
        </button>
      </div>
    </div>
  );
}

export function StatGrid({ children, className = "" }) {
  return (
    <div
      className={`grid grid-cols-2 items-stretch gap-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function StatusCard({
  label,
  value,
  description,
  tone = "red",
  onClick,
}) {
  const toneClassName = kpiTones[tone] ?? kpiTones.red;
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`flex h-full min-h-[130px] w-full flex-col rounded-[28px] border border-[#F3E5E5] bg-white p-5 text-left shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] transition ${
        onClick
          ? "cursor-pointer hover:border-brandRed/40 hover:shadow-[-4px_5px_10px_rgba(211,47,47,0.24)] focus:outline-none focus:ring-2 focus:ring-brandRed/20"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-2xl ${toneClassName}`}>
          <Icon name="activity" size={16} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-normal text-slate-900">{value}</p>
      {description && (
        <p className="mt-auto pt-1 text-[11px] leading-5 text-slate-500 font-normal">{description}</p>
      )}
    </Component>
  );
}

export function Pagination({
  page = 1,
  pageCount = 1,
  pageSize = 5,
  totalCount = 0,
  onPageChange = () => {},
  onPageSizeChange = () => {},
}) {
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex min-w-0 flex-col gap-3 border-t border-slate-100 px-4 py-3 text-sm lg:flex-row lg:items-center lg:justify-between">
      <p className="text-slate-500 text-xs">
        Showing {start}–{end} of {totalCount}
      </p>

      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 sm:justify-start">
        <div className="flex items-center gap-2 text-slate-600">
          <span className="sr-only sm:not-sr-only text-xs">Rows</span>
          <AdminSelect
            value={pageSize}
            onChange={onPageSizeChange}
            options={[5, 10, 20]}
            ariaLabel="Rows per page"
            className="w-20"
            buttonClassName="h-9"
            menuPlacement="top"
          />
        </div>

        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
          className="hidden h-9 rounded-[30px] border border-[#E5E7EB] px-3 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40 lg:inline-flex lg:items-center transition cursor-pointer"
        >
          First
        </button>
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-9 rounded-[30px] border border-[#E5E7EB] px-3 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40 transition cursor-pointer"
        >
          Previous
        </button>
        <span className="min-w-16 text-center text-slate-600 text-xs">
          {page} / {pageCount}
        </span>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="h-9 rounded-[30px] border border-[#E5E7EB] px-3 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40 transition cursor-pointer"
        >
          Next
        </button>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(pageCount)}
          className="hidden h-9 rounded-[30px] border border-[#E5E7EB] px-3 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40 lg:inline-flex lg:items-center transition cursor-pointer"
        >
          Last
        </button>
      </div>
    </div>
  );
}

export function EmptyState({
  title = "No records found",
  description = "Try changing or clearing the current filters.",
  action,
  onAction,
}) {
  return (
    <div className="w-full rounded-[35px] bg-white border border-[#F3E5E5] p-8 text-center shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-brandRed">
        <Icon name="search" size={20} />
      </div>
      <h3 className="mt-4 font-semibold text-slate-700 text-sm">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-xs text-slate-400 font-normal">
        {description}
      </p>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 h-10 rounded-[30px] border border-brandRed px-4 text-xs font-semibold text-brandRed cursor-pointer"
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function LoadingState({ label = "Loading records…" }) {
  return (
    <div className="flex min-h-48 items-center justify-center gap-3 p-8 text-sm text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-brandRed" />
      {label}
    </div>
  );
}

export function ErrorState({
  title = "Unable to load data",
  message = "The Admin data could not be loaded. Please try again.",
  onRetry,
}) {
  return (
    <div className="w-full rounded-[35px] bg-white border border-[#F3E5E5] p-8 text-center shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-rose-700">
        <Icon name="xcircle" size={20} />
      </div>
      <h3 className="mt-4 font-semibold text-slate-700 text-sm">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-xs text-slate-400 font-normal">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 h-10 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function Modal({ open, onClose, title, description, children }) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />
      <div className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-[35px] bg-white border border-[#F3E5E5] p-5 sm:p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="admin-modal-title" className="text-lg font-normal text-brandRed tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-xs text-slate-500 font-normal">{description}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#E5E7EB] hover:border-brandRed transition cursor-pointer"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  tone = "danger",
  onConfirm,
  onClose,
  children,
}) {
  const confirmClassName =
    tone === "danger"
      ? "bg-brandRed text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark"
      : "bg-emerald-600 text-white hover:bg-emerald-700";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
    >
      {children}
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="h-10 rounded-[30px] border border-[#E5E7EB] px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`h-10 rounded-[30px] px-4 text-xs font-semibold transition cursor-pointer ${confirmClassName}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export function Toast({ message, onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      className="fixed bottom-5 right-5 z-[100] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-[30px] bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] animate-scale-up"
    >
      <Icon name="check" size={16} className="text-emerald-400" />
      <span>{message}</span>
      <button type="button" aria-label="Dismiss notification" onClick={onClose} className="cursor-pointer">
        <Icon name="x" size={14} />
      </button>
    </div>
  );
}

export function Tabs({ tabs = [], activeTab, onChange = () => {} }) {
  return (
    <div className="overflow-x-auto border-b border-slate-100 scrollbar-none" role="tablist">
      <div className="flex min-w-max gap-2 px-1 py-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => onChange(tab)}
            className={`h-9 rounded-[30px] px-4 text-xs font-medium shrink-0 transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-brandRed text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] font-semibold"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-[#E5E7EB]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PermissionGate({ allowed, children, fallback = null }) {
  return allowed ? children : fallback;
}
