import { Check } from "lucide-react";

const labels = ["Your Shop", "About You", "Products", "Payments", "Launch"];

export default function ProgressSteps({ step }) {
  const progress = ((step - 1) / 4) * 100;

  return (
    <div className="mb-8 font-sans">
      <div className="relative grid grid-cols-5 gap-1 md:gap-4">
        <div className="absolute left-[10%] right-[10%] top-[16px] h-[3px] rounded-full bg-slate-100">
          <span
            className="block h-full rounded-full bg-brandRed transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {labels.map((label, i) => {
          const num = i + 1;
          const done = num < step;
          const active = num === step;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center gap-2 text-center">
              <div
                className={`grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                  active
                    ? "border-2 border-brandRed bg-brandRed text-white shadow-md shadow-brandRed/25 scale-110"
                    : done
                    ? "border-2 border-brandRed bg-brandRed text-white"
                    : "border-2 border-slate-200 bg-white text-slate-400"
                }`}
              >
                {done ? <Check size={15} strokeWidth={3} /> : num}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-semibold leading-tight hidden sm:block ${
                  active ? "text-brandRed" : done ? "text-slate-700" : "text-slate-400"
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
