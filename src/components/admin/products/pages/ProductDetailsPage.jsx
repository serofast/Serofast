import { useState } from "react";
import { Archive, Boxes, Edit3, Image as ImageIcon, Layers } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, ConfirmDialog, PageHeader, StatusBadge, Tabs, Toast } from "../../shared/ui";
import { useProducts } from "../hooks/useProducts";
import { productService } from "../services/productService";
import { discountPercentage } from "../validation/productValidation";

const tabs = ["Overview", "Carousel Images", "Inventory"];
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const ANGLE_LABELS = [
  "Angle 1 (Front / Cover)",
  "Angle 2 (Side Angle)",
  "Angle 3 (Back / Perspective)",
  "Angle 4 (Close-up / Detail)",
  "Additional Angle",
];

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product } = useProducts(productId);
  const [activeTab, setActiveTab] = useState("Overview");
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [toast, setToast] = useState("");

  if (!product) {
    return (
      <div className="rounded-[35px] border border-[#F3E5E5] bg-white p-8 text-center text-sm text-slate-500">
        Product not found.
      </div>
    );
  }

  function archiveProduct() {
    productService.archive(product.id);
    setArchiveOpen(false);
    setToast("Product archived.");
  }

  const primaryImage =
    product.images?.find((image) => image.isPrimary)?.url ?? product.images?.[0]?.url;

  const sections = product.sections || ["Explore Products"];

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-8">
      <PageHeader
        title={product.name}
        description="Catalog specifications, carousel angle images, and stock status."
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate(`/admin/products/${product.id}/edit`)}
          className="inline-flex h-10 items-center gap-2 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-xs hover:bg-brandRedDark"
        >
          <Edit3 size={14} /> Edit Product
        </button>
        {product.status !== "Archived" && (
          <button
            type="button"
            onClick={() => setArchiveOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-[30px] border border-brandRed bg-white px-4 text-xs font-medium text-brandRed hover:bg-rose-50"
          >
            <Archive size={14} /> Archive
          </button>
        )}
      </div>

      <Card className="overflow-hidden border border-[#F3E5E5] bg-white">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="h-32 w-32 rounded-[22px] border border-slate-100 object-cover bg-slate-50"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-[22px] bg-slate-100 text-slate-400">
              <ImageIcon size={28} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge value={product.status || "Active"} />
              {product.featured && (
                <span className="rounded-full bg-rose-50 px-3 py-0.5 text-[11px] font-semibold text-brandRed">
                  ★ Featured
                </span>
              )}
              {sections.map((sec) => (
                <span
                  key={sec}
                  className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-700"
                >
                  {sec}
                </span>
              ))}
            </div>
            <h1 className="mt-2 text-lg font-semibold text-slate-900">{product.name}</h1>
            <p className="mt-1 line-clamp-2 text-xs text-slate-600">
              {product.description || "No description provided."}
            </p>
          </div>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="p-5 sm:p-6">
          {activeTab === "Overview" && <Overview product={product} sections={sections} />}
          {activeTab === "Carousel Images" && <Images product={product} />}
          {activeTab === "Inventory" && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Summary label="Current Stock" value={product.stock > 0 ? `${product.stock} (In Stock)` : "0 (Sold Out - Hidden from shoppers)"} />
                <Summary
                  label="Shopper Visibility"
                  value={product.stock > 0 ? "Visible on App & Web" : "Hidden from Store Listings"}
                />
              </div>
              <button
                type="button"
                onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                className="inline-flex h-10 items-center gap-2 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium text-slate-700 hover:border-brandRed hover:text-brandRed"
              >
                <Boxes size={15} /> Edit Product Stock & Price
              </button>
            </div>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={archiveOpen}
        title="Archive Product?"
        description="This product will no longer appear as active in marketplace listings."
        confirmLabel="Archive Product"
        tone="danger"
        onConfirm={archiveProduct}
        onClose={() => setArchiveOpen(false)}
      />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function Overview({ product, sections }) {
  const fields = [
    ["Category", product.categoryName || product.category || "General"],
    ["Placement Sections", sections.join(", ")],
    ["Regular Price", currency.format(product.price || 0)],
    [
      "Discount Price",
      product.discountPrice
        ? `${currency.format(product.discountPrice)} (${discountPercentage(product.price, product.discountPrice)}% off)`
        : "—",
    ],
    ["Stock Status", product.stock > 0 ? `${product.stock} in stock` : "Sold Out"],
    ["Description", product.description || "—"],
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map(([label, value]) => (
        <Summary key={label} label={label} value={value} />
      ))}
    </div>
  );
}

function Images({ product }) {
  const images = product.images || [];
  if (!images.length) {
    return <Empty text="No carousel images added for this product." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {images.map((image, index) => {
        const label = ANGLE_LABELS[index] || `Angle ${index + 1}`;
        return (
          <figure
            key={image.id || index}
            className="overflow-hidden rounded-[20px] border border-[#F3E5E5] bg-[#FAF8F5]"
          >
            <div className="h-44 w-full overflow-hidden bg-slate-50">
              <img
                src={image.url}
                alt={image.alt || `Angle ${index + 1}`}
                className="h-full w-full object-contain p-2"
              />
            </div>
            <figcaption className="border-t border-slate-100 bg-white p-3 text-[11px]">
              <span className="font-semibold text-slate-800">
                {image.isPrimary ? "★ Primary Cover" : label}
              </span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div className="rounded-[20px] border border-[#F3E5E5] bg-[#FAF8F5] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-xs font-medium text-slate-900">{value}</p>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#E5E7EB] p-8 text-center text-xs text-slate-500">
      {text}
    </div>
  );
}
