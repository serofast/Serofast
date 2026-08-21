import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingBag,
  Settings,
} from "lucide-react";

export default function AdminBottomNav() {
  const navItems = [
    { label: "Overview", path: "/admin", icon: LayoutDashboard },
    { label: "Shops", path: "/admin/shops", icon: Store },
    { label: "Products", path: "/admin/products", icon: Package },
    { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 rounded-t-[20px] border-t border-[#E5E7EB] bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.04)] font-sans font-sansation pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex h-[60px] items-center justify-around px-3 max-w-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className="flex-1 flex flex-col items-center justify-center h-full cursor-pointer select-none active:scale-95 transition-transform"
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <div
                    className={`h-[3px] rounded-[2px] transition-all duration-220 ease-out ${
                      isActive
                        ? "w-[22px] bg-brandRed shadow-[0_1px_4px_rgba(211,47,47,0.35)]"
                        : "w-0 bg-transparent"
                    }`}
                  />
                  <div className="h-[5px]" />
                  <div className="relative">
                    <Icon
                      size={21}
                      className={`transition-all duration-180 ease-out ${
                        isActive
                          ? "text-brandRed scale-110 stroke-[2.2]"
                          : "text-[#9CA3AF] scale-100 stroke-[1.8]"
                      }`}
                    />
                  </div>
                  <div className="h-[3px]" />
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
