import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Logo } from "../reusable";

export default function OnboardingHeader({ onClose }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md font-sans">
      <div className="mx-auto flex h-14 sm:h-[60px] w-[min(1280px,calc(100%_-_48px))] max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)] items-center justify-between">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-[21px] font-extrabold tracking-[-0.5px] text-brandRed transition-transform duration-200 hover:scale-[1.02] max-560:text-[18px]"
          aria-label="SeroFast home"
        >
          <Logo
            size="sm"
            iconClassName="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5"
          />
          <span className="tracking-tight">SEROFAST</span>
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
