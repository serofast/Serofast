import { useState } from "react";
import { ChevronDown, Sparkles, MessageCircle } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How does the ₹50 Shop Registration work?",
      answer:
        "Local offline shop owners pay a simple, one-time setup fee of ₹50 to list their store and inventory on SeroFast. There are zero monthly subscription charges, no hidden maintenance fees, and no percentage commission cuts on sales.",
    },
    {
      question: "How do Student Entrepreneurs earn money & certificates?",
      answer:
        "Students join the Student Entrepreneurship Program for free. By sharing their custom store/partner referral links across campus networks, they earn profit margins on generated orders, plus verified Professional Certificates and quarterly awards.",
    },
    {
      question: "What are the delivery times and shipping costs for buyers?",
      answer:
        "Since SeroFast operates on a hyperlocal model connecting neighborhood stores directly with buyers in the same campus radius, orders are delivered within hours on the same day. All local orders feature ₹0 shipping charges.",
    },
    {
      question: "How do payments & settlements work for shop owners?",
      answer:
        "SeroFast supports UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery. For digital transactions, payouts are settled directly into the merchant's bank account instantly upon order completion.",
    },
    {
      question: "What is the return and replacement policy?",
      answer:
        "Local buyers enjoy a hassle-free 7-day local return policy. Since products are sourced directly from verified local shops nearby, returns and replacements are processed quickly by local customer support.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="relative w-full py-14 sm:py-20 lg:py-24" id="faq">
      <div className="mx-auto w-[min(1320px,calc(100%_-_40px))] sm:w-[min(1320px,calc(100%_-_48px))] max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)] max-w-3xl">
        <ScrollReveal variant="fade-down" className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brandRed/15 bg-promoHighlight px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brandRed">
            <Sparkles size={13} className="text-brandRed" />
            <span>GOT QUESTIONS? WE&apos;VE GOT ANSWERS</span>
          </div>

          <h2 className="mt-4 text-[clamp(22px,3.2vw,36px)] font-extrabold tracking-[-0.02em] text-[#191616]">
            Frequently Asked Questions
          </h2>

          <p className="mt-3 text-[13px] leading-relaxed text-[#8b8282] sm:text-[14px]">
            Everything you need to know about setting up your shop, joining the student program, or ordering.
          </p>
        </ScrollReveal>

        {/* Accordion List */}
        <ScrollReveal variant="fade-up" delay={120} className="mt-8 sm:mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-[18px] border transition-all duration-300 ${
                  isOpen
                    ? "border-brandRed/25 bg-white shadow-[0_6px_24px_rgba(210,33,37,0.06)]"
                    : "border-slate-100 bg-white hover:border-slate-200 hover:bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left text-[13px] font-bold text-[#191616] sm:text-[14px]"
                  aria-expanded={isOpen}
                >
                  <span className={`transition-colors ${isOpen ? "text-brandRed" : ""}`}>
                    {faq.question}
                  </span>
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                      isOpen ? "rotate-180 bg-brandRed text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 pt-1 text-[12px] sm:text-[13px] leading-relaxed text-[#8b8282] border-t border-slate-100/80">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollReveal>

        <div className="mt-6 text-center text-[12px] font-semibold text-[#8b8282]">
          Still have questions?{" "}
          <a href="#calculator" className="text-brandRed font-bold hover:underline">
            Send an enquiry to our team
          </a>
        </div>
      </div>
    </section>
  );
}
