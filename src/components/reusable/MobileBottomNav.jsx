import { useState } from "react";
import {
  Home,
  Sparkles,
  Plus,
  LayoutDashboard,
  UserRound,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useScrollDirection from "../../hooks/useScrollDirection";

export default function MobileBottomNav() {
  const location = useLocation();
  const isVisible = useScrollDirection(8);
  const [pressedIdx, setPressedIdx] = useState(null);

  const navItems = [
    {
      label: "Home",
      href: "#home",
      icon: Home,
      isHash: true,
    },
    {
      label: "Benefits",
      href: "#audience",
      icon: Sparkles,
      isHash: true,
    },
    {
      label: "Shop",
      href: "/create-shop",
      icon: Plus,
      isPrimary: true,
    },
    {
      label: "Dashboard",
      href: "/shop-owner/dashboard",
      icon: LayoutDashboard,
      badge: true,
    },
    {
      label: "Login",
      href: "/login",
      icon: UserRound,
    },
  ];

  return (
    <nav
      className={`hidden max-560:fixed max-560:inset-x-0 max-560:bottom-0 max-560:z-[100] max-560:flex max-560:h-[68px] max-560:items-center max-560:justify-around max-560:rounded-t-[22px] max-560:border-t max-560:border-white/40 max-560:bg-white/80 max-560:backdrop-blur-2xl max-560:backdrop-saturate-[1.8] max-560:px-2 max-560:pb-[max(6px,env(safe-area-inset-bottom))] max-560:shadow-[0_-8px_32px_rgba(0,0,0,0.08),0_-2px_8px_rgba(0,0,0,0.04)] will-change-transform transition-all duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        isVisible
          ? "max-560:translate-y-0 max-560:opacity-100"
          : "max-560:translate-y-[120%] max-560:opacity-0 max-560:pointer-events-none"
      }`}
      aria-label="Mobile navigation"
    >
      {/* Subtle top highlight line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isPressed = pressedIdx === idx;

        // Primary floating CTA
        if (item.isPrimary) {
          return (
            <Link
              key={item.label}
              to={item.href}
              className="relative flex-1 flex flex-col items-center justify-center cursor-pointer select-none"
              onTouchStart={() => setPressedIdx(idx)}
              onTouchEnd={() => setTimeout(() => setPressedIdx(null), 150)}
              onMouseDown={() => setPressedIdx(idx)}
              onMouseUp={() => setTimeout(() => setPressedIdx(null), 150)}
              onMouseLeave={() => setPressedIdx(null)}
            >
              {/* Elevated floating button */}
              <div
                className={`relative -mt-4 flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-gradient-to-b from-brandRed to-rose-600 text-white transition-all duration-200 ease-out ${
                  isPressed
                    ? "scale-90 shadow-[0_2px_6px_rgba(211,47,47,0.3)]"
                    : "scale-100 shadow-[0_4px_16px_rgba(211,47,47,0.3),0_2px_6px_rgba(211,47,47,0.15)]"
                }`}
              >
                {/* Glow ring */}
                <div className="absolute -inset-0.5 rounded-[16px] bg-brandRed/10 blur-sm" />
                <Icon size={19} className="relative" strokeWidth={2.2} />
              </div>
              <span className="mt-0.5 text-[9px] font-semibold leading-none text-brandRed tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        }

        const isActive = !item.isHash && location.pathname === item.href;

        const content = (
          <div
            className={`relative flex flex-col items-center justify-center h-full w-full gap-0.5 transition-transform duration-150 ease-out ${
              isPressed ? "scale-90" : "scale-100"
            }`}
          >
            {/* Active pill background */}
            <div
              className={`absolute top-1 left-1/2 -translate-x-1/2 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isActive
                  ? "h-[32px] w-[48px] bg-brandRed/[0.09]"
                  : "h-0 w-0 bg-transparent"
              }`}
            />

            {/* Icon wrapper */}
            <div className="relative z-10">
              <Icon
                size={22}
                strokeWidth={isActive ? 2.3 : 1.7}
                className={`transition-all duration-200 ease-out ${
                  isActive
                    ? "text-brandRed scale-110"
                    : "text-[#A0A5AD] scale-100"
                }`}
              />

              {/* Active glow dot */}
              {isActive && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-brandRed shadow-[0_0_6px_rgba(211,47,47,0.6)]" />
              )}

              {/* Notification badge */}
              {item.badge && (
                <span className="absolute -top-0.5 -right-0.5 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-brandRed text-[7px] font-extrabold text-white shadow-[0_2px_6px_rgba(211,47,47,0.4)]">
                  <span className="h-[5px] w-[5px] rounded-full bg-white animate-pulse" />
                </span>
              )}
            </div>

            {/* Label */}
            <span
              className={`relative z-10 text-[10px] tracking-tight transition-all duration-200 ease-out ${
                isActive
                  ? "font-bold text-brandRed"
                  : "font-medium text-[#A0A5AD]"
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
            className="flex-1 flex flex-col items-center justify-center h-full cursor-pointer select-none"
            onTouchStart={() => setPressedIdx(idx)}
            onTouchEnd={() => setTimeout(() => setPressedIdx(null), 150)}
            onMouseDown={() => setPressedIdx(idx)}
            onMouseUp={() => setTimeout(() => setPressedIdx(null), 150)}
            onMouseLeave={() => setPressedIdx(null)}
          >
            {content}
          </a>
        ) : (
          <Link
            key={item.label}
            to={item.href}
            className="flex-1 flex flex-col items-center justify-center h-full cursor-pointer select-none"
            onTouchStart={() => setPressedIdx(idx)}
            onTouchEnd={() => setTimeout(() => setPressedIdx(null), 150)}
            onMouseDown={() => setPressedIdx(idx)}
            onMouseUp={() => setTimeout(() => setPressedIdx(null), 150)}
            onMouseLeave={() => setPressedIdx(null)}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
