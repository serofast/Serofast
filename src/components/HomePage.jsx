import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Clock3,
  Download,
  Gift,
  MapPin,
  Menu,
  MoveUpRight,
  Play,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  Ticket,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { freeBuffDeals, shops } from "./../data/landing";
import { Footer, Header, MobileBottomNav, ScrollToTop, AppTeaserModal, FreeBuffClaimModal } from "./reusable";
import FastCheckoutModal from "./checkout/FastCheckoutModal";

const categories = [
  { label: "Free deals", icon: Gift, tone: "bg-[#ffdfd7] text-[#b72d26]" },
  { label: "Food & drinks", icon: ShoppingBag, tone: "bg-[#fff0bd] text-[#7b5b00]" },
  { label: "Fashion", icon: Sparkles, tone: "bg-[#dcebdc] text-[#28603e]" },
  { label: "Tech", icon: Zap, tone: "bg-[#dce7f7] text-[#285187]" },
  { label: "Daily needs", icon: Store, tone: "bg-[#f1dfd3] text-[#75452d]" },
];

function DealRail({ deals, onClaim }) {
  return (
    <div className="flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {deals.slice(0, 4).map((deal) => (
        <article key={deal.id} className="group min-w-[278px] max-w-[320px] flex-1 snap-start overflow-hidden rounded-[6px] border border-[#eadfd8] bg-white">
          <div className="relative h-40 overflow-hidden">
            <img src={deal.image} alt={deal.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 bg-[#ff5b48] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white"><Ticket size={11} /> Limited deal</span>
            <span className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-semibold text-white"><MapPin size={12} /> {deal.shopName}</span>
          </div>
          <div className="p-4">
            <h3 className="min-h-10 text-[15px] font-bold leading-tight text-[#20201f]">{deal.title}</h3>
            <div className="mt-3 flex items-center justify-between border-t border-[#f0e9e4] pt-3">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#8d817b]"><Clock3 size={13} /> Ends {deal.validUntil}</span>
              <button type="button" onClick={() => onClaim(deal)} className="inline-flex items-center gap-1 text-[12px] font-bold text-[#d94335]">Claim <ArrowRight size={14} /></button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [teaserOpen, setTeaserOpen] = useState(false);
  const [claimDeal, setClaimDeal] = useState(null);
  const [checkoutItem, setCheckoutItem] = useState(null);

  const openTeaser = (name) => setTeaserOpen(name || "SeroFast app");
  const openCheckout = (item) => setCheckoutItem(item || { title: "Oversized Vintage Campus Hoodie", price: 1249, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400" });

  return (
    <div className="home-page min-h-screen overflow-x-hidden bg-[#f7f3ee] pb-16 text-[#20201f]">
      <Header onOpenAppTeaser={openTeaser} hideFreeBuffBranding />

      <main>
        <section className="relative min-h-[650px] overflow-hidden bg-[#fff1ed] text-[#191616] lg:min-h-[690px]">
          <div className="absolute inset-0 opacity-20"><img src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1800&q=85" alt="Friends sharing food at a campus table" className="h-full w-full object-cover" /></div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff1ed_0%,rgba(255,241,237,.94)_45%,rgba(255,241,237,.52)_100%)]" />
          <div className="relative mx-auto grid min-h-[650px] w-[min(1240px,calc(100%_-_32px))] items-start gap-12 pb-10 pt-12 lg:min-h-[690px] lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:pb-20 lg:pt-20">
            <div className="max-w-[650px]">
              <div className="mb-6 inline-flex items-center gap-2 border border-brandRed/20 bg-white/70 px-3 py-2 text-[11px] font-bold uppercase tracking-[.16em] text-brandRed"><span className="h-2 w-2 rounded-full bg-brandRed" /> Live around your campus</div>
              <h1 className="max-w-[620px] text-[clamp(3.2rem,9vw,6.8rem)] font-bold leading-[.88] tracking-[-.05em]">Good finds.<br /><span className="text-brandRed">No detours.</span></h1>
              <p className="mt-7 max-w-[480px] text-[16px] leading-relaxed text-textSecondary">Your campus marketplace for clothing, essentials, and fast deliveries from central warehouse directly to your hostel room.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => openCheckout()} className="inline-flex h-12 items-center justify-center gap-2 bg-brandRed px-6 text-[13px] font-bold text-white transition hover:bg-brandRedDark cursor-pointer shadow-sm"><ShoppingBag size={16} /> Quick Order Campus Apparel <ArrowRight size={16} /></button>
                <Link to="/track" className="inline-flex h-12 items-center justify-center gap-2 border border-slate-300 bg-white/70 px-6 text-[13px] font-bold text-textPrimary transition hover:border-brandRed hover:text-brandRed"><Truck size={16} /> Track Existing Order</Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[11px] font-semibold text-textMuted"><span className="flex items-center gap-2"><BadgeCheck size={15} className="text-emerald-600" /> Central Warehouse Fulfilled</span><span className="flex items-center gap-2"><Zap size={15} className="text-amber-500" /> 30-Min Campus Hostel Delivery</span></div>
            </div>
            <div className="relative hidden lg:block">
              <div className="ml-auto max-w-[390px] border border-brandRed/15 bg-white p-3 text-textPrimary shadow-2xl rotate-[2deg]">
                <div className="flex items-center justify-between border-b border-[#e3d9d1] pb-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-textMuted">Warehouse Featured Drop</span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-brandRed"><span className="h-2 w-2 rounded-full bg-brandRed" /> In Stock</span>
                </div>
                <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600" alt="Oversized Vintage Hoodie" className="mt-3 h-48 w-full object-cover rounded-md" />
                <div className="pt-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-brandRed">Campus Apparel · Central Hub</p>
                  <h2 className="mt-2 text-[22px] font-bold leading-none">Oversized Vintage Hoodie</h2>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[14px] font-extrabold text-slate-900">₹1,249</span>
                    <button type="button" onClick={() => openCheckout()} className="inline-flex items-center gap-1 bg-brandRed px-4 py-2 text-[11px] font-bold text-white rounded-md cursor-pointer hover:bg-brandRedDark">Order Now <MoveUpRight size={13} /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#e6dcd4] bg-[#fffaf5] py-5"><div className="mx-auto flex w-[min(1240px,calc(100%_-_32px))] gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{categories.map(({ label, icon: Icon, tone }) => <button type="button" key={label} onClick={() => openCheckout()} className="flex min-w-max items-center gap-2 border border-[#eadfd8] bg-white px-4 py-3 text-[12px] font-bold transition hover:-translate-y-0.5 hover:border-[#d94335]"><span className={`grid h-7 w-7 place-items-center ${tone}`}><Icon size={14} /></span>{label}<ChevronRight size={14} className="text-[#aa9b91]" /></button>)}</div></section>

        <section id="deals" className="mx-auto w-[min(1240px,calc(100%_-_32px))] py-16 lg:py-24"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#d94335]">Fresh drops</p><h2 className="mt-2 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-none tracking-[-.04em]">Campus Wardrobe Drops</h2><p className="mt-3 max-w-[440px] text-[14px] leading-relaxed text-[#756a64]">Central warehouse verified clothes delivered straight to your hostel.</p></div><button type="button" onClick={() => openCheckout()} className="hidden items-center gap-2 pb-1 text-[12px] font-bold text-[#d94335] sm:flex cursor-pointer">Order Apparel <ArrowRight size={15} /></button></div><DealRail deals={freeBuffDeals} onClaim={() => openCheckout()} /></section>

        <section id="owners" className="bg-brandRed py-14 text-white"><div className="mx-auto flex w-[min(1240px,calc(100%_-_32px))] flex-col justify-between gap-8 lg:flex-row lg:items-center"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-amber-100">For the merchants & shop owners</p><h2 className="mt-3 max-w-[650px] text-[clamp(2rem,5vw,4.6rem)] font-bold leading-[.92] tracking-[-.04em]">Partner with SeroFast Central Warehouse.</h2></div><div className="max-w-[310px]"><p className="text-[14px] leading-relaxed text-white/80">List your products on SeroFast, our central warehouse handles 100% of campus packing and fulfillment.</p><Link to="/signup" className="mt-5 inline-flex items-center gap-2 bg-textPrimary px-5 py-3 text-[12px] font-bold">Start selling <ArrowRight size={15} /></Link></div></div></section>
      </main>
      <Footer /><ScrollToTop /><MobileBottomNav />
      <FreeBuffClaimModal deal={claimDeal} isOpen={Boolean(claimDeal)} onClose={() => setClaimDeal(null)} />
      <AppTeaserModal isOpen={Boolean(teaserOpen)} onClose={() => setTeaserOpen(false)} initialItemName={teaserOpen} />
      <FastCheckoutModal isOpen={Boolean(checkoutItem)} onClose={() => setCheckoutItem(null)} initialItem={checkoutItem} />
    </div>
  );
}
