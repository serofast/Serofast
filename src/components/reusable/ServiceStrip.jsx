import { Truck, RotateCcw, CreditCard, Headphones } from "lucide-react";

const services = [
  [Truck, "Fast Delivery", "On all orders"],
  [RotateCcw, "Easy Returns", "Within 7 days"],
  [CreditCard, "Secure Payment", "100% protected"],
  [Headphones, "24/7 Support", "We're always here"],
];

export default function ServiceStrip() {
  return (
    <div className="absolute bottom-5 left-[8%] right-[8%] z-[3] grid min-h-[69px] grid-cols-4 items-center rounded-[13px] bg-white/[0.96] px-[14px] py-[10px] shadow-float max-800:bottom-[14px] max-800:left-[4%] max-800:right-[4%] max-560:relative max-560:bottom-auto max-560:left-auto max-560:right-auto max-560:-mt-7 max-560:mx-3 max-560:mb-3 max-560:w-[calc(100%-24px)] max-560:grid-cols-2 max-560:gap-2 max-560:p-[10px]">
      {services.map(([Icon, title, text]) => (
        <div
          className="flex items-center gap-[11px] border-r border-[#eee] px-[13px] last:border-r-0 max-800:px-2 max-560:border-r-0 max-560:px-[5px] max-560:py-[3px] max-560:[&:nth-child(1)]:border-b max-560:[&:nth-child(1)]:border-b-[#eee] max-560:[&:nth-child(1)]:pb-2 max-560:[&:nth-child(2)]:border-b max-560:[&:nth-child(2)]:border-b-[#eee] max-560:[&:nth-child(2)]:pb-2 max-560:[&:nth-child(n+3)]:pt-2"
          key={title}
        >
          <div className="grid h-[35px] w-[35px] shrink-0 place-items-center rounded-full bg-promoHighlight text-brandRed max-800:h-[30px] max-800:w-[30px]">
            <Icon size={20} />
          </div>
          <div>
            <strong className="block text-[12px] max-800:text-[10px] max-380:text-[9px]">
              {title}
            </strong>
            <span className="mt-1 block text-[10px] text-textSecondary max-800:text-[8px] max-380:hidden">
              {text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
