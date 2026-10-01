import { useState } from "react";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import { TextAnimate } from "@/registry/magicui/text-animate";
import ParallaxLayer from "../../motion/ParallaxLayer";

const FAQS = [
  {
    question: "What is SeroFast and how does it work for college students?",
    answer:
      "SeroFast is India's campus social commerce ecosystem. College students can launch their own digital shop in under 2 minutes with zero inventory or upfront cost, pick products from verified campus catalogs, set custom profit margins, and share with hostel peers. SeroFast handles quality inspection, packaging, and dispatch.",
  },
  {
    question: "Do I need any money or stock to start selling?",
    answer:
      "None at all. SeroFast operates on a zero-stock dropshipping model. SeroFast regional hubs source, inspect, and hold all inventory. You only choose what items to feature in your shop, set your markup, and promote your store link. You never buy products upfront.",
  },
  {
    question: "How much commission does SeroFast take from my earnings?",
    answer:
      "0% platform commission. When you set your retail markup on products, 100% of that margin belongs to you. There are no monthly fees, no hidden maintenance charges, and no listing fees.",
  },
  {
    question: "How and when do I receive my profit payouts?",
    answer:
      "Payouts are instant and automated directly to any UPI ID (Google Pay, PhonePe, or Paytm) within seconds of successful customer order completion. There is no minimum withdrawal limit or payout waiting period.",
  },
  {
    question: "How does campus delivery work for buyers?",
    answer:
      "Orders are delivered straight to campus hostel gates, dorm rooms, or canteens in under 45 minutes by student runners. Every delivery is secured with a 4-digit arrival OTP to ensure authentic peer-to-peer handover.",
  },
  {
    question: "What is the return and replacement policy for student buyers?",
    answer:
      "All campus purchases come with an authentic 7-day hassle-free return and replacement guarantee. If an item has any size or quality issue, our campus support team handles direct pickup and full replacement or refund.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section
      id="faq"
      className="relative border-b border-[#EBE3DC] bg-gradient-to-b from-white via-[#FAF8F5] to-white py-16 lg:py-24 select-none overflow-hidden"
    >
      {/* Soft Ambient Parallax Atmosphere */}
      <ParallaxLayer speed={0.16} className="section-atmosphere">
        <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-brandRed/[0.04] blur-3xl" />
        <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-rose-200/20 blur-3xl" />
      </ParallaxLayer>

      <div className="relative mx-auto w-[min(1400px,calc(100%_-_32px))] max-w-3xl">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brandRed/20 bg-brandRed/5 px-3.5 py-1 text-xs font-bold text-brandRed">
            <HelpCircle size={13} className="text-brandRed" />
            <span>Got Questions? We've Got Answers</span>
          </div>

          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            as="h2"
            className="mt-3 text-[clamp(1.8rem,3.4vw,2.7rem)] font-black tracking-tight text-[#191616]"
          >
            Frequently Asked Questions
          </TextAnimate>

          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Everything you need to know about setting up your campus storefront, zero-stock dropshipping, and hostel delivery.
          </p>
        </div>

        {/* Accordion List */}
        <div className="mt-10 space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal
                key={index}
                variant="fade-up"
                delay={index * 60}
                duration={500}
              >
                <div
                  className={`overflow-hidden rounded-2xl border transition-all duration-200 bg-white ${
                    isOpen
                      ? "border-brandRed/30 shadow-[0_8px_24px_rgba(211,47,47,0.08)]"
                      : "border-[#EBE3DC] hover:border-brandRed/20 hover:shadow-xs"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left text-sm font-bold text-[#191616] transition-colors hover:text-brandRed"
                    aria-expanded={isOpen}
                  >
                    <span className={isOpen ? "text-brandRed font-black" : ""}>
                      {faq.question}
                    </span>
                    <div
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-transform duration-200 ${
                        isOpen
                          ? "rotate-180 bg-brandRed text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ChevronDown size={15} />
                    </div>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-250 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-[#F3E5E5] px-5 pb-5 pt-3.5 text-xs sm:text-[13px] leading-relaxed text-slate-600">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center text-xs font-medium text-slate-500">
          Have more questions?{" "}
          <Link
            to="/signup"
            className="inline-flex items-center gap-1 font-bold text-brandRed hover:underline"
          >
            <span>Start selling free today</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}

