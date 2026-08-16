import { Store, Sparkles, MapPin } from "lucide-react";

export default function LogoMarquee() {
  const partners = [
    { name: "Urban Styles", category: "Fashion & Apparel", location: "Main Market", rating: "4.9 ★" },
    { name: "Tech Haven", category: "Mobiles & Laptops", location: "Campus Hub", rating: "4.8 ★" },
    { name: "Glow & Grace", category: "Cosmetics & Beauty", location: "East Plaza", rating: "4.9 ★" },
    { name: "Gadget Sphere", category: "Smart Home Tech", location: "North Square", rating: "4.7 ★" },
    { name: "Elite Fashion", category: "Boutique & Wear", location: "Central Avenue", rating: "5.0 ★" },
    { name: "Home Nest", category: "Décor & Living", location: "Station Road", rating: "4.8 ★" },
    { name: "SRM Campus Store", category: "Stationery & Books", location: "Student Hub", rating: "4.9 ★" },
    { name: "Vellore Electronics", category: "Gadgets & Spares", location: "Town Center", rating: "4.8 ★" },
  ];

  const marqueeItems = [...partners, ...partners];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#fafafa] via-white to-[#fafafa] py-10 border-y border-[#eee]">
      {/* Edge gradient blur overlays */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white via-white/80 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white via-white/80 to-transparent" />

      <div className="mb-6 flex items-center justify-center gap-2 text-center text-xs font-extrabold uppercase tracking-widest text-[#777] max-560:mb-4 max-560:text-[10px] max-560:tracking-wide">
        <Sparkles size={14} className="text-brandRed" />
        <span>Trusted by 500+ Verified Hyperlocal Partner Stores &amp; Campus Hubs</span>
      </div>

      <div className="flex overflow-hidden">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] hover:[animation-play-state:paused] gap-6">
          {marqueeItems.map((item, idx) => (
            <div
              key={idx}
              className="group flex shrink-0 items-center gap-3.5 rounded-2xl border border-[#eaeaea] bg-white px-5 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-brandRed/40 hover:bg-[#fff9f9] hover:shadow-[0_8px_24px_rgba(210,33,37,0.08)]"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-promoHighlight text-brandRed transition-transform duration-300 group-hover:scale-110 group-hover:bg-brandRed group-hover:text-white">
                <Store size={20} />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-textPrimary transition-colors group-hover:text-brandRed">
                    {item.name}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                    {item.rating}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#777]">
                  <span>{item.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin size={10} className="text-brandRed" />
                    {item.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
