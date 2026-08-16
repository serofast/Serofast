import { Home, Sparkles, PlusCircle, LayoutDashboard, UserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function MobileBottomNav() {
  const location = useLocation();

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
      className="hidden max-560:fixed max-560:inset-x-0 max-560:bottom-0 max-560:z-[100] max-560:flex max-560:h-16 max-560:items-center max-560:justify-around max-560:border-t max-560:border-slate-200/80 max-560:bg-white/[0.98] max-560:backdrop-blur-md max-560:px-2 max-560:pb-[max(6px,env(safe-area-inset-bottom))] max-560:pt-1 max-560:shadow-[0_-10px_30px_rgba(0,0,0,0.08)]"
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
              className="flex flex-col items-center justify-center -mt-4 group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-brandRed to-red-500 text-white shadow-[0_6px_16px_rgba(210,33,37,0.35)] transition-transform duration-200 active:scale-95 group-hover:scale-105">
                <Icon size={22} className="stroke-[2.2]" />
              </div>
              <span className="mt-0.5 text-[10px] font-bold text-brandRed">
                {item.label}
              </span>
            </Link>
          );
        }

        const isActive = !item.isHash && location.pathname === item.href;
        const linkClasses = `flex flex-col items-center justify-center gap-0.5 py-1 px-2 text-[10px] font-semibold transition-colors duration-150 active:scale-95 ${
          isActive
            ? "text-brandRed"
            : "text-slate-500 hover:text-brandRed"
        }`;

        if (item.isHash) {
          return (
            <a key={item.label} href={item.href} className={linkClasses}>
              <Icon size={19} className="stroke-[1.9]" />
              <span>{item.label}</span>
            </a>
          );
        }

        return (
          <Link key={item.label} to={item.href} className={linkClasses}>
            <Icon size={19} className="stroke-[1.9]" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
