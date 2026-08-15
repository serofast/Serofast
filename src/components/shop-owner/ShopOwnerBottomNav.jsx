import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  CreditCard,
  Settings,
} from "lucide-react";

export default function ShopOwnerBottomNav() {
  const navItems = [
    { label: "Overview", path: "/shop-owner/dashboard", icon: LayoutDashboard },
    { label: "Products", path: "/shop-owner/inventory", icon: Package },
    { label: "Orders", path: "/shop-owner/orders", icon: ShoppingBag, badge: "3" },
    { label: "Payouts", path: "/shop-owner/payouts", icon: CreditCard },
    { label: "Settings", path: "/shop-owner/settings", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-2 py-1 shadow-lg font-sans">
      <div className="mx-auto flex items-center justify-around max-w-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1 px-3 min-h-[48px] rounded-xl transition-all active:scale-95 ${
                  isActive
                    ? "text-brandRed font-bold"
                    : "text-slate-500 hover:text-slate-900 font-medium"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon size={20} className={isActive ? "text-brandRed" : "text-slate-500"} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-2 grid h-4 w-4 place-items-center rounded-full bg-brandRed text-[9px] font-bold text-white shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
