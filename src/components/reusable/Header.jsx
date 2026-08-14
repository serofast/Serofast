import { Search, Smartphone, Store, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "../../data/landing";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#eee] bg-white/[0.97] backdrop-blur-[16px]">
      <div className="mx-auto grid min-h-[68px] w-[min(1280px,calc(100%_-_48px))] grid-cols-[190px_minmax(280px,1fr)_auto] items-center gap-[26px] max-1100:grid-cols-[170px_1fr_auto] max-1100:gap-[15px] max-800:w-[min(680px,calc(100%_-_28px))] max-800:grid-cols-[1fr_auto] max-800:min-h-[60px] max-800:py-2 max-560:w-[calc(100%_-_20px)] max-560:gap-[9px]">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 text-[21px] font-extrabold tracking-[-0.5px] text-brandRed max-560:text-[18px]"
          aria-label="SeroFast home"
        >
          <span className="inline-block -rotate-12 text-[31px] leading-none">
            ➤
          </span>
          <span>SEROFAST</span>
        </Link>

        <div className="flex h-[42px] items-center rounded-[9px] border border-[#d9d9d9] bg-white px-[14px] text-[#777] max-800:order-3 max-800:col-span-full max-800:mb-2.5">
          <Search size={20} />
          <input
            aria-label="Search products"
            placeholder="Search for products and more"
            className="w-full border-0 bg-transparent px-3 text-textPrimary outline-0 placeholder:text-[#999]"
          />
          <span className="h-[18px] w-[18px] rounded-full border-[1.6px] border-[#a9a9a9]" />
        </div>

        <nav
          className="flex items-center gap-[17px] whitespace-nowrap text-[13px] font-semibold max-1100:gap-2.5 max-1100:text-[11px]"
          aria-label="Account actions"
        >
          <a
            className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-brandRed max-800:hidden"
            href="#app"
          >
            <Smartphone size={21} />
            Download App
          </a>
          <span className="h-7 w-px bg-[#e6e6e6] max-800:hidden" />
<Link
  to="/create-shop"
  className="inline-flex items-center gap-2 text-brandRed max-560:text-[0px] max-560:[&>svg]:h-[22px] max-560:[&>svg]:w-[22px]"
>
  <Store size={21} />
  Create Shop
</Link>
          <span className="h-7 w-px bg-[#e6e6e6] max-800:hidden" />
          <Link
            to="/login?role=admin"
            className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-brandRed max-800:hidden"
          >
            <UserRound size={22} />
            Login
          </Link>
        </nav>
      </div>

      <div className="border-t border-[#f4f4f4] max-800:hidden">
        <nav
          className="mx-auto flex h-[51px] w-[min(1280px,calc(100%_-_48px))] items-center justify-between gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]"
          aria-label="Categories"
        >
          {categories.map((category) => (
            <a
              key={category}
              href="#products"
              className="shrink-0 text-[13px] font-semibold text-[#1f1f1f]"
            >
              {category}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
