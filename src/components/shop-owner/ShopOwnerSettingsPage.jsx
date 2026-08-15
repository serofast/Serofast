import { useState } from "react";
import { QrCode, Save, ShieldCheck } from "lucide-react";
import { initialSellerStore } from "../../data/sellerData";

export default function ShopOwnerSettingsPage() {
  const [store, setStore] = useState(initialSellerStore);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in font-sans">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">Manage store profile &amp; printable QR poster.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <form onSubmit={handleSave} className="lg:col-span-8 rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs space-y-3.5">
          <h3 className="text-sm font-bold text-slate-900">General Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700">Store Name</label>
              <input
                type="text"
                value={store.name}
                onChange={(e) => setStore({ ...store, name: e.target.value })}
                className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-slate-400 font-medium"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700">Owner Full Name</label>
              <input
                type="text"
                value={store.ownerName}
                onChange={(e) => setStore({ ...store, ownerName: e.target.value })}
                className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700">Business Email</label>
              <input
                type="email"
                value={store.email}
                onChange={(e) => setStore({ ...store, email: e.target.value })}
                className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-slate-400 font-medium"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700">Phone Number</label>
              <input
                type="tel"
                value={store.phone}
                onChange={(e) => setStore({ ...store, phone: e.target.value })}
                className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-medium text-slate-700">Address</label>
            <input
              type="text"
              value={store.address}
              onChange={(e) => setStore({ ...store, address: e.target.value })}
              className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-slate-400 font-medium"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="min-h-[44px] flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-brandRed px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition cursor-pointer"
            >
              <Save size={14} />
              <span>{saved ? "Saved! ✓" : "Save Changes"}</span>
            </button>
          </div>
        </form>

        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs text-center space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Printable Customer QR Code</h4>
            <p className="text-[11px] text-slate-500 font-normal">Display at counter for instant orders.</p>

            <div className="mx-auto grid h-36 w-36 place-items-center rounded-xl bg-slate-900 text-white p-3">
              <QrCode size={96} className="text-amber-400" />
            </div>

            <button
              type="button"
              onClick={() => alert("Downloading printable PDF poster...")}
              className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            >
              Download PDF Poster
            </button>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-900 space-y-1">
            <span className="font-semibold flex items-center gap-1 text-emerald-800">
              <ShieldCheck size={14} /> Verified Merchant
            </span>
            <p className="text-emerald-700 text-[11px] font-normal">100% direct profit guarantee.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
