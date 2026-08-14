import { Check } from "lucide-react";

const labels = ["Why Join", "Shop Details", "Products", "Launch"];

export default function ProgressSteps({ step }) {
  const progress = ((step - 1) / 3) * 100;

  return (
    <div className="mb-8 lg:mb-10">
      <div className="mb-4 flex items-center justify-between text-xs font-bold tracking-[0.04em] text-textSecondary lg:text-sm">
        <span>{step === 1 ? "Getting Started" : "Create Your Shop"}</span>
        <strong className="text-brandRed">Step {step} of 4</strong>
      </div>

      <div className="relative grid grid-cols-4 gap-2 md:gap-6">
        <div className="absolute left-[12.5%] right-[12.5%] top-[17px] h-0.5 rounded-full bg-lightBorder lg:top-[21px]">
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
            <div key={label} className="relative z-10 flex flex-col items-center gap-2 text-center">
              <div
                className={`grid h-9 w-9 place-items-center rounded-full border-2 text-sm font-bold transition-colors lg:h-11 lg:w-11 lg:text-base ${
                  active || complete
                    ? "border-brandRed bg-brandRed text-white"
                    : "border-lightBorder bg-white text-textSecondary"
                }`}
              >
                {complete ? <Check size={18} /> : number}
              </div>
              <span
                className={`text-[11px] font-semibold leading-tight md:text-xs lg:text-sm ${
                  active || complete ? "text-brandRed" : "text-textSecondary"
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
