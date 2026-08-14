import { Search, Heart, ShoppingBag, ShieldCheck } from "lucide-react";
import ServiceStrip from "./ServiceStrip";

export default function HeroBanner() {
  return (
    <div className="relative grid min-h-[calc(100svh-119px)] max-800:min-h-[calc(100svh-90px)] w-full grid-cols-1 lg:grid-cols-[48%_52%] xl:grid-cols-[46%_54%] overflow-hidden bg-[#fff2f2]">
      {/* Left Column: Content */}
      <div className="relative z-[2] flex flex-col justify-center bg-[linear-gradient(90deg,#fff1f1_0%,#fff4f4_80%,rgba(255,244,244,0.3)_100%)] px-6 py-12 sm:px-12 md:px-16 lg:px-14 xl:px-20 lg:py-16 max-800:bg-[#fff2f2] max-800:p-[32px_24px_28px]">
        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#D22125]/20 bg-[#D22125]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D22125] max-800:mb-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#D22125]" />
          Hyperlocal Marketplace
        </div>

        <h1 className="m-0 mb-4 text-[clamp(36px,4.2vw,54px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-textPrimary max-560:text-[33px] max-380:text-[29px]">
          Buy from Your
          <br />
          <span className="text-[#D22125]">Favorite Shops</span>
        </h1>

        <div className="grid gap-3.5 my-2 max-560:gap-2.5">
          <p className="m-0 flex items-center gap-3 text-[15px] font-medium text-[#404040] max-560:text-[13px] max-380:text-[12px]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#ffe0e0] bg-white text-[#D22125] shadow-sm">
              <Search size={18} />
            </span>
            <span>Discover products you love</span>
          </p>

          <p className="m-0 flex items-center gap-3 text-[15px] font-medium text-[#404040] max-560:text-[13px] max-380:text-[12px]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#ffe0e0] bg-white text-[#D22125] shadow-sm">
              <Heart size={18} />
            </span>
            <span>Get your opportunity and start earning</span>
          </p>

          <p className="m-0 flex items-center gap-3 text-[15px] font-medium text-[#404040] max-560:text-[13px] max-380:text-[12px]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#ffe0e0] bg-white text-[#D22125] shadow-sm">
              <ShoppingBag size={18} />
            </span>
            <span>Order now &amp; get delivered within hours</span>
          </p>

          <p className="m-0 flex items-center gap-3 text-[15px] font-medium text-[#404040] max-560:text-[13px] max-380:text-[12px]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#ffe0e0] bg-white text-[#D22125] shadow-sm">
              <ShieldCheck size={18} />
            </span>
            <span>Shop from your favorite shops and friends</span>
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 max-560:gap-2.5">
          <a
            className="inline-flex h-[48px] min-w-[140px] items-center justify-center rounded-[8px] bg-[#D22125] px-7 text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(210,33,37,0.25)] transition-all duration-200 hover:bg-[#b81b1f] hover:shadow-[0_14px_28px_rgba(210,33,37,0.35)] hover:-translate-y-0.5 active:translate-y-0 max-560:min-w-0 max-560:flex-1"
            href="#products"
          >
            Shop Now
          </a>
          <a
            className="inline-flex h-[48px] min-w-[140px] items-center justify-center rounded-[8px] border border-[#d8d8d8] bg-white px-7 text-[15px] font-bold text-textPrimary shadow-sm transition-all duration-200 hover:border-[#D22125] hover:text-[#D22125] hover:-translate-y-0.5 max-560:min-w-0 max-560:flex-1"
            href="#shops"
          >
            Explore Shops
          </a>
        </div>

        <div className="mt-7 flex items-center gap-2" aria-hidden="true">
          <span className="h-2 w-7 rounded-full bg-[#D22125]" />
          <span className="h-2 w-2 rounded-full bg-[#d5d5d5]" />
          <span className="h-2 w-2 rounded-full bg-[#d5d5d5]" />
        </div>
      </div>

      {/* Right Column: Hero Visual & Service Strip */}
      <div className="relative flex min-h-[380px] w-full flex-col justify-end overflow-hidden lg:min-h-full">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=90"
          alt="Customer shopping online from home"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#fff2f2_0%,rgba(255,242,242,0.45)_15%,transparent_40%)] max-lg:bg-[linear-gradient(180deg,#fff2f2_0%,rgba(255,242,242,0.3)_30%,transparent_70%)]" />
        <ServiceStrip />
      </div>
    </div>
  );
}
