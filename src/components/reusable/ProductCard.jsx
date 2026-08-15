import { Heart, ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <article className="group cursor-pointer overflow-hidden rounded-[16px] border border-transparent bg-[#fafafa] shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brandRed/20 hover:bg-white hover:shadow-[0_16px_32px_rgba(210,33,37,0.08)]">
      <div className="relative h-[200px] overflow-hidden bg-[#f7f7f7] max-560:h-[145px]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="block h-full w-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-108"
        />
      </div>
      <div className="px-3 pb-3 pt-[11px] max-560:p-[9px]">
        <h3 className="m-0 mb-2 text-[12px] font-semibold text-textPrimary transition-colors duration-200 group-hover:text-brandRed max-560:text-[10px]">
          {product.name}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <strong className="text-[13px] font-bold text-brandRed">{product.price}</strong>
          <div className="flex gap-1.5">
            <button
              aria-label={`Like ${product.name}`}
              className="grid h-[28px] w-[28px] place-items-center rounded-[8px] border border-[#e2e2e2] bg-white text-[#666] shadow-2xs transition-all duration-200 hover:scale-110 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 active:scale-90"
            >
              <Heart size={16} />
            </button>
            <button
              aria-label={`Add ${product.name} to cart`}
              className="grid h-[28px] w-[28px] place-items-center rounded-[8px] border border-[#e2e2e2] bg-white text-[#666] shadow-2xs transition-all duration-200 hover:scale-110 hover:border-brandRed hover:bg-brandRed hover:text-white active:scale-90"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
