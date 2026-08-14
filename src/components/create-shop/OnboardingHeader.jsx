import {
  Globe2,
  Search,
  Smartphone,
  Store,
  UserRound,
  CircleHelp,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function OnboardingHeader({ step, onClose }) {
  const firstScreen = step === 1;
  const sellerScreen = step >= 3;

  return (
    <header className="sticky top-0 z-30 border-b border-lightBorder bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[64px] w-full max-w-[1400px] items-center gap-3 px-4 md:px-6 lg:gap-7 lg:px-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to home"
          className="inline-flex items-center gap-2 text-lg font-extrabold tracking-[-0.3px] text-brandRed lg:text-xl"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brandRed text-sm font-bold text-white">
            S
          </span>
          SEROFAST
        </button>

        {firstScreen ? (
          <>
            <nav className="m-auto hidden gap-7 lg:flex" aria-label="Marketplace">
              {["Marketplace", "Solutions", "Pricing", "Support"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-textSecondary transition hover:text-brandRed"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-3 lg:gap-4">
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full border border-lightBorder bg-white text-textSecondary"
                aria-label="Language"
              >
                <Globe2 size={16} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-brandRed px-5 text-sm font-semibold text-white transition hover:bg-brandRedDark"
              >
                Open Shop
              </button>
            </div>
          </>
        ) : sellerScreen ? (
          <div className="ml-auto flex items-center gap-3 lg:gap-4">
            <span className="hidden items-center gap-1.5 text-sm text-textSecondary sm:inline-flex">
              <CircleHelp size={16} className="text-brandRed" /> Need Help?
            </span>
            <button
              type="button"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-lightBorder bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold text-textPrimary"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brandRed text-white">
                {step === 4 ? "S" : "D"}
              </span>
              {step === 4 ? "My Shop" : "Demo User"}
              <span className="text-textMuted">⌄</span>
            </button>
          </div>
        ) : (
          <>
            <label className="ml-3 hidden h-10 w-[min(360px,30vw)] items-center gap-2 rounded-lg border border-[#d9d9d9] bg-white px-3 text-textMuted md:flex">
              <Search size={16} />
              <input
                className="w-full border-0 bg-transparent text-sm text-textPrimary outline-none placeholder:text-textMuted"
                placeholder="Search for products and more"
              />
            </label>

            <div className="ml-auto flex items-center gap-4">
              <span className="hidden items-center gap-1 text-sm text-textSecondary min-[821px]:inline-flex">
                <Smartphone size={15} /> Download App
              </span>
              <span className="hidden items-center gap-1 text-sm font-semibold text-brandRed min-[821px]:inline-flex">
                <Store size={15} /> Create Shop
              </span>
              <Link
                to="/login?role=shop-owner"
                className="hidden items-center gap-1 text-sm text-textSecondary transition hover:text-brandRed min-[821px]:inline-flex"
              >
                <UserRound size={15} /> Login
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
