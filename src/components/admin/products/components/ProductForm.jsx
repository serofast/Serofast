import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Camera,
  Check,
  CheckCircle2,
  HelpCircle,
  ImagePlus,
  Layers,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  Zap,
} from "lucide-react";
import { AdminSelect, Card } from "../../shared/ui";
import { validateProduct, discountPercentage } from "../validation/productValidation";

const fieldClass =
  "h-11 w-full rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs text-slate-800 outline-none transition-all focus:border-brandRed focus:ring-2 focus:ring-brandRed/10";
const textAreaClass =
  "min-h-28 w-full rounded-[24px] border border-[#E5E7EB] bg-white px-4 py-3 text-xs text-slate-800 outline-none transition-all focus:border-brandRed focus:ring-2 focus:ring-brandRed/10 resize-y";

const PLACEMENT_SECTIONS = [
  { id: "Flash Deals", label: "Flash Deals", icon: Zap, color: "text-amber-500 bg-amber-50 border-amber-200" },
  { id: "Explore Products", label: "Explore Products", icon: Layers, color: "text-blue-500 bg-blue-50 border-blue-200" },
  { id: "Recommended", label: "Recommended", icon: Sparkles, color: "text-purple-500 bg-purple-50 border-purple-200" },
  { id: "More Sections", label: "More Products", icon: Tag, color: "text-emerald-500 bg-emerald-50 border-emerald-200" },
];

const ANGLE_LABELS = [
  "Angle 1 (Front / Cover)",
  "Angle 2 (Side Angle)",
  "Angle 3 (Back / Perspective)",
  "Angle 4 (Close-up / Detail)",
  "Additional Angle",
  "Additional Angle",
];

function createDraft(product, categories) {
  if (product) {
    const rawSections = product.sections || [];
    return {
      name: product.name || "",
      description: product.description || product.shortDescription || "",
      categoryId: product.categoryId || product.category || categories[0]?.id || "",
      sections: rawSections.length ? rawSections : ["Explore Products"],
      price: product.price || product.base_price || "",
      discountPrice: product.discountPrice || "",
      stock: product.stock ?? product.warehouse_stock ?? 1,
      status: product.status === "Draft" ? "Draft" : "Active",
      featured: Boolean(product.featured),
      images: Array.isArray(product.images) ? product.images : [],
    };
  }

  return {
    name: "",
    description: "",
    categoryId: categories[0]?.id ?? "",
    sections: ["Explore Products"],
    price: "",
    discountPrice: "",
    stock: 1,
    status: "Active",
    featured: false,
    images: [],
  };
}

function FormField({ label, error, helper, required, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-700">
        <span>
          {label}
          {required && <span className="ml-1 text-brandRed">*</span>}
        </span>
        {helper && <span className="text-[10px] font-normal text-slate-400">{helper}</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-[11px] font-medium text-brandRed">{error}</span>}
    </label>
  );
}

function Section({ title, description, badge, children }) {
  return (
    <Card className="overflow-hidden border border-[#F3E5E5] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>}
        </div>
        {badge && (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-brandRed">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

export default function ProductForm({ product, categories, products, onSave, onCancel }) {
  const [draft, setDraft] = useState(() => createDraft(product, categories));
  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const activeCategories = categories.filter((category) => category.status !== "Inactive");

  function update(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function toggleSection(sectionId) {
    const current = draft.sections || [];
    const updated = current.includes(sectionId)
      ? current.filter((s) => s !== sectionId)
      : [...current, sectionId];
    update("sections", updated.length > 0 ? updated : [sectionId]);
  }

  function addImage(url) {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (draft.images.length >= 6) {
      setErrors((current) => ({ ...current, images: "Up to 6 carousel angle images supported." }));
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      setErrors((current) => ({ ...current, images: "Please enter a valid image URL." }));
      return;
    }
    update("images", [
      ...draft.images,
      {
        id: `IMG-${Date.now()}`,
        url: trimmed,
        alt: `${draft.name || "Product"} - Angle ${draft.images.length + 1}`,
        position: draft.images.length,
        isPrimary: draft.images.length === 0,
      },
    ]);
    setImageUrl("");
  }

  function uploadImages(files) {
    const selected = [...files];
    if (draft.images.length + selected.length > 6) {
      setErrors((current) => ({ ...current, images: "You can add up to 6 angle images for the carousel." }));
      return;
    }
    const invalid = selected.find((file) => !file.type.startsWith("image/") || file.size > 2 * 1024 * 1024);
    if (invalid) {
      setErrors((current) => ({
        ...current,
        images: "Use PNG, JPG, or WebP images no larger than 2 MB each.",
      }));
      return;
    }
    selected.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = () => {
        setDraft((current) => ({
          ...current,
          images: [
            ...current.images,
            {
              id: `IMG-${Date.now()}-${i}-${file.name}`,
              url: reader.result,
              alt: file.name.replace(/\.[^.]+$/, ""),
              position: current.images.length,
              isPrimary: current.images.length === 0,
            },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });
    setErrors((current) => ({ ...current, images: undefined }));
  }

  function moveImage(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= draft.images.length) return;
    const images = [...draft.images];
    [images[index], images[target]] = [images[target], images[index]];
    update(
      "images",
      images.map((img, pos) => ({ ...img, position: pos }))
    );
  }

  function removeImage(id) {
    const images = draft.images.filter((image) => image.id !== id);
    if (images.length && !images.some((image) => image.isPrimary)) {
      images[0] = { ...images[0], isPrimary: true };
    }
    update("images", images);
  }

  function setPrimary(id) {
    update(
      "images",
      draft.images.map((image) => ({ ...image, isPrimary: image.id === id }))
    );
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validateProduct(draft, products, product?.id ?? null);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    onSave(draft);
  }

  const calcDiscount = discountPercentage(draft.price, draft.discountPrice);

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-[24px] border border-rose-200 bg-rose-50/90 p-4 text-xs font-medium text-brandRed shadow-xs"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brandRed text-white font-bold text-[10px]">
            !
          </div>
          <span>Please fill in the required fields highlighted below before saving.</span>
        </div>
      )}

      {/* 1. PRODUCT IMAGES (FIRST AT THE TOP) */}
      <Section
        title="1. Product Carousel Images"
        description="Add 3 to 4 angle photos (front, side, perspective, detail). Customers swipe through these in a multi-image carousel on the product page."
        badge={
          draft.images.length >= 3 ? (
            <span className="text-emerald-700 font-medium">✓ {draft.images.length} Images Added</span>
          ) : (
            <span>{draft.images.length} / 4 Recommended</span>
          )
        }
      >
        <div className="space-y-4">
          {/* Upload and URL input bar */}
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <div className="relative flex-1">
              <input
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImage(imageUrl);
                  }
                }}
                placeholder="Paste image link (https://...)"
                className={fieldClass}
              />
            </div>
            <button
              type="button"
              onClick={() => addImage(imageUrl)}
              className="h-11 shrink-0 rounded-[30px] border border-[#E5E7EB] bg-white px-5 text-xs font-medium text-slate-700 transition-colors hover:border-brandRed hover:text-brandRed"
            >
              Add URL
            </button>
            <label className="flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[30px] bg-brandRed px-5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(211,47,47,0.25)] transition-transform active:scale-95 hover:bg-brandRedDark">
              <ImagePlus size={15} />
              <span>Upload Photos</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(event) => uploadImages(event.target.files)}
              />
            </label>
          </div>

          {errors.images && <p className="text-[11px] font-medium text-brandRed">{errors.images}</p>}

          {/* Angle Images Grid */}
          {draft.images.length === 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["1. Front / Main View", "2. Side Angle", "3. Back Angle", "4. Detail / Texture"].map(
                (placeholder, idx) => (
                  <label
                    key={placeholder}
                    className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#E5E7EB] bg-[#FAF8F5] p-3 text-center transition-all hover:border-brandRed/50 hover:bg-rose-50/40"
                  >
                    <Camera size={20} className="text-slate-400" />
                    <span className="mt-2 text-[11px] font-semibold text-slate-600">{placeholder}</span>
                    <span className="mt-0.5 text-[9px] text-slate-400">Click or upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={(event) => uploadImages(event.target.files)}
                    />
                  </label>
                )
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {draft.images.map((image, index) => {
                const label = ANGLE_LABELS[index] || `Angle ${index + 1}`;
                return (
                  <div
                    key={image.id}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-[20px] border transition-all ${
                      image.isPrimary
                        ? "border-brandRed bg-white ring-2 ring-brandRed/20 shadow-md"
                        : "border-[#F3E5E5] bg-[#FAF8F5]"
                    }`}
                  >
                    {/* Angle Tag Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 bg-white/90 px-3 py-1.5 backdrop-blur-xs">
                      <span className="truncate text-[10px] font-bold text-slate-700">
                        {image.isPrimary ? "★ Primary Cover" : label}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        title="Remove image"
                        className="text-slate-400 transition-colors hover:text-brandRed"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Image Preview */}
                    <div className="relative h-36 w-full overflow-hidden bg-slate-50">
                      <img
                        src={image.url}
                        alt={image.alt || draft.name}
                        className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between border-t border-slate-100 bg-white px-2.5 py-2">
                      <button
                        type="button"
                        onClick={() => setPrimary(image.id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold transition-colors ${
                          image.isPrimary
                            ? "bg-brandRed text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <Star size={11} fill={image.isPrimary ? "currentColor" : "none"} />
                        {image.isPrimary ? "Primary" : "Set Cover"}
                      </button>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveImage(index, -1)}
                          title="Move earlier in carousel"
                          className="rounded-full bg-slate-100 p-1.5 text-slate-600 transition-colors disabled:opacity-20 hover:bg-slate-200"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={index === draft.images.length - 1}
                          onClick={() => moveImage(index, 1)}
                          title="Move later in carousel"
                          className="rounded-full bg-slate-100 p-1.5 text-slate-600 transition-colors disabled:opacity-20 hover:bg-slate-200"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add more button if less than 6 */}
              {draft.images.length < 6 && (
                <label className="flex h-auto min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#E5E7EB] bg-[#FAF8F5] p-3 text-center transition-all hover:border-brandRed/50 hover:bg-rose-50/30">
                  <Camera size={18} className="text-slate-400" />
                  <span className="mt-1.5 text-[11px] font-semibold text-slate-700">
                    + Add Angle {draft.images.length + 1}
                  </span>
                  <span className="mt-0.5 text-[9px] text-slate-400">Carousel slide</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(event) => uploadImages(event.target.files)}
                  />
                </label>
              )}
            </div>
          )}
        </div>
      </Section>

      {/* 2. PRODUCT DETAILS */}
      <Section
        title="2. Product Details"
        description="Name and clear description for shoppers."
      >
        <div className="space-y-4">
          <FormField label="Product Name" required error={errors.name}>
            <input
              value={draft.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="e.g. Classic Oversized Denim Jacket"
              className={fieldClass}
            />
          </FormField>

          <FormField
            label="Product Description"
            helper="One comprehensive description for the item"
          >
            <textarea
              value={draft.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Describe the product material, size fit, condition, styling tips, or any unique specifications..."
              className={textAreaClass}
            />
          </FormField>
        </div>
      </Section>

      {/* 3. CATEGORY & DISPLAY PLACEMENT */}
      <Section
        title="3. Category & Display Placement"
        description="Select category and which storefront sections this product should appear in."
      >
        <div className="space-y-5">
          <FormField label="Product Category" required error={errors.categoryId}>
            <AdminSelect
              value={draft.categoryId}
              onChange={(value) => update("categoryId", value)}
              options={activeCategories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              ariaLabel="Product category"
              buttonClassName="h-11"
            />
          </FormField>

          <div>
            <span className="mb-2 block text-xs font-semibold text-slate-700">
              Display Placement / Store Sections
            </span>
            <p className="mb-3 text-[11px] text-slate-500">
              Choose one or more sections where users can discover and purchase this item:
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {PLACEMENT_SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isSelected = (draft.sections || []).includes(sec.id);
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => toggleSection(sec.id)}
                    className={`flex items-center justify-between rounded-[20px] border p-3 text-left transition-all ${
                      isSelected
                        ? "border-brandRed bg-rose-50/70 text-slate-900 shadow-xs ring-1 ring-brandRed"
                        : "border-[#E5E7EB] bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full ${sec.color}`}
                      >
                        <Icon size={14} />
                      </div>
                      <span className="text-xs font-semibold">{sec.label}</span>
                    </div>
                    {isSelected && (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-brandRed text-white">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* 4. PRICING & SINGLE STOCK */}
      <Section
        title="4. Pricing & Inventory"
        description="Set the price and single-item stock availability."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Regular Price (₹)" required error={errors.price}>
            <input
              type="number"
              min="0"
              step="1"
              value={draft.price}
              onChange={(event) => update("price", event.target.value)}
              placeholder="e.g. 999"
              className={fieldClass}
            />
          </FormField>

          <FormField
            label="Discount / Sale Price (₹)"
            helper={calcDiscount > 0 ? `${calcDiscount}% OFF` : "Optional"}
            error={errors.discountPrice}
          >
            <input
              type="number"
              min="0"
              step="1"
              value={draft.discountPrice ?? ""}
              onChange={(event) => update("discountPrice", event.target.value)}
              placeholder="e.g. 799"
              className={fieldClass}
            />
          </FormField>

          <FormField
            label="Stock Quantity"
            helper="1 unit default (unlisted when sold)"
            error={errors.stock}
          >
            <input
              type="number"
              min="0"
              step="1"
              value={draft.stock}
              onChange={(event) => update("stock", event.target.value)}
              className={fieldClass}
            />
          </FormField>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-[16px] bg-slate-50 px-3.5 py-2 text-[11px] text-slate-500">
          <HelpCircle size={13} className="shrink-0 text-slate-400" />
          <span>
            Single-stock model: Once this item is sold (stock reaches 0), it will be automatically hidden from shoppers on the mobile app and website.
          </span>
        </div>
      </Section>

      {/* 5. PUBLISHING STATUS */}
      <Section title="5. Visibility & Publishing">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Product Status">
            <AdminSelect
              value={draft.status}
              onChange={(value) => update("status", value)}
              options={[
                { value: "Active", label: "Active (Published live)" },
                { value: "Draft", label: "Draft (Hidden from store)" },
              ]}
              ariaLabel="Product status"
              buttonClassName="h-11"
            />
          </FormField>

          <div className="flex items-center">
            <label className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium text-slate-700 transition-colors hover:border-slate-300">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(event) => update("featured", event.target.checked)}
                className="h-4 w-4 accent-brandRed"
              />
              <span className="flex items-center gap-1.5">
                <Star size={13} className="text-amber-500" fill={draft.featured ? "currentColor" : "none"} />
                Mark as Featured Product
              </span>
            </label>
          </div>
        </div>
      </Section>

      {/* FORM ACTIONS */}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-[30px] border border-[#E5E7EB] bg-white px-6 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="h-11 rounded-[30px] bg-brandRed px-8 text-xs font-semibold text-white shadow-[0_6px_20px_rgba(211,47,47,0.35)] transition-all hover:bg-brandRedDark active:scale-98"
        >
          {product ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
