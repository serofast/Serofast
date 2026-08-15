import { useState } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, CreditCard, Lock } from "lucide-react";

export default function PaymentSettlementStep({ form, updateForm, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.accountHolder?.trim()) errs.accountHolder = "Account holder name is required";
    if (!form.upiId?.trim()) errs.upiId = "UPI ID is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans max-w-2xl mx-auto">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brandRed">Step 4 of 6</span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Payment &amp; Settlement</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
          Tell SeroFast where your order earnings should be settled. 100% direct retention with 0% commission.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4">
        {/* Instant UPI Settlement */}
        <div className="rounded-xl border border-brandRed/20 bg-promoHighlight/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brandRed flex items-center gap-1.5">
              <CreditCard size={16} /> Instant UPI VPA Handle <span className="text-brandRed">*</span>
            </span>
            <span className="rounded bg-brandRed text-white px-2 py-0.5 text-[10px] font-bold">
              Recommended
            </span>
          </div>

          <input
            type="text"
            value={form.upiId || ""}
            onChange={(e) => updateForm({ upiId: e.target.value })}
            placeholder="yourname@okaxis or store@hdfcbank"
            className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm font-mono font-medium text-slate-900 outline-none focus:border-brandRed"
          />
          {errors.upiId && <span className="text-[11px] text-rose-500 font-medium block">{errors.upiId}</span>}
          <p className="text-[11px] text-slate-500 font-normal">Customer payments settle directly into your UPI account.</p>
        </div>

        {/* Bank Account Details */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Bank Account Details</h4>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Account Holder Name <span className="text-brandRed">*</span>
            </label>
            <input
              type="text"
              value={form.accountHolder || form.ownerName || ""}
              onChange={(e) => updateForm({ accountHolder: e.target.value })}
              placeholder="Name as printed in Bank Passbook"
              className="mt-1 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed"
            />
            {errors.accountHolder && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{errors.accountHolder}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Bank Account Number
              </label>
              <input
                type="text"
                value={form.accountNumber || ""}
                onChange={(e) => updateForm({ accountNumber: e.target.value })}
                placeholder="918237465012"
                className="mt-1 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-mono font-medium text-slate-900 outline-none focus:border-brandRed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                IFSC Code
              </label>
              <input
                type="text"
                value={form.ifscCode || ""}
                onChange={(e) => updateForm({ ifscCode: e.target.value })}
                placeholder="HDFC0001234"
                className="mt-1 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-mono font-medium text-slate-900 outline-none focus:border-brandRed uppercase"
              />
            </div>
          </div>
        </div>

        {/* Settlement Method Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Preferred Settlement Speed
          </label>
          <select
            value={form.settlementMethod || "Instant UPI"}
            onChange={(e) => updateForm({ settlementMethod: e.target.value })}
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed"
          >
            <option value="Instant UPI">Instant UPI (Settles within 15 minutes of order)</option>
            <option value="Daily Batch">Daily Evening Batch (8:00 PM)</option>
            <option value="Weekly NEFT">Weekly Settlement (Every Monday)</option>
          </select>
        </div>

        <div className="rounded-xl bg-emerald-50/70 border border-emerald-100 p-3 flex items-center gap-2 text-xs text-emerald-900 font-medium">
          <Lock size={16} className="shrink-0 text-emerald-600" />
          <span>Payment details are securely encrypted and verified via SeroFast payout gateway.</span>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[48px] flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          type="submit"
          className="min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-brandRed px-6 py-3 text-sm font-bold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition cursor-pointer"
        >
          <span>Step 5 — Delivery Settings</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
