import { formatINR } from "./utils";

/**
 * Fully controlled selling-price input.
 *
 * The parent owns the draft string via `value` / `onChange`. Validity is
 * derived from the value, so parents can block actions (e.g. adding a
 * product) while the field shows a price below the base price.
 */
export default function SellingPriceInput({ value, base, onChange, id, label }) {
  const draft = value == null || value === "" ? "" : String(value);
  const clean = draft.replace(/[^0-9]/g, "");
  const num = clean === "" ? 0 : Number(clean);
  const hasText = draft.trim() !== "";
  const tooLow = hasText && num < base;

  const handleChange = (e) => {
    const raw = e.target.value;
    if (/[^0-9]/.test(raw)) return; // digits only
    onChange(raw);
  };

  return (
    <div>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={draft}
        onChange={handleChange}
        placeholder={formatINR(base)}
        aria-label={label}
        aria-invalid={tooLow}
        aria-describedby={tooLow ? `${id}-error` : undefined}
        className={`h-11 w-full rounded-lg border bg-lightSurface px-3 text-sm text-textPrimary outline-none transition focus:border-brandRed focus:ring-2 focus:ring-brandRed/10 ${
          tooLow ? "border-brandRed bg-promoHighlight" : "border-[#d9d9d9]"
        }`}
      />
      {tooLow && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-brandRed">
          Selling price cannot be lower than {formatINR(base)}.
        </p>
      )}
    </div>
  );
}
