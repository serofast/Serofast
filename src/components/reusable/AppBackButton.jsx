import { ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

/**
 * AppBackButton - Clean circular border back button widget with brand red icon
 * @param {Object} props
 * @param {Function} [props.onTap] Custom click handler
 * @param {string} [props.to] Optional link path (e.g., "/")
 * @param {number} [props.size=38] Diameter in pixels (default 38)
 * @param {number} [props.iconSize=19] Icon size in pixels (default 19)
 * @param {string} [props.borderColor="border-[#E5E7EB]"] Custom border color class
 * @param {string} [props.className=""] Extra custom CSS classes
 * @param {string} [props.ariaLabel="Go back"] Accessible label
 */
export default function AppBackButton({
  onTap,
  to,
  size = 38,
  iconSize = 19,
  borderColor = "border-[#E5E7EB]",
  className = "",
  ariaLabel = "Go back",
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onTap) {
      onTap(e);
    } else if (!to) {
      navigate(-1);
    }
  };

  const buttonContent = (
    <span
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`inline-grid place-items-center rounded-full bg-white border ${borderColor} text-brandRed shadow-2xs transition-all duration-200 hover:scale-105 hover:border-brandRed/40 hover:shadow-xs active:scale-95 cursor-pointer ${className}`}
    >
      <ArrowLeft size={iconSize} className="stroke-[2.2]" />
    </span>
  );

  if (to) {
    return (
      <Link to={to} aria-label={ariaLabel} className="inline-flex items-center">
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className="inline-flex items-center border-0 bg-transparent p-0"
    >
      {buttonContent}
    </button>
  );
}
