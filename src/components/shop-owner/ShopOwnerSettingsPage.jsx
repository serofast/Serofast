import { useState, useEffect } from "react";
import { QrCode, Save, ShieldCheck, Store, User, Mail, Phone, MapPin, LogOut, CheckCircle2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { initialSellerStore } from "../../data/sellerData";
import { AppFormCard, AppFormField, AppFormButton } from "../reusable/form";

export default function ShopOwnerSettingsPage() {
  const [store, setStore] = useState(initialSellerStore);
  const [saved, setSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const active = localStorage.getItem("serofast_active_shop");
      if (active) {
        const parsed = JSON.parse(active);
        setStore((prev) => ({ ...prev, name: parsed.name || prev.name }));
      }
      const owner = localStorage.getItem("serofast_current_owner");
      if (owner) {
        const parsedOwner = JSON.parse(owner);
        setStore((prev) => ({
          ...prev,
          ownerName: parsedOwner.full_name || prev.ownerName,
          email: parsedOwner.email || prev.email,
          phone: parsedOwner.phone || prev.phone,
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setToastMessage("Store settings saved successfully!");
    setTimeout(() => {
      setSaved(false);
      setToastMessage(null);
    }, 3500);
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Container */}
        <div className="lg:col-span-8">
          <AppFormCard className="max-w-full" title="General Store Information" subtitle="Update your campus store profile details">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppFormField
                  label="Store Name"
                  icon={Store}
                  value={store.name}
                  onChange={(val) => setStore({ ...store, name: val })}
                  placeholder="Store Name"
                />

                <AppFormField
                  label="Owner Full Name"
                  icon={User}
                  value={store.ownerName}
                  onChange={(val) => setStore({ ...store, ownerName: val })}
                  placeholder="Owner Name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppFormField
                  label="Business Email"
                  icon={Mail}
                  type="email"
                  value={store.email}
                  onChange={(val) => setStore({ ...store, email: val })}
                  placeholder="owner@email.com"
                />

                <AppFormField
                  label="Phone Number"
                  icon={Phone}
                  type="tel"
                  value={store.phone}
                  onChange={(val) => setStore({ ...store, phone: val })}
                  placeholder="+91 98765 43210"
                />
              </div>

              <AppFormField
                label="Store Address"
                icon={MapPin}
                value={store.address}
                onChange={(val) => setStore({ ...store, address: val })}
                placeholder="Campus Store Address / Block"
              />

              <div className="pt-2">
                <AppFormButton type="submit" icon={Save}>
                  {saved ? "Saved Successfully! ✓" : "Save Changes"}
                </AppFormButton>
              </div>
            </form>
          </AppFormCard>
        </div>

        {/* QR Code, Verification & Logout Card */}
        <div className="lg:col-span-4 space-y-4">
          <AppFormCard className="max-w-full text-center">
            <h4 className="text-sm font-medium text-brandRed">Customer QR Code</h4>
            <p className="text-xs text-slate-500 font-normal mt-1">Display at counter for instant orders.</p>

            <div className="mx-auto my-4 grid h-36 w-36 place-items-center rounded-[24px] bg-slate-900 text-white p-3 ring-1 ring-slate-700 shadow-md">
              <QrCode size={96} className="text-amber-400" />
            </div>

            <button
              type="button"
              onClick={() => alert("Downloading printable PDF poster...")}
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
              Logging out will clear your session on this device.
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
    </div>
  );
}
