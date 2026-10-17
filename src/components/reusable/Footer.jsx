import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
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
      className="group/grid relative grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-brandRed/30 hover:bg-brandRed hover:text-white hover:shadow-[0_6px_20px_rgba(211,47,47,0.25)]"
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
                className={`group/link inline-flex items-center gap-1.5 text-xs transition-colors duration-200 ${
                  item.bold
                    ? "font-bold text-brandRed"
                    : "text-slate-500 hover:text-brandRed"
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
                className={`group/link inline-flex items-center gap-1.5 text-xs transition-colors duration-200 ${
                  item.bold
                    ? "font-bold text-brandRed"
                    : "text-slate-500 hover:text-brandRed"
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
    <footer className="w-full border-t border-[#F0EBE6] bg-white text-[#191616]">

      {/* ── Main Footer Content (Clean, Responsive, No Bloat) ── */}
      <div className="mx-auto w-[min(1320px,calc(100%_-_40px))] py-12 sm:w-[min(1320px,calc(100%_-_48px))] sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Newsletter (lg:col-span-5) */}
          <div className="space-y-4 lg:col-span-5 lg:pr-8">
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-brandRed transition-transform duration-200 hover:scale-[1.02]"
              aria-label="SeroFast home"
            >
              <Logo size="sm" iconClassName="transition-transform duration-300 group-hover:rotate-6" />
              <span>SEROFAST</span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              India's student-powered campus commerce ecosystem. Empowering college creators to launch storefronts with zero capital.
            </p>

            {/* Compact Newsletter */}
            <div className="pt-1">
              <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                <div className="relative flex-1">
                  <Mail
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter college email"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-[#191616] outline-none transition-all placeholder:text-slate-400 focus:border-brandRed focus:ring-2 focus:ring-brandRed/10"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brandRed text-white shadow-md shadow-brandRed/20 transition-all hover:bg-brandRedDark hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </form>
              {subscribed && (
                <p className="mt-2 text-xs font-semibold text-brandRed">
                  Thanks for subscribing! Check your inbox.
                </p>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <SocialIcon icon={Instagram} label="Instagram" />
              <SocialIcon icon={Twitter} label="Twitter" />
              <SocialIcon icon={Linkedin} label="LinkedIn" />
              <SocialIcon icon={Youtube} label="YouTube" />
            </div>
          </div>

          {/* Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <FooterLinkColumn
              title="Platform"
              links={[
                { label: "App Walkthrough", href: "#app-preview" },
                { label: "Campus Features", href: "#app-features" },
                { label: "For Students", href: "#dual-mode" },
                { label: "FAQ", href: "#faq" },
                { label: "Download App", href: "#download-app" },
              ]}
            />
          </div>

          {/* For Students (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <FooterLinkColumn
              title="For Students"
              links={[
                { label: "Become a Seller", to: "/signup", bold: true },
                { label: "Seller Login", to: "/login" },
                { label: "Buyer Mode", href: "#dual-mode" },
                { label: "Track Your Order", to: "/track" },
                { label: "Download App", href: "#download-app" },
              ]}
            />
          </div>

          {/* Contact & Support (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#191616]">
              Contact & Support
            </h4>
            <div className="mt-4 space-y-3 text-xs text-slate-500">
              <p className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brandRed/10 text-brandRed">
                  <MapPin size={13} />
                </span>
                <span>Kanyakumari & Bangalore, India</span>
              </p>
              <p className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brandRed/10 text-brandRed">
                  <Mail size={13} />
                </span>
                <span>serofastinfo@gmail.com</span>
              </p>
              <p className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brandRed/10 text-brandRed">
                  <Phone size={13} />
                </span>
                <span>+91 744 840 2365</span>
              </p>
              <div className="pt-2">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-brandRed/10 px-4 py-2.5 text-xs font-bold text-brandRed transition-all hover:bg-brandRed hover:text-white"
                >
                  <Store size={14} />
                  <span>Start Selling Free</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ──────────────────────────────────────── */}
      <div className="border-t border-[#F0EBE6] bg-[#FAF8F5]/80">
        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-3 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:px-6">
          <div className="flex items-center gap-1.5">
            <span>© 2026 SeroFast. Built with</span>
            <Heart size={12} className="text-brandRed animate-pulse fill-brandRed" />
            <span>in Kanyakumari, India.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="cursor-pointer transition-colors hover:text-brandRed">Privacy</span>
            <span>·</span>
            <span className="cursor-pointer transition-colors hover:text-brandRed">Terms</span>
            <span>·</span>
            <span className="cursor-pointer transition-colors hover:text-brandRed">Refund Policy</span>
            <span>·</span>
            <span className="cursor-pointer transition-colors hover:text-brandRed">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
