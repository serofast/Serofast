import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  CreditCard,
  Settings,
} from "lucide-react";
import useScrollDirection from "../../hooks/useScrollDirection";

export default function ShopOwnerBottomNav({ pendingOrdersCount = 0 }) {
  const isVisible = useScrollDirection(8);

  const navItems = [
    { label: "Overview", path: "/shop-owner/dashboard", icon: LayoutDashboard },
    { label: "Products", path: "/shop-owner/inventory", icon: Package },
    {
      label: "Orders",
      path: "/shop-owner/orders",
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? String(pendingOrdersCount) : null,
    },
    { label: "Payouts", path: "/shop-owner/payouts", icon: CreditCard },
    { label: "Settings", path: "/shop-owner/settings", icon: Settings },
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-[51] rounded-t-[20px] border-t border-[#E5E7EB] bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.06)] font-sans font-sansation pb-[env(safe-area-inset-bottom)] will-change-transform transition-transform duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        isVisible
          ? "translate-y-0"
          : "translate-y-[120%] pointer-events-none"
      }`}
    >
      <div className="mx-auto flex h-[60px] items-center justify-around px-3 max-w-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex-1 flex flex-col items-center justify-center h-full cursor-pointer select-none active:scale-95 transition-transform"
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center justify-center h-full w-full">
                  {/* 1. Sleek Small Top Indicator Line */}
                  <div
                    className={`h-[3px] rounded-[2px] transition-all duration-220 ease-out ${
                      isActive
                        ? "w-[22px] bg-brandRed shadow-[0_1px_4px_rgba(211,47,47,0.35)]"
                        : "w-0 bg-transparent"
                    }`}
                  />

                  <div className="h-[5px]" />

                  {/* 2. Animated Icon (Scale & Color) */}
                  <div className="relative">
                    <Icon
                      size={21}
                      className={`transition-all duration-180 ease-out ${
                        isActive
                          ? "text-brandRed scale-110 stroke-[2.2]"
                          : "text-[#9CA3AF] scale-100 stroke-[1.8]"
                      }`}
                    />
                    {item.badge && (
                      <span className="absolute -top-1.5 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brandRed text-[8px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="h-[3px]" />

                  {/* 3. Animated Text Label */}
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
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
