import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import {
  Store,
  UserRound,
  GraduationCap,
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
      <div className="border-y border-brandRed/10 bg-[#FFF1F1]">
        <div className="mx-auto grid w-[min(1320px,calc(100%_-_40px))] grid-cols-2 gap-3 py-5 sm:w-[min(1320px,calc(100%_-_48px))] sm:grid-cols-4 sm:gap-4 sm:py-6 max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)] max-560:gap-2">
          {[
            { icon: Users, value: "320+", label: "Active Sellers", color: "text-brandRed" },
            { icon: Store, value: "1,200+", label: "Products in Catalogue", color: "text-brandRed" },
            { icon: Star, value: "4.8★", label: "Seller Rating", color: "text-amber-600" },
            { icon: Zap, value: "0%", label: "Seller Commission", color: "text-emerald-600" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center justify-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-3 py-3 shadow-[0_4px_20px_rgba(25,22,22,0.04)] max-560:justify-start max-560:px-2.5">
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white ${stat.color}`}>
                <stat.icon size={16} strokeWidth={2.5} />
              </div>
              <div>
                <strong className="block text-[16px] font-extrabold leading-none text-[#191616] sm:text-[18px]">
                  {stat.value}
                </strong>
                <span className="mt-1 block text-[10px] font-semibold leading-tight text-[#8b8282]">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Guarantees Strip ────────────────────────────────── */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid w-[min(1320px,calc(100%_-_40px))] grid-cols-2 gap-4 py-6 sm:w-[min(1320px,calc(100%_-_48px))] lg:grid-cols-4 max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)] max-560:gap-3">
          {[              {
              icon: Store,
              color: "bg-brandRed/10 text-brandRed",
              title: "Free Seller Onboarding",
              desc: "0% commission on every sale",
            },
            {
              icon: GraduationCap,
              color: "bg-blue-50 text-blue-600",
              title: "Student Sellers",
              desc: "Earn from your campus network",
            },
            {
              icon: Truck,
              color: "bg-emerald-50 text-emerald-600",
              title: "Managed Fulfilment",
              desc: "Packing & delivery handled",
            },
            {
              icon: ShieldCheck,
              color: "bg-amber-50 text-amber-600",
              title: "Central Catalogue",
              desc: "Admin-curated products & stock",
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
              India's student-powered commerce platform. We source and stock
              the products, manage packing, delivery and payments — while
              student sellers share their shop link and earn a margin on every
              order.
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

          {/* ── Platform ──────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <FooterLinkColumn
              title="Platform"
              links={[
                {
                  label: "Become a Seller",
                  to: "/signup",
                  bold: true,
                },
                { label: "Why SeroFast", href: "#audience" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Platform Features", href: "#features" },
                { label: "FAQ", href: "#faq" },
              ]}
            />
          </div>

          {/* ── For Students ────────────────────────────────── */}
          <div className="lg:col-span-2">
            <FooterLinkColumn
              title="For Students"
              links={[
                {
                  label: "Become a Student Seller",
                  to: "/signup",
                  bold: true,
                },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Platform Features", href: "#features" },
                { label: "FAQ", href: "#faq" },
                { label: "Track Your Orders", to: "/track" },
              ]}
            />
          </div>

          {/* ── For Customers ────────────────────────────────── */}
          <div className="lg:col-span-2">
            <FooterLinkColumn
              title="For Customers"
              links={[
                { label: "Track Your Order", to: "/track", bold: true },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Platform Features", href: "#features" },
                { label: "FAQ", href: "#faq" },
              ]}
            />
          </div>

          {/* ── Get Started ──────────────────────────────────── */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#191616]">
              Get Started
            </h4>
            <div className="mt-4 space-y-2.5">
              <p className="text-[11px] leading-relaxed text-[#8b8282]">
                Create your free seller shop in minutes.
              </p>
              <Link
                to="/signup"
                className="group/app flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition-all duration-300 hover:border-brandRed/30 hover:shadow-[0_4px_16px_rgba(211,47,47,0.08)] hover:-translate-y-0.5"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brandRed text-white">
                  <Store size={16} />
                </span>
                <div>
                  <span className="block text-[9px] font-medium text-[#8b8282]">
                    FOR SELLERS & STUDENTS
                  </span>
                  <span className="block text-[12px] font-bold text-[#191616]">
                    Start Selling Free
                  </span>
                </div>
              </Link>
              <Link
                to="/login"
                className="group/app flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition-all duration-300 hover:border-brandRed/30 hover:shadow-[0_4px_16px_rgba(211,47,47,0.08)] hover:-translate-y-0.5"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#191616] text-white">
                  <UserRound size={16} />
                </span>
                <div>
                  <span className="block text-[9px] font-medium text-[#8b8282]">
                    FOR SELLERS & ADMINS
                  </span>
                  <span className="block text-[12px] font-bold text-[#191616]">
                    Portal Login
                  </span>
                </div>
              </Link>
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
