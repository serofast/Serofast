import { ArrowRight } from "lucide-react";

export default function SectionHeader({ title, action, href = "#" }) {
  return (
    <div className="mb-[14px] flex items-center justify-between">
      <h2 className="m-0 text-[19px] tracking-[-0.25px] max-560:text-[18px]">
        {title}
      </h2>
      <a
        href={href}
        className="flex items-center gap-[11px] text-[12px] font-semibold text-brandRed"
      >
        {action}
        <span className="grid h-[27px] w-[27px] place-items-center rounded-full border border-[#ddd]">
          <ArrowRight size={16} />
        </span>
      </a>
    </div>
  );
}
