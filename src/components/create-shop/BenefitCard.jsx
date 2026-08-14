import {
  Clock3,
  Store,
  GraduationCap,
  TrendingUp,
  Check,
} from "lucide-react";

const icons = {
  clock: Clock3,
  store: Store,
  "graduation-cap": GraduationCap,
  "trending-up": TrendingUp,
};

const tones = {
  green: "bg-[#EAF8F3] text-[#15916C]",
  blue: "bg-[#EDF5FF] text-[#3A73D9]",
  purple: "bg-[#F2EEFF] text-[#6B3CE3]",
  orange: "bg-[#FFF3E7] text-[#EA861E]",
};

export default function BenefitCard({ benefit }) {
  const Icon = icons[benefit.icon];

  return (
    <article className="flex gap-4 rounded-bento-sm border border-lightBorder bg-lightSurface p-5 shadow-bento transition hover:-translate-y-1 hover:shadow-hover lg:gap-5 lg:p-6">
      <div
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl lg:h-12 lg:w-12 ${tones[benefit.tone]}`}
      >
        <Icon size={22} />
      </div>

      <div className="min-w-0">
        <h2 className="mb-3 mt-0 text-base font-bold lg:text-lg">{benefit.title}</h2>
        <ul className="m-0 grid list-none gap-2 p-0 lg:gap-2.5">
          {benefit.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm leading-[1.45] text-textSecondary lg:text-base">
              <Check size={16} className="mt-0.5 shrink-0 text-brandRed" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
