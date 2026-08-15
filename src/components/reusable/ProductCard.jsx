import { Heart, ShoppingCart, Smartphone } from "lucide-react";

export default function ProductCard({ product, onOpenAppTeaser }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onOpenAppTeaser) {
      onOpenAppTeaser(product.name);
    }
  };

  return (
    <article
      onClick={handleClick}
      className="group relative cursor-pointer overflow-hidden rounded-[16px] border border-slate-100 bg-[#fafafa] shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brandRed/30 hover:bg-white hover:shadow-[0_16px_32px_rgba(210,33,37,0.12)]"
    >
      {/* App Only Badge Overlay on Hover */}
      <div className="absolute top-2 left-2 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/90 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm shadow-md">
          <Smartphone size={11} className="text-amber-400" />
          App Exclusive
        </span>
      </div>

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
          <strong className="text-[13px] font-bold text-brandRed">₹{product.price}</strong>
          <div className="flex gap-1.5">
            <button
              onClick={handleClick}
              aria-label={`Like ${product.name}`}
              className="grid h-[28px] w-[28px] place-items-center rounded-[8px] border border-[#e2e2e2] bg-white text-[#666] shadow-2xs transition-all duration-200 hover:scale-110 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 active:scale-90 max-560:h-[32px] max-560:w-[32px]"
            >
              <Heart size={16} />
            </button>
            <button
              onClick={handleClick}
              aria-label={`Add ${product.name} to cart`}
              className="grid h-[28px] w-[28px] place-items-center rounded-[8px] border border-[#e2e2e2] bg-white text-[#666] shadow-2xs transition-all duration-200 hover:scale-110 hover:border-brandRed hover:bg-brandRed hover:text-white active:scale-90 max-560:h-[32px] max-560:w-[32px]"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
