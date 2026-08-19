import { useState, useEffect } from "react";
import { QrCode, CheckCircle2, X, Store, Clock, Sparkles, Copy, Check } from "lucide-react";

export default function FreeBuffClaimModal({ deal, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [passCode, setPassCode] = useState("");

  useEffect(() => {
    if (deal) {
      const code = `FREEBUFF-${Math.floor(100000 + Math.random() * 900000)}`;
      setPassCode(code);
    }
  }, [deal]);

  if (!isOpen || !deal) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(passCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto p-4 font-sans font-sansation"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_8px_24px_rgba(211,47,47,0.3)] animate-scale-up">
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full border border-[#E5E7EB] hover:border-brandRed transition cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Header Badge */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-rose-50 border border-rose-200 text-brandRed mb-3">
            <Sparkles size={24} />
          </div>
          <span className="rounded-full bg-brandRed/10 border border-brandRed/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brandRed mb-1">
            FreeBuff Pass Generated
          </span>
          <h2 className="text-xl font-normal text-slate-900 tracking-tight">
            {deal.title}
          </h2>
          <p className="text-xs text-slate-500 font-normal mt-1 flex items-center gap-1">
            <Store size={13} className="text-brandRed" /> {deal.shopName || "Campus Partner Store"}
          </p>
        </div>

        {/* QR Code Container */}
        <div className="mt-5 rounded-[28px] bg-[#FAF8F5] border border-[#F3E5E5] p-5 flex flex-col items-center justify-center text-center space-y-3">
          <div className="grid h-36 w-36 place-items-center rounded-[20px] bg-white p-3 shadow-md border border-slate-200">
            {/* SVG QR Code Simulation */}
            <div className="relative grid h-full w-full place-items-center bg-slate-900 p-2 rounded-xl text-white">
              <QrCode size={96} className="text-white" />
              <div className="absolute inset-0 grid place-items-center bg-white/10 backdrop-blur-[1px] rounded-xl opacity-0 hover:opacity-100 transition">
                <span className="text-[10px] font-bold bg-brandRed text-white px-2 py-1 rounded-full">Scan at Counter</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Pass Redemption Code</span>
            <div className="mt-1 flex items-center justify-center gap-2">
              <code className="text-base font-bold text-brandRed tracking-wider bg-rose-50 px-3 py-1 rounded-xl border border-rose-200">
                {passCode}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-brandRed hover:text-brandRed transition cursor-pointer"
                title="Copy Code"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Validity & Pass Info */}
        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
            <span className="text-slate-500 font-normal flex items-center gap-1.5">
              <Clock size={14} className="text-amber-500" /> Valid Until
            </span>
            <span className="font-semibold text-slate-800">{deal.validUntil || "Today, 9:00 PM"}</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
            <span className="text-slate-500 font-normal flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" /> Pass Cost
            </span>
            <span className="font-bold text-emerald-700">₹0 (100% FREE)</span>
          </div>
        </div>

        {/* Redeem Button */}
        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[30px] bg-brandRed text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark active:scale-95 transition cursor-pointer"
          >
            <CheckCircle2 size={16} />
            <span>Pass Claimed! Show at Store Counter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
