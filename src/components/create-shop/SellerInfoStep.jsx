import { useState } from "react";
import { ArrowLeft, ArrowRight, User, Building } from "lucide-react";

export default function SellerInfoStep({ form, updateForm, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.ownerName?.trim()) errs.ownerName = "Owner name is required";
    if (!form.phone?.trim()) errs.phone = "Phone number is required";
    if (!form.email?.trim()) errs.email = "Email is required";
    if (!form.address?.trim()) errs.address = "Business address is required";
    if (!form.city?.trim()) errs.city = "City is required";
    if (!form.pincode?.trim()) errs.pincode = "PIN code is required";
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
        <span className="text-xs font-bold uppercase tracking-wider text-brandRed">Step 2 of 6</span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Seller Information</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
          Clearly distinguish your personal Owner Details from your physical Shop Address.
        </p>
      </div>

      {/* Owner Information Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brandRed flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
          <User size={16} /> Owner Information (Personal)
        </h3>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Owner Full Name <span className="text-brandRed">*</span>
          </label>
          <input
            type="text"
            value={form.ownerName || ""}
            onChange={(e) => updateForm({ ownerName: e.target.value })}
            placeholder="e.g. Ramesh Kumar"
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
          />
          {errors.ownerName && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{errors.ownerName}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Phone Number <span className="text-brandRed">*</span>
            </label>
            <input
              type="tel"
              value={form.phone || ""}
              onChange={(e) => updateForm({ phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
            />
            {errors.phone && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{errors.phone}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address <span className="text-brandRed">*</span>
            </label>
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) => updateForm({ email: e.target.value })}
              placeholder="owner@yourshop.com"
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
            />
            {errors.email && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{errors.email}</span>}
          </div>
        </div>
      </div>

      {/* Shop Location Information Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
          <Building size={16} className="text-slate-500" /> Shop Physical Location
        </h3>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Business Street Address <span className="text-brandRed">*</span>
          </label>
          <input
            type="text"
            value={form.address || ""}
            onChange={(e) => updateForm({ address: e.target.value })}
            placeholder="Shop #12, Campus Student Complex, North Gate"
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
          />
          {errors.address && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{errors.address}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              City <span className="text-brandRed">*</span>
            </label>
            <input
              type="text"
              value={form.city || "Chennai"}
              onChange={(e) => updateForm({ city: e.target.value })}
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
            />
            {errors.city && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{errors.city}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              State
            </label>
            <input
              type="text"
              value={form.state || "Tamil Nadu"}
              onChange={(e) => updateForm({ state: e.target.value })}
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              PIN Code <span className="text-brandRed">*</span>
            </label>
            <input
              type="text"
              value={form.pincode || ""}
              onChange={(e) => updateForm({ pincode: e.target.value })}
              placeholder="600025"
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
            />
            {errors.pincode && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{errors.pincode}</span>}
          </div>
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
          <span>Step 3 — Business Details</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
