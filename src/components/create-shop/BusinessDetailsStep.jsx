import { useState } from "react";
import { ArrowLeft, ArrowRight, FileText, Info } from "lucide-react";

export default function BusinessDetailsStep({ form, updateForm, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.businessType) errs.businessType = "Please select business type";
    if (!form.pickupAddress?.trim()) errs.pickupAddress = "Pickup address is required";
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
        <span className="text-xs font-bold uppercase tracking-wider text-brandRed">Step 3 of 6</span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Business Details</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
          Essential registration details. Fields marked optional can be updated later in settings.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4">
        {/* Business Type & Seller Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Business Type <span className="text-brandRed">*</span>
            </label>
            <select
              value={form.businessType || "Individual"}
              onChange={(e) => updateForm({ businessType: e.target.value })}
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed"
            >
              <option value="Individual">Individual Student / Creator</option>
              <option value="Sole Proprietorship">Sole Proprietorship</option>
              <option value="LLP">Partnership / LLP</option>
              <option value="Private Limited">Private Limited Company</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Seller Category
            </label>
            <select
              value={form.sellerType || "Campus Partner"}
              onChange={(e) => updateForm({ sellerType: e.target.value })}
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed"
            >
              <option value="Campus Partner">Verified Campus Partner</option>
              <option value="Student Promoter">Student Entrepreneur</option>
              <option value="Local Store">Local Merchant Store</option>
            </select>
          </div>
        </div>

        {/* GST & PAN (Optional Tags) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                GST Number
              </label>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                Optional
              </span>
            </div>
            <input
              type="text"
              value={form.gstNo || ""}
              onChange={(e) => updateForm({ gstNo: e.target.value })}
              placeholder="33AAAAA0000A1Z5"
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed uppercase"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                PAN Number
              </label>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                Optional
              </span>
            </div>
            <input
              type="text"
              value={form.panNo || ""}
              onChange={(e) => updateForm({ panNo: e.target.value })}
              placeholder="ABCDE1234F"
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed uppercase"
            />
          </div>
        </div>

        {/* Pickup Address */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Dispatch &amp; Pickup Address <span className="text-brandRed">*</span>
          </label>
          <input
            type="text"
            value={form.pickupAddress || form.address || ""}
            onChange={(e) => updateForm({ pickupAddress: e.target.value })}
            placeholder="Address where SeroFast runners pick up customer orders"
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed"
          />
          {errors.pickupAddress && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{errors.pickupAddress}</span>}
        </div>

        <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-3 flex items-start gap-2 text-xs text-blue-800 font-normal">
          <Info size={16} className="shrink-0 text-blue-600 mt-0.5" />
          <span>GST &amp; PAN are optional for small student creators. You can launch immediately and add tax documents when scaling.</span>
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
          <span>Step 4 — Payment &amp; Settlement</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
