import { Link } from "react-router-dom";
import { CircleHelp, X, Sparkles } from "lucide-react";

export default function OnboardingHeader({ step, onClose }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md font-sans">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
        {/* Left: SeroFast Brand Title + Badge */}
        <Link to="/shop-owner/dashboard" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-brandRed text-white font-bold text-sm shadow-xs">
            S
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold tracking-tight text-slate-900">SEROFAST</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-brandRed uppercase">
              <Sparkles size={10} /> Store Onboarding
            </span>
          </div>
        </Link>

        {/* Center/Right: Step Badge & Help / Exit */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500 font-normal">
            <CircleHelp size={14} className="text-brandRed" /> Help Desk
          </span>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-brandRed">
            Step {step} of 6
          </span>

          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            title="Exit Setup"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
