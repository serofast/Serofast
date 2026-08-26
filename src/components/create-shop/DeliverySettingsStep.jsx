import { ArrowLeft, ArrowRight, Truck, Clock, MapPin, CheckCircle2, Sparkles } from "lucide-react";

export default function DeliverySettingsStep({ onNext, onBack }) {
  return (
    <div className="space-y-6 font-sans w-full max-w-full lg:max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brandRed">Step 4 of 5</span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Campus Delivery &amp; Logistics</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
          SeroFast handles 100% of campus order pickups and deliveries. No logistics setup needed from sellers!
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
        {/* Highlight 1: SeroFast Runners Pickup */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Truck size={18} className="text-blue-600" /> SeroFast Campus Runners
            </span>
            <span className="rounded-full bg-blue-600 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
              Automated Pickups
            </span>
          </div>
          <p className="text-xs text-blue-950 font-normal leading-relaxed">
            When a student places an order, a SeroFast runner arrives at your shop location to pick up the packaged item.
          </p>
        </div>

        {/* Highlight 2: Express 15-30 Min Delivery */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Clock size={18} className="text-amber-600" /> Express 15–30 Minute Delivery
            </span>
            <span className="rounded bg-amber-600 text-white px-2 py-0.5 text-[10px] font-bold">
              Hostel Delivery
            </span>
          </div>
          <p className="text-xs text-amber-950 font-normal leading-relaxed">
            Runners deliver directly to student hostel rooms, academic blocks, and campus gates with live order tracking.
          </p>
        </div>

        {/* Highlight 3: Seller Responsibilities */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <MapPin size={16} className="text-brandRed" /> Simple Seller Fulfillment Rules
          </span>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium">Accept incoming order notification on your Seller Dashboard</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium">Package the product securely with customer order slip</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium">Hand over package to SeroFast runner upon arrival</span>
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
          onClick={onNext}
          className="min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-brandRed px-6 py-3 text-sm font-bold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition cursor-pointer"
        >
          <span>Step 5 — Review &amp; Launch</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
