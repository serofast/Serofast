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
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-100 bg-white text-[#191616]">
      {/* Top Banner — Guarantees */}
      <div className="border-b border-slate-100 bg-[#fafafa]">
        <div className="mx-auto grid w-[min(1320px,calc(100%_-_40px))] sm:w-[min(1320px,calc(100%_-_48px))] grid-cols-2 gap-4 py-6 lg:grid-cols-4 max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)] max-560:gap-3">
          {[
            { icon: Store, color: "bg-brandRed/10 text-brandRed", title: "₹50 Shop Registration", desc: "Keep 100% your margin profit" },
            { icon: GraduationCap, color: "bg-blue-50 text-blue-600", title: "Student Entrepreneurship", desc: "Earn profits, certificates & awards" },
            { icon: Truck, color: "bg-emerald-50 text-emerald-600", title: "Delivered in Hours", desc: "₹0 Shipping on all local orders" },
            { icon: ShieldCheck, color: "bg-amber-50 text-amber-600", title: "100% Trusted Shops", desc: "Verified neighborhood stores" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 max-560:flex-col max-560:justify-center max-560:gap-2 max-560:text-center">
              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-[11px] ${item.color}`}>
                <item.icon size={18} />
              </div>
              <div>
                <strong className="block text-[12px] font-bold text-[#191616]">{item.title}</strong>
                <span className="text-[10px] text-[#8b8282]">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto w-[min(1320px,calc(100%_-_40px))] sm:w-[min(1320px,calc(100%_-_48px))] py-10 lg:py-14 max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 max-560:grid-cols-2 max-560:gap-x-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="max-560:col-span-2 lg:col-span-2 space-y-3 pr-0 lg:pr-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[20px] font-extrabold tracking-tight text-brandRed"
              aria-label="SeroFast home"
            >
              <Logo size="sm" />
              <span>SEROFAST</span>
            </Link>

            <p className="text-[12px] leading-relaxed text-[#8b8282] max-w-[320px]">
              India&apos;s leading hyperlocal marketplace connecting verified neighbourhood shops, empowering student entrepreneurs, and delivering authentic products with ₹0 shipping fees.
            </p>

            <div className="pt-1 space-y-1.5 text-[12px] text-[#8b8282]">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-brandRed shrink-0" />
                <span>Bangalore, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-brandRed shrink-0" />
                <span>support@serofast.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-brandRed shrink-0" />
                <span>+91 98765 43210</span>
              </p>
            </div>
          </div>

          {/* Shop Owners */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#191616]">
              For Shop Owners
            </h4>
            <ul className="mt-3 space-y-2 text-[12px] text-[#8b8282]">
              {[
                { label: "Start Shop for ₹50", to: "/create-shop", bold: true },
                { label: "Keep Full Margin Profit", href: "#about" },
                { label: "Shop Owner Portal", to: "/login" },
                { label: "Merchant FAQ", href: "#faq" },
              ].map((item, i) => (
                <li key={i}>
                  {item.to ? (
                    <Link to={item.to} className={`transition-colors hover:text-brandRed flex items-center gap-1.5 ${item.bold ? "font-bold text-brandRed" : ""}`}>
                      <ArrowRight size={11} className="text-brandRed" />
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <a href={item.href} className="transition-colors hover:text-brandRed">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Students */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#191616]">
              Student Program
            </h4>
            <ul className="mt-3 space-y-2 text-[12px] text-[#8b8282]">
              {[
                { label: "Join as Student Runner", href: "#enquiry", icon: Award },
                { label: "Campus Micro-Hubs", href: "#fulfillment" },
                { label: "0% Commission Calculator", href: "#calculator" },
                { label: "Partner FAQ", href: "#faq" },
              ].map((item, i) => (
                <li key={i}>
                  <a href={item.href} className={`transition-colors hover:text-brandRed flex items-center gap-1.5 ${i === 0 ? "font-bold text-brandRed" : ""}`}>
                    {item.icon && <item.icon size={12} />}
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Shoppers */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#191616]">
              For Shoppers
            </h4>
            <ul className="mt-3 space-y-2 text-[12px] text-[#8b8282]">
              {[
                { label: "Track Your Order", to: "/track", bold: true },
                { label: "Browse Campus Deals", href: "#deals" },
                { label: "Campus Partner Shops", href: "#shops" },
                { label: "Download Mobile App", href: "#home" },
                { label: "Customer Support", href: "#enquiry" },
              ].map((item, i) => (
                <li key={i}>
                  {item.to ? (
                    <Link to={item.to} className={`transition-colors hover:text-brandRed flex items-center gap-1.5 ${item.bold ? "font-bold text-brandRed" : ""}`}>
                      <ArrowRight size={11} className="text-brandRed" />
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <a href={item.href} className="transition-colors hover:text-brandRed">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100 bg-[#fafafa]">
        <div className="mx-auto flex flex-col items-center justify-between gap-2 px-5 py-4 sm:flex-row sm:px-0 max-w-[1320px]">
          <div className="flex items-center gap-1 text-[11px] text-[#aaa]">
            <span>© 2026 SeroFast. Built with</span>
            <Heart size={11} className="text-brandRed" fill="currentColor" />
            <span>in Bangalore, India.</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#aaa]">
            <a href="#" className="transition-colors hover:text-brandRed">Privacy</a>
            <span className="text-slate-200">·</span>
            <a href="#" className="transition-colors hover:text-brandRed">Terms</a>
            <span className="text-slate-200">·</span>
            <a href="#" className="transition-colors hover:text-brandRed">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
