import { useState, useEffect } from "react";
import { ArrowRight, ImagePlus, CheckCircle2, Store } from "lucide-react";
import { fetchOwnerProfile } from "../../lib/supabase";

export default function BasicShopDetailsStep({ form, updateForm, onNext }) {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      const owner = await fetchOwnerProfile();
      if (owner?.category && !form.category) {
        updateForm({ category: owner.category });
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const validate = () => {
    const errs = {};
    if (!form.shopName?.trim()) errs.shopName = "Shop name is required";
    if (!form.category) errs.category = "Please select a category";
    if (!form.description?.trim()) errs.description = "A short description is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    updateForm({ logo: previewUrl, logoFile: file });
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    updateForm({ cover: previewUrl, coverFile: file });
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (validate()) onNext(); }}
      className="space-y-7 font-sans max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brandRed/10 text-brandRed">
          <Store size={22} />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Set up your shop</h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">This is how customers will discover you on campus.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm space-y-5">
        {/* Shop Name */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Shop Name <span className="text-brandRed">*</span>
          </label>
          <input
            type="text"
            value={form.shopName || ""}
            onChange={(e) => updateForm({ shopName: e.target.value })}
            placeholder="e.g. Urban Threads Campus Store"
            className="min-h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:bg-white focus:ring-2 focus:ring-brandRed/10 transition"
          />
          {errors.shopName && <span className="text-[11px] text-rose-500 font-medium mt-1.5 block">{errors.shopName}</span>}
        </div>

        {/* Category & Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Category <span className="text-brandRed">*</span>
            </label>
            <select
              value={form.category || "Fashion"}
              onChange={(e) => updateForm({ category: e.target.value })}
              className="min-h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:bg-white focus:ring-2 focus:ring-brandRed/10 transition appearance-none cursor-pointer"
            >
              <option value="Fashion">Fashion &amp; Apparel</option>
              <option value="Footwear">Footwear &amp; Sneakers</option>
              <option value="Accessories">Accessories &amp; Bags</option>
              <option value="Electronics">Electronics &amp; Gadgets</option>
              <option value="Beauty">Beauty &amp; Personal Care</option>
              <option value="Stationery">Stationery &amp; Books</option>
            </select>
            {errors.category && <span className="text-[11px] text-rose-500 font-medium mt-1.5 block">{errors.category}</span>}
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">Tagline</label>
            <input
              type="text"
              value={form.tagline || ""}
              onChange={(e) => updateForm({ tagline: e.target.value })}
              placeholder="e.g. Trendy campus fashion under ₹999"
              className="min-h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:bg-white focus:ring-2 focus:ring-brandRed/10 transition"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Description <span className="text-brandRed">*</span>
          </label>
          <textarea
            rows={3}
            value={form.description || ""}
            onChange={(e) => updateForm({ description: e.target.value })}
            placeholder="Tell campus customers what makes your store unique..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:bg-white focus:ring-2 focus:ring-brandRed/10 transition"
          />
          {errors.description && <span className="text-[11px] text-rose-500 font-medium mt-1.5 block">{errors.description}</span>}
        </div>

        {/* Image Uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Logo */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">Upload Shop Logo</label>
            <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center hover:border-brandRed/50 transition cursor-pointer overflow-hidden min-h-[130px]">
              <input type="file" accept="image/*" onChange={handleLogoChange} className="sr-only" />
              {form.logo ? (
                <div className="flex items-center gap-3 w-full">
                  <img src={form.logo} alt="Logo" className="h-16 w-16 rounded-xl object-cover border border-slate-200 shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={14} /> Selected</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Tap to change</span>
                  </div>
                </div>
              ) : (
                <>
                  <ImagePlus size={28} className="text-slate-300 mb-1.5" />
                  <span className="text-xs font-semibold text-slate-600">Tap to upload logo</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG (Max 2MB)</span>
                </>
              )}
            </label>
          </div>

          {/* Cover */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">Upload Cover Banner</label>
            <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center hover:border-brandRed/50 transition cursor-pointer overflow-hidden min-h-[130px]">
              <input type="file" accept="image/*" onChange={handleCoverChange} className="sr-only" />
              {form.cover ? (
                <div className="relative h-20 w-full rounded-xl overflow-hidden border border-slate-200">
                  <img src={form.cover} alt="Cover" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" /> Tap to change
                  </div>
                </div>
              ) : (
                <>
                  <ImagePlus size={28} className="text-slate-300 mb-1.5" />
                  <span className="text-xs font-semibold text-slate-600">Tap to upload cover</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">1200 × 400 recommended</span>
                </>
              )}
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="min-h-[56px] w-full flex items-center justify-center gap-2.5 rounded-2xl bg-brandRed px-6 text-sm font-bold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark active:scale-[0.98] transition cursor-pointer"
      >
        <span>Continue</span>
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
