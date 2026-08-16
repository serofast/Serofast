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
      className="space-y-6 font-sans font-sansation max-w-2xl mx-auto"
    >
      {/* Flutter Card Container */}
      <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 sm:p-8 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-5">
        
        {/* Title */}
        <div className="text-center pb-2">
          <h2 className="text-[22px] font-semibold text-brandRed tracking-tight">
            Create Your Campus Shop
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Step 1 of 5: Basic Shop Details
          </p>
        </div>

        {/* Shop Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
            Shop Name <span className="text-brandRed">*</span>
          </label>
          <input
            type="text"
            value={form.shopName || ""}
            onChange={(e) => updateForm({ shopName: e.target.value })}
            placeholder="e.g. Urban Threads Campus Store"
            className="h-12 w-full rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-sm font-normal text-slate-900 outline-none shadow-[-4px_5px_8px_rgba(211,47,47,0.15),-7px_8px_15px_rgba(211,47,47,0.07)] focus:border-brandRed focus:border-[1.5px] focus:shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] transition-all duration-200 placeholder:text-[#8FA0B8] placeholder:text-xs"
          />
          {errors.shopName && <span className="text-xs text-red-500 font-normal ml-3 mt-1 block">{errors.shopName}</span>}
        </div>

        {/* Category & Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
              Category <span className="text-brandRed">*</span>
            </label>
            <select
              value={form.category || "Fashion"}
              onChange={(e) => updateForm({ category: e.target.value })}
              className="h-12 w-full rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-sm font-normal text-slate-900 outline-none shadow-[-4px_5px_8px_rgba(211,47,47,0.15),-7px_8px_15px_rgba(211,47,47,0.07)] focus:border-brandRed focus:border-[1.5px] focus:shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="Fashion">Fashion &amp; Apparel</option>
              <option value="Footwear">Footwear &amp; Sneakers</option>
              <option value="Accessories">Accessories &amp; Bags</option>
              <option value="Electronics">Electronics &amp; Gadgets</option>
              <option value="Beauty">Beauty &amp; Personal Care</option>
              <option value="Stationery">Stationery &amp; Books</option>
            </select>
            {errors.category && <span className="text-xs text-red-500 font-normal ml-3 mt-1 block">{errors.category}</span>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Tagline</label>
            <input
              type="text"
              value={form.tagline || ""}
              onChange={(e) => updateForm({ tagline: e.target.value })}
              placeholder="e.g. Trendy campus fashion under ₹999"
              className="h-12 w-full rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-sm font-normal text-slate-900 outline-none shadow-[-4px_5px_8px_rgba(211,47,47,0.15),-7px_8px_15px_rgba(211,47,47,0.07)] focus:border-brandRed focus:border-[1.5px] focus:shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] transition-all duration-200 placeholder:text-[#8FA0B8] placeholder:text-xs"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">
            Description <span className="text-brandRed">*</span>
          </label>
          <textarea
            rows={3}
            value={form.description || ""}
            onChange={(e) => updateForm({ description: e.target.value })}
            placeholder="Tell campus customers what makes your store unique..."
            className="w-full rounded-[24px] border border-[#E5E7EB] bg-white p-4 text-sm font-normal text-slate-900 outline-none shadow-[-4px_5px_8px_rgba(211,47,47,0.15),-7px_8px_15px_rgba(211,47,47,0.07)] focus:border-brandRed focus:border-[1.5px] focus:shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] transition-all duration-200 placeholder:text-[#8FA0B8] placeholder:text-xs"
          />
          {errors.description && <span className="text-xs text-red-500 font-normal ml-3 mt-1 block">{errors.description}</span>}
        </div>

        {/* Image Uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Logo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Upload Shop Logo</label>
            <label className="relative flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[#E5E7EB] bg-[#FAF8F5] p-4 text-center hover:border-brandRed transition cursor-pointer overflow-hidden min-h-[120px]">
              <input type="file" accept="image/*" onChange={handleLogoChange} className="sr-only" />
              {form.logo ? (
                <div className="flex items-center gap-3 w-full">
                  <img src={form.logo} alt="Logo" className="h-14 w-14 rounded-full object-cover border border-slate-200 shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={14} /> Selected</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Tap to change</span>
                  </div>
                </div>
              ) : (
                <>
                  <ImagePlus size={24} className="text-[#8FA0B8] mb-1" />
                  <span className="text-xs font-semibold text-slate-700">Tap to upload logo</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG (Max 2MB)</span>
                </>
              )}
            </label>
          </div>

          {/* Cover */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Upload Cover Banner</label>
            <label className="relative flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[#E5E7EB] bg-[#FAF8F5] p-4 text-center hover:border-brandRed transition cursor-pointer overflow-hidden min-h-[120px]">
              <input type="file" accept="image/*" onChange={handleCoverChange} className="sr-only" />
              {form.cover ? (
                <div className="relative h-16 w-full rounded-xl overflow-hidden border border-slate-200">
                  <img src={form.cover} alt="Cover" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center text-white text-xs font-bold gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" /> Tap to change
                  </div>
                </div>
              ) : (
                <>
                  <ImagePlus size={24} className="text-[#8FA0B8] mb-1" />
                  <span className="text-xs font-semibold text-slate-700">Tap to upload cover</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">1200 × 400 recommended</span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-[30px] bg-brandRed text-[15px] font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] transition-all duration-150 active:scale-[0.98] cursor-pointer hover:bg-brandRedDark"
        >
          <span>Continue to Step 2</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
