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
    <div className="space-y-6 animate-fade-in font-sans">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Store Profile &amp; QR Poster</h1>
        <p className="text-xs text-slate-500 font-normal mt-1">Manage shop details, delivery settings &amp; printable QR poster.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">General Store Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700">Store Name</label>
              <input
                type="text"
                value={store.name}
                onChange={(e) => setStore({ ...store, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-brandRed font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">Owner Full Name</label>
              <input
                type="text"
                value={store.ownerName}
                onChange={(e) => setStore({ ...store, ownerName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-brandRed font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700">Business Email</label>
              <input
                type="email"
                value={store.email}
                onChange={(e) => setStore({ ...store, email: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-brandRed font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">Phone Number (SMS Notifications)</label>
              <input
                type="tel"
                value={store.phone}
                onChange={(e) => setStore({ ...store, phone: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-brandRed font-medium"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700">Physical Store Address</label>
            <input
              type="text"
              value={store.address}
              onChange={(e) => setStore({ ...store, address: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-brandRed font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-semibold text-slate-700">Campus Delivery Radius (Km)</label>
              <input
                type="number"
                value={store.deliveryRadiusKm}
                onChange={(e) => setStore({ ...store, deliveryRadiusKm: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-brandRed font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700">Minimum Order Amount (₹)</label>
              <input
                type="number"
                value={store.minOrderAmount}
                onChange={(e) => setStore({ ...store, minOrderAmount: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-brandRed font-medium"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-brandRed px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brandRedDark transition"
            >
              <Save size={15} />
              <span>{saved ? "Profile Saved! ✓" : "Save Changes"}</span>
            </button>
          </div>
        </form>

        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs text-center space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Printable Customer QR Poster</h4>
            <p className="text-xs text-slate-500 font-normal">Display this QR code at your shop counter for instant customer orders.</p>

            <div className="mx-auto grid h-40 w-40 place-items-center rounded-xl bg-slate-900 text-white p-3 shadow-md">
              <QrCode size={110} className="text-amber-400" />
            </div>

            <button
              type="button"
              onClick={() => alert("Downloading printable PDF poster...")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-800 hover:border-brandRed hover:text-brandRed transition"
            >
              Download PDF Poster
            </button>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs text-emerald-900 space-y-1">
            <span className="font-bold flex items-center gap-1 text-emerald-800">
              <ShieldCheck size={15} /> Verification Status
            </span>
            <p className="text-emerald-700 font-normal">Your store is verified on SeroFast with 100% direct profit guarantee.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
