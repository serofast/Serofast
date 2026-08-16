import { Star, UsersRound, Smartphone, ShieldCheck } from "lucide-react";

export default function ShopCard({ shop, onOpenAppTeaser }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onOpenAppTeaser) {
      onOpenAppTeaser(shop.name);
    }
  };

  return (
    <article
      onClick={handleClick}
      className="group relative cursor-pointer overflow-hidden rounded-[16px] border border-[#ededed] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brandRed/30 hover:shadow-[0_18px_36px_rgba(210,33,37,0.12)]"
    >
      <div className="relative h-[111px] overflow-visible max-560:h-[105px]">
        <div className="h-full w-full overflow-hidden rounded-t-[15px]">
          <img
            src={shop.image}
            alt={shop.name}
            loading="lazy"
            className="block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
          />
        </div>
        <div className="absolute right-2 top-[9px] flex items-center gap-1 rounded-[14px] bg-white/95 px-2 py-[5px] text-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-xs transition-transform duration-300 group-hover:scale-105">
          <Star size={14} fill="#f59e0b" className="text-amber-500" />
          <strong className="text-textPrimary">{shop.rating}</strong>
          <span className="text-[#777]">({shop.reviews})</span>
        </div>

        {/* Verified Shop Owner Badge */}
        <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] font-bold text-emerald-300 backdrop-blur-sm shadow-sm">
          <ShieldCheck size={11} className="text-emerald-400" />
          Verified Shop Owner
        </div>

        <img
          className="absolute bottom-[-18px] left-[14px] h-[50px] w-[50px] rounded-full border-4 border-white object-cover shadow-[0_3px_10px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out group-hover:scale-110 group-hover:border-brandRed"
          src={shop.avatar}
          alt=""
          loading="lazy"
        />
      </div>
      <div className="px-3 pb-[12px] pt-[27px] max-560:px-2.5">
        <h3 className="m-0 mb-[3px] text-[14px] font-bold text-textPrimary transition-colors duration-200 group-hover:text-brandRed">
          {shop.name}
        </h3>
        <strong className="block text-[12px] text-brandRed">
          {shop.tagline}
        </strong>
        <p className="mb-2.5 mt-2 min-h-[35px] text-[11px] leading-[1.45] text-[#555] max-560:min-h-[50px] max-380:text-[10px]">
          {shop.description}
        </p>
        
        <div className="flex flex-wrap items-center justify-between gap-x-1 gap-y-1 border-t border-slate-100 pt-2 text-[9px] text-[#777]">
          <span className="flex min-w-0 items-center gap-1 whitespace-nowrap">
            <UsersRound size={13} className="shrink-0 text-[#999] group-hover:text-brandRed transition-colors duration-200" />
            <span className="min-w-0 truncate">{shop.followers} Followers</span>
          </span>
          <span className="flex items-center gap-1 text-slate-900 font-bold group-hover:text-brandRed shrink-0">
            <Smartphone size={11} />
            Shop via App
          </span>
        </div>
      </div>
    </article>
  );
}
