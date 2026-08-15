import { useState } from "react";
import {
  X,
  Smartphone,
  Sparkles,
  QrCode,
  CheckCircle2,
  Send,
  ArrowRight,
  Zap,
  Star,
} from "lucide-react";

export default function AppTeaserModal({ isOpen, onClose, initialItemName }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [joinedWaitlist, setJoinedWaitlist] = useState(false);
  const [activeTab, setActiveTab] = useState("download");

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
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4 max-560:p-0">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-[540px] flex-col overflow-hidden rounded-t-3xl border border-slate-100 bg-white shadow-2xl animate-in zoom-in-95 duration-200 sm:rounded-3xl max-560:pb-[env(safe-area-inset-bottom)]">
        {/* Bottom-sheet drag handle (mobile) */}
        <div className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-slate-200 sm:hidden" aria-hidden="true" />

        {/* Header */}
        <div className="relative bg-slate-950 px-6 py-6 text-white max-560:px-4 max-560:py-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-brandRed/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-300 border border-brandRed/30">
              <Sparkles size={12} className="text-amber-400" />
              SeroFast Mobile App
            </span>
          </div>

          <h2 className="mt-2.5 text-xl font-extrabold tracking-tight text-white max-560:text-lg">
            Shopping App Launching Soon
          </h2>

          <p className="mt-1 text-xs text-slate-300">
            {initialItemName ? (
              <>You selected <strong className="text-amber-300 font-semibold">&ldquo;{initialItemName}&rdquo;</strong>. </>
            ) : null}
            This web platform is for **Shop Owners**. Customer orders take place in our upcoming Mobile App!
          </p>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 max-560:p-4">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab("download")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                activeTab === "download"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Smartphone size={15} className={activeTab === "download" ? "text-brandRed" : ""} />
              SMS App Link
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("waitlist")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                activeTab === "waitlist"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Star size={15} className={activeTab === "waitlist" ? "text-amber-500" : ""} />
              VIP Early Access
            </button>
          </div>

          {activeTab === "download" ? (
            <div>
              {!linkSent ? (
                <form onSubmit={handleSendLink} className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    Get an instant SMS download link:
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
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-12 pr-3 text-xs font-medium text-slate-900 outline-none transition focus:border-brandRed focus:bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brandRed px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brandRed/20 transition hover:bg-brandRedDark active:scale-95 shrink-0"
                    >
                      <Send size={14} />
                      Send Link
                    </button>
                  </div>
                </form>
              ) : (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-center animate-in zoom-in-95">
                  <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-white shadow-md">
                    <CheckCircle2 size={20} />
                  </div>
                  <h4 className="mt-1.5 text-xs font-bold text-slate-900">
                    App Link Sent!
                  </h4>
                  <p className="mt-0.5 text-[11px] text-slate-600">
                    Text sent to <strong className="text-slate-900">+91 {phoneNumber}</strong>.
                  </p>
                </div>
              )}

              {/* QR Preview */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 max-560:flex-col max-560:gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-white border border-slate-200 shadow-2xs shrink-0">
                    <QrCode size={22} className="text-slate-800" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Scan QR Code</h5>
                    <p className="text-[10px] text-slate-500">Scan with camera to preview app</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="rounded-md bg-slate-900 px-2.5 py-1 text-white text-[10px] font-semibold flex items-center gap-1">
                    <Smartphone size={12} /> App Store
                  </span>
                  <span className="rounded-md bg-slate-900 px-2.5 py-1 text-white text-[10px] font-semibold flex items-center gap-1">
                    <Zap size={12} className="text-emerald-400" /> Play Store
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {!joinedWaitlist ? (
                <form onSubmit={handleJoinWaitlist} className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    Join VIP Waitlist &amp; get ₹100 shopping credit:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="your.email@university.edu"
                      required
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs font-medium text-slate-900 outline-none transition focus:border-brandRed focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-95 shrink-0"
                    >
                      Join Waitlist
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-center animate-in zoom-in-95">
                  <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-amber-500 text-white shadow-md">
                    <Star size={20} />
                  </div>
                  <h4 className="mt-1.5 text-xs font-bold text-slate-900">
                    VIP Reserved! 🎉
                  </h4>
                  <p className="mt-0.5 text-[11px] text-slate-600">
                    ₹100 reserved for <strong className="text-slate-900">{waitlistEmail}</strong>.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">
              Are you a campus shop owner?
            </span>
            <a
              href="/login"
              className="inline-flex items-center gap-1 text-xs font-bold text-brandRed hover:underline"
            >
              Shop Owner Portal
              <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
