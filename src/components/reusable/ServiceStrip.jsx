import { Truck, RotateCcw, CreditCard, Headphones } from "lucide-react";

const services = [
  [Truck, "Fast Delivery", "On all orders"],
  [RotateCcw, "Easy Returns", "Within 7 days"],
  [CreditCard, "Secure Payment", "100% protected"],
  [Headphones, "24/7 Support", "We're always here"],
];

export default function ServiceStrip() {
  return (
    <div className="relative z-[3] mx-6 mb-6 grid min-h-[72px] grid-cols-4 items-center rounded-[18px] border border-white/80 bg-white/95 px-4 py-3 shadow-float backdrop-blur-md transition-all duration-300 hover:shadow-2xl max-1100:mx-4 max-1100:mb-4 max-1100:grid-cols-2 max-1100:gap-3 max-560:mx-3 max-560:mb-4 max-560:grid-cols-2 max-560:gap-2 max-560:p-2.5">
      {services.map(([Icon, title, text]) => (
        <div
          className="group flex cursor-pointer items-center gap-3 border-r border-[#eee] px-3 py-1 transition-all duration-200 hover:-translate-y-0.5 last:border-r-0 max-1100:border-r-0 max-1100:px-1.5 max-560:px-1"
          key={title}
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#FFF1F1] text-[#D22125] shadow-xs transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-[#D22125] group-hover:text-white group-hover:shadow-md group-hover:rotate-3 max-800:h-8 max-800:w-8">
            <Icon size={18} />
          </div>
          <div>
            <strong className="block text-[13px] font-bold text-textPrimary transition-colors duration-200 group-hover:text-brandRed max-800:text-[11px] max-380:text-[10px]">
              {title}
            </strong>
            <span className="mt-0.5 block text-[11px] text-textSecondary max-800:text-[9px] max-380:hidden">
              {text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
