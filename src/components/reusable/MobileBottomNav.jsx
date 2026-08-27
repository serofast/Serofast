import { Home, Sparkles, PlusCircle, LayoutDashboard, UserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useScrollDirection from "../../hooks/useScrollDirection";

export default function MobileBottomNav() {
  const location = useLocation();
  const isVisible = useScrollDirection(8);

  const navItems = [
    {
      label: "Home",
      href: "#home",
      icon: Home,
      isHash: true,
    },
    {
      label: "Benefits",
      href: "#comparison",
      icon: Sparkles,
      isHash: true,
    },
    {
      label: "Open Shop",
      href: "/create-shop",
      icon: PlusCircle,
      isPrimary: true,
    },
    {
      label: "Dashboard",
      href: "/shop-owner/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Login",
      href: "/login",
      icon: UserRound,
    },
  ];

  return (
    <nav
      className={`hidden max-560:fixed max-560:inset-x-0 max-560:bottom-0 max-560:z-[100] max-560:flex max-560:h-[60px] max-560:items-center max-560:justify-around max-560:rounded-t-[20px] max-560:border-t max-560:border-[#E5E7EB] max-560:bg-white max-560:px-3 max-560:pb-[max(4px,env(safe-area-inset-bottom))] max-560:shadow-[0_-4px_16px_rgba(0,0,0,0.06)] font-sans font-sansation will-change-transform transition-transform duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        isVisible
          ? "max-560:translate-y-0"
          : "max-560:translate-y-[120%] pointer-events-none"
      }`}
      aria-label="Shop Owner Mobile navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;

        // Primary highlighted CTA button for "Open Shop"
        if (item.isPrimary) {
          return (
            <Link
              key={item.label}
              to={item.href}
              className="flex-1 flex flex-col items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border-2 border-white bg-brandRed text-white shadow-[0_4px_12px_rgba(211,47,47,0.25)]">
                <Icon size={20} className="stroke-[2.2]" />
              </div>
              <span className="mt-1 text-[10px] font-bold leading-none text-brandRed">
                {item.label}
              </span>
            </Link>
          );
        }

        const isActive = !item.isHash && location.pathname === item.href;

        const content = (
          <div className="flex flex-col items-center justify-center h-full w-full gap-0.5">
            {/* Top Line Indicator */}
            <div
              className={`h-[3px] rounded-[2px] transition-all duration-220 ease-out ${
                isActive
                  ? "w-[22px] bg-brandRed shadow-[0_1px_4px_rgba(211,47,47,0.35)]"
                  : "w-0 bg-transparent"
              }`}
            />

            {/* Icon */}
            <Icon
              size={21}
              className={`transition-all duration-180 ease-out ${
                isActive
                  ? "text-brandRed scale-110 stroke-[2.2]"
                  : "text-[#9CA3AF] scale-100 stroke-[1.8]"
              }`}
            />

            {/* Label */}
            <span
              className={`text-[10px] tracking-tight transition-all duration-180 ease-out ${
                isActive
                  ? "font-bold text-brandRed"
                  : "font-medium text-[#9CA3AF]"
              }`}
            >
              {item.label}
            </span>
          </div>
        );

        return item.isHash ? (
          <a
            key={item.label}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center h-full cursor-pointer select-none active:scale-95 transition-transform"
          >
            {content}
          </a>
        ) : (
          <Link
            key={item.label}
            to={item.href}
            className="flex-1 flex flex-col items-center justify-center h-full cursor-pointer select-none active:scale-95 transition-transform"
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
