import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import {
  Store,
  GraduationCap,
  Award,
  Truck,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
  Sparkles,
  Users,
  Star,
  Zap,
  Send,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Smartphone,
  Play,
} from "lucide-react";

/* ── Social link helper ──────────────────────────────────── */
function SocialIcon({ icon: Icon, label, href = "#" }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="group/grid relative grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-[#888] transition-all duration-300 hover:-translate-y-0.5 hover:border-brandRed/30 hover:bg-brandRed hover:text-white hover:shadow-[0_6px_20px_rgba(211,47,47,0.25)]"
    >
      <Icon size={16} />
    </a>
  );
}

/* ── Link column with animated underline ──────────────────── */
function FooterLinkColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#191616]">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((item, i) => (
          <li key={i}>
            {item.to ? (
              <Link
                to={item.to}
                className={`group/link inline-flex items-center gap-1.5 text-[12px] transition-colors duration-200 ${
                  item.bold
                    ? "font-bold text-brandRed"
                    : "text-[#8b8282] hover:text-brandRed"
                }`}
              >
                {item.icon && (
                  <item.icon
                    size={12}
                    className="text-brandRed opacity-60 transition-opacity group-hover/link:opacity-100"
                  />
                )}
                {item.label}
                <ArrowRight
                  size={10}
                  className="ml-0.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover/link:translate-x-0 group-hover/link:opacity-100"
                />
              </Link>
            ) : (
              <a
                href={item.href}
                className={`group/link inline-flex items-center gap-1.5 text-[12px] transition-colors duration-200 ${
                  item.bold
                    ? "font-bold text-brandRed"
                    : "text-[#8b8282] hover:text-brandRed"
                }`}
              >
                {item.icon && (
                  <item.icon
                    size={12}
                    className="text-brandRed opacity-60 transition-opacity group-hover/link:opacity-100"
                  />
                )}
                {item.label}
                <ArrowRight
                  size={10}
                  className="ml-0.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover/link:translate-x-0 group-hover/link:opacity-100"
                />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-full border-t border-slate-100 bg-white text-[#191616]">
      {/* ── Stats Trust Strip ───────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brandRed via-rose-600 to-red-500">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/20" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10" />
        </div>
        <div className="relative mx-auto grid w-[min(1320px,calc(100%_-_40px))] grid-cols-2 gap-4 py-5 sm:w-[min(1320px,calc(100%_-_48px))] sm:grid-cols-4 sm:py-6 max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)] max-560:grid-cols-2 max-560:gap-3">
          {[
            { icon: Users, value: "4,820+", label: "Active Students" },
            { icon: Store, value: "150+", label: "Verified Shops" },
            { icon: Star, value: "4.8★", label: "Average Rating" },
            { icon: Zap, value: "100%", label: "Free Delivery" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center justify-center gap-3 text-white max-560:justify-start">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur-sm">
                <stat.icon size={16} />
              </div>
              <div>
                <strong className="block text-[16px] font-extrabold leading-none sm:text-[18px]">
                  {stat.value}
                </strong>
                <span className="text-[10px] font-medium text-white/80">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Guarantees Strip ────────────────────────────────── */}
      <div className="border-b border-slate-100 bg-[#fafafa]">
        <div className="mx-auto grid w-[min(1320px,calc(100%_-_40px))] grid-cols-2 gap-4 py-6 sm:w-[min(1320px,calc(100%_-_48px))] lg:grid-cols-4 max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)] max-560:gap-3">
          {[
            {
              icon: Store,
              color: "bg-brandRed/10 text-brandRed",
              title: "₹50 Shop Registration",
              desc: "Keep 100% your margin profit",
            },
            {
              icon: GraduationCap,
              color: "bg-blue-50 text-blue-600",
              title: "Student Entrepreneurship",
              desc: "Earn profits, certificates & awards",
            },
            {
              icon: Truck,
              color: "bg-emerald-50 text-emerald-600",
              title: "Delivered in Hours",
              desc: "₹0 Shipping on all local orders",
            },
            {
              icon: ShieldCheck,
              color: "bg-amber-50 text-amber-600",
              title: "100% Trusted Shops",
              desc: "Verified neighborhood stores",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition-all duration-300 hover:border-slate-100 hover:bg-white hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)] max-560:flex-col max-560:justify-center max-560:gap-2 max-560:text-center"
            >
              <div
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-[12px] transition-transform duration-300 group-hover:scale-110 ${item.color}`}
              >
                <item.icon size={18} />
              </div>
              <div>
                <strong className="block text-[12px] font-bold text-[#191616]">
                  {item.title}
                </strong>
                <span className="text-[10px] text-[#8b8282]">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Footer Content ─────────────────────────────── */}
      <div className="mx-auto w-[min(1320px,calc(100%_-_40px))] py-10 sm:w-[min(1320px,calc(100%_-_48px))] sm:py-14 lg:py-16 max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 max-560:grid-cols-2 max-560:gap-x-5 max-560:gap-y-8">
          {/* ── Brand Column + Newsletter (wide) ──────────────── */}
          <div className="space-y-5 lg:col-span-4 lg:pr-6 max-560:col-span-2">
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5 text-[22px] font-extrabold tracking-tight text-brandRed transition-transform duration-200 hover:scale-[1.02]"
              aria-label="SeroFast home"
            >
              <Logo size="sm" iconClassName="transition-transform duration-300 group-hover:rotate-6" />
              <span>SEROFAST</span>
            </Link>

            <p className="text-[12px] leading-relaxed text-[#8b8282] max-w-[310px]">
              India's leading hyperlocal marketplace connecting verified
              neighbourhood shops, empowering student entrepreneurs, and
              delivering authentic products with ₹0 shipping fees.
            </p>

            {/* Contact */}
            <div className="space-y-2 text-[11px] text-[#8b8282]">
              <p className="flex items-center gap-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brandRed/10 text-brandRed">
                  <MapPin size={13} />
                </span>
                <span>Bangalore, India</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brandRed/10 text-brandRed">
                  <Mail size={13} />
                </span>
                <span>support@serofast.com</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brandRed/10 text-brandRed">
                  <Phone size={13} />
                </span>
                <span>+91 98765 43210</span>
              </p>
            </div>

            {/* Newsletter */}
            <div className="rounded-2xl border border-slate-100 bg-[#fafafa] p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#191616]">
                Stay in the loop
              </p>
              <p className="mt-1 text-[11px] text-[#8b8282]">
                Weekly campus deals & updates. No spam, ever.
              </p>
              <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
                <div className="relative flex-1">
                  <Mail
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bbb]"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-[11px] text-[#191616] outline-none transition-all duration-200 placeholder:text-[#bbb] focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
                  />
                </div>
                <button
                  type="submit"
                  className="grid h-auto shrink-0 place-items-center rounded-xl bg-gradient-to-r from-brandRed to-rose-600 px-4 text-white shadow-[0_4px_14px_rgba(211,47,47,0.25)] transition-all duration-200 hover:shadow-[0_6px_20px_rgba(211,47,47,0.35)] hover:-translate-y-0.5 active:scale-95"
                >
                  <Send size={14} />
                </button>
              </form>
              {subscribed && (
                <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  You're subscribed! Check your inbox.
                </p>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              <SocialIcon icon={Instagram} label="Instagram" />
              <SocialIcon icon={Twitter} label="Twitter" />
              <SocialIcon icon={Linkedin} label="LinkedIn" />
              <SocialIcon icon={Youtube} label="YouTube" />
            </div>
          </div>

          {/* ── Shop Owners ──────────────────────────────────── */}
          <div className="lg:col-span-2">
            <FooterLinkColumn
              title="For Shop Owners"
              links={[
                {
                  label: "Start Shop for ₹50",
                  to: "/create-shop",
                  bold: true,
                },
                { label: "Keep Full Margin Profit", href: "#about" },
                { label: "Shop Owner Portal", to: "/login" },
                { label: "Merchant FAQ", href: "#faq" },
                { label: "Payout Information", href: "#about" },
              ]}
            />
          </div>

          {/* ── Student Program ──────────────────────────────── */}
          <div className="lg:col-span-2">
            <FooterLinkColumn
              title="Student Program"
              links={[
                {
                  label: "Join as Entrepreneur",
                  href: "#enquiry",
                  icon: Award,
                  bold: true,
                },
                { label: "Ecosystem Overview", href: "#about" },
                { label: "Campus Deals", href: "#freebuff" },
                { label: "Student FAQ", href: "#faq" },
                { label: "Certificates & Awards", href: "#about" },
              ]}
            />
          </div>

          {/* ── For Shoppers ─────────────────────────────────── */}
          <div className="lg:col-span-2">
            <FooterLinkColumn
              title="For Shoppers"
              links={[
                { label: "Track Your Order", to: "/track", bold: true },
                { label: "Browse Campus Deals", href: "#deals" },
                { label: "Campus Partner Shops", href: "#shops" },
                { label: "Customer Support", href: "#enquiry" },
                { label: "How It Works", href: "#about" },
                { label: "Delivery Info", href: "#about" },
              ]}
            />
          </div>

          {/* ── Get the App ──────────────────────────────────── */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#191616]">
              Get the App
            </h4>
            <div className="mt-4 space-y-2.5">
              <p className="text-[11px] leading-relaxed text-[#8b8282]">
                Shop smarter with our campus marketplace app.
              </p>
              <a
                href="#"
                className="group/app flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition-all duration-300 hover:border-brandRed/30 hover:shadow-[0_4px_16px_rgba(211,47,47,0.08)] hover:-translate-y-0.5"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#191616] text-white">
                  <Play size={16} />
                </span>
                <div>
                  <span className="block text-[9px] font-medium text-[#8b8282]">
                    GET IT ON
                  </span>
                  <span className="block text-[12px] font-bold text-[#191616]">
                    Google Play
                  </span>
                </div>
              </a>
              <a
                href="#"
                className="group/app flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition-all duration-300 hover:border-brandRed/30 hover:shadow-[0_4px_16px_rgba(211,47,47,0.08)] hover:-translate-y-0.5"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#191616] text-white">
                  <Smartphone size={16} />
                </span>
                <div>
                  <span className="block text-[9px] font-medium text-[#8b8282]">
                    Download on the
                  </span>
                  <span className="block text-[12px] font-bold text-[#191616]">
                    App Store
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ──────────────────────────────────────── */}
      <div className="border-t border-slate-100 bg-[#fafafa]">
        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-3 px-5 py-4 sm:flex-row sm:px-6">
          {/* Left */}
          <div className="flex items-center gap-1 text-[11px] text-[#aaa]">
            <span>© 2026 SeroFast. Built with</span>
            <Heart
              size={11}
              className="text-brandRed animate-pulse"
              fill="currentColor"
            />
            <span>in Bangalore, India.</span>
          </div>

          {/* Center — Links */}
          <div className="flex items-center gap-3 text-[11px] text-[#aaa]">
            {["Privacy", "Terms", "Support", "Refund Policy"].map(
              (label, i, arr) => (
                <span key={label} className="flex items-center gap-3">
                  <a
                    href="#"
                    className="transition-colors duration-200 hover:text-brandRed"
                  >
                    {label}
                  </a>
                  {i < arr.length - 1 && (
                    <span className="text-slate-200">·</span>
                  )}
                </span>
              )
            )}
          </div>

          {/* Right — Mini social row */}
          <div className="flex items-center gap-1.5">
            {[
              { icon: Instagram, label: "Instagram" },
              { icon: Twitter, label: "Twitter" },
              { icon: Linkedin, label: "LinkedIn" },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="grid h-7 w-7 place-items-center rounded-lg text-[#bbb] transition-all duration-200 hover:bg-brandRed/10 hover:text-brandRed"
              >
                <s.icon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
