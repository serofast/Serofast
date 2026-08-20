import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AdminSelect,
  Card,
  ConfirmDialog,
  PageHeader,
  StatusBadge,
  Tabs,
  Toast,
} from "../../shared/ui";
import { products } from "../../shared/adminData";

const tabs = [
  "Overview",
  "Images",
  "Pricing",
  "Inventory",
  "Attributes",
  "Shop",
  "Reviews",
  "Sales",
  "Moderation",
];

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const source = products.find((item) => item.id === productId) ?? products[0];
  const [product, setProduct] = useState(source);
  const [draft, setDraft] = useState(source);
  const [activeTab, setActiveTab] = useState("Overview");
  const [pendingStatus, setPendingStatus] = useState(null);
  const [toast, setToast] = useState("");
  const editing = location.pathname.endsWith("/edit");

  function saveProduct(event) {
    event.preventDefault();

    if (!draft.product.trim() || Number(draft.stock) < 0) {
      setToast("Enter a product name and a stock value of zero or greater.");
      return;
    }

    setProduct({ ...draft, stock: Number(draft.stock) });
    setToast("Product updated in local Admin state.");
    navigate(`/admin/products/${product.id}`);
  }

  function confirmStatus() {
    setProduct((current) => ({ ...current, status: pendingStatus }));
    setDraft((current) => ({ ...current, status: pendingStatus }));
    setToast(`Product marked ${pendingStatus.toLowerCase()}.`);
    setPendingStatus(null);
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          {editing ? `Edit ${product.product}` : product.product}
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Product profile, inventory, seller information, and moderation state.
        </p>
      </div>

      {editing ? (
        <ProductEditor
          draft={draft}
          setDraft={setDraft}
          onSubmit={saveProduct}
          onCancel={() => navigate(`/admin/products/${product.id}`)}
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {product.status !== "Active" && (
              <button
                type="button"
                onClick={() => setPendingStatus("Active")}
                className="flex h-10 items-center justify-center gap-1.5 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer"
              >
                Approve
              </button>
            )}
            <button
              type="button"
              onClick={() => setPendingStatus(product.status === "Hidden" ? "Active" : "Hidden")}
              className="flex h-10 items-center justify-center gap-1.5 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium text-slate-700 hover:border-slate-300 transition cursor-pointer"
            >
              {product.status === "Hidden" ? "Publish" : "Hide"}
            </button>
            <button
              type="button"
              onClick={() => setPendingStatus("Flagged")}
              className="flex h-10 items-center justify-center gap-1.5 rounded-[30px] border border-brandRed bg-white px-4 text-xs font-semibold text-brandRed hover:bg-rose-50 transition cursor-pointer"
            >
              Flag Product
            </button>
          </div>

          <Card className="min-w-0 overflow-hidden">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            <div className="p-5 sm:p-6">
              {activeTab === "Overview" ? (
                <ProductOverview product={product} />
              ) : activeTab === "Moderation" ? (
                <ModerationChecklist />
              ) : (
                <div className="rounded-[24px] bg-[#FAF8F5] p-5 border border-[#F3E5E5]">
                  <h3 className="text-xs font-medium text-slate-800">{activeTab}</h3>
                  <p className="mt-2 text-[11px] text-slate-500 font-normal">
                    This Phase 4 panel is ready for {activeTab.toLowerCase()} data
                    from the product service in the backend phase.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingStatus)}
        title={`${pendingStatus} product`}
        description={`${product.product} will be marked ${pendingStatus?.toLowerCase() ?? ""}.`}
        confirmLabel="Confirm moderation change"
        tone={pendingStatus === "Active" ? "success" : "danger"}
        onConfirm={confirmStatus}
        onClose={() => setPendingStatus(null)}
      />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function ProductOverview({ product }) {
  return (
    <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
      {[
        ["Shop", product.shop],
        ["Category", product.category],
        ["Price", product.price],
        ["Stock", product.stock],
        ["Rating", `★ ${product.rating}`],
        ["Created", product.created],
      ].map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-xs">
          <span className="text-slate-500 font-normal">{label}</span>
          <span className="text-right font-medium text-slate-900">{value}</span>
        </div>
      ))}
      <div className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-xs">
        <span className="text-slate-500 font-normal">Status</span>
        <StatusBadge value={product.status} />
      </div>
    </div>
  );
}

function ProductEditor({ draft, setDraft, onSubmit, onCancel }) {
  const shopOptions = [...new Set(products.map((product) => product.shop))];
  const categoryOptions = [...new Set(products.map((product) => product.category))];

  return (
    <Card className="max-w-3xl p-5 sm:p-6">
      <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
        {[
          { key: "product", label: "Product Name", type: "text" },
          { key: "shop", label: "Shop", options: shopOptions },
          { key: "category", label: "Category", options: categoryOptions },
          { key: "price", label: "Price", type: "text" },
          { key: "stock", label: "Stock", type: "number" },
        ].map(({ key, label, type, options }) => (
          <label key={key} className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-700">{label}</span>
            {options ? (
              <AdminSelect
                value={draft[key]}
                onChange={(value) =>
                  setDraft((current) => ({ ...current, [key]: value }))
                }
                options={options}
                ariaLabel={label}
                buttonClassName="h-10"
              />
            ) : (
              <input
                type={type}
                min={type === "number" ? "0" : undefined}
                value={draft[key]}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, [key]: event.target.value }))
                }
                className="h-10 w-full rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs outline-none focus:border-brandRed"
              />
            )}
          </label>
        ))}
        <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-10 items-center justify-center rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex h-10 items-center justify-center rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer"
          >
            Save Product
          </button>
        </div>
      </form>
    </Card>
  );
}

function ModerationChecklist() {
  const [checks, setChecks] = useState(() =>
    Object.fromEntries(
      ["Product information", "Images", "Category", "Price", "Prohibited content"].map(
        (item) => [item, true],
      ),
    ),
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Object.entries(checks).map(([item, checked]) => (
        <label key={item} className="flex min-h-12 items-center gap-3 rounded-[20px] border border-[#F3E5E5] bg-[#FAF8F5] p-3 text-xs">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => setChecks((current) => ({ ...current, [item]: !checked }))}
            className="h-4 w-4 accent-brandRed"
          />
          {item} reviewed
        </label>
      ))}
    </div>
  );
}
