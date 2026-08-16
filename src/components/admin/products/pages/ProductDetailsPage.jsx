import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
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
    <div>
      <PageHeader
        title={editing ? `Edit ${product.product}` : product.product}
        description="Product profile, inventory, seller information, and moderation state."
        action={!editing ? "Edit Product" : undefined}
        onAction={() => navigate(`/admin/products/${product.id}/edit`)}
      />

      {editing ? (
        <ProductEditor
          draft={draft}
          setDraft={setDraft}
          onSubmit={saveProduct}
          onCancel={() => navigate(`/admin/products/${product.id}`)}
        />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap gap-2">
            {product.status !== "Active" && (
              <button
                type="button"
                onClick={() => setPendingStatus("Active")}
                className="min-h-10 rounded-lg bg-brandRed px-4 text-sm font-semibold text-white"
              >
                Approve
              </button>
            )}
            <button
              type="button"
              onClick={() => setPendingStatus(product.status === "Hidden" ? "Active" : "Hidden")}
              className="min-h-10 rounded-lg border border-lightBorder px-4 text-sm font-semibold"
            >
              {product.status === "Hidden" ? "Publish" : "Hide"}
            </button>
            <button
              type="button"
              onClick={() => setPendingStatus("Flagged")}
              className="min-h-10 rounded-lg border border-lightBorder px-4 text-sm font-semibold text-brandRed"
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
                <div className="rounded-xl bg-lightBackground p-5">
                  <h2 className="font-semibold">{activeTab}</h2>
                  <p className="mt-2 text-sm text-textSecondary">
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
        <div key={label} className="flex justify-between gap-4 border-b border-lightBorder pb-3 text-sm">
          <span className="text-textMuted">{label}</span>
          <span className="text-right font-semibold">{value}</span>
        </div>
      ))}
      <div className="flex justify-between gap-4 border-b border-lightBorder pb-3 text-sm">
        <span className="text-textMuted">Status</span>
        <StatusBadge value={product.status} />
      </div>
    </div>
  );
}

function ProductEditor({ draft, setDraft, onSubmit, onCancel }) {
  return (
    <Card className="max-w-3xl p-5 sm:p-6">
      <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
        {[
          ["product", "Product Name", "text"],
          ["shop", "Shop", "text"],
          ["category", "Category", "text"],
          ["price", "Price", "text"],
          ["stock", "Stock", "number"],
        ].map(([key, label, type]) => (
          <label key={key} className="block">
            <span className="mb-1.5 block text-sm font-semibold">{label}</span>
            <input
              type={type}
              min={type === "number" ? "0" : undefined}
              value={draft[key]}
              onChange={(event) =>
                setDraft((current) => ({ ...current, [key]: event.target.value }))
              }
              className="h-11 w-full rounded-lg border border-lightBorder px-3 text-sm outline-none focus:border-brandRed"
            />
          </label>
        ))}
        <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded-lg border border-lightBorder px-4 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="min-h-11 rounded-lg bg-brandRed px-4 text-sm font-semibold text-white"
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
        <label key={item} className="flex min-h-12 items-center gap-3 rounded-xl border border-lightBorder p-3 text-sm">
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
