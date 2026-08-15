import { Home, Store, Search, ShoppingCart, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileBottomNav() {
  const items = [
    [Home, "Home", "#home"],
    [Store, "Shops", "#shops"],
    [Search, "Search", "#products"],
    [ShoppingCart, "Cart", "#products"],
    [UserRound, "Login", "/login"],
  ];

  return (
    <nav
      className="hidden max-560:fixed max-560:inset-x-0 max-560:bottom-0 max-560:z-[100] max-560:grid max-560:h-16 max-560:grid-cols-5 max-560:border-t max-560:border-[#eee] max-560:bg-white/[0.98] max-560:px-[5px] max-560:pb-[max(5px,env(safe-area-inset-bottom))] max-560:pt-[5px] max-560:shadow-[0_-8px_25px_rgba(0,0,0,0.06)]"
      aria-label="Mobile navigation"
    >
      {items.map(([Icon, label, href], index) => {
        const className = `flex flex-col items-center justify-center gap-[3px] text-[9px] font-semibold ${
          index === 0 ? "text-brandRed" : "text-[#777] hover:text-brandRed"
        }`;

        if (href.startsWith("/")) {
          return (
            <Link key={label} to={href} className={className}>
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        }

        return (
          <a key={label} href={href} className={className}>
            <Icon size={20} />
            <span>{label}</span>
          </a>
        );
      })}
    </nav>
  );
}
