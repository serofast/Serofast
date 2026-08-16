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
  Heart,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#eaeaea] bg-white text-textPrimary">
      {/* Top Banner inside footer highlighting core guarantees */}
      <div className="border-b border-[#f4f4f4] bg-[#fafafa]">
        <div className="mx-auto grid w-[min(1280px,calc(100%_-_48px))] grid-cols-2 gap-4 py-6 lg:grid-cols-4 max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)] max-560:gap-2.5">
          <div className="flex items-center gap-3 max-560:flex-col max-560:justify-center max-560:gap-1.5 max-560:text-center">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-promoHighlight text-brandRed">
              <Store size={20} />
            </div>
            <div>
              <strong className="block text-[13px] font-bold text-textPrimary">₹50 Shop Registration</strong>
              <span className="text-[11px] text-textSecondary">Keep 100% your margin profit</span>
            </div>
          </div>

          <div className="flex items-center gap-3 max-560:flex-col max-560:justify-center max-560:gap-1.5 max-560:text-center">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <GraduationCap size={20} />
            </div>
            <div>
              <strong className="block text-[13px] font-bold text-textPrimary">Student Entrepreneurship</strong>
              <span className="text-[11px] text-textSecondary">Earn profits, certificates &amp; awards</span>
            </div>
          </div>

          <div className="flex items-center gap-3 max-560:flex-col max-560:justify-center max-560:gap-1.5 max-560:text-center">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <Truck size={20} />
            </div>
            <div>
              <strong className="block text-[13px] font-bold text-textPrimary">Delivered in Hours</strong>
              <span className="text-[11px] text-textSecondary">₹0 Shipping on all local orders</span>
            </div>
          </div>

          <div className="flex items-center gap-3 max-560:flex-col max-560:justify-center max-560:gap-1.5 max-560:text-center">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <strong className="block text-[13px] font-bold text-textPrimary">100% Trusted Shops</strong>
              <span className="text-[11px] text-textSecondary">Verified neighborhood stores</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="mx-auto w-[min(1280px,calc(100%_-_48px))] py-12 lg:py-16 max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 max-560:grid-cols-2 max-560:gap-x-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Col 1: Brand Info */}
          <div className="max-560:col-span-2 lg:col-span-2 space-y-4 pr-0 lg:pr-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[22px] font-extrabold tracking-tight text-brandRed"
              aria-label="SeroFast home"
            >
              <Logo size="sm" />
              <span>SEROFAST</span>
            </Link>

            <p className="text-[13.5px] leading-relaxed text-textSecondary max-w-sm">
              India&apos;s leading hyperlocal marketplace connecting verified neighborhood shops, empowering ambitious student entrepreneurs, and delivering authentic products to local customers in hours with ₹0 shipping fees.
            </p>

            <div className="pt-2">
              <span className="block text-[12px] font-bold uppercase tracking-wider text-textPrimary">
                Headquarters &amp; Support
              </span>
              <div className="mt-2.5 space-y-2 text-[13px] text-textSecondary">
                <p className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-brandRed shrink-0" />
                  <span>Hyperlocal Tech Hub, Bangalore, India</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail size={16} className="text-brandRed shrink-0" />
                  <span>support@serofast.com</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone size={16} className="text-brandRed shrink-0" />
                  <span>+91 98765 43210 (7 AM - 11 PM)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Col 2: For Shop Owners */}
          <div>
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-textPrimary">
              For Shop Owners
            </h4>
            <ul className="mt-4 space-y-2.5 text-[13px] text-textSecondary">
              <li>
                <Link to="/create-shop" className="transition-colors hover:text-brandRed flex items-center gap-1.5">
                  <ArrowRight size={13} className="text-brandRed" />
                  <span>Start Shop for ₹50</span>
                </Link>
              </li>
              <li>
                <a href="#about" className="transition-colors hover:text-brandRed">
                  Keep Full Margin Profit
                </a>
              </li>
              <li>
                <Link to="/login" className="transition-colors hover:text-brandRed">
                  Shop Owner Portal
                </Link>
              </li>
              <li>
                <a href="#enquiry" className="transition-colors hover:text-brandRed">
                  Catalog Digitalization
                </a>
              </li>
              <li>
                <a href="#enquiry" className="transition-colors hover:text-brandRed">
                  Local Merchant FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Entrepreneurship */}
          <div>
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-textPrimary">
              Student Program
            </h4>
            <ul className="mt-4 space-y-2.5 text-[13px] text-textSecondary">
              <li>
                <a href="#enquiry" className="transition-colors hover:text-brandRed flex items-center gap-1.5 font-semibold text-brandRed">
                  <Award size={14} />
                  <span>Join as Entrepreneur</span>
                </a>
              </li>
              <li>
                <a href="#about" className="transition-colors hover:text-brandRed">
                  Earn Margin Profits
                </a>
              </li>
              <li>
                <a href="#about" className="transition-colors hover:text-brandRed">
                  Certificates &amp; Awards
                </a>
              </li>
              <li>
                <a href="#enquiry" className="transition-colors hover:text-brandRed">
                  Campus Ambassador Hub
                </a>
              </li>
              <li>
                <a href="#enquiry" className="transition-colors hover:text-brandRed">
                  Student Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer & Guarantees */}
          <div className="max-560:col-span-2">
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-textPrimary">
              Customer Promises
            </h4>
            <ul className="mt-4 space-y-2.5 text-[13px] text-textSecondary">
              <li>
                <a href="#products" className="transition-colors hover:text-brandRed">
                  Delivery in Hours
                </a>
              </li>
              <li>
                <a href="#products" className="transition-colors hover:text-brandRed font-medium text-emerald-600">
                  ₹0 Shipping Fee Guarantee
                </a>
              </li>
              <li>
                <a href="#shops" className="transition-colors hover:text-brandRed">
                  100% Verified Local Shops
                </a>
              </li>
              <li>
                <a href="#about" className="transition-colors hover:text-brandRed">
                  7-Day Easy Return Policy
                </a>
              </li>
              <li>
                <a href="#enquiry" className="transition-colors hover:text-brandRed">
                  Help &amp; 24/7 Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-[#f0f0f0] bg-white py-6">
        <div className="mx-auto flex w-[min(1280px,calc(100%_-_48px))] flex-col items-center justify-between gap-4 text-[12px] text-[#777] sm:flex-row max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]">
          <p className="m-0 text-center sm:text-left">
            © {new Date().getFullYear()} SeroFast Technologies Pvt. Ltd. All rights reserved.
          </p>

          <div className="flex items-center gap-1 text-center font-medium text-[#555]">
            <span>Crafted with</span>
            <Heart size={14} className="fill-brandRed text-brandRed" />
            <span>for Local Indian Shops &amp; Student Entrepreneurs</span>
          </div>

          <div className="flex items-center gap-5">
            <a href="#about" className="transition-colors hover:text-brandRed">Privacy</a>
            <a href="#about" className="transition-colors hover:text-brandRed">Terms</a>
            <a href="#about" className="transition-colors hover:text-brandRed">Merchant Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
