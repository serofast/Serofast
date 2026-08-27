import { Store, Sparkles, MapPin, Star, ShieldCheck } from "lucide-react";

export default function LogoMarquee() {
  const partners = [
    { name: "Urban Styles", category: "Fashion & Apparel", location: "Main Market", rating: "4.9" },
    { name: "Tech Haven", category: "Mobiles & Laptops", location: "Campus Hub", rating: "4.8" },
    { name: "Glow & Grace", category: "Cosmetics & Beauty", location: "East Plaza", rating: "4.9" },
    { name: "Gadget Sphere", category: "Smart Home Tech", location: "North Square", rating: "4.7" },
    { name: "Elite Fashion", category: "Boutique & Wear", location: "Central Avenue", rating: "5.0" },
    { name: "Home Nest", category: "Décor & Living", location: "Station Road", rating: "4.8" },
    { name: "SRM Campus Store", category: "Stationery & Books", location: "Student Hub", rating: "4.9" },
    { name: "Vellore Electronics", category: "Gadgets & Spares", location: "Town Center", rating: "4.8" },
  ];

  const marqueeItems = [...partners, ...partners];

  return (
    <section className="relative w-full overflow-hidden bg-white border-y border-[#f0f0f0] py-10 sm:py-12">
      {/* Edge fade overlays */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-28 bg-gradient-to-r from-white via-white/95 to-transparent sm:w-36" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-28 bg-gradient-to-l from-white via-white/95 to-transparent sm:w-36" />

      {/* Section Label */}
      <div className="mb-8 flex items-center justify-center gap-2.5 text-center">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-slate-200" />
        <Sparkles size={13} className="text-brandRed/50" />
        <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#999]">
          Trusted by 500+ Verified Hyperlocal Partner Stores
        </span>
        <Sparkles size={13} className="text-brandRed/50" />
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-slate-200" />
      </div>

      {/* Marquee Track */}
      <div className="flex overflow-hidden">
        <div className="animate-marquee pause-on-hover flex gap-4">
          {marqueeItems.map((item, idx) => (
            <div
              key={idx}
              className="group flex shrink-0 items-center gap-3.5 rounded-[18px] border border-slate-100 bg-white px-5 py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-brandRed/25 hover:shadow-[0_8px_28px_rgba(210,33,37,0.07)]"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-promoHighlight text-brandRed transition-all duration-300 group-hover:bg-brandRed group-hover:text-white group-hover:scale-105">
                <Store size={19} />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#191616] whitespace-nowrap transition-colors group-hover:text-brandRed">
                    {item.name}
                  </span>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 border border-amber-100">
                    <Star size={8} fill="#f59e0b" className="text-amber-500" />
                    {item.rating}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#8b8282]">
                  <span>{item.category}</span>
                  <span className="text-slate-200">•</span>
                  <MapPin size={9} className="text-brandRed/60" />
                  <span>{item.location}</span>
                </div>
              </div>
              <ShieldCheck size={14} className="ml-1 shrink-0 text-emerald-400/0 transition-all duration-300 group-hover:text-emerald-500 group-hover:scale-110" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
