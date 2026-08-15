import { useState } from "react";
import { ArrowLeft, Rocket, MapPin, Truck, RotateCcw, ShieldCheck, CheckCircle2, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LaunchReviewStep({ form, onBack, onLaunch }) {
  const [submitting, setSubmitting] = useState(false);
  const [launched, setLaunched] = useState(false);
  const navigate = useNavigate();

  const handleCreateShop = () => {
    setSubmitting(true);
    setTimeout(() => {
      onLaunch();
      setLaunched(true);
      setSubmitting(false);
    }, 1200);
  };

  const coverUrl = form.cover || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80";
  const logoUrl = form.logo || "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&q=80";

  if (launched) {
    return (
      <div className="py-8 space-y-6 text-center animate-scale-up font-sans max-w-xl mx-auto">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 size={48} />
        </div>

        <div>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            🎉 Setup Complete — Shop Registered
          </span>
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-900">
            Your Shop is Live!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 font-normal max-w-md mx-auto">
            <strong className="text-slate-900 font-bold">“{form.shopName || "Urban Threads"}”</strong> has been registered on SeroFast and synced to the Supabase database.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs text-left space-y-2 text-xs font-medium">
          <div className="flex justify-between items-center py-1 border-b border-slate-100">
            <span className="text-slate-500">Store Name:</span>
            <span className="text-slate-900 font-bold">{form.shopName || "Urban Threads"}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-100">
            <span className="text-slate-500">Owner:</span>
            <span className="text-slate-900 font-semibold">{form.ownerName || "Ramesh Kumar"}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-100">
            <span className="text-slate-500">Settlement UPI:</span>
            <span className="font-mono text-brandRed font-bold">{form.upiId || "store@hdfcbank"}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/shop-owner/dashboard")}
          className="min-h-[50px] w-full flex items-center justify-center gap-2 rounded-xl bg-brandRed px-6 text-sm font-bold text-white shadow-lg shadow-brandRed/20 hover:bg-brandRedDark transition cursor-pointer"
        >
          <Store size={18} />
          <span>Go to Seller Dashboard</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-2xl mx-auto">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brandRed">Step 6 of 6</span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Review &amp; Launch</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
          Review your shop card preview before publishing your store to campus shoppers.
        </p>
      </div>

      {/* Live Shop Preview Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-md">
        <div className="bg-slate-100 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/60 flex items-center justify-between">
          <span>Live Customer Shop Preview</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <ShieldCheck size={12} /> Verified Seller
          </span>
        </div>

        {/* Cover Image & Logo Overlay */}
        <div className="relative h-40 sm:h-48 w-full bg-slate-200">
          <img src={coverUrl} alt="Cover" className="h-full w-full object-cover" />
          <div className="absolute -bottom-6 left-5 h-16 w-16 rounded-xl border-2 border-white bg-white shadow-md overflow-hidden">
            <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="pt-8 p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{form.shopName || "Urban Threads"}</h3>
              <span className="rounded-full bg-brandRed/10 px-2 py-0.5 text-[10px] font-bold text-brandRed">
                {form.category || "Fashion"}
              </span>
            </div>
            {form.tagline && <p className="text-xs font-medium text-slate-600 mt-0.5">{form.tagline}</p>}
            <p className="text-xs text-slate-500 font-normal mt-1.5 leading-relaxed">
              {form.description || "Official campus store providing quality fashion and accessories."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-100">
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
                <MapPin size={13} className="text-brandRed" /> Location
              </span>
              <p className="text-slate-500 text-[11px] font-normal">{form.city || "Chennai"}, {form.pincode || "600025"}</p>
            </div>

            <div className="space-y-0.5">
              <span className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
                <Truck size={13} className="text-blue-600" /> Delivery
              </span>
              <p className="text-slate-500 text-[11px] font-normal">₹{form.shippingFee || "20"} ({form.prepTime || "15-30 mins"})</p>
            </div>

            <div className="space-y-0.5">
              <span className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
                <RotateCcw size={13} className="text-emerald-600" /> Policy
              </span>
              <p className="text-slate-500 text-[11px] font-normal">{form.returnPolicy || "7 Days Returns"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[48px] flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleCreateShop}
          disabled={submitting}
          className="min-h-[50px] flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-brandRed px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brandRed/20 hover:bg-brandRedDark transition cursor-pointer disabled:opacity-50"
        >
          <Rocket size={18} />
          <span>{submitting ? "Publishing Store..." : "Create My Shop"}</span>
        </button>
      </div>
    </div>
  );
}
