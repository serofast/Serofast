import { useState, useEffect, useRef } from "react";
import { TrendingUp, Sparkles, ArrowRight, Check, X, ShieldCheck, Zap, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

export default function ComparisonPricingSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [monthlySales, setMonthlySales] = useState(100000);
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
      className="relative w-full py-14 sm:py-20 lg:py-24 overflow-hidden"
      id="comparison"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-10 top-20 h-72 w-72 rounded-full bg-brandRed/[0.04] blur-[100px]" />
      <div className="pointer-events-none absolute right-10 bottom-20 h-80 w-80 rounded-full bg-emerald-400/[0.04] blur-[100px]" />

      <div className="relative z-[2] mx-auto w-[min(1320px,calc(100%_-_40px))] sm:w-[min(1320px,calc(100%_-_48px))] max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]">
        <ScrollReveal variant="fade-down" className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brandRed/15 bg-promoHighlight px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brandRed">
            <Sparkles size={13} className="text-brandRed" />
            <span>TRANSPARENT PRICING & SAVINGS</span>
          </div>

          <h2 className="mt-4 text-[clamp(24px,3.6vw,40px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#191616]">
            Why Shop Owners Save Thousands with SeroFast
          </h2>

          <p className="mt-3 text-[14px] leading-relaxed text-[#8b8282] sm:text-[15px]">
            Traditional aggregators drain your margins with 15-30% commissions. With SeroFast, pay just ₹50 once and keep 100% of your profits.
          </p>
        </ScrollReveal>

        {/* Calculator + Comparison Grid */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Calculator Card */}
          <ScrollReveal variant="fade-left" delay={100} className="lg:col-span-5">
            <div className="rounded-[24px] border border-slate-100 bg-white p-5 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-brandRed/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-brandRed">
                  Profit Calculator
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <TrendingUp size={13} /> 100% Margin
                </span>
              </div>

              <h3 className="mt-4 text-[18px] font-extrabold text-[#191616]">
                Estimate Your Annual Savings
              </h3>

              <div className="mt-5">
                <div className="flex items-baseline justify-between text-[13px] font-bold text-[#191616]">
                  <span>Monthly Store Revenue:</span>
                  <span className="text-brandRed text-[17px] font-extrabold">
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
                  className="mt-4 w-full accent-brandRed cursor-pointer h-2 bg-slate-100 rounded-full touch-manipulation"
                />
                <div className="flex justify-between text-[10px] text-[#aaa] mt-1.5">
                  <span>₹10K/mo</span>
                  <span>₹250K/mo</span>
                  <span>₹500K/mo</span>
                </div>
              </div>

              {/* Savings Highlight */}
              <div className="mt-5 rounded-[18px] border border-emerald-200/60 bg-emerald-50/80 p-4 transition-transform duration-300 hover:scale-[1.01]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Estimated Annual Savings
                </div>
                <div className="mt-1 text-[28px] font-extrabold text-emerald-700">
                  ₹{annualSavings.toLocaleString("en-IN")}
                </div>
                <p className="mt-1 text-[11px] text-emerald-800">
                  vs. 20% commission marketplace apps.
                </p>
              </div>

              <Link
                to="/signup"
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-brandRed to-rose-600 text-[13px] font-bold text-white shadow-[0_6px_20px_rgba(210,33,37,0.3)] transition-all duration-300 hover:shadow-[0_10px_28px_rgba(210,33,37,0.4)] hover:-translate-y-0.5 active:scale-[0.97]"
              >
                <span>Become a Shop Owner for ₹50 Now</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </ScrollReveal>

          {/* Comparison Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Traditional Aggregators */}
            <ScrollReveal variant="fade-up" delay={150}>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-5 sm:p-6 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-[#888] uppercase tracking-wider">
                    Traditional Apps
                  </span>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                    High Cost
                  </span>
                </div>
                <div className="mt-3 text-[22px] font-extrabold text-slate-700">
                  15%–30% <span className="text-[12px] font-medium text-[#888]">commission</span>
                </div>

                <div className="mt-4 space-y-2.5 border-t border-slate-200 pt-4 text-[11px] font-medium text-[#555]">
                  {[
                    { label: "Annual Listing Fees", value: "₹10K–₹25K/yr", bad: true },
                    { label: "Commission Per Order", value: "15% to 30%", bad: true },
                    { label: "Customer Data Access", value: "Locked", bad: true },
                    { label: "Payout Delay", value: "7 to 14 days", bad: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span>{item.label}</span>
                      <span className={`font-bold ${item.bad ? "text-red-500" : "text-[#888]"}`}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-[10px] font-bold text-[#888] mb-1.5">
                    <span>Cost Burden</span>
                    <span>High (85%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: isVisible ? "85%" : "0%" }}
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* SeroFast Platform */}
            <ScrollReveal variant="fade-up" delay={200}>
              <div className="relative rounded-[24px] border-2 border-brandRed/30 bg-white p-5 sm:p-6 shadow-[0_10px_32px_rgba(210,33,37,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(210,33,37,0.14)]">
                <div className="absolute -top-3 right-5 rounded-full bg-brandRed px-3 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                  RECOMMENDED
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-brandRed uppercase tracking-wider">
                    SeroFast Platform
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    0% Commission
                  </span>
                </div>

                <div className="mt-3 text-[22px] font-extrabold text-[#191616]">
                  ₹50 <span className="text-[12px] font-bold text-brandRed">One-Time Setup</span>
                </div>

                <div className="mt-4 space-y-2.5 border-t border-brandRed/10 pt-4 text-[11px] font-medium text-[#191616]">
                  {[
                    { label: "Annual Listing Fees", value: "₹0 / Year", good: true },
                    { label: "Commission Per Order", value: "0% (100% Yours)", good: true },
                    { label: "Direct Customer Reach", value: "Full Access", good: true },
                    { label: "Settlement Speed", value: "Instant UPI", good: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span>{item.label}</span>
                      <span className={`font-bold ${item.good ? "text-emerald-600" : "text-[#888]"}`}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-[10px] font-bold text-emerald-700 mb-1.5">
                    <span>Profit Retention</span>
                    <span>100%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-emerald-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: isVisible ? "100%" : "0%" }}
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
