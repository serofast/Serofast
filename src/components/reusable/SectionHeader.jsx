import { ArrowRight } from "lucide-react";

export default function SectionHeader({ title, subtitle, action, href = "#", onClickAction }) {
  const handleClick = (e) => {
    if (onClickAction) {
      e.preventDefault();
      onClickAction();
    }
  };

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div className="max-w-2xl">
        <h2 className="m-0 text-[clamp(20px,2.8vw,28px)] font-extrabold leading-tight tracking-[-0.02em] text-[#191616]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-[13px] leading-relaxed text-[#8b8282] sm:text-[14px]">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <a
          href={href}
          onClick={handleClick}
          className="group inline-flex shrink-0 items-center gap-2 text-[12px] font-bold text-brandRed transition-all duration-200 hover:text-brandRedDark"
        >
          <span>{action}</span>
          <span className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white transition-all duration-300 group-hover:border-brandRed group-hover:bg-brandRed group-hover:text-white group-hover:shadow-sm">
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </a>
      )}
    </div>
  );
}
