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
  Heart,
  Users,
  TrendingUp,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

import ScrollReveal from "./ScrollReveal";

export default function AboutSeroFastBanner() {
  const pillars = [
    {
      id: "shops",
      badge: "Shop Owners",
      badgeColor: "bg-brandRed/10 text-brandRed border-brandRed/20",
      icon: Store,
      accentBg: "bg-brandRed",
      title: "Invest ₹50 & Keep Your Margin Profit",
      subtitle: "Empowering local offline merchants to go digital with zero heavy software or subscription costs.",
      highlights: [
        "Invest just ₹50 to list your entire store and products",
        "Keep 100% of your retail margin profits — no commission cuts",
        "Direct connection to thousands of local students and families",
        "Real-time order alerts & automated local customer billing",
      ],
      ctaText: "Register Shop for ₹50",
      ctaLink: "/create-shop",
      ctaPrimary: true,
    },
    {
      id: "students",
      badge: "Student Program",
      badgeColor: "bg-blue-50 text-blue-600 border-blue-200",
      icon: GraduationCap,
      accentBg: "bg-blue-600",
      title: "Become a Digital Entrepreneur & Earn",
      subtitle: "Turn your campus network into a thriving business. Earn income, certificates & prestigious awards.",
      highlights: [
        "Earn real profit margins on every generated order",
        "Receive verified Professional Entrepreneurship Certificates",
        "Win quarterly Top Performer Awards & commendations",
        "Zero investment risk — flexible hours alongside studies",
      ],
      ctaText: "Join Student Program",
      ctaLink: "#enquiry",
      ctaPrimary: false,
    },
    {
      id: "customers",
      badge: "For Shoppers",
      badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: Clock,
      accentBg: "bg-emerald-600",
      title: "Order Now & Get Delivered in Hours",
      subtitle: "Fastest hyperlocal delivery connecting you directly to verified neighbourhood stores you already love.",
      highlights: [
        "Express same-day delivery right to your doorstep",
        "No shipping charges — enjoy ₹0 Delivery on all orders",
        "Buy genuine products from trusted local shops",
        "Hassle-free 7-day local returns with instant support",
      ],
      ctaText: "Start Shopping Local",
      ctaLink: "#freebuff",
      ctaPrimary: false,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden py-14 sm:py-20 lg:py-24">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute -left-20 top-20 h-80 w-80 rounded-full bg-brandRed/[0.04] blur-[100px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-blue-400/[0.04] blur-[100px]" />
      <div className="pointer-events-none absolute left-1/3 bottom-0 h-72 w-72 rounded-full bg-emerald-400/[0.04] blur-[100px]" />

      <div className="relative z-[2] mx-auto w-[min(1320px,calc(100%_-_40px))] sm:w-[min(1320px,calc(100%_-_48px))] max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]">
        {/* Header */}
        <ScrollReveal variant="fade-down" className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brandRed/15 bg-promoHighlight px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brandRed">
            <Sparkles size={13} className="animate-spin" style={{ animationDuration: "6s" }} />
            <span>ABOUT SEROFAST ECOSYSTEM</span>
          </div>

          <h2 className="mt-4 text-[clamp(24px,3.6vw,40px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#191616]">
            Empowering Shops, Students & Smart Shoppers
          </h2>

          <p className="mt-3 text-[14px] leading-relaxed text-[#8b8282] sm:text-[15px]">
            India&apos;s pioneering hyperlocal commerce network. We bring neighbourhood shops online, empower students as digital entrepreneurs, and guarantee lightning-fast delivery.
          </p>
        </ScrollReveal>

        {/* Pillar Cards Grid */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <ScrollReveal
                key={pillar.id}
                variant="fade-up"
                delay={index * 120}
                duration={700}
                className="h-full"
              >
                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[22px] border border-slate-100 bg-white p-6 shadow-[0_6px_24px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brandRed/20 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] sm:p-7">
                  {/* Badge + Tag */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold ${pillar.badgeColor}`}>
                        <Icon size={12} />
                        {pillar.badge}
                      </span>
                    </div>

                    {/* Icon + Title */}
                    <div className="mt-4 flex items-start gap-3.5">
                      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-[14px] ${pillar.accentBg} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                        <Icon size={22} />
                      </div>
                      <div>
                        <h3 className="m-0 text-[17px] font-extrabold leading-snug text-[#191616] transition-colors group-hover:text-brandRed">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>

                    <p className="mt-3 text-[13px] leading-relaxed text-[#8b8282]">
                      {pillar.subtitle}
                    </p>

                    {/* Highlights */}
                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                      {pillar.highlights.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-[12px] font-medium text-[#444]"
                        >
                          <CheckCircle2
                            size={15}
                            className="mt-0.5 shrink-0 text-brandRed transition-transform duration-200 group-hover:scale-110"
                          />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 pt-1">
                    {pillar.ctaLink.startsWith("/") ? (
                      <Link
                        to={pillar.ctaLink}
                        className={`flex h-[44px] w-full items-center justify-center gap-2 rounded-[14px] text-[13px] font-bold transition-all duration-300 ${
                          pillar.ctaPrimary
                            ? "bg-brandRed text-white shadow-[0_6px_20px_rgba(210,33,37,0.25)] hover:bg-brandRedDark hover:shadow-[0_10px_26px_rgba(210,33,37,0.35)]"
                            : "border border-slate-200 bg-white text-[#191616] hover:border-brandRed/30 hover:text-brandRed"
                        } hover:-translate-y-0.5 active:scale-[0.97]`}
                      >
                        <span>{pillar.ctaText}</span>
                        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    ) : (
                      <a
                        href={pillar.ctaLink}
                        className={`flex h-[44px] w-full items-center justify-center gap-2 rounded-[14px] text-[13px] font-bold transition-all duration-300 ${
                          pillar.ctaPrimary
                            ? "bg-brandRed text-white shadow-[0_6px_20px_rgba(210,33,37,0.25)] hover:bg-brandRedDark hover:shadow-[0_10px_26px_rgba(210,33,37,0.35)]"
                            : "border border-slate-200 bg-white text-[#191616] hover:border-brandRed/30 hover:text-brandRed"
                        } hover:-translate-y-0.5 active:scale-[0.97]`}
                      >
                        <span>{pillar.ctaText}</span>
                        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                      </a>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Metrics Strip */}
        <ScrollReveal variant="scale-up" delay={200} className="mt-8 sm:mt-12">
          <div className="grid grid-cols-2 gap-3 rounded-[20px] border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sm:p-5 lg:grid-cols-4 sm:gap-4">
            {[
              { icon: Coins, color: "bg-promoHighlight text-brandRed", title: "₹50 Only", desc: "To launch digital shop" },
              { icon: Award, color: "bg-blue-50 text-blue-600", title: "Certificates", desc: "& awards for students" },
              { icon: Zap, color: "bg-emerald-50 text-emerald-600", title: "In Hours", desc: "Fast local delivery" },
              { icon: Truck, color: "bg-amber-50 text-amber-600", title: "₹0 Shipping", desc: "No delivery charges" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2 min-w-0">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-[12px] ${item.color}`}>
                  <item.icon size={20} />
                </div>
                <div className="min-w-0">
                  <strong className="block text-[16px] font-extrabold text-[#191616]">{item.title}</strong>
                  <span className="text-[11px] text-[#8b8282]">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
