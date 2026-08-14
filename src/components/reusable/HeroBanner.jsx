import { Search, Heart, ShoppingBag, ShieldCheck } from "lucide-react";
import ServiceStrip from "./ServiceStrip";

export default function HeroBanner() {
  return (
    <div className="relative grid min-h-[365px] grid-cols-[48%_52%] overflow-hidden rounded-bento bg-[#fff2f2] max-800:grid-cols-1">
      <div className="relative z-[2] bg-[linear-gradient(90deg,#fff1f1_0%,#fff4f4_76%,rgba(255,244,244,0.15)_100%)] px-[34px] pb-[28px] pl-[60px] pt-[34px] max-1100:pl-[35px] max-800:bg-[#fff2f2] max-800:p-[28px_24px_24px]">
        <h1 className="m-0 mb-[15px] text-[clamp(36px,4vw,46px)] font-extrabold leading-[0.99] tracking-[-0.9px] max-560:text-[35px] max-380:text-[31px]">
          Buy from Your
          <br />
          <span className="text-brandRed">Favorite Shops</span>
        </h1>
        <div className="grid gap-[9px]">
          <p className="m-0 flex items-center gap-3 text-[15px] text-[#404040] max-560:text-[13px] max-380:text-[12px]">
            <Search size={21} className="shrink-0 text-brandRed" />
            Discover products you love
          </p>
          <p className="m-0 flex items-center gap-3 text-[15px] text-[#404040] max-560:text-[13px] max-380:text-[12px]">
            <Heart size={21} className="shrink-0 text-brandRed" />
            Support your favorite local sellers
          </p>
          <p className="m-0 flex items-center gap-3 text-[15px] text-[#404040] max-560:text-[13px] max-380:text-[12px]">
            <ShoppingBag size={21} className="shrink-0 text-brandRed" />
            Shop easily from one place
          </p>
          <p className="m-0 flex items-center gap-3 text-[15px] text-[#404040] max-560:text-[13px] max-380:text-[12px]">
            <ShieldCheck size={21} className="shrink-0 text-brandRed" />
            Safe, secure &amp; reliable shopping
          </p>
        </div>
        <div className="mt-[25px] flex gap-5 max-560:gap-2.5">
          <a
            className="inline-flex h-[43px] min-w-[128px] items-center justify-center rounded-[7px] bg-brandRed text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(211,47,47,0.16)] hover:bg-brandRedDark max-560:min-w-0 max-560:flex-1"
            href="#products"
          >
            Shop Now
          </a>
          <a
            className="inline-flex h-[43px] min-w-[128px] items-center justify-center rounded-[7px] border border-[#d8d8d8] bg-white text-[14px] font-bold hover:border-brandRed hover:text-brandRed max-560:min-w-0 max-560:flex-1"
            href="#shops"
          >
            Explore Shops
          </a>
        </div>
        <div className="mt-[22px] flex items-center gap-2" aria-hidden="true">
          <span className="h-[7px] w-[21px] rounded-[8px] bg-primaryLight" />
          <span className="h-[7px] w-[7px] rounded-full bg-[#d5d5d5]" />
          <span className="h-[7px] w-[7px] rounded-full bg-[#d5d5d5]" />
        </div>
      </div>

      <div className="relative min-h-[365px] overflow-hidden max-800:min-h-[290px] max-560:min-h-[255px]">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=90"
          alt="Customer shopping online from home"
          className="block h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#fff4f4_0%,rgba(255,244,244,0.45)_12%,transparent_35%)]" />
        <ServiceStrip />
      </div>
    </div>
  );
}
