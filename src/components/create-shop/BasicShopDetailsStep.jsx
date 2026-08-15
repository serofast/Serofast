import { useState } from "react";
import { ArrowRight, ImagePlus, Store } from "lucide-react";

export default function BasicShopDetailsStep({ form, updateForm, onNext }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.shopName?.trim()) errs.shopName = "Shop name is required";
    if (!form.category) errs.category = "Please select a category";
    if (!form.description?.trim()) errs.description = "Shop description is required";
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
        <span className="text-xs font-bold uppercase tracking-wider text-brandRed">Step 1 of 6</span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Create your shop</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
          Let's get your store ready for SeroFast. Basic shop details will be visible to campus shoppers.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4">
        {/* Shop Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Shop Name <span className="text-brandRed">*</span>
          </label>
          <input
            type="text"
            value={form.shopName || ""}
            onChange={(e) => updateForm({ shopName: e.target.value })}
            placeholder="e.g. Urban Threads Campus Store"
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
          />
          {errors.shopName && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{errors.shopName}</span>}
        </div>

        {/* Shop Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Shop Category <span className="text-brandRed">*</span>
            </label>
            <select
              value={form.category || "Fashion"}
              onChange={(e) => updateForm({ category: e.target.value })}
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
            >
              <option value="Fashion">Fashion &amp; Apparel</option>
              <option value="Footwear">Footwear &amp; Sneakers</option>
              <option value="Accessories">Accessories &amp; Bags</option>
              <option value="Electronics">Electronics &amp; Gadgets</option>
              <option value="Beauty">Beauty &amp; Personal Care</option>
              <option value="Stationery">Stationery &amp; Books</option>
            </select>
            {errors.category && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{errors.category}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Shop Tagline
            </label>
            <input
              type="text"
              value={form.tagline || ""}
              onChange={(e) => updateForm({ tagline: e.target.value })}
              placeholder="e.g. Trendy campus fashion under ₹999"
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
            />
          </div>
        </div>

        {/* Shop Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Shop Description <span className="text-brandRed">*</span>
          </label>
          <textarea
            rows={3}
            value={form.description || ""}
            onChange={(e) => updateForm({ description: e.target.value })}
            placeholder="Tell campus customers what makes your store unique..."
            className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
          />
          {errors.description && <span className="text-[11px] text-rose-500 font-medium mt-1 block">{errors.description}</span>}
        </div>

        {/* Upload Logo & Cover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Upload Shop Logo
            </label>
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center hover:border-brandRed transition">
              <ImagePlus size={24} className="text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-700">Click or Drag Logo</span>
              <span className="text-[10px] text-slate-400">JPG, PNG (Max 2MB)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Upload Cover Banner
            </label>
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center hover:border-brandRed transition">
              <ImagePlus size={24} className="text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-700">Click or Drag Cover</span>
              <span className="text-[10px] text-slate-400">1200 × 400 Recommended</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="min-h-[48px] w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-brandRed px-6 py-3 text-sm font-bold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition cursor-pointer"
        >
          <span>Step 2 — Seller Information</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
