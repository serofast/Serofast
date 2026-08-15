import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Package, CheckCircle2, Loader2 } from "lucide-react";
import { fetchWarehouseProducts } from "../../lib/supabase";

export default function ProductSelectionStep({ form, updateForm, onNext, onBack }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const selected = form.selectedProducts || [];

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchWarehouseProducts();
      setProducts(data);
      setLoading(false);
    })();
  }, []);

  const toggleProduct = (id) => {
    let updated;
    if (selected.includes(id)) {
      updated = selected.filter((pid) => pid !== id);
    } else {
      if (selected.length >= 20) return; // Max 20
      updated = [...selected, id];
    }
    updateForm({ selectedProducts: updated });
  };

  const isSelected = (id) => selected.includes(id);

  return (
    <div className="space-y-7 font-sans max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brandRed/10 text-brandRed">
          <Package size={22} />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Stock your shop</h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Select up to <strong className="text-brandRed">20 products</strong> from the SeroFast warehouse to display in your store.
          </p>
        </div>
      </div>

      {/* Selection Counter */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-5 py-3.5 shadow-sm">
        <span className="text-xs font-semibold text-slate-600">Products selected</span>
        <span className={`text-sm font-bold ${selected.length >= 20 ? "text-amber-600" : "text-brandRed"}`}>
          {selected.length} / 20
        </span>
      </div>

      {/* Product Grid */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 size={32} className="animate-spin text-brandRed" />
            <span className="text-xs font-semibold">Loading warehouse products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
            <Package size={36} />
            <span className="text-xs font-semibold">No products in warehouse yet.</span>
            <span className="text-[10px]">Ask the SeroFast admin to add products first.</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {products.map((p) => {
              const checked = isSelected(p.id);
              const imgUrl = p.image_urls?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80";

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProduct(p.id)}
                  className={`relative rounded-2xl border-2 p-2.5 text-left transition-all active:scale-[0.97] cursor-pointer ${
                    checked
                      ? "border-brandRed bg-brandRed/5 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  } ${!checked && selected.length >= 20 ? "opacity-40 pointer-events-none" : ""}`}
                >
                  {/* Check badge */}
                  {checked && (
                    <div className="absolute top-2 right-2 z-10">
                      <CheckCircle2 size={20} className="text-brandRed drop-shadow-sm" fill="white" />
                    </div>
                  )}

                  <img
                    src={imgUrl}
                    alt={p.title}
                    className="w-full aspect-square rounded-xl object-cover bg-slate-100"
                  />

                  <div className="mt-2 space-y-0.5">
                    <h4 className="text-xs font-semibold text-slate-900 leading-tight line-clamp-2">{p.title}</h4>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-slate-900">₹{p.price}</span>
                      {p.original_price && p.original_price > p.price && (
                        <span className="text-[10px] text-slate-400 line-through">₹{p.original_price}</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
        <button type="button" onClick={onBack} className="min-h-[52px] flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer">
          <ArrowLeft size={16} /> Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="min-h-[56px] flex-1 sm:flex-initial flex items-center justify-center gap-2.5 rounded-2xl bg-brandRed px-6 text-sm font-bold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark active:scale-[0.98] transition cursor-pointer"
        >
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
