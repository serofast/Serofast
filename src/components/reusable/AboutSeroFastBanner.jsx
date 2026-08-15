import {
  Store,
  GraduationCap,
  Award,
  Clock,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Coins,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import ScrollReveal from "./ScrollReveal";

export default function AboutSeroFastBanner() {
  const pillars = [
    {
      id: "shops",
      badge: "Shop Owners Opportunity",
      badgeColor: "bg-[#ffebeb] text-[#D22125] border-[#fcd5d5]",
      icon: Store,
      accentBg: "bg-[#D22125]",
      title: "Invest ₹50 & Take Your Margin Profit",
      subtitle:
        "Empowering local offline merchants to go digital with zero heavy software or subscription costs.",
      highlights: [
        "Invest just ₹50 to list your entire store and products",
        "Keep 100% of your retail margin profits — no greedy commission cuts",
        "Direct connection to thousands of local college students and families",
        "Instant digital storefront setup ready in under 5 minutes",
        "Real-time order alerts & automated local customer billing",
      ],
      tag: "⚡ Minimal Setup Cost",
      ctaText: "Register Shop for ₹50",
      ctaLink: "/create-shop",
      ctaPrimary: true,
    },
    {
      id: "students",
      badge: "Student Entrepreneur Program",
      badgeColor: "bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]",
      icon: GraduationCap,
      accentBg: "bg-[#2563eb]",
      title: "Become a Digital Entrepreneur & Earn Big",
      subtitle:
        "Turn your campus network into a thriving business. Earn handsome income, industry certificates & prestigious awards.",
      highlights: [
        "Earn real profit margins on every order generated in your network",
        "Receive verified Professional Entrepreneurship Certificates",
        "Win quarterly Top Performer Awards & leadership commendations",
        "Zero investment risk — work flexible hours alongside your studies",
        "Gain real-world marketing, e-commerce, and business management experience",
      ],
      tag: "🏆 Certificate + Awards Included",
      ctaText: "Join Student Program",
      ctaLink: "#enquiry",
      ctaPrimary: false,
    },
    {
      id: "customers",
      badge: "Customer Guarantees & Promises",
      badgeColor: "bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]",
      icon: Clock,
      accentBg: "bg-[#059669]",
      title: "Order Now & Get Delivered in Hours",
      subtitle:
        "Fastest hyperlocal delivery connecting you directly to the verified neighbourhood stores you already love.",
      highlights: [
        "Express same-day delivery right to your doorstep within hours",
        "No shipping charges — enjoy ₹0 Delivery on all local orders",
        "Buy 100% genuine products from your trusted neighbourhood shops",
        "Hassle-free 7-day local returns with instant customer care",
        "Secure payments via UPI, Debit/Credit cards, or Cash on Delivery",
      ],
      tag: "🚀 ₹0 Shipping Charges",
      ctaText: "Start Shopping Local",
      ctaLink: "#products",
      ctaPrimary: false,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#fff3f3] via-[#fff9f9] to-white py-16 sm:py-20 lg:py-24 border-y border-[#ffe2e2]">
      {/* Decorative ambient background orbs */}
      <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-brandRed/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 bottom-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

      {/* Header Container */}
      <div className="relative z-[2] mx-auto w-[min(1280px,calc(100%_-_48px))] max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]">
        <ScrollReveal variant="fade-down" className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D22125]/20 bg-[#D22125]/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#D22125] shadow-xs">
            <Sparkles size={14} className="animate-spin" style={{ animationDuration: "6s" }} />
            <span>ABOUT SEROFAST ECOSYSTEM</span>
          </div>

          <h2 className="mt-4 text-[clamp(28px,3.6vw,44px)] font-extrabold leading-[1.12] tracking-tight text-textPrimary">
            Empowering Shops, Students &amp; Smart Shoppers
          </h2>

          <p className="mt-3 text-[15px] leading-relaxed text-textSecondary sm:text-[16px]">
            SeroFast is India&apos;s pioneering hyperlocal commerce network. We bring neighborhood shops online, empower students to become independent digital entrepreneurs, and guarantee lightning-fast delivery to local customers.
          </p>
        </ScrollReveal>

        {/* 3 Main Pillar Cards Grid with Staggered Scroll Reveal */}
        <div className="mt-12 grid grid-cols-1 gap-7 lg:grid-cols-3 sm:gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <ScrollReveal
                key={pillar.id}
                variant="fade-up"
                delay={index * 130}
                duration={750}
                className="h-full"
              >
                <div
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[22px] border border-white/90 bg-white/95 p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-brandRed/30 hover:shadow-[0_20px_45px_rgba(210,33,37,0.12)] max-560:p-5"
                >
                  {/* Top Banner Tag */}
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${pillar.badgeColor}`}
                      >
                        <Icon size={13} />
                        {pillar.badge}
                      </span>
                      <span className="rounded-md bg-[#fafafa] px-2 py-0.5 text-[10px] font-extrabold text-[#777] shadow-2xs">
                        {pillar.tag}
                      </span>
                    </div>

                    {/* Icon + Title */}
                    <div className="mt-5 flex items-start gap-4">
                      <div
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${pillar.accentBg} text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                      >
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="m-0 text-[19px] font-extrabold leading-snug text-textPrimary transition-colors duration-200 group-hover:text-brandRed">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>

                    <p className="mt-3 text-[13px] leading-relaxed text-textSecondary">
                      {pillar.subtitle}
                    </p>

                    {/* Benefit Points */}
                    <div className="mt-5 space-y-2.5 border-t border-[#f4f4f4] pt-4">
                      {pillar.highlights.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-[12.5px] font-medium text-[#333]"
                        >
                          <CheckCircle2
                            size={16}
                            className="mt-0.5 shrink-0 text-[#D22125] transition-transform duration-200 group-hover:scale-110"
                          />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="mt-7 pt-2">
                    {pillar.ctaLink.startsWith("/") ? (
                      <Link
                        to={pillar.ctaLink}
                        className={`flex h-[46px] w-full items-center justify-center gap-2 rounded-[14px] text-[13.5px] font-bold transition-all duration-300 ${
                          pillar.ctaPrimary
                            ? "bg-[#D22125] text-white shadow-[0_8px_20px_rgba(210,33,37,0.3)] hover:bg-[#b81b1f] hover:shadow-[0_12px_26px_rgba(210,33,37,0.4)]"
                            : "border border-[#d9d9d9] bg-white text-textPrimary hover:border-brandRed hover:text-brandRed hover:shadow-sm"
                        } hover:-translate-y-0.5 active:translate-y-0`}
                      >
                        <span>{pillar.ctaText}</span>
                        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    ) : (
                      <a
                        href={pillar.ctaLink}
                        className={`flex h-[46px] w-full items-center justify-center gap-2 rounded-[14px] text-[13.5px] font-bold transition-all duration-300 ${
                          pillar.ctaPrimary
                            ? "bg-[#D22125] text-white shadow-[0_8px_20px_rgba(210,33,37,0.3)] hover:bg-[#b81b1f] hover:shadow-[0_12px_26px_rgba(210,33,37,0.4)]"
                            : "border border-[#d9d9d9] bg-white text-textPrimary hover:border-brandRed hover:text-brandRed hover:shadow-sm"
                        } hover:-translate-y-0.5 active:translate-y-0`}
                      >
                        <span>{pillar.ctaText}</span>
                        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </a>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Edge-to-edge Metrics / Trust Highlights Strip */}
        <ScrollReveal variant="scale-up" delay={200} className="mt-12">
          <div className="grid grid-cols-2 gap-4 rounded-[20px] border border-[#f0e2e2] bg-white/90 p-5 shadow-sm backdrop-blur-md sm:grid-cols-4 max-560:p-4">
            <div className="flex items-center gap-3.5 p-2">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-promoHighlight text-brandRed">
                <Coins size={22} />
              </div>
              <div>
                <strong className="block text-[17px] font-extrabold text-textPrimary">₹50 Only</strong>
                <span className="text-[11px] text-textSecondary">To launch local digital shop</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Award size={22} />
              </div>
              <div>
                <strong className="block text-[17px] font-extrabold text-textPrimary">Certificates</strong>
                <span className="text-[11px] text-textSecondary">&amp; awards for students</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <Zap size={22} />
              </div>
              <div>
                <strong className="block text-[17px] font-extrabold text-textPrimary">In Hours</strong>
                <span className="text-[11px] text-textSecondary">Fast local doorstep delivery</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <Truck size={22} />
              </div>
              <div>
                <strong className="block text-[17px] font-extrabold text-textPrimary">₹0 Shipping</strong>
                <span className="text-[11px] text-textSecondary">No delivery charges</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
