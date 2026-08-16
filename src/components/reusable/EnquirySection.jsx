import { useState } from "react";
import { Mail, Send, CheckCircle, Sparkles, MessageSquare, Phone, Clock, Store, GraduationCap } from "lucide-react";

import ScrollReveal from "./ScrollReveal";

export default function EnquirySection() {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Shop Partner (₹50)");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Shop Partner (₹50)",
    "Student Entrepreneur",
    "Customer Support",
    "General Enquiry",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setEmail("");
      setMessage("");
    }, 600);
  };

  return (
    <section className="relative w-full bg-white py-16 sm:py-20 lg:py-24" id="enquiry">
      {/* Decorative ambient elements */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-full -translate-x-1/2 bg-gradient-to-b from-[#fff5f5]/60 to-transparent" />

      <div className="relative z-[2] mx-auto w-[min(1280px,calc(100%_-_48px))] max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]">
        <ScrollReveal variant="fade-down" className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brandRed/20 bg-promoHighlight px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brandRed shadow-2xs">
            <Sparkles size={14} className="text-brandRed" />
            <span>GET IN TOUCH</span>
          </div>

          <h2 className="mt-4 text-[clamp(26px,3.2vw,38px)] font-extrabold tracking-tight text-textPrimary">
            Have Questions or Want to Partner with Us?
          </h2>

          <p className="mt-3 text-[14px] leading-relaxed text-textSecondary sm:text-[15px]">
            Whether you are a local shop owner eager to start with ₹50, a student looking to earn and receive certificates, or a shopper with a question, we&apos;re here for you!
          </p>
        </ScrollReveal>

        {/* Enquiry Box Container with Scroll Reveal */}
        <ScrollReveal variant="scale-up" delay={120} duration={800} className="mx-auto mt-10 max-w-2xl">
          <div className="rounded-[24px] border border-[#ebebeb] bg-[#fafafa] p-6 shadow-[0_12px_36px_rgba(0,0,0,0.03)] sm:p-8">
            {submitted ? (
              <div className="animate-scale-up flex flex-col items-center py-6 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                  <CheckCircle size={32} />
                </div>
                <h3 className="mt-4 text-[20px] font-bold text-textPrimary">
                  Enquiry Sent Successfully!
                </h3>
                <p className="mt-2 max-w-md text-[14px] text-textSecondary">
                  Thank you for reaching out. Our SeroFast hyperlocal coordinator will get in touch with you via email within 2 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-textPrimary px-6 text-xs font-bold text-white transition hover:bg-black"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Pills */}
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#666]">
                    Select Enquiry Type
                  </label>
                  <div className="mt-2.5 flex flex-wrap gap-2 max-560:flex-col max-560:gap-2.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-all duration-200 max-560:py-2 ${
                          category === cat
                            ? "bg-brandRed text-white shadow-sm"
                            : "border border-[#e0e0e0] bg-white text-[#555] hover:border-brandRed hover:text-brandRed"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Email Input Box with 18px radius */}
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#666]">
                    Your Email Address
                  </label>
                  <div className="group mt-2 flex h-[52px] items-center rounded-[18px] border border-[#d9d9d9] bg-white px-4 text-[#777] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-[#bbb] focus-within:border-brandRed focus-within:ring-4 focus-within:ring-brandRed/10 focus-within:shadow-[0_4px_18px_rgba(210,33,37,0.1)]">
                    <Mail size={20} className="shrink-0 transition-colors duration-200 group-focus-within:text-brandRed" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address (e.g. you@example.com)"
                      className="w-full border-0 bg-transparent px-3 text-[14.5px] text-textPrimary outline-none placeholder:text-[#999]"
                    />
                  </div>
                </div>

                {/* Optional Message Field */}
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#666]">
                    Message / Details (Optional)
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your shop, student program interest, or query..."
                      className="w-full resize-none rounded-[16px] border border-[#d9d9d9] bg-white p-3.5 text-[14px] text-textPrimary outline-none transition-all duration-300 hover:border-[#bbb] focus:border-brandRed focus:ring-4 focus:ring-brandRed/10"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex h-[50px] w-full items-center justify-center gap-2.5 rounded-[18px] bg-brandRed text-[15px] font-bold text-white shadow-[0_8px_22px_rgba(210,33,37,0.25)] transition-all duration-300 hover:bg-brandRedDark hover:shadow-[0_12px_28px_rgba(210,33,37,0.35)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Sending Enquiry...</span>
                  ) : (
                    <>
                      <span>Send Enquiry Now</span>
                      <Send size={17} className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>

                <div className="flex flex-col items-start gap-1 text-[11px] text-[#777] pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <span>🔒 100% Privacy Protected. No spam.</span>
                  <span>⚡ Response guaranteed within 2 hours</span>
                </div>
              </form>
            )}
          </div>
        </ScrollReveal>

        {/* Quick Contact Chips with Scroll Reveal */}
        <ScrollReveal variant="fade-up" delay={200} className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[13px] text-textSecondary sm:gap-8">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-brandRed" />
            <span>support@serofast.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-brandRed" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-brandRed" />
            <span>Open 7:00 AM – 11:00 PM</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
