import { useState } from "react";
import { CircleHelp, Send, X, ArrowLeft } from "lucide-react";
import { formatINR } from "./utils";
import SellingPriceInput from "./SellingPriceInput";

export default function LaunchReviewStep({
  form,
  selectedProducts,
  onUpdatePrice,
  onRemoveProduct,
  onBack,
  onLaunch,
}) {
  // id -> raw draft string typed by the user (may be invalid while typing)
  const [priceDrafts, setPriceDrafts] = useState({});

  const entryFee = form.entryFee === "standard" ? 50 : 0;
  const entryFeeLabel = form.entryFee === "standard" ? "Standard Entry Fee" : "Limited Time Offer";

  const baseTotal = selectedProducts.reduce((sum, product) => sum + product.basePrice, 0);
  const sellingTotal = selectedProducts.reduce(
    (sum, product) => sum + (product.sellingPrice || product.basePrice),
    0
  );
  const potentialProfit = sellingTotal - baseTotal;

  return (
    <section>
      <div className="mb-6 lg:mb-8">
        <h1 className="mb-1.5 mt-0 text-2xl font-bold md:text-3xl lg:text-4xl">Review & Launch</h1>
        <p className="m-0 max-w-2xl text-sm leading-relaxed text-textSecondary lg:text-base">
          Confirm your products and selling prices. You can only increase the admin base price.
          When ready, launch your shop!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="overflow-hidden rounded-bento-sm border border-lightBorder bg-lightSurface shadow-bento">
          <div className="flex min-h-[60px] items-center justify-between gap-3 border-b border-lightBorder px-4 lg:px-5">
            <strong className="text-base font-bold lg:text-lg">Selected Products</strong>
            <span className="rounded-full bg-promoHighlight px-3 py-1 text-xs font-bold text-brandRed lg:text-sm">
              {selectedProducts.length} Products
            </span>
          </div>

          {selectedProducts.length > 0 ? (
            selectedProducts.map((product) => {
              const sellingPrice = product.sellingPrice || product.basePrice;
              const profit = sellingPrice - product.basePrice;

              const handlePriceChange = (raw) => {
                setPriceDrafts((cur) => ({ ...cur, [product.id]: raw }));
                const num = raw === "" ? 0 : Number(raw.replace(/[^0-9]/g, ""));
                if (raw !== "" && num >= product.basePrice) {
                  onUpdatePrice(product.id, num);
                }
              };

              return (
                <div
                  key={product.id}
                  className="grid grid-cols-2 items-center gap-3 border-b border-lightBorder p-4 last:border-b-0 lg:grid-cols-[52px_minmax(0,1.4fr)_110px_140px_auto_44px] lg:gap-4 lg:p-5"
                >
                  <img
                    src={product.image}
                    alt=""
                    className="h-12 w-12 rounded-lg bg-[#f7f7f7] object-contain mix-blend-multiply lg:h-14 lg:w-14"
                  />
                  <div className="min-w-0">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.05em] text-textSecondary">
                      {product.category}
                    </span>
                    <strong className="mt-0.5 block truncate text-sm font-semibold lg:text-base">
                      {product.name}
                    </strong>
                  </div>
                  <span className="text-sm text-textSecondary">
                    Base: {formatINR(product.basePrice)}
                  </span>
                  <SellingPriceInput
                    id={`launch-price-${product.id}`}
                    value={priceDrafts[product.id] ?? String(sellingPrice)}
                    base={product.basePrice}
                    onChange={handlePriceChange}
                    label={`Selling price for ${product.name}`}
                  />
                  <span className="w-max rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600 lg:text-sm">
                    +{formatINR(profit)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveProduct(product.id)}
                    aria-label={`Remove ${product.name}`}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-[#e2e5ea] bg-lightSurface text-textSecondary transition hover:border-brandRed hover:text-brandRed"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
              <p className="text-base font-semibold">No products selected yet</p>
              <p className="text-sm text-textSecondary">
                Go back to the product catalog and add at least one product.
              </p>
              <button
                type="button"
                onClick={onBack}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-brandRed px-6 text-sm font-semibold text-white transition hover:bg-brandRedDark"
              >
                Choose Products
              </button>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-bento-sm border border-lightBorder bg-lightSurface shadow-bento lg:sticky lg:top-24">
          <div className="border-b border-lightBorder p-5 text-base font-bold lg:text-lg">
            Launch Summary
          </div>

          <dl className="grid gap-3 p-5">
            {[
              ["Shop Name", form.shopName || "My Awesome Shop"],
              ["Category", form.category || "Fashion"],
              ["Products", selectedProducts.length],
              ["Total Base Value", formatINR(baseTotal)],
              ["Your Selling Total", formatINR(sellingTotal)],
              ["Potential Profit", formatINR(potentialProfit)],
              ["Entry Charge", formatINR(entryFee)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3 text-sm">
                <dt className="text-textSecondary">{label}</dt>
                <dd
                  className={`m-0 text-right font-bold ${
                    label === "Potential Profit" ? "text-emerald-600" : "text-textPrimary"
                  }`}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mx-5 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
            <CircleHelp size={16} className="mt-0.5 shrink-0" />
            <span>
              One-time entry charge of <b>{formatINR(entryFee)}</b> ({entryFeeLabel}) will be
              applied when you launch.
            </span>
          </div>

          <div className="p-5 pt-4">
            <button
              type="button"
              onClick={onLaunch}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-brandRed px-6 text-sm font-semibold text-white transition hover:bg-brandRedDark"
            >
              <Send size={18} />
              Launch My Shop
            </button>
            <button
              type="button"
              onClick={onBack}
              className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[#d9d9d9] bg-lightSurface px-5 text-sm font-semibold text-textPrimary transition hover:border-brandRed hover:text-brandRed"
            >
              <ArrowLeft size={16} />
              Back to Products
            </button>
          </div>
        </aside>
      </div>

      <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-lightBorder pt-5 text-xs text-textSecondary sm:flex-row lg:text-sm">
        <strong className="text-brandRed">Serofast</strong>
        <div className="flex flex-wrap justify-center gap-5">
          <span>Terms of Service</span>
          <span>Privacy Policy</span>
          <span>Vendor Handbook</span>
          <span>Contact Us</span>
        </div>
        <span>© 2024 Serofast Marketplace. All rights reserved.</span>
      </footer>
    </section>
  );
}
