import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, UserRound, MapPin } from "lucide-react";
import { fetchOwnerProfile } from "../../lib/supabase";

export default function SellerInfoStep({ form, updateForm, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  // Auto-prefill from sign-up data
  useEffect(() => {
    (async () => {
      const owner = await fetchOwnerProfile();
      if (owner) {
        const patch = {};
        if (!form.ownerName && owner.full_name) patch.ownerName = owner.full_name;
        if (!form.phone && owner.phone) patch.phone = owner.phone;
        if (!form.email && owner.email) patch.email = owner.email;
        if (Object.keys(patch).length) updateForm(patch);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const validate = () => {
    const errs = {};
    if (!form.ownerName?.trim()) errs.ownerName = "Owner name is required";
    if (!form.phone?.trim()) errs.phone = "Phone number is required";
    if (!form.email?.trim()) errs.email = "Email is required";
    if (!form.address?.trim()) errs.address = "Business address is required";
    if (!form.pincode?.trim()) errs.pincode = "PIN code is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const inputClass =
    "min-h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:bg-white focus:ring-2 focus:ring-brandRed/10 transition";

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (validate()) onNext(); }}
      className="space-y-7 font-sans max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brandRed/10 text-brandRed">
          <UserRound size={22} />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">About you</h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">We've pre-filled details from your sign-up. Verify and add your shop address.</p>
        </div>
      </div>

      {/* Owner Info */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm space-y-4">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-brandRed flex items-center gap-1.5 border-b border-slate-100 pb-3">
          <UserRound size={14} /> Owner details
        </h3>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">Full Name <span className="text-brandRed">*</span></label>
          <input type="text" value={form.ownerName || ""} onChange={(e) => updateForm({ ownerName: e.target.value })} placeholder="e.g. Ramesh Kumar" className={inputClass} />
          {errors.ownerName && <span className="text-[11px] text-rose-500 font-medium mt-1.5 block">{errors.ownerName}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">Phone <span className="text-brandRed">*</span></label>
            <input type="tel" value={form.phone || ""} onChange={(e) => updateForm({ phone: e.target.value })} placeholder="+91 98765 43210" className={inputClass} />
            {errors.phone && <span className="text-[11px] text-rose-500 font-medium mt-1.5 block">{errors.phone}</span>}
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">Email <span className="text-brandRed">*</span></label>
            <input type="email" value={form.email || ""} onChange={(e) => updateForm({ email: e.target.value })} placeholder="owner@shop.com" className={inputClass} />
            {errors.email && <span className="text-[11px] text-rose-500 font-medium mt-1.5 block">{errors.email}</span>}
          </div>
        </div>
      </div>

      {/* Shop Address */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm space-y-4">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 border-b border-slate-100 pb-3">
          <MapPin size={14} className="text-slate-400" /> Shop address
        </h3>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">Street Address <span className="text-brandRed">*</span></label>
          <input type="text" value={form.address || ""} onChange={(e) => updateForm({ address: e.target.value })} placeholder="Shop #12, Campus Complex, North Gate" className={inputClass} />
          {errors.address && <span className="text-[11px] text-rose-500 font-medium mt-1.5 block">{errors.address}</span>}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">City</label>
            <input type="text" value={form.city || "Chennai"} onChange={(e) => updateForm({ city: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">State</label>
            <input type="text" value={form.state || "Tamil Nadu"} onChange={(e) => updateForm({ state: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">PIN <span className="text-brandRed">*</span></label>
            <input type="text" value={form.pincode || ""} onChange={(e) => updateForm({ pincode: e.target.value })} placeholder="600025" className={inputClass} />
            {errors.pincode && <span className="text-[11px] text-rose-500 font-medium mt-1.5 block">{errors.pincode}</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
        <button type="button" onClick={onBack} className="min-h-[52px] flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer">
          <ArrowLeft size={16} /> Back
        </button>
        <button type="submit" className="min-h-[56px] flex-1 sm:flex-initial flex items-center justify-center gap-2.5 rounded-2xl bg-brandRed px-6 text-sm font-bold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark active:scale-[0.98] transition cursor-pointer">
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
