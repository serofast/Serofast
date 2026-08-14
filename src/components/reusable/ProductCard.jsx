import { Heart, ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-[13px] bg-[#fafafa] transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-bento">
      <div className="h-[200px] overflow-hidden bg-[#f7f7f7] max-560:h-[145px]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="block h-full w-full object-contain mix-blend-multiply"
        />
      </div>
      <div className="px-3 pb-3 pt-[11px] max-560:p-[9px]">
        <h3 className="m-0 mb-2.5 text-[11px] font-semibold max-560:text-[10px]">
          {product.name}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <strong className="text-[12px] text-brandRed">{product.price}</strong>
          <div className="flex gap-[5px]">
            <button
              aria-label={`Like ${product.name}`}
              className="grid h-[27px] w-[27px] place-items-center rounded-[7px] border border-[#ddd] bg-white text-[#555] hover:border-[#efb0b0] hover:text-brandRed"
            >
              <Heart size={19} />
            </button>
            <button
              aria-label={`Add ${product.name} to cart`}
              className="grid h-[27px] w-[27px] place-items-center rounded-[7px] border border-[#ddd] bg-white text-[#555] hover:border-[#efb0b0] hover:text-brandRed"
            >
              <ShoppingCart size={19} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
