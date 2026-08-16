import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Logo } from "../reusable";

export default function OnboardingHeader({ onClose }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md font-sans">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
        <Link to="/shop-owner/dashboard" className="flex items-center gap-2 group">
          <Logo size="xs" iconClassName="group-hover:scale-105" />
          <span className="text-sm font-bold tracking-tight text-slate-900">
            SEROFAST <span className="text-xs text-slate-500 font-semibold ml-0.5">STORE</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          title="Exit Setup"
        >
          <X size={20} />
        </button>
      </div>
    </header>
  );
}
