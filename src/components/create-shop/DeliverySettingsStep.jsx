import { useState } from "react";
import { ArrowLeft, ArrowRight, Truck, Clock, ShieldCheck } from "lucide-react";

export default function DeliverySettingsStep({ form, updateForm, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.prepTime) errs.prepTime = "Please select preparation time";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans max-w-2xl mx-auto">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brandRed">Step 5 of 6</span>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Delivery Settings</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
          Configure fulfillment rules, shipping fee thresholds, prep times, and return policies.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs space-y-4">
        {/* Shipping Method & Radius */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Fulfillment Method <span className="text-brandRed">*</span>
            </label>
            <select
              value={form.shippingMethod || "Campus Delivery + Store Pickup"}
              onChange={(e) => updateForm({ shippingMethod: e.target.value })}
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed"
            >
              <option value="Campus Delivery + Store Pickup">Campus Runner Delivery + Self Pickup</option>
              <option value="Store Pickup Only">Self Pickup Only at Counter</option>
              <option value="Pan-City Delivery">Pan-City Express Delivery</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Delivery Radius
            </label>
            <select
              value={form.deliveryRadius || "5 km"}
              onChange={(e) => updateForm({ deliveryRadius: e.target.value })}
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed"
            >
              <option value="Entire Campus">Entire Campus &amp; Hostels</option>
              <option value="3 km">Within 3 km Radius</option>
              <option value="5 km">Within 5 km Radius</option>
              <option value="10 km">Within 10 km Radius</option>
            </select>
          </div>
        </div>

        {/* Shipping Fee & Free Shipping Threshold */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Standard Shipping Fee (₹)
            </label>
            <input
              type="number"
              value={form.shippingFee !== undefined ? form.shippingFee : "20"}
              onChange={(e) => updateForm({ shippingFee: e.target.value })}
              placeholder="20"
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Free Shipping Above (₹)
            </label>
            <input
              type="number"
              value={form.freeShippingThreshold !== undefined ? form.freeShippingThreshold : "499"}
              onChange={(e) => updateForm({ freeShippingThreshold: e.target.value })}
              placeholder="499"
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed"
            />
          </div>
        </div>

        {/* Prep Time */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Estimated Order Preparation Time <span className="text-brandRed">*</span>
          </label>
          <select
            value={form.prepTime || "15-30 mins"}
            onChange={(e) => updateForm({ prepTime: e.target.value })}
            className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed"
          >
            <option value="15-30 mins">Instant (15-30 mins)</option>
            <option value="1-2 hours">Same Day (1-2 hours)</option>
            <option value="24 hours">Next Day (24 hours)</option>
          </select>
        </div>

        {/* Return & Cancellation Policy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Return Policy
            </label>
            <select
              value={form.returnPolicy || "7 Days Easy Returns"}
              onChange={(e) => updateForm({ returnPolicy: e.target.value })}
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed"
            >
              <option value="7 Days Easy Returns">7 Days Easy Returns</option>
              <option value="3 Days Replacement Only">3 Days Replacement Only</option>
              <option value="No Returns">No Returns (Final Sale)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Cancellation Policy
            </label>
            <select
              value={form.cancellationPolicy || "Free cancellation before dispatch"}
              onChange={(e) => updateForm({ cancellationPolicy: e.target.value })}
              className="mt-1.5 min-h-[48px] w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brandRed"
            >
              <option value="Free cancellation before dispatch">Free cancellation before dispatch</option>
              <option value="Instant cancellation">Instant cancellation anytime</option>
            </select>
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
          type="submit"
          className="min-h-[48px] flex items-center justify-center gap-2 rounded-xl bg-brandRed px-6 py-3 text-sm font-bold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition cursor-pointer"
        >
          <span>Step 6 — Review &amp; Launch</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
