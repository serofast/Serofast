import { useState } from "react";
import { Mail, Send, CheckCircle, Sparkles, Phone, Clock } from "lucide-react";

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
    <section className="relative w-full py-14 sm:py-20 lg:py-24" id="enquiry">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-full -translate-x-1/2 bg-gradient-to-b from-brandRed/[0.02] to-transparent" />

      <div className="relative z-[2] mx-auto w-[min(1320px,calc(100%_-_40px))] sm:w-[min(1320px,calc(100%_-_48px))] max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]">
        <ScrollReveal variant="fade-down" className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brandRed/15 bg-promoHighlight px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brandRed">
            <Sparkles size={13} className="text-brandRed" />
            <span>GET IN TOUCH</span>
          </div>

          <h2 className="mt-4 text-[clamp(22px,3.2vw,36px)] font-extrabold tracking-[-0.02em] text-[#191616]">
            Have Questions or Want to Partner?
          </h2>

          <p className="mt-3 text-[13px] leading-relaxed text-[#8b8282] sm:text-[14px]">
            Whether you&apos;re a shop owner, student entrepreneur, or shopper — we&apos;re here for you!
          </p>
        </ScrollReveal>

        {/* Enquiry Form */}
        <ScrollReveal variant="scale-up" delay={120} duration={800} className="mx-auto mt-8 sm:mt-10 max-w-2xl">
          <div className="rounded-[24px] border border-slate-100 bg-[#fafafa] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] sm:p-7">
            {submitted ? (
              <div className="animate-scale-up flex flex-col items-center py-6 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                  <CheckCircle size={32} />
                </div>
                <h3 className="mt-4 text-[18px] font-bold text-[#191616]">
                  Enquiry Sent Successfully!
                </h3>
                <p className="mt-2 max-w-md text-[13px] text-[#8b8282]">
                  Thank you for reaching out. Our SeroFast coordinator will get in touch within 2 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-[#191616] px-6 text-[12px] font-bold text-white transition hover:bg-black"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Pills */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#888]">
                    Select Enquiry Type
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all duration-200 ${
                          category === cat
                            ? "bg-brandRed text-white shadow-sm"
                            : "border border-slate-200 bg-white text-[#555] hover:border-brandRed/30 hover:text-brandRed"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#888]">
                    Your Email Address
                  </label>
                  <div className="group mt-2 flex h-[48px] items-center rounded-[14px] border border-slate-200 bg-white px-4 text-[#777] transition-all duration-300 hover:border-slate-300 focus-within:border-brandRed focus-within:ring-4 focus-within:ring-brandRed/10">
                    <Mail size={18} className="shrink-0 transition-colors group-focus-within:text-brandRed" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full border-0 bg-transparent px-3 text-[13px] text-[#191616] outline-none placeholder:text-[#bbb]"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#888]">
                    Message / Details (Optional)
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your shop, student program interest, or query..."
                      className="w-full resize-none rounded-[14px] border border-slate-200 bg-white p-3.5 text-[13px] text-[#191616] outline-none transition-all duration-300 hover:border-slate-300 focus:border-brandRed focus:ring-4 focus:ring-brandRed/10"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex h-[48px] w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-brandRed to-rose-600 text-[14px] font-bold text-white shadow-[0_6px_20px_rgba(210,33,37,0.25)] transition-all duration-300 hover:shadow-[0_10px_28px_rgba(210,33,37,0.35)] hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Enquiry Now</span>
                      <Send size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[10px] text-[#aaa] pt-1">
                  <span>100% Privacy Protected. No spam.</span>
                  <span>Response within 2 hours</span>
                </div>
              </form>
            )}
          </div>
        </ScrollReveal>

        {/* Quick Contact */}
        <ScrollReveal variant="fade-up" delay={200} className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-5 text-[12px] text-[#8b8282] sm:gap-8">
          <div className="flex items-center gap-2">
            <Mail size={15} className="text-brandRed" />
            <span>support@serofast.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={15} className="text-brandRed" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-brandRed" />
            <span>Open 7:00 AM – 11:00 PM</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
