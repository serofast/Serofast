import { ArrowLeft, ArrowRight, ShieldCheck, Zap, Wallet, CheckCircle2 } from "lucide-react";

export default function PaymentSettlementStep({ onNext, onBack }) {
  return (
    <div className="space-y-7 font-sans w-full max-w-full lg:max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
          <Wallet size={22} />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">How you get paid</h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">SeroFast ensures 100% direct profit retention with zero commission.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm space-y-4">
        {/* 0% Commission */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck size={18} className="text-emerald-600" /> 0% Commission
            </span>
            <span className="rounded-full bg-emerald-600 text-white px-3 py-1 text-[10px] font-bold">100% Retained</span>
          </div>
          <p className="text-xs text-emerald-900 font-normal leading-relaxed">
            Every rupee from your sales goes directly to you. No per-transaction deductions.
          </p>
        </div>

        {/* Instant UPI */}
        <div className="rounded-2xl border border-brandRed/15 bg-rose-50/50 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brandRed flex items-center gap-1.5">
              <Zap size={18} /> Instant UPI Settlements
            </span>
            <span className="rounded bg-brandRed text-white px-2.5 py-1 text-[10px] font-bold">Auto Payouts</span>
          </div>
          <p className="text-xs text-slate-700 font-normal leading-relaxed">
            Payments land directly into your UPI handle within 15 minutes of order completion.
          </p>
        </div>

        {/* Flow */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Payout flow</span>
          <div className="space-y-2.5 text-xs">
            {["Customer pays online on SeroFast", "Order is accepted & delivered", "Funds credited to your UPI automatically"].map((text, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
        <button type="button" onClick={onBack} className="min-h-[52px] flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer">
          <ArrowLeft size={16} /> Back
        </button>
        <button type="button" onClick={onNext} className="min-h-[56px] flex-1 sm:flex-initial flex items-center justify-center gap-2.5 rounded-2xl bg-brandRed px-6 text-sm font-bold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark active:scale-[0.98] transition cursor-pointer">
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
