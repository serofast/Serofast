
import { useState, useEffect } from "react";
import {
  QrCode,
  Save,
  ShieldCheck,
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  LogOut,
  CheckCircle2,
  Tag,
  FileText,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Upload,
  Camera,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppFormCard, AppFormField, AppFormButton } from "../reusable/form";
import { AppSuccessModal, AppErrorModal } from "../reusable";
import { fetchShopDetails, updateShopDetails, uploadShopAsset } from "../../lib/supabase";

export default function ShopOwnerSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  // IDs
  const [activeShopId, setActiveShopId] = useState(null);
  const [activeOwnerId, setActiveOwnerId] = useState(null);

  // Shop & Owner Editable Fields
  const [storeName, setStoreName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("Fashion");
  const [description, setDescription] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Media URLs & File Upload States
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let sId = null;
    let oId = null;
    try {
      const active = localStorage.getItem("serofast_active_shop");
      if (active) sId = JSON.parse(active).id;
      const owner = localStorage.getItem("serofast_current_owner");
      if (owner) oId = JSON.parse(owner).id;
    } catch (e) {
      console.warn(e);
    }
    setActiveShopId(sId);
    setActiveOwnerId(oId);

    (async () => {
      setLoading(true);
      try {
        const { shop, owner } = await fetchShopDetails(sId, oId);

        if (shop) {
          setStoreName(shop.name || shop.shopName || "");
          setTagline(shop.tagline || "");
          setCategory(shop.category || shop.category_id || "Fashion");
          setDescription(shop.description || "");
          setAddress(shop.address || shop.location || "");
          setLogoUrl(shop.avatar_url || shop.logoUrl || shop.logo || "");
          setCoverUrl(shop.cover_url || shop.coverUrl || shop.cover || "");
        }

        if (owner) {
          setOwnerName(owner.full_name || owner.name || owner.ownerName || "");
          setEmail(owner.email || "");
          setPhone(owner.phone || shop?.owner_phone || "");
          if (!category) setCategory(owner.category || "Fashion");
        } else if (shop) {
          setPhone(shop.owner_phone || "");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoUrl("");
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setCoverUrl("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    let finalLogoUrl = logoUrl;
    let finalCoverUrl = coverUrl;

    try {
      if (logoFile) {
        const uploadedLogo = await uploadShopAsset(logoFile, "logos", storeName || activeShopId);
        if (uploadedLogo) {
          finalLogoUrl = uploadedLogo;
          setLogoUrl(uploadedLogo);
          setLogoFile(null);
          setLogoPreview(null);
        }
      }

      if (coverFile) {
        const uploadedCover = await uploadShopAsset(coverFile, "covers", storeName || activeShopId);
        if (uploadedCover) {
          finalCoverUrl = uploadedCover;
          setCoverUrl(uploadedCover);
          setCoverFile(null);
          setCoverPreview(null);
        }
      }

      const effectivePhone = phone?.trim() || "";

      const shopPayload = {
        name: storeName,
        tagline,
        category_id: category.toLowerCase(),
        category,
        description,
        address,
        avatar_url: finalLogoUrl,
        cover_url: finalCoverUrl,
      };
      if (effectivePhone) shopPayload.owner_phone = effectivePhone;

      const ownerPayload = {
        full_name: ownerName,
        email,
        category,
      };
      if (effectivePhone) ownerPayload.phone = effectivePhone;

      await updateShopDetails(activeShopId, activeOwnerId, shopPayload, ownerPayload);

      setSaved(true);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to update store settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPoster = () => {
    // Printable QR code poster download action
  };

  const handleLogout = () => {
    localStorage.removeItem("serofast_active_shop");
    localStorage.removeItem("serofast_current_owner");
    navigate("/login");
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation w-full pb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          Store Settings &amp; Profile
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Manage your campus store details, owner contact profile, and brand assets.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="animate-spin text-brandRed" size={32} />
          <span className="text-xs">Loading shop registration details from Supabase...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Form Container */}
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handleSave} className="space-y-6">

              {/* Section 1: General Store Identity */}
              <AppFormCard className="max-w-full" title="General Store Profile" subtitle="Public store information displayed to customers">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AppFormField
                      label="Store Name"
                      icon={Store}
                      value={storeName}
                      onChange={(val) => setStoreName(val)}
                      placeholder="e.g. Urban Styles Minimal"
                    />

                    <AppFormField
                      label="Category"
                      icon={Tag}
                      value={category}
                      onChange={(val) => setCategory(val)}
                      placeholder="e.g. Fashion, Electronics, Snacks"
                    />
                  </div>

                  <AppFormField
                    label="Store Tagline"
                    icon={Sparkles}
                    value={tagline}
                    onChange={(val) => setTagline(val)}
                    placeholder="e.g. Contemporary fashion for campus minimalists"
                  />

                  <div>
                    <label className="block text-xs font-normal text-slate-700 mb-1 flex items-center gap-1.5">
                      <FileText size={14} className="text-slate-400" /> Store Description
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what your campus store sells and key offerings..."
                      className="w-full rounded-[18px] border border-[#E5E7EB] p-3 text-xs font-normal focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none bg-white"
                    />
                  </div>
                </div>
              </AppFormCard>

              {/* Section 2: Owner & Contact Profile */}
              <AppFormCard className="max-w-full" title="Owner Contact Profile" subtitle="Your registered merchant contact details saved during shop setup">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AppFormField
                      label="Owner Full Name"
                      icon={User}
                      value={ownerName}
                      onChange={(val) => setOwnerName(val)}
                      placeholder="e.g. Sarah Jenkins"
                    />

                    <AppFormField
                      label="Business Email"
                      icon={Mail}
                      type="email"
                      value={email}
                      onChange={(val) => setEmail(val)}
                      placeholder="owner@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AppFormField
                      label="Phone Number"
                      icon={Phone}
                      type="tel"
                      value={phone}
                      onChange={(val) => setPhone(val)}
                      placeholder="+91 98765 43210"
                    />

                    <AppFormField
                      label="Campus Store Address / Location"
                      icon={MapPin}
                      value={address}
                      onChange={(val) => setAddress(val)}
                      placeholder="e.g. Shop #14, Main Market Road, SRM Campus"
                    />
                  </div>
                </div>
              </AppFormCard>

              {/* Section 3: Brand Assets & Media */}
              <AppFormCard
                className="max-w-full"
                title="Brand Assets & Images"
                subtitle="Upload and manage your store's logo and cover banner in your dedicated Supabase storage folder"
              >
                <div className="space-y-6">
                  {/* 1. Store Cover Banner Section */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon size={15} className="text-brandRed" /> Store Cover Banner
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">Recommended: 1200 × 400px</span>
                    </label>

                    {/* Banner Card Container */}
                    <div className="rounded-[24px] border border-[#E5E7EB] bg-slate-50/50 p-3 sm:p-4 space-y-3">
                      {/* Image Preview Box */}
                      <div className="relative h-44 sm:h-52 w-full rounded-[18px] overflow-hidden bg-slate-100 border border-slate-200/80 group">
                        {coverPreview || coverUrl ? (
                          <img
                            src={coverPreview || coverUrl}
                            alt="Store Cover Banner"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center text-slate-400 gap-1.5 p-4 text-center">
                            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-400 shadow-sm border border-slate-200/60">
                              <ImageIcon size={24} />
                            </div>
                            <span className="text-xs font-medium text-slate-600">No Cover Banner Uploaded</span>
                            <span className="text-[11px] text-slate-400">Add a banner to make your shop stand out on campus</span>
                          </div>
                        )}
                      </div>

                      {/* Controls Bar (Mobile & Desktop Responsive) */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2">
                          {coverFile ? (
                            <span className="text-[11px] font-semibold text-rose-700 flex items-center gap-1.5 bg-rose-50 border border-rose-200/80 px-3 py-1.5 rounded-full">
                              <CheckCircle2 size={13} className="text-brandRed" /> Selected: {coverFile.name} (Will upload on save)
                            </span>
                          ) : coverUrl ? (
                            <span className="text-[11px] font-semibold text-rose-700 flex items-center gap-1.5 bg-rose-50 border border-rose-200/80 px-3 py-1.5 rounded-full">
                              <CheckCircle2 size={13} className="text-brandRed" /> Active Cover Banner Set
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-normal">
                              No cover banner image active
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="flex-1 sm:flex-initial flex h-11 items-center justify-center gap-2 rounded-[30px] bg-brandRed px-5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(211,47,47,0.3)] hover:bg-brandRedDark active:scale-[0.98] transition cursor-pointer font-sans font-sansation">
                            <Upload size={14} />
                            <span>{coverPreview || coverUrl ? "Change Banner" : "Upload Banner"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleCoverChange}
                            />
                          </label>

                          {(coverPreview || coverUrl) && (
                            <button
                              type="button"
                              onClick={handleRemoveCover}
                              className="flex h-11 items-center justify-center gap-1.5 rounded-[30px] border border-rose-200 bg-rose-50 px-4 text-xs font-semibold text-brandRed hover:bg-brandRed hover:text-white transition active:scale-[0.98] cursor-pointer font-sans font-sansation"
                            >
                              <Trash2 size={14} />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Shop Profile Logo Section */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Camera size={15} className="text-brandRed" /> Shop Profile Logo
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">Square 1:1 ratio (300 × 300px)</span>
                    </label>

                    {/* Logo Card Container */}
                    <div className="rounded-[24px] border border-[#E5E7EB] bg-slate-50/50 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
                      {/* Avatar Preview Circle */}
                      <div className="relative group shrink-0 h-24 w-24 sm:h-28 sm:w-28 rounded-[24px] border-2 border-white shadow-md overflow-hidden bg-slate-100 grid place-items-center">
                        {logoPreview || logoUrl ? (
                          <img
                            src={logoPreview || logoUrl}
                            alt="Shop Logo"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Store size={40} className="text-slate-300" />
                        )}

                        <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-xs">
                          <Upload size={20} />
                          <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">CHANGE</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                          />
                        </label>
                      </div>

                      {/* Info & Action Controls */}
                      <div className="flex-1 space-y-3 text-center sm:text-left w-full">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-800">Shop Logo</h4>
                          <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-relaxed">
                            Your logo appears on product listings, search cards, and customer order invoices across SeroFast.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                          <label className="flex h-11 items-center justify-center gap-2 rounded-[30px] bg-brandRed px-5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(211,47,47,0.3)] hover:bg-brandRedDark active:scale-[0.98] transition cursor-pointer font-sans font-sansation">
                            <Upload size={14} />
                            <span>{logoPreview || logoUrl ? "Change Logo" : "Upload New Logo"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleLogoChange}
                            />
                          </label>

                          {(logoPreview || logoUrl) && (
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="flex h-11 items-center justify-center gap-1.5 rounded-[30px] border border-rose-200 bg-rose-50 px-4 text-xs font-semibold text-brandRed hover:bg-brandRed hover:text-white transition active:scale-[0.98] cursor-pointer font-sans font-sansation"
                            >
                              <Trash2 size={14} />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        {logoFile ? (
                          <div className="text-[11px] font-semibold text-rose-700 flex items-center justify-center sm:justify-start gap-1.5 bg-rose-50 border border-rose-200/80 px-3 py-1.5 rounded-full w-fit">
                            <CheckCircle2 size={13} className="text-brandRed" /> Selected: {logoFile.name} (Will upload on save)
                          </div>
                        ) : logoUrl ? (
                          <div className="text-[11px] font-semibold text-rose-700 flex items-center justify-center sm:justify-start gap-1.5 bg-rose-50 border border-rose-200/80 px-3 py-1.5 rounded-full w-fit">
                            <CheckCircle2 size={13} className="text-brandRed" /> Active Shop Logo Set
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </AppFormCard>

              <div className="pt-2">
                <AppFormButton type="submit" icon={Save} isLoading={isSaving}>
                  {saved ? "All Store Settings Saved to Database" : "Save Store & Profile Settings"}
                </AppFormButton>
              </div>
            </form>
          </div>

          {/* Right Column: QR Code & Account Actions */}
          <div className="lg:col-span-4 space-y-4">
            <AppFormCard className="max-w-full text-center">
              <h4 className="text-sm font-medium text-brandRed">Customer Order QR Code</h4>
              <p className="text-xs text-slate-500 font-normal mt-1">Display at your counter for instant customer scans.</p>

              <div className="mx-auto my-4 grid h-40 w-40 place-items-center rounded-[24px] bg-slate-900 text-white p-3 ring-1 ring-slate-700 shadow-md">
                <QrCode size={108} className="text-amber-400" />
              </div>

              <button
                type="button"
                onClick={handleDownloadPoster}
                className="flex h-12 w-full items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white text-xs font-medium text-slate-800 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
              >
                Download PDF Poster
              </button>
            </AppFormCard>

            {/* Account Security & Logout Section */}
            <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-brandRed" /> Account Security
                </span>
                <span className="text-[11px] text-brandRed font-normal">Active</span>
              </div>

              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                Logging out will end your session on this device.
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[30px] bg-rose-50 border border-rose-200 text-brandRed text-xs font-semibold hover:bg-brandRed hover:text-white transition-all duration-200 cursor-pointer shadow-xs"
              >
                <LogOut size={16} />
                <span>Log Out Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Red Success Status Modal Dialog */}
      <AppSuccessModal
        isOpen={saved}
        onClose={() => setSaved(false)}
        title="Settings Saved Successfully"
        message="Your store profile, contact details, logo, and cover banner have been updated in the database."
        details={storeName ? `Active Store: ${storeName}` : null}
        primaryActionLabel="Continue"
        onPrimaryAction={() => setSaved(false)}
      />

      {/* Brand Red Error Status Modal Dialog */}
      <AppErrorModal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        title="Update Failed"
        message={errorMessage || "Failed to update store settings. Please try again."}
        primaryActionLabel="Try Again"
        onPrimaryAction={() => {
          setErrorMessage(null);
        }}
      />
    </div>
  );
}
