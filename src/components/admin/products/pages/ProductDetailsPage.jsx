import { useState } from "react";
import { Archive, Copy, Edit3, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, ConfirmDialog, PageHeader, StatusBadge, Tabs, Toast } from "../../shared/ui";
import { useProducts } from "../hooks/useProducts";
import { productService } from "../services/productService";
import { discountPercentage } from "../validation/productValidation";

const tabs = ["Overview", "Images", "Variants", "Inventory", "Approval History"];
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product, approvalHistory } = useProducts(productId);
  const [activeTab, setActiveTab] = useState("Overview");
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [toast, setToast] = useState("");

  if (!product) return <div className="rounded-[35px] border border-[#F3E5E5] bg-white p-8 text-center text-sm text-slate-500">Product not found.</div>;
  const history = approvalHistory.filter((item) => item.productId === product.id).sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt));

  function archiveProduct() {
    productService.archive(product.id);
    setArchiveOpen(false);
    setToast("Product archived. Related inventory and history were preserved.");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-8">
      <PageHeader title={product.name} description="Catalog, media, variant, inventory, and local moderation record." />
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => navigate(`/admin/products/${product.id}/edit`)} className="inline-flex h-10 items-center gap-2 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white"><Edit3 size={14} /> Edit Product</button>
        {["Draft", "Rejected"].includes(product.approvalStatus) && <button type="button" onClick={() => { productService.submitForApproval([product.id]); setToast("Product submitted for local approval review."); }} className="inline-flex h-10 items-center gap-2 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium"><Send size={14} /> Submit for Approval</button>}
        {product.status !== "Archived" && <button type="button" onClick={() => setArchiveOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-[30px] border border-brandRed bg-white px-4 text-xs font-medium text-brandRed"><Archive size={14} /> Archive</button>}
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <img src={product.images.find((image) => image.isPrimary)?.url ?? product.images[0]?.url} alt={product.name} className="h-28 w-28 rounded-[24px] object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><StatusBadge value={product.status} /><StatusBadge value={product.approvalStatus} />{product.featured && <span className="rounded-full bg-rose-50 px-3 py-1 text-[11px] text-brandRed">Featured</span>}</div>
            <p className="mt-3 text-sm text-slate-600">{product.shortDescription || product.description}</p>
            <button type="button" onClick={() => { navigator.clipboard?.writeText(product.sku); setToast("SKU copied."); }} className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-500"><Copy size={12} /> {product.sku}</button>
          </div>
        </div>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="p-5 sm:p-6">
          {activeTab === "Overview" && <Overview product={product} />}
          {activeTab === "Images" && <Images product={product} />}
          {activeTab === "Variants" && <Variants product={product} />}
          {activeTab === "Inventory" && <div className="grid gap-3 sm:grid-cols-3"><Summary label="Total Stock" value={product.stock} /><Summary label="Low-stock Threshold" value={product.lowStockThreshold} /><Summary label="Inventory Level" value={product.stock === 0 ? "Out of Stock" : product.stock <= product.lowStockThreshold ? "Low Stock" : "In Stock"} /></div>}
          {activeTab === "Approval History" && <History entries={history} />}
        </div>
      </Card>

      <ConfirmDialog open={archiveOpen} title="Archive Product?" description="This product will no longer appear as active. Its variants, inventory, reviews, and order references remain available." confirmLabel="Archive Product" tone="danger" onConfirm={archiveProduct} onClose={() => setArchiveOpen(false)} />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function Overview({ product }) {
  return <div className="grid gap-3 sm:grid-cols-2">{[["Category", product.categoryName], ["Shop", product.shopName], ["Regular Price", currency.format(product.price)], ["Discount Price", product.discountPrice ? `${currency.format(product.discountPrice)} (${discountPercentage(product.price, product.discountPrice)}% off)` : "—"], ["Stock", product.stock], ["SKU", product.sku], ["Tags", product.tags.join(", ") || "—"], ["Updated", new Date(product.updatedAt).toLocaleString("en-IN")]].map(([label, value]) => <Summary key={label} label={label} value={value} />)}</div>;
}

function Images({ product }) {
  if (!product.images.length) return <Empty text="No product images added." />;
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{product.images.map((image) => <figure key={image.id} className="overflow-hidden rounded-[24px] border border-[#F3E5E5]"><img src={image.url} alt={image.alt} className="h-48 w-full object-cover" /><figcaption className="p-3 text-[11px] text-slate-500">{image.isPrimary ? "Primary image" : `Position ${image.position + 1}`} · {image.alt}</figcaption></figure>)}</div>;
}

function Variants({ product }) {
  if (!product.variants.length) return <Empty text="This product has no variants. Product-level SKU and stock are used." />;
  return <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-xs"><thead className="border-b border-slate-100 bg-[#FAF8F5]"><tr>{["Attributes", "SKU", "Price", "Discount", "Stock", "Threshold", "Status"].map((label) => <th key={label} className="px-4 py-3 font-medium text-slate-600">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{product.variants.map((variant) => <tr key={variant.id}><td className="px-4 py-3">{Object.entries(variant.attributes).map(([key, value]) => `${key}: ${value}`).join(" · ")}</td><td className="px-4 py-3">{variant.sku}</td><td className="px-4 py-3">{currency.format(variant.price)}</td><td className="px-4 py-3">{variant.discountPrice ? currency.format(variant.discountPrice) : "—"}</td><td className="px-4 py-3">{variant.stock}</td><td className="px-4 py-3">{variant.lowStockThreshold}</td><td className="px-4 py-3"><StatusBadge value={variant.status} /></td></tr>)}</tbody></table></div>;
}

function History({ entries }) {
  if (!entries.length) return <Empty text="No approval history has been recorded." />;
  return <div className="space-y-3">{entries.map((entry) => <div key={entry.id} className="rounded-[24px] border border-[#F3E5E5] bg-[#FAF8F5] p-4 text-xs"><div className="flex flex-wrap items-center justify-between gap-2"><span className="font-medium text-slate-900">{entry.action}</span><time className="text-[11px] text-slate-400">{new Date(entry.reviewedAt).toLocaleString("en-IN")}</time></div><p className="mt-1 text-slate-500">{entry.previousStatus} → {entry.newStatus} · {entry.reviewedBy}</p>{entry.reason && <p className="mt-2 text-brandRed">Reason: {entry.reason}</p>}</div>)}</div>;
}

function Summary({ label, value }) { return <div className="rounded-[24px] border border-[#F3E5E5] bg-[#FAF8F5] p-4"><p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-xs font-medium text-slate-900">{value}</p></div>; }
function Empty({ text }) { return <div className="rounded-[24px] border border-dashed border-[#E5E7EB] p-8 text-center text-xs text-slate-500">{text}</div>; }
