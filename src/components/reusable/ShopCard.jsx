import { Star, UsersRound } from "lucide-react";

export default function ShopCard({ shop }) {
  return (
    <article className="overflow-hidden rounded-[12px] border border-[#ededed] bg-white shadow-[0_3px_12px_rgba(0,0,0,0.025)] transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-hover">
      <div className="relative h-[111px] overflow-visible max-560:h-[105px]">
        <img
          src={shop.image}
          alt={shop.name}
          loading="lazy"
          className="block h-full w-full object-cover"
        />
        <div className="absolute right-2 top-[9px] flex items-center gap-1 rounded-[14px] bg-white px-2 py-[5px] text-[10px] shadow-[0_2px_7px_rgba(0,0,0,0.1)]">
          <Star size={14} fill="currentColor" />
          <strong>{shop.rating}</strong>
          <span className="text-[#777]">({shop.reviews})</span>
        </div>
        <img
          className="absolute bottom-[-18px] left-[14px] h-[50px] w-[50px] rounded-full border-4 border-white object-cover shadow-[0_2px_7px_rgba(0,0,0,0.12)]"
          src={shop.avatar}
          alt=""
          loading="lazy"
        />
      </div>
      <div className="px-3 pb-[11px] pt-[27px] max-560:px-2.5">
        <h3 className="m-0 mb-[3px] text-[14px]">{shop.name}</h3>
        <strong className="block text-[12px] text-brandRed">
          {shop.tagline}
        </strong>
        <p className="mb-2.5 mt-2 min-h-[35px] text-[11px] leading-[1.45] text-[#555] max-560:min-h-[50px] max-380:text-[10px]">
          {shop.description}
        </p>
        <span className="flex items-center gap-1 whitespace-nowrap text-[9px] text-[#777]">
          <UsersRound size={14} />
          Followed by {shop.followers}
        </span>
      </div>
    </article>
  );
}
