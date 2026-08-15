import { useState, useEffect, useRef } from "react";
import { Check, X, ShieldCheck, Zap, TrendingUp, Sparkles, ArrowRight, DollarSign, Percent } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

export default function ComparisonPricingSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [monthlySales, setMonthlySales] = useState(100000); // Default ₹100,000 monthly sales slider
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Calculate traditional marketplace commission (approx 20%) vs SeroFast (0% commission, flat ₹50 setup)
  const traditionalCommission = Math.round(monthlySales * 0.20);
  const traditionalAnnualFee = 15000;
  const traditionalTotalAnnualCost = (traditionalCommission * 12) + traditionalAnnualFee;

  const serofastCommission = 0;
  const serofastSetupFee = 50;
  const serofastTotalAnnualCost = serofastSetupFee;

  const annualSavings = traditionalTotalAnnualCost - serofastTotalAnnualCost;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-gradient-to-b from-white via-[#fff7f7] to-white py-16 sm:py-20 lg:py-24 border-y border-[#ffe2e2] overflow-hidden"
      id="comparison"
    >
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute left-10 top-20 h-72 w-72 rounded-full bg-brandRed/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative z-[2] mx-auto w-[min(1280px,calc(100%_-_48px))] max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]">
        <ScrollReveal variant="fade-down" className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brandRed/20 bg-promoHighlight px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brandRed shadow-xs">
            <Sparkles size={14} className="text-brandRed" />
            <span>TRANSPARENT PRICING &amp; SAVINGS</span>
          </div>

          <h2 className="mt-4 text-[clamp(28px,3.6vw,44px)] font-extrabold leading-[1.12] tracking-tight text-textPrimary">
            Why Shop Owners Save Thousands with SeroFast
          </h2>

          <p className="mt-3 text-[15px] leading-relaxed text-textSecondary sm:text-[16px]">
            Traditional aggregators drain your hard-earned margins with 15-30% commissions and annual platform fees. With SeroFast, pay just ₹50 once and keep 100% of your profits.
          </p>
        </ScrollReveal>

        {/* Dynamic Calculator & Comparison Bar Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Interactive Calculator Slider Card */}
          <div className="lg:col-span-5 rounded-3xl border border-white/80 bg-white/95 p-7 shadow-[0_12px_36px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_20px_45px_rgba(210,33,37,0.1)]">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-brandRed/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-brandRed">
                Profit Calculator
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <TrendingUp size={14} /> 100% Margin Retention
              </span>
            </div>

            <h3 className="mt-4 text-xl font-extrabold text-textPrimary">
              Estimate Your Annual Savings
            </h3>

            <div className="mt-6">
              <div className="flex justify-between text-sm font-bold text-textPrimary">
                <span>Monthly Store Revenue:</span>
                <span className="text-brandRed text-base font-extrabold">
                  ₹{monthlySales.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="5000"
                value={monthlySales}
                onChange={(e) => setMonthlySales(Number(e.target.value))}
                className="mt-3 w-full accent-brandRed cursor-pointer h-2 bg-gray-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-textMuted mt-1">
                <span>₹10,000/mo</span>
                <span>₹250,000/mo</span>
                <span>₹500,000/mo</span>
              </div>
            </div>

            {/* Savings Highlight Box */}
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 transition-transform duration-300 hover:scale-[1.02]">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Estimated Annual Money Kept in Your Pocket
              </div>
              <div className="mt-1 text-3xl font-extrabold text-emerald-700">
                ₹{annualSavings.toLocaleString("en-IN")}
              </div>
              <p className="mt-1 text-[12px] text-emerald-800">
                Compared to standard 20% commission marketplace apps.
              </p>
            </div>

            <Link
              to="/create-shop"
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brandRed text-sm font-bold text-white shadow-[0_8px_20px_rgba(210,33,37,0.3)] transition-all duration-300 hover:bg-[#b81b1f] hover:shadow-[0_12px_28px_rgba(210,33,37,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              <span>Register Your Store for ₹50 Now</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Comparison Side-by-Side Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Traditional Aggregators Card */}
            <div className="rounded-3xl border border-gray-200 bg-gray-50/90 p-6 transition-all duration-300 hover:border-gray-300 hover:bg-white hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-gray-500 uppercase tracking-wider">
                  Traditional Apps
                </span>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-600">
                  High Cost
                </span>
              </div>
              <div className="mt-3 text-2xl font-extrabold text-gray-800">
                15% – 30% <span className="text-sm font-normal text-gray-500">Commission</span>
              </div>

              <div className="mt-5 space-y-3 border-t border-gray-200 pt-4 text-xs font-medium text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Annual Listing Fees</span>
                  <span className="font-bold text-red-600">₹10,000 – ₹25,000/yr</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Commission Per Order</span>
                  <span className="font-bold text-red-600">15% to 30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Merchant Customer Data</span>
                  <span className="font-bold text-gray-500">Locked / Hidden</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Payout Delay</span>
                  <span className="font-bold text-gray-500">7 to 14 Days</span>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1">
                  <span>Cost Burden</span>
                  <span>High (85%)</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: isVisible ? "85%" : "0%" }}
                  />
                </div>
              </div>
            </div>

            {/* SeroFast Platform Card */}
            <div className="relative rounded-3xl border-2 border-brandRed bg-white p-6 shadow-[0_12px_32px_rgba(210,33,37,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(210,33,37,0.2)]">
              <div className="absolute -top-3 right-6 rounded-full bg-brandRed px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                RECOMMENDED
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-brandRed uppercase tracking-wider">
                  SeroFast Platform
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                  0% Commission
                </span>
              </div>

              <div className="mt-3 text-2xl font-extrabold text-textPrimary">
                ₹50 <span className="text-sm font-bold text-brandRed">One-Time Setup</span>
              </div>

              <div className="mt-5 space-y-3 border-t border-red-100 pt-4 text-xs font-medium text-textPrimary">
                <div className="flex items-center justify-between">
                  <span>Annual Listing Fees</span>
                  <span className="font-bold text-emerald-600">₹0 / Year</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Commission Per Order</span>
                  <span className="font-bold text-emerald-600">0% (100% Yours)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Direct Customer Reach</span>
                  <span className="font-bold text-emerald-600">Full Access</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Settlement Speed</span>
                  <span className="font-bold text-emerald-600">Instant UPI</span>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-[11px] font-bold text-emerald-700 mb-1">
                  <span>Merchant Retention</span>
                  <span>100% Profit</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-emerald-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: isVisible ? "100%" : "0%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
