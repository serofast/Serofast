import { Star, UsersRound, Smartphone, ShieldCheck, MapPin } from "lucide-react";

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
      className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brandRed/25 hover:shadow-[0_16px_36px_rgba(210,33,37,0.1)]"
    >
      {/* Cover Image */}
      <div className="relative h-[120px] overflow-hidden max-560:h-[108px]">
        <div className="h-full w-full overflow-hidden rounded-t-[19px]">
          <img
            src={shop.image}
            alt={shop.name}
            loading="lazy"
            className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Verified Badge */}
        <div className="absolute left-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-slate-900/75 px-2.5 py-1 text-[9px] font-bold text-emerald-300 backdrop-blur-sm">
          <ShieldCheck size={10} className="text-emerald-400" />
          Verified
        </div>

        {/* Rating Badge */}
        <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
          <Star size={12} fill="#f59e0b" className="text-amber-500" />
          <strong className="text-[#191616]">{shop.rating}</strong>
          <span className="text-[#8b8282]">({shop.reviews})</span>
        </div>

        {/* Avatar */}
        <div className="absolute bottom-[-20px] left-3.5">
          <img
            className="h-[48px] w-[48px] rounded-full border-[3px] border-white object-cover shadow-[0_3px_12px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:scale-110 group-hover:border-brandRed/30"
            src={shop.avatar}
            alt=""
            loading="lazy"
          />
        </div>
      </div>

      {/* Card Body */}
      <div className="px-3.5 pt-[28px] pb-3.5 max-560:px-3">
        <h3 className="m-0 text-[14px] font-bold text-[#191616] transition-colors group-hover:text-brandRed">
          {shop.name}
        </h3>
        <strong className="mt-0.5 block text-[11px] font-semibold text-brandRed">
          {shop.tagline}
        </strong>

        <p className="mt-2 min-h-[32px] text-[11px] leading-[1.5] text-[#8b8282] line-clamp-2">
          {shop.description}
        </p>

        {/* Footer Info */}
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
          <span className="flex items-center gap-1 text-[10px] font-medium text-[#8b8282]">
            <MapPin size={10} className="text-brandRed/50" />
            {shop.location || "Campus Area"}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-brandRed/70 transition-colors group-hover:text-brandRed">
            <Smartphone size={10} />
            Shop via App
          </span>
        </div>
      </div>
    </article>
  );
}
