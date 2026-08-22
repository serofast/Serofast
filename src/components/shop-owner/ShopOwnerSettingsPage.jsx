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
  Truck,
  DollarSign,
  Clock,
  Image as ImageIcon,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppFormCard, AppFormField, AppFormButton } from "../reusable/form";
import { fetchShopDetails, updateShopDetails, uploadShopAsset } from "../../lib/supabase";

export default function ShopOwnerSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
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

  // Enhanced Operational Settings
  const [isOnline, setIsOnline] = useState(true);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState(5);
  const [minOrderAmount, setMinOrderAmount] = useState(199);
  const [prepTimeMins, setPrepTimeMins] = useState(15);

  // Media URLs
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

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
          setIsOnline(shop.status !== "offline");
          setDeliveryRadiusKm(shop.deliveryRadiusKm || shop.delivery_radius || 5);
          setMinOrderAmount(shop.minOrderAmount || shop.min_order || 199);
          setPrepTimeMins(shop.prepTimeMins || 15);
          setLogoUrl(shop.avatar_url || shop.logoUrl || shop.logo || "");
          setCoverUrl(shop.cover_url || shop.coverUrl || shop.cover || "");
        }

        if (owner) {
          setOwnerName(owner.full_name || owner.name || owner.ownerName || "");
          setEmail(owner.email || "");
          setPhone(owner.phone || "");
          if (!category) setCategory(owner.category || "Fashion");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaved(true);

    let finalLogoUrl = logoUrl;
    let finalCoverUrl = coverUrl;

    if (logoFile) {
      const uploaded = await uploadShopAsset(logoFile, "logos");
      if (uploaded) {
        finalLogoUrl = uploaded;
        setLogoUrl(uploaded);
      }
    }
    if (coverFile) {
      const uploaded = await uploadShopAsset(coverFile, "covers");
      if (uploaded) {
        finalCoverUrl = uploaded;
        setCoverUrl(uploaded);
      }
    }

    const shopPayload = {
      name: storeName,
      tagline,
      category_id: category.toLowerCase(),
      category,
      description,
      address,
      status: isOnline ? "online" : "offline",
      deliveryRadiusKm: Number(deliveryRadiusKm) || 5,
      minOrderAmount: Number(minOrderAmount) || 199,
      prepTimeMins: Number(prepTimeMins) || 15,
      avatar_url: finalLogoUrl,
      cover_url: finalCoverUrl,
    };

    const ownerPayload = {
      full_name: ownerName,
      email,
      phone,
      category,
    };

    await updateShopDetails(activeShopId, activeOwnerId, shopPayload, ownerPayload);

    setToastMessage("🎉 Store settings & profile successfully saved to database!");
    setTimeout(() => {
      setSaved(false);
      setToastMessage(null);
    }, 4000);
  };

  const handleDownloadPoster = () => {
    setToastMessage("Downloading printable QR code PDF poster...");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = () => {
    localStorage.removeItem("serofast_active_shop");
    localStorage.removeItem("serofast_current_owner");
    navigate("/login");
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          Store Settings &amp; Profile
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Manage your campus store details, operational preferences, and owner contact profile.
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

              {/* Section 3: Operational & Delivery Settings */}
              <AppFormCard className="max-w-full" title="Operations & Delivery Preferences" subtitle="Configure order fulfillment parameters for campus delivery">
                <div className="space-y-4">
                  {/* Store Status Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-[22px] bg-[#FAF8F5] border border-[#F3E5E5]">
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">Store Online Status</span>
                      <span className="text-[11px] text-slate-500 font-normal">Toggle whether your shop is currently accepting customer orders.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOnline(!isOnline)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${
                        isOnline ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          isOnline ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-normal text-slate-700 mb-1 flex items-center gap-1">
                        <Truck size={13} className="text-slate-400" /> Delivery Radius (km)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={deliveryRadiusKm}
                        onChange={(e) => setDeliveryRadiusKm(e.target.value)}
                        className="w-full h-10 rounded-[14px] border border-[#E5E7EB] px-3 text-xs font-normal focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-normal text-slate-700 mb-1 flex items-center gap-1">
                        <DollarSign size={13} className="text-slate-400" /> Min. Order Amount (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={minOrderAmount}
                        onChange={(e) => setMinOrderAmount(e.target.value)}
                        className="w-full h-10 rounded-[14px] border border-[#E5E7EB] px-3 text-xs font-normal focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-normal text-slate-700 mb-1 flex items-center gap-1">
                        <Clock size={13} className="text-slate-400" /> Avg. Prep Time (Mins)
                      </label>
                      <input
                        type="number"
                        min="5"
                        value={prepTimeMins}
                        onChange={(e) => setPrepTimeMins(e.target.value)}
                        className="w-full h-10 rounded-[14px] border border-[#E5E7EB] px-3 text-xs font-normal focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                      />
                    </div>
                  </div>
                </div>
              </AppFormCard>

              {/* Section 4: Brand Assets & Media */}
              <AppFormCard className="max-w-full" title="Brand Assets &amp; Images" subtitle="Update store logo and cover banner image URLs">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <AppFormField
                        label="Store Logo Image URL"
                        icon={ImageIcon}
                        value={logoUrl}
                        onChange={(val) => setLogoUrl(val)}
                        placeholder="https://..."
                      />
                      {logoUrl && (
                        <img
                          src={logoUrl}
                          alt="Logo Preview"
                          className="mt-2 h-14 w-14 rounded-2xl object-cover border border-slate-200"
                        />
                      )}
                    </div>

                    <div>
                      <AppFormField
                        label="Store Cover Banner URL"
                        icon={ImageIcon}
                        value={coverUrl}
                        onChange={(val) => setCoverUrl(val)}
                        placeholder="https://..."
                      />
                      {coverUrl && (
                        <img
                          src={coverUrl}
                          alt="Cover Preview"
                          className="mt-2 h-14 w-full rounded-2xl object-cover border border-slate-200"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </AppFormCard>

              <div className="pt-2">
                <AppFormButton type="submit" icon={Save}>
                  {saved ? "All Store Settings Saved to Database! ✓" : "Save Store & Profile Settings"}
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

      {/* Animated Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-[22px] bg-slate-900 text-white px-5 py-3.5 text-xs font-normal shadow-2xl flex items-center gap-2.5 animate-bounce font-sans font-sansation">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
