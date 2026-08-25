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
  Loader2,
  Package,
  Plus,
  Scissors,
  Shirt,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  Zap,
} from "lucide-react";
import CreatableDropdown from "./CreatableDropdown";
import { Card } from "../../shared/ui";
import { validateProduct, discountPercentage } from "../validation/productValidation";
import { uploadProductImageToStorage } from "../../../../services/adminSupabaseService";

const fieldClass =
  "h-11 w-full rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs text-slate-800 outline-none transition-all focus:border-brandRed focus:ring-2 focus:ring-brandRed/10";
const textAreaClass =
  "min-h-28 w-full rounded-[24px] border border-[#E5E7EB] bg-white px-4 py-3 text-xs text-slate-800 outline-none transition-all focus:border-brandRed focus:ring-2 focus:ring-brandRed/10 resize-y";

const DEFAULT_CATEGORIES = [
  "Fashion",
  "Men's Clothing",
  "Women's Clothing",
  "Electronics",
  "Mobiles & Gadgets",
  "Footwear",
  "Beauty & Wellness",
  "Home & Kitchen",
  "Furniture",
  "Accessories & Jewellery",
  "Sports & Fitness",
  "Books & Stationery",
  "Grocery",
];

const DEFAULT_SECTIONS = [
  "Flash Deals",
  "Explore Products",
  "Recommended",
  "Trending Now",
  "New Arrivals",
  "Best Sellers",
  "Campus Specials",
  "More Products",
];

const DEFAULT_MATERIALS = [
  "100% Organic Cotton",
  "Cotton Blend",
  "Denim / Cotton Twill",
  "Pure Linen",
  "Silk / Satin",
  "Polyester / Spandex",
  "Wool / Wool Blend",
  "Rayon / Viscose",
  "Corduroy",
  "Genuine Leather",
  "Vegan Faux Leather",
  "Canvas / Duck Cloth",
  "Fleece / Terry Cotton",
  "Ribbed Knit",
  "Stainless Steel / Alloy",
  "Ceramic / Glass",
];

const DEFAULT_FITS = [
  "Regular Fit",
  "Slim Fit",
  "Oversized Fit",
  "Relaxed Fit",
  "Boxy Fit",
  "Classic Fit",
  "Loose Fit",
  "Tailored Fit",
  "Athletic / Tapered",
  "Skinny Fit",
  "Standard Fit",
];

const DEFAULT_CARE = [
  "Machine wash cold with like colors",
  "Hand wash only in cold water",
  "Dry clean only",
  "Do not bleach / Warm iron",
  "Tumble dry low",
  "Line dry in shade",
  "Wipe clean with a damp cloth",
  "Avoid direct heat / moisture",
];

const DEFAULT_SIZES = [
  "Free Size",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "UK 6",
  "UK 7",
  "UK 8",
  "UK 9",
  "UK 10",
  "UK 11",
  "One Size",
];

const ANGLE_LABELS = [
  "Angle 1 (Front / Cover)",
  "Angle 2 (Side Angle)",
  "Angle 3 (Back / Perspective)",
  "Angle 4 (Close-up / Detail)",
  "Angle 5 (Additional)",
  "Angle 6 (Additional)",
];

function createDraft(product, categories) {
  if (product) {
    const rawSections = product.sections || [];
    const rawSizes = Array.isArray(product.sizes)
      ? product.sizes
      : product.size ? [product.size] : [];

    const rawCutPrice =
      product["Price(will be cutted)"] ??
      product.cut_price ??
      product.base_price ??
      "";
    const rawStorePrice =
      product.store_price ??
      product.retail_price ??
      product.price ??
      "";

    return {
      name: product.name || product.title || "",
      description: product.description || "",
      categoryId: product.categoryId || product.category || categories[0]?.name || categories[0]?.id || "Fashion",
      sections: rawSections.length ? rawSections : ["Explore Products"],
      material: product.material || "",
      fit: product.fit || "",
      care: product.care || "",
      sizes: rawSizes,
      cut_price: rawCutPrice,
      store_price: rawStorePrice,
      stock: product.stock ?? product.warehouse_stock ?? 1,
      images: Array.isArray(product.images) ? product.images : [],
    };
  }

  return {
    name: "",
    description: "",
    categoryId: categories[0]?.name || categories[0]?.id || "Fashion",
    sections: ["Explore Products"],
    material: "",
    fit: "",
    care: "",
    sizes: [],
    cut_price: "",
    store_price: "",
    stock: 1,
    images: [],
  };
}

function FormField({ label, error, helper, required, children, className = "" }) {
  return (
    <div className={`block ${className}`}>
      <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-700">
        <span>
          {label}
          {required && <span className="ml-1 text-brandRed">*</span>}
        </span>
        {helper && <span className="text-[10px] font-normal text-slate-400">{helper}</span>}
      </div>
      {children}
      {error && <span className="mt-1.5 block text-[11px] font-medium text-brandRed">{error}</span>}
    </div>
  );
}

function Section({ title, description, badge, children }) {
  return (
    <Card className="overflow-visible relative border border-[#F3E5E5] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] sm:p-6">
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

export default function ProductForm({ product, categories = [], products = [], onSave, onCancel }) {
  const [draft, setDraft] = useState(() => createDraft(product, categories));
  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Merge categories list
  const categoryOptions = Array.from(
    new Set([
      ...categories.map((c) => c.name || c.id),
      ...DEFAULT_CATEGORIES,
    ])
  ).filter(Boolean);

  function update(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
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
    const angleIndex = draft.images.length;
    const angleTag = ANGLE_LABELS[angleIndex] || `Angle ${angleIndex + 1}`;
    update("images", [
      ...draft.images,
      {
        id: `IMG-${Date.now()}`,
        url: trimmed,
        alt: `${draft.name || "Product"} - ${angleTag}`,
        angle: angleIndex === 0 ? "main" : `angle-${angleIndex + 1}`,
        position: angleIndex,
        isPrimary: angleIndex === 0,
      },
    ]);
    setImageUrl("");
  }

  async function uploadImages(files) {
    const selected = Array.from(files);
    if (!selected.length) return;

    if (draft.images.length + selected.length > 6) {
      setErrors((current) => ({
        ...current,
        images: "You can add up to 6 angle images for the product carousel.",
      }));
      return;
    }

    const invalid = selected.find((f) => !f.type.startsWith("image/") || f.size > 5 * 1024 * 1024);
    if (invalid) {
      setErrors((current) => ({
        ...current,
        images: "Please upload valid image files (PNG, JPG, WebP) under 5 MB each.",
      }));
      return;
    }

    setUploading(true);
    setErrors((current) => ({ ...current, images: undefined }));

    try {
      const uploadedList = [];
      for (let i = 0; i < selected.length; i++) {
        const file = selected[i];
        const nextPos = draft.images.length + i;
        const angleSlug = nextPos === 0 ? "main" : `angle-${nextPos + 1}`;
        const storedUrl = await uploadProductImageToStorage(
          file,
          angleSlug,
          draft.categoryId || "general"
        );

        if (storedUrl) {
          uploadedList.push({
            id: `IMG-${Date.now()}-${i}`,
            url: storedUrl,
            alt: `${draft.name || "Product"} - ${ANGLE_LABELS[nextPos] || `Angle ${nextPos + 1}`}`,
            angle: angleSlug,
            position: nextPos,
            isPrimary: nextPos === 0 && draft.images.length === 0,
          });
        }
      }

      update("images", [...draft.images, ...uploadedList]);
    } catch (err) {
      setErrors((current) => ({ ...current, images: "Image upload failed. Please try again." }));
    } finally {
      setUploading(false);
    }
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

  function handleFormSubmit(event, addAnother = false) {
    if (event) event.preventDefault();
    const nextErrors = validateProduct(draft, products, product?.id ?? null);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    onSave(draft, addAnother);
  }

  const calcDiscount = discountPercentage(draft.cut_price, draft.store_price);

  return (
    <form onSubmit={(e) => handleFormSubmit(e, false)} className="space-y-6" noValidate>
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-[24px] border border-rose-200 bg-rose-50/90 p-4 text-xs font-medium text-brandRed shadow-xs"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brandRed text-white font-bold text-[10px]">
            !
          </div>
          <span>Please review the required fields highlighted below before saving.</span>
        </div>
      )}

      {/* 1. PRODUCT IMAGES (FIRST AT THE TOP) */}
      <Section
        title="1. Product Carousel Images"
        description="Add 3 to 4 side-angle photos (Front / Cover, Side Angle, Back Perspective, Close-up). Files are stored directly in the cloud storage bucket and mapped to the product carousel."
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
                placeholder="Paste external image URL (https://...)"
                className={fieldClass}
              />
            </div>
            <button
              type="button"
              onClick={() => addImage(imageUrl)}
              className="h-11 shrink-0 rounded-[30px] border border-[#E5E7EB] bg-white px-5 text-xs font-medium text-slate-700 transition-colors hover:border-brandRed hover:text-brandRed cursor-pointer"
            >
              Add URL
            </button>
            <label className="flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[30px] bg-brandRed px-5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(211,47,47,0.25)] transition-transform active:scale-95 hover:bg-brandRedDark">
              {uploading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Uploading to Storage...</span>
                </>
              ) : (
                <>
                  <ImagePlus size={15} />
                  <span>Upload Side Angles</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                className="sr-only"
                onChange={(event) => uploadImages(event.target.files)}
              />
            </label>
          </div>

          {errors.images && <p className="text-[11px] font-medium text-brandRed">{errors.images}</p>}

          {/* Angle Images Grid */}
          {draft.images.length === 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["1. Front / Cover View", "2. Side Angle", "3. Back Angle", "4. Detail / Texture"].map(
                (placeholder, idx) => (
                  <label
                    key={placeholder}
                    className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#E5E7EB] bg-[#FAF8F5] p-3 text-center transition-all hover:border-brandRed/50 hover:bg-rose-50/40"
                  >
                    <Camera size={20} className="text-slate-400" />
                    <span className="mt-2 text-[11px] font-semibold text-slate-600">{placeholder}</span>
                    <span className="mt-0.5 text-[9px] text-slate-400">Click to upload</span>
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
                        {image.isPrimary ? "Primary Cover" : label}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        title="Remove image"
                        className="text-slate-400 transition-colors hover:text-brandRed cursor-pointer"
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
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold transition-colors cursor-pointer ${
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
                          className="rounded-full bg-slate-100 p-1.5 text-slate-600 transition-colors disabled:opacity-20 hover:bg-slate-200 cursor-pointer"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={index === draft.images.length - 1}
                          onClick={() => moveImage(index, 1)}
                          title="Move later in carousel"
                          className="rounded-full bg-slate-100 p-1.5 text-slate-600 transition-colors disabled:opacity-20 hover:bg-slate-200 cursor-pointer"
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
                    disabled={uploading}
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
        description="Core name and single description for shoppers."
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
            helper="One single description for the item"
          >
            <textarea
              value={draft.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Describe the product details, size fit, condition, styling tips, or any unique specifications..."
              className={textAreaClass}
            />
          </FormField>
        </div>
      </Section>

      {/* 3. CATEGORY & STORE PLACEMENT */}
      <Section
        title="3. Category & Store Section Placement"
        description="Select or type custom categories and storefront display sections."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Product Category"
            required
            helper="Select or type new category"
            error={errors.categoryId}
          >
            <CreatableDropdown
              value={draft.categoryId}
              onChange={(val) => update("categoryId", val)}
              options={categoryOptions}
              placeholder="Select or type category..."
              allowCustom={true}
              ariaLabel="Product Category"
            />
          </FormField>

          <FormField
            label="Display Placement / Store Sections"
            helper="Select or type new store sections"
          >
            <CreatableDropdown
              value={draft.sections}
              onChange={(val) => update("sections", val)}
              options={DEFAULT_SECTIONS}
              placeholder="Select or type sections..."
              multiple={true}
              allowCustom={true}
              ariaLabel="Store Sections"
            />
          </FormField>
        </div>
      </Section>

      {/* 4. PRODUCT SPECIFICATIONS (MATERIAL, FIT, CARE, SIZES) */}
      <Section
        title="4. Specifications & Sizing"
        description="Specify fabric material, fit cut, care instructions, and available sizes. Admin can select from standard options or type custom values."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Material / Fabric" helper="Select or type custom material">
            <CreatableDropdown
              value={draft.material}
              onChange={(val) => update("material", val)}
              options={DEFAULT_MATERIALS}
              placeholder="e.g. 100% Cotton, Denim..."
              allowCustom={true}
              ariaLabel="Material"
            />
          </FormField>

          <FormField label="Fit" helper="Select or type custom fit">
            <CreatableDropdown
              value={draft.fit}
              onChange={(val) => update("fit", val)}
              options={DEFAULT_FITS}
              placeholder="e.g. Regular Fit, Oversized..."
              allowCustom={true}
              ariaLabel="Fit"
            />
          </FormField>

          <FormField label="Care Instructions" helper="Select or type wash care">
            <CreatableDropdown
              value={draft.care}
              onChange={(val) => update("care", val)}
              options={DEFAULT_CARE}
              placeholder="e.g. Machine wash cold, Dry clean..."
              allowCustom={true}
              ariaLabel="Care Instructions"
            />
          </FormField>

          <FormField label="Available Sizes" helper="Select or type custom sizes">
            <CreatableDropdown
              value={draft.sizes}
              onChange={(val) => update("sizes", val)}
              options={DEFAULT_SIZES}
              placeholder="Select or type sizes (e.g. M, L, XL, Free Size)..."
              multiple={true}
              allowCustom={true}
              ariaLabel="Available Sizes"
            />
          </FormField>
        </div>
      </Section>

      {/* 5. PRICING & WAREHOUSE INVENTORY */}
      <Section
        title="5. Pricing & Warehouse Inventory"
        description="Set the store price (the price the user will buy) and the price that will be cutted (slashed MRP for discount display)."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Price (will be cutted) */}
          <FormField
            label="Price (will be cutted - ₹)"
            helper="Original price that will be slashed / crossed out"
            error={errors.cut_price}
          >
            <input
              type="number"
              min="0"
              step="1"
              value={draft.cut_price}
              onChange={(event) => update("cut_price", event.target.value)}
              placeholder="e.g. 999 (Slashed MRP)"
              className={fieldClass}
            />
          </FormField>

          {/* Store Price (User will buy) */}
          <FormField
            label="Store Price (User Will Buy - ₹)"
            required
            helper={
              calcDiscount > 0
                ? `${calcDiscount}% OFF (User Saves ₹${Number(draft.cut_price) - Number(draft.store_price)})`
                : "Final price user pays to buy"
            }
            error={errors.store_price}
          >
            <input
              type="number"
              min="0"
              step="1"
              value={draft.store_price}
              onChange={(event) => update("store_price", event.target.value)}
              placeholder="e.g. 499 (Selling Price)"
              className={fieldClass}
            />
          </FormField>

          {/* Single Stock */}
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
            Single-stock model: Once this item is sold (stock reaches 0), it will automatically be unlisted and hidden from customer views.
          </span>
        </div>
      </Section>

      {/* FORM ACTIONS */}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-[30px] border border-[#E5E7EB] bg-white px-6 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
        >
          Cancel
        </button>
        {!product && (
          <button
            type="button"
            onClick={(e) => handleFormSubmit(e, true)}
            className="h-11 rounded-[30px] border border-brandRed bg-rose-50/60 px-6 text-xs font-semibold text-brandRed transition-all hover:bg-rose-100 cursor-pointer"
          >
            Save & Add Another
          </button>
        )}
        <button
          type="submit"
          className="h-11 rounded-[30px] bg-brandRed px-8 text-xs font-semibold text-white shadow-[0_6px_20px_rgba(211,47,47,0.35)] transition-all hover:bg-brandRedDark active:scale-98 cursor-pointer"
        >
          {product ? "Save Warehouse Product" : "Create Warehouse Product"}
        </button>
      </div>
    </form>
  );
}
