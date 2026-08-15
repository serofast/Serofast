import { Check } from "lucide-react";

const labels = [
  "Shop Details",
  "Seller Info",
  "Business",
  "Payment",
  "Delivery",
  "Review & Launch",
];

export default function ProgressSteps({ step }) {
  const progress = ((step - 1) / 5) * 100;

  return (
    <div className="mb-6 lg:mb-8 font-sans">
      <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
        <span>Seller Setup Wizard</span>
        <span className="text-brandRed">Step {step} of 6</span>
      </div>

      {/* Progress Bar Line */}
      <div className="relative grid grid-cols-6 gap-1 md:gap-4">
        <div className="absolute left-[8.3%] right-[8.3%] top-[14px] h-0.5 rounded-full bg-slate-200 lg:top-[18px]">
          <span
            className="block h-full rounded-full bg-brandRed transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {labels.map((label, index) => {
          const number = index + 1;
          const complete = number < step;
          const active = number === step;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center gap-1.5 text-center">
              <div
                className={`grid h-7 w-7 sm:h-9 sm:w-9 place-items-center rounded-full border-2 text-xs sm:text-sm font-bold transition-all ${
                  active || complete
                    ? "border-brandRed bg-brandRed text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                {complete ? <Check size={14} /> : number}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-semibold leading-tight hidden sm:block ${
                  active || complete ? "text-brandRed" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
