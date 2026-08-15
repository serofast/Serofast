import { ArrowRight } from "lucide-react";

export default function SectionHeader({ title, action, href = "#", onClickAction }) {
  const handleClick = (e) => {
    if (onClickAction) {
      e.preventDefault();
      onClickAction();
    }
  };

  return (
    <div className="mb-[14px] flex items-center justify-between gap-3 max-560:flex-col max-560:items-start max-560:gap-1.5">
      <h2 className="m-0 min-w-0 flex-1 text-[19px] font-bold leading-snug tracking-[-0.25px] text-textPrimary max-560:flex-none max-560:text-[18px]">
        {title}
      </h2>
      <a
        href={href}
        onClick={handleClick}
        className="group flex shrink-0 items-center gap-[11px] text-[12px] font-semibold text-brandRed transition-colors duration-200 hover:text-brandRedDark cursor-pointer max-560:gap-2 max-560:text-[11px]"
      >
        <span>{action}</span>
        <span className="grid h-[28px] w-[28px] place-items-center rounded-full border border-[#ddd] bg-white transition-all duration-300 group-hover:border-brandRed group-hover:bg-brandRed group-hover:text-white group-hover:translate-x-1 group-hover:shadow-sm max-560:h-[26px] max-560:w-[26px]">
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </a>
    </div>
  );
}
