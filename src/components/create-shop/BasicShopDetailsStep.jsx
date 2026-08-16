import { useState, useEffect } from "react";
import { ArrowRight, ImagePlus, CheckCircle2 } from "lucide-react";
import { fetchOwnerProfile } from "../../lib/supabase";
import {
  AppFormCard,
  AppFormField,
  AppFormSelect,
  AppFormTextArea,
  AppFormButton,
} from "../reusable/form";

const categoryOptions = [
  "Fashion & Apparel",
  "Footwear & Sneakers",
  "Accessories & Bags",
  "Electronics & Gadgets",
  "Beauty & Personal Care",
  "Stationery & Books",
];

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
      className="space-y-6 max-w-2xl mx-auto"
    >
      <AppFormCard
        title="Create Your Campus Shop"
        subtitle="Step 1 of 5: Basic Shop Details"
        className="max-w-2xl"
      >
        <div className="space-y-5">
          {/* Shop Name */}
          <AppFormField
            label="Shop Name"
            required
            value={form.shopName}
            onChange={(val) => updateForm({ shopName: val })}
            placeholder="e.g. Urban Threads Campus Store"
            error={errors.shopName}
          />

          {/* Category & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppFormSelect
              label="Category"
              required
              value={form.category || "Fashion & Apparel"}
              onChange={(val) => updateForm({ category: val })}
              options={categoryOptions}
              error={errors.category}
            />

            <AppFormField
              label="Tagline"
              value={form.tagline}
              onChange={(val) => updateForm({ tagline: val })}
              placeholder="e.g. Trendy campus fashion under ₹999"
            />
          </div>

          {/* Description */}
          <AppFormTextArea
            label="Description"
            required
            rows={3}
            value={form.description}
            onChange={(val) => updateForm({ description: val })}
            placeholder="Tell campus customers what makes your store unique..."
            error={errors.description}
          />

          {/* Image Uploads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-sans font-sansation">
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
          <AppFormButton type="submit" icon={ArrowRight}>
            Continue to Step 2
          </AppFormButton>
        </div>
      </AppFormCard>
    </form>
  );
}
