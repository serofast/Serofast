import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles, MessageCircle } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const faqs = [
    {
      question: "How does the ₹50 Shop Registration work?",
      answer:
        "Local offline shop owners pay a simple, one-time setup fee of ₹50 to list their store and inventory on SeroFast. There are zero monthly subscription charges, no hidden maintenance fees, and no percentage commission cuts on sales.",
    },
    {
      question: "How do Student Entrepreneurs earn money & certificates?",
      answer:
        "Students join the Student Entrepreneurship Program for free. By sharing their custom store/partner referral links across campus networks and residential societies, they earn handsome profit margins on generated orders, plus verified Professional Certificates and quarterly awards.",
    },
    {
      question: "What are the delivery times and shipping costs for buyers?",
      answer:
        "Since SeroFast operates on a hyperlocal model connecting neighborhood stores directly with buyers in the same town/campus radius, orders are delivered within hours on the same day. All local orders feature ₹0 shipping charges.",
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
    <section className="relative w-full bg-gradient-to-b from-white via-[#fafafa] to-white py-16 sm:py-20 lg:py-24 border-t border-[#eee]" id="faq">
      <div className="mx-auto w-[min(1280px,calc(100%_-_48px))] max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)] max-w-3xl">
        <ScrollReveal variant="fade-down" className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brandRed/20 bg-promoHighlight px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brandRed shadow-xs">
            <Sparkles size={14} className="text-brandRed" />
            <span>GOT QUESTIONS? WE&apos;VE GOT ANSWERS</span>
          </div>

          <h2 className="mt-4 text-[clamp(26px,3.2vw,38px)] font-extrabold tracking-tight text-textPrimary">
            Frequently Asked Questions
          </h2>

          <p className="mt-3 text-[14px] leading-relaxed text-textSecondary sm:text-[15px]">
            Everything you need to know about setting up your shop, joining the student program, or ordering from local neighborhood stores.
          </p>
        </ScrollReveal>

        {/* Expandable Accordion List */}
        <ScrollReveal variant="fade-up" delay={120} className="mt-10 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-brandRed/40 bg-white shadow-[0_8px_24px_rgba(210,33,37,0.08)]"
                    : "border-gray-200 bg-white/80 hover:border-gray-300 hover:bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-bold text-textPrimary sm:text-base cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className={`transition-colors duration-200 ${isOpen ? "text-brandRed" : "group-hover:text-brandRed"}`}>
                    {faq.question}
                  </span>
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-brandRed text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {/* Animated Accordion Content via Grid Row Transition */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-textSecondary border-t border-gray-100/80">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollReveal>

        {/* Additional help footer link */}
        <div className="mt-8 text-center text-xs font-semibold text-textSecondary">
          Still have questions?{" "}
          <a href="#enquiry" className="text-brandRed font-bold hover:underline">
            Send an enquiry to our team
          </a>
        </div>
      </div>
    </section>
  );
}
