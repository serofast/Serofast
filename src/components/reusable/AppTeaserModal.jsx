import { useState } from "react";
import {
  X,
  Smartphone,
  Sparkles,
  QrCode,
  CheckCircle2,
  Send,
  ArrowRight,
  ShieldCheck,
  Zap,
  Store,
  Star,
} from "lucide-react";

export default function AppTeaserModal({ isOpen, onClose, initialItemName }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [joinedWaitlist, setJoinedWaitlist] = useState(false);
  const [activeTab, setActiveTab] = useState("download"); // "download" | "waitlist"

  if (!isOpen) return null;

  const handleSendLink = (e) => {
    e.preventDefault();
    if (phoneNumber.trim().length >= 8) {
      setLinkSent(true);
    }
  };

  const handleJoinWaitlist = (e) => {
    e.preventDefault();
    if (waitlistEmail.trim().length >= 5) {
      setJoinedWaitlist(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 max-560:p-2.5">
      {/* Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-[620px] overflow-hidden rounded-[28px] border border-white/20 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.35)] animate-in zoom-in-95 duration-250">
        {/* Top Header Gradient Banner */}
        <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-brandRed px-6 py-6 text-white max-560:px-4 max-560:py-5">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white active:scale-90"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brandRed/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-300 border border-brandRed/30 shadow-inner">
              <Sparkles size={13} className="text-amber-400 animate-pulse" />
              SeroFast Mobile App
            </span>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
              Coming Soon
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-white max-560:text-xl">
            Looking to shop products on SeroFast?
          </h2>

          <p className="mt-1.5 text-xs leading-relaxed text-slate-300 max-w-[500px]">
            {initialItemName ? (
              <>You selected <strong className="text-amber-300 font-semibold">&ldquo;{initialItemName}&rdquo;</strong>. </>
            ) : null}
            This website is strictly designed for <strong className="text-white">Shop Owners</strong> &amp; <strong className="text-white">Admin Management</strong>. Customer product browsing and 15-min campus orders take place inside our Mobile App!
          </p>

          {/* Key Value Badges */}
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-slate-200">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 backdrop-blur-sm">
              <Zap size={13} className="text-amber-400" />
              15-Min Campus Delivery
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 backdrop-blur-sm">
              <Store size={13} className="text-rose-300" />
              Direct Store Pricing
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 backdrop-blur-sm">
              <ShieldCheck size={13} className="text-emerald-400" />
              Verified Campus Outlets
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-560:p-4">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => setActiveTab("download")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                activeTab === "download"
                  ? "bg-white text-slate-900 shadow-md shadow-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Smartphone size={16} className={activeTab === "download" ? "text-brandRed" : ""} />
              Get App Link via SMS
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("waitlist")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                activeTab === "waitlist"
                  ? "bg-white text-slate-900 shadow-md shadow-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Star size={16} className={activeTab === "waitlist" ? "text-amber-500" : ""} />
              VIP Early Access
            </button>
          </div>

          {activeTab === "download" ? (
            <div>
              {!linkSent ? (
                <form onSubmit={handleSendLink} className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    Enter your mobile number to get the app download link:
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        +91
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="98765 43210"
                        maxLength={10}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-12 pr-4 text-xs font-medium text-slate-900 outline-none transition focus:border-brandRed focus:bg-white focus:ring-2 focus:ring-brandRed/10"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-brandRed px-5 py-3 text-xs font-bold text-white shadow-lg shadow-brandRed/25 transition hover:bg-brandRedDark active:scale-95 shrink-0"
                    >
                      <Send size={14} />
                      Send Link
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    We will text you an instant link as soon as the app goes live on App Store &amp; Play Store.
                  </p>
                </form>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-center animate-in zoom-in-95">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-slate-900">
                    App Link Sent!
                  </h4>
                  <p className="mt-1 text-xs text-slate-600">
                    We&apos;ve sent the app download details to <strong className="text-slate-900">+91 {phoneNumber}</strong>. You&apos;ll be notified first on launch!
                  </p>
                  <button
                    type="button"
                    onClick={() => setLinkSent(false)}
                    className="mt-3 text-[11px] font-semibold text-brandRed hover:underline"
                  >
                    Send to a different number
                  </button>
                </div>
              )}

              {/* QR Code & App Badges Preview */}
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-4 max-560:flex-col max-560:gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-white p-2 border border-slate-200 shadow-sm shrink-0">
                    <QrCode size={28} className="text-slate-800" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Scan QR Code</h5>
                    <p className="text-[11px] text-slate-500">Scan with your smartphone camera</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-white text-[10px] font-semibold flex items-center gap-1.5">
                    <Smartphone size={13} />
                    App Store
                  </div>
                  <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-white text-[10px] font-semibold flex items-center gap-1.5">
                    <Zap size={13} className="text-emerald-400" />
                    Google Play
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {!joinedWaitlist ? (
                <form onSubmit={handleJoinWaitlist} className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    Join VIP Waitlist &amp; get ₹100 shopping credit on launch day:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="your.email@university.edu"
                      required
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-xs font-medium text-slate-900 outline-none transition focus:border-brandRed focus:bg-white focus:ring-2 focus:ring-brandRed/10"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-95 shrink-0"
                    >
                      Join Waitlist
                      <ArrowRight size={14} />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Over 2,400+ students &amp; campus shoppers have joined the SeroFast mobile waitlist.
                  </p>
                </form>
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-center animate-in zoom-in-95">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/30">
                    <Star size={24} />
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-slate-900">
                    You&apos;re on the VIP Waitlist! 🎉
                  </h4>
                  <p className="mt-1 text-xs text-slate-600">
                    We&apos;ve reserved your ₹100 credit for <strong className="text-slate-900">{waitlistEmail}</strong>. Keep an eye on your inbox!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Shop Owner CTA Section */}
          <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between max-560:flex-col max-560:text-center max-560:gap-2">
            <span className="text-[11px] font-medium text-slate-500">
              Are you a local store merchant or shop owner?
            </span>
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brandRed hover:underline"
            >
              Shop Owner Login &amp; Portal
              <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
