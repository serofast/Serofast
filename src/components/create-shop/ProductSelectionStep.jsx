import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Check,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Layers3,
  ShieldCheck,
  Pencil,
  TrendingUp,
} from "lucide-react";
import { categories, products } from "./data";
import { formatINR } from "./utils";
import SellingPriceInput from "./SellingPriceInput";

const PAGE_SIZE = 8;

export default function ProductSelectionStep({
  selectedProducts,
  onToggleProduct,
  onUpdatePrice,
  onNext,
  onBack,
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // id -> raw draft string typed by the user (may be invalid while typing)
  const [priceDrafts, setPriceDrafts] = useState({});
  const [continueError, setContinueError] = useState("");

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = category === "All" || product.category === category;
        const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
      }),
    [category, query]
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, query]);

  const visible = filtered.slice(0, visibleCount);
  const showLoadMore = filtered.length > visibleCount;

  const handlePriceChange = (id, raw, base, isSelected) => {
    setPriceDrafts((cur) => ({ ...cur, [id]: raw }));
    const num = raw === "" ? 0 : Number(raw.replace(/[^0-9]/g, ""));
    // Keep the shared selected-product state in sync when editing a
    // product that is already added to the shop with a valid price.
    if (raw !== "" && num >= base && isSelected && onUpdatePrice) {
      onUpdatePrice(id, num);
    }
  };

  const isPriceInvalid = (product) => {
    const raw = priceDrafts[product.id];
    if (raw == null || raw === "") return false;
    return Number(raw.replace(/[^0-9]/g, "")) < product.basePrice;
  };

  const handleToggle = (product) => {
    // Don't add a product while its selling price is below the base price.
    if (isPriceInvalid(product)) return;
    const raw = priceDrafts[product.id];
    const num = raw ? Number(raw.replace(/[^0-9]/g, "")) : 0;
    const sellingPrice = raw && num >= product.basePrice ? num : product.basePrice;
    onToggleProduct(product, sellingPrice);
    setContinueError("");
  };

  const handleContinue = () => {
    if (selectedProducts.length === 0) {
      setContinueError("Please select at least one product to continue.");
      return;
    }
    onNext();
  };

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-1.5 mt-0 text-2xl font-bold md:text-3xl lg:text-4xl">Choose your products</h1>
          <p className="m-0 text-sm text-textSecondary lg:text-base">
            Select products from the catalog to add directly to your shop
          </p>
          <p className="m-0 text-sm text-textSecondary lg:text-base">
            Now, or do it later in the dashboard – you can add, remove & edit anytime.
          </p>
        </div>
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-bento-sm bg-promoHighlight text-brandRed">
          <Layers3 size={26} />
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="flex h-11 flex-1 items-center gap-2 rounded-lg border border-[#d9d9d9] bg-lightSurface px-4 text-textMuted lg:h-12">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search catalog..."
            aria-label="Search products"
            className="w-full border-0 bg-transparent text-sm text-textPrimary outline-none placeholder:text-textMuted"
          />
        </label>

        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {["All", ...categories].map((item) => {
            const active = category === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`min-h-[40px] shrink-0 rounded-full border px-4 text-sm font-semibold transition ${
                  active
                    ? "border-brandRed bg-brandRed text-white"
                    : "border-[#d9d9d9] bg-lightSurface text-textSecondary hover:border-brandRed hover:text-brandRed"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5 flex min-h-[64px] items-center gap-3 rounded-bento-sm border border-lightBorder bg-lightSurface p-4 shadow-bento lg:p-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-promoHighlight text-brandRed">
          <Layers3 size={18} />
        </span>
        <div className="min-w-0">
          <strong className="block text-base font-bold lg:text-lg">
            {selectedProducts.length} Products Selected
          </strong>
          <span className="mt-0.5 block text-xs text-textSecondary lg:text-sm">
            You can import up to 100 products · Keep minimum price above base
          </span>
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-5">
          {visible.map((product) => {
            const selectedItem = selectedProducts.find((item) => item.id === product.id);
            const selected = Boolean(selectedItem);

            return (
              <article
                key={product.id}
                className={`overflow-hidden rounded-bento-sm border bg-lightSurface shadow-bento transition hover:-translate-y-1 hover:shadow-hover ${
                  selected ? "border-brandRed ring-2 ring-brandRed/10" : "border-lightBorder"
                }`}
              >
                <div className="relative h-[170px] overflow-hidden bg-[#f7f7f7] lg:h-[190px]">
                  <button
                    type="button"
                    onClick={() => handleToggle(product)}
                    aria-label={
                      selected
                        ? `Remove ${product.name} from shop`
                        : `Add ${product.name} to shop`
                    }
                    className={`absolute left-3 top-3 z-10 grid h-6 w-6 place-items-center rounded-md border-2 transition ${
                      selected
                        ? "border-brandRed bg-brandRed text-white"
                        : "border-[#c9ced6] bg-white/90 text-transparent hover:border-brandRed"
                    }`}
                  >
                    <Check size={14} />
                  </button>
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-contain mix-blend-multiply"
                  />
                </div>

                <div className="p-4 lg:p-5">
                  <span className="text-xs font-bold uppercase tracking-[0.05em] text-textSecondary">
                    {product.category}
                  </span>
                  <h3 className="mb-3 mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug lg:text-base">
                    {product.name}
                  </h3>

                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-textMuted">Base (Lowest) Price</span>
                    <strong className="text-sm font-bold text-textPrimary">
                      {formatINR(product.basePrice)}
                    </strong>
                  </div>

                  <span className="mb-1.5 block text-xs text-textMuted">
                    Your Selling Price
                  </span>
                  <SellingPriceInput
                    id={`selling-${product.id}`}
                    value={priceDrafts[product.id] ?? (selected ? String(selectedItem.sellingPrice) : String(product.basePrice))}
                    base={product.basePrice}
                    onChange={(raw) => handlePriceChange(product.id, raw, product.basePrice, selected)}
                    label={`Selling price for ${product.name}`}
                  />

                  <button
                    type="button"
                    onClick={() => handleToggle(product)}
                    className={`mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition ${
                      selected
                        ? "bg-brandRed text-white hover:bg-brandRedDark"
                        : "border border-[#d9d9d9] bg-lightSurface text-textPrimary hover:border-brandRed hover:text-brandRed"
                    }`}
                  >
                    {selected ? <Check size={18} /> : <Plus size={18} />}
                    {selected ? "Added to Shop" : "Add to Shop"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-bento-sm border border-lightBorder bg-lightSurface p-10 text-center shadow-bento">
          <p className="text-base font-semibold">No products found</p>
          <p className="mt-1 text-sm text-textSecondary">
            Try a different search term or category.
          </p>
        </div>
      )}

      {showLoadMore && (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          className="mx-auto mt-6 flex min-h-[44px] items-center gap-2 rounded-full border border-[#d9d9d9] bg-lightSurface px-6 text-sm font-semibold text-textPrimary transition hover:border-brandRed hover:text-brandRed"
        >
          Load More Products
          <ChevronDown size={16} />
        </button>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [Layers3, "Wide Selection", "Millions of quality products"],
          [ShieldCheck, "Secure & Trusted", "100% verified suppliers"],
          [Pencil, "Easy Management", "Update pricing anytime later"],
          [TrendingUp, "Boost Your Sales", "Top products, better profit"],
        ].map(([Icon, title, text]) => (
          <div
            key={title}
            className="flex items-center gap-3 rounded-bento-sm border border-lightBorder bg-lightSurface p-4 shadow-bento lg:p-5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-promoHighlight text-brandRed">
              <Icon size={18} />
            </span>
            <span className="text-xs leading-[1.45] text-textSecondary lg:text-sm">
              <b className="mb-0.5 block text-sm font-semibold text-textPrimary lg:text-base">
                {title}
              </b>
              {text}
            </span>
          </div>
        ))}
      </div>

      {continueError && (
        <p role="alert" className="mt-5 text-center text-xs font-medium text-brandRed lg:text-sm">
          {continueError}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-lightBorder pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[#d9d9d9] bg-lightSurface px-5 text-sm font-semibold text-textPrimary transition hover:border-brandRed hover:text-brandRed sm:w-auto"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-brandRed px-6 text-sm font-semibold text-white transition hover:bg-brandRedDark sm:w-auto"
        >
          Continue to Launch
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
