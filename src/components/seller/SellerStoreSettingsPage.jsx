import { useState } from "react";
import { Store, QrCode, Download, Save, CheckCircle2, ShieldCheck, MapPin, Phone, Globe } from "lucide-react";
import { initialSellerStore } from "../../data/sellerData";

export default function SellerStoreSettingsPage() {
  const [storeInfo, setStoreInfo] = useState(initialSellerStore);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Store Settings &amp; QR Standee</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Manage digital shop details &amp; print your offline customer QR standee banner.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Store Settings Form */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Store size={18} className="text-brandRed" /> Store Profile &amp; Geofencing
            </h3>
            {saved && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <CheckCircle2 size={14} /> Saved Successfully
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700">Shop Name</label>
              <input
                type="text"
                value={storeInfo.name}
                onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-brandRed font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700">Tagline / Slogan</label>
              <input
                type="text"
                value={storeInfo.tagline}
                onChange={(e) => setStoreInfo({ ...storeInfo, tagline: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-brandRed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700">WhatsApp / Phone</label>
                <input
                  type="text"
                  value={storeInfo.phone}
                  onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-brandRed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700">Delivery Radius (km)</label>
                <input
                  type="number"
                  value={storeInfo.deliveryRadiusKm}
                  onChange={(e) => setStoreInfo({ ...storeInfo, deliveryRadiusKm: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-brandRed"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700">Physical Store Address</label>
              <textarea
                rows={2}
                value={storeInfo.address}
                onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-brandRed resize-none"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-brandRed px-5 py-3 text-xs font-bold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition"
            >
              <Save size={16} />
              <span>Save Store Changes</span>
            </button>
          </form>
        </div>

        {/* QR Code Standee Generator Card */}
        <div className="lg:col-span-5 rounded-3xl border-2 border-brandRed bg-gradient-to-b from-[#fff5f5] to-white p-6 shadow-md text-center space-y-4">
          <span className="rounded-full bg-brandRed px-3 py-1 text-[10px] font-extrabold text-white uppercase tracking-wider">
            PRINTABLE COUNTER STANDEE
          </span>

          <h3 className="text-lg font-extrabold text-slate-900">
            Offline Counter QR Banner
          </h3>
          <p className="text-xs text-slate-600">
            Place this QR banner at your shop counter. Customers scan to browse your full online catalog on SeroFast!
          </p>

          {/* Simulated QR Code Banner */}
          <div className="mx-auto w-56 rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-center gap-1 text-xs font-extrabold text-brandRed">
              <span>➤ SEROFAST</span>
            </div>
            <div className="grid h-36 w-36 mx-auto place-items-center bg-slate-900 rounded-xl p-2">
              <QrCode size={110} className="text-white" />
            </div>
            <div className="text-[11px] font-bold text-slate-900">{storeInfo.name}</div>
            <div className="text-[9px] text-slate-500 font-semibold">Scan to Buy Online &amp; Get Delivered!</div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-black transition"
          >
            <Download size={16} />
            <span>Download High-Res Printable PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
