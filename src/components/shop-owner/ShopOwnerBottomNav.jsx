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
    { label: "Home", path: "/shop-owner/dashboard", icon: LayoutDashboard },
    { label: "Products", path: "/shop-owner/inventory", icon: Package },
    { label: "Orders", path: "/shop-owner/orders", icon: ShoppingBag, badge: "3" },
    { label: "Payouts", path: "/shop-owner/payouts", icon: CreditCard },
    { label: "Settings", path: "/shop-owner/settings", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-1 pb-[env(safe-area-inset-bottom)] shadow-lg font-sans">
      <div className="mx-auto flex items-center justify-around max-w-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-2 px-2 min-h-[56px] rounded-xl transition-all active:scale-95 ${
                  isActive
                    ? "text-brandRed font-bold"
                    : "text-slate-400 hover:text-slate-700 font-medium"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon size={22} className={isActive ? "text-brandRed" : "text-slate-400"} />
                    {item.badge && (
                      <span className="absolute -top-1.5 -right-2.5 grid h-4.5 w-4.5 place-items-center rounded-full bg-brandRed text-[9px] font-bold text-white shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] mt-1 tracking-tight ${isActive ? "text-brandRed" : "text-slate-400"}`}>{item.label}</span>
                  {isActive && <span className="absolute bottom-1 h-[3px] w-5 rounded-full bg-brandRed" />}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
