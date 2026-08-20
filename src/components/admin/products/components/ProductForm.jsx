import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Star, Trash2, X } from "lucide-react";
import { AdminSelect, Card } from "../../shared/ui";
import { validateProduct } from "../validation/productValidation";

const fieldClass = "h-11 w-full rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs text-slate-800 outline-none focus:border-brandRed";
const textAreaClass = "min-h-24 w-full rounded-[24px] border border-[#E5E7EB] bg-white px-4 py-3 text-xs text-slate-800 outline-none focus:border-brandRed";

function createDraft(product, categories) {
  return product
    ? JSON.parse(JSON.stringify(product))
    : {
        name: "",
        slug: "",
        description: "",
        shortDescription: "",
        categoryId: categories[0]?.id ?? "",
        shopId: "SHOP-ADMIN-CATALOG",
        shopName: "Admin Catalog",
        sku: "",
        price: "",
        discountPrice: "",
        stock: 0,
        lowStockThreshold: 5,
        status: "Draft",
        featured: false,
        tags: [],
        images: [],
        variants: [],
        approvalStatus: "Draft",
        rejectionReason: "",
      };
}

function FormField({ label, error, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[11px] font-medium text-brandRed">{error}</span>}
    </label>
  );
}

function Section({ title, description, children }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-base font-normal text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-[11px] text-slate-500">{description}</p>}
      </div>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

export default function ProductForm({ product, categories, products, onSave, onCancel }) {
  const [draft, setDraft] = useState(() => createDraft(product, categories));
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const activeCategories = categories.filter((category) => category.status !== "Inactive");
  const statusOptions = product?.approvalStatus === "Approved"
    ? ["Active", "Inactive", "Archived"]
    : ["Draft", "Pending Approval"];

  const totalVariantStock = useMemo(
    () => draft.variants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0),
    [draft.variants],
  );

  function update(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function addTag(value = tagInput) {
    const tags = String(value).split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean);
    if (tags.length) update("tags", [...new Set([...draft.tags, ...tags])]);
    setTagInput("");
  }

  function addImage(url) {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (draft.images.length >= 8) {
      setErrors((current) => ({ ...current, images: "A product can contain up to 8 local images." }));
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      setErrors((current) => ({ ...current, images: "Enter a valid image URL." }));
      return;
    }
    update("images", [...draft.images, { id: `IMG-${Date.now()}`, url: trimmed, alt: draft.name || "Product image", position: draft.images.length, isPrimary: draft.images.length === 0 }]);
    setImageUrl("");
  }

  function uploadImages(files) {
    const selected = [...files];
    if (draft.images.length + selected.length > 8) {
      setErrors((current) => ({ ...current, images: "A product can contain up to 8 local images." }));
      return;
    }
    const invalid = selected.find((file) => !file.type.startsWith("image/") || file.size > 500 * 1024);
    if (invalid) {
      setErrors((current) => ({ ...current, images: "Use JPG, PNG, WebP, or another image format no larger than 500 KB per local file." }));
      return;
    }
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setDraft((current) => ({ ...current, images: [...current.images, { id: `IMG-${Date.now()}-${file.name}`, url: reader.result, alt: file.name.replace(/\.[^.]+$/, ""), position: current.images.length, isPrimary: current.images.length === 0 }] }));
      reader.readAsDataURL(file);
    });
    setErrors((current) => ({ ...current, images: undefined }));
  }

  function moveImage(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= draft.images.length) return;
    const images = [...draft.images];
    [images[index], images[target]] = [images[target], images[index]];
    update("images", images.map((image, position) => ({ ...image, position })));
  }

  function removeImage(id) {
    const images = draft.images.filter((image) => image.id !== id);
    if (images.length && !images.some((image) => image.isPrimary)) images[0] = { ...images[0], isPrimary: true };
    update("images", images);
  }

  function setPrimary(id) {
    update("images", draft.images.map((image) => ({ ...image, isPrimary: image.id === id })));
  }

  function addVariant() {
    update("variants", [...draft.variants, { id: `VAR-${Date.now()}`, attributes: { Size: "", Color: "" }, sku: `${draft.sku || "SKU"}-`, price: draft.price || 0, discountPrice: draft.discountPrice || "", stock: 0, lowStockThreshold: draft.lowStockThreshold || 0, imageId: draft.images.find((image) => image.isPrimary)?.id ?? "", status: "Active" }]);
  }

  function updateVariant(index, patch) {
    update("variants", draft.variants.map((variant, currentIndex) => currentIndex === index ? { ...variant, ...patch } : variant));
  }

  function submit(event) {
    event.preventDefault();
    const nextDraft = { ...draft, stock: draft.variants.length ? totalVariantStock : draft.stock };
    const nextErrors = validateProduct(nextDraft, products, product?.id ?? null);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    onSave(nextDraft);
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {Object.keys(errors).length > 0 && (
        <div role="alert" className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-xs text-brandRed">
          Review the highlighted product fields before saving.
        </div>
      )}

      <Section title="Basic Information" description="Product identity and marketplace description.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Product Name" error={errors.name}>
            <input value={draft.name} onChange={(event) => update("name", event.target.value)} className={fieldClass} />
          </FormField>
          <FormField label="Slug">
            <input value={draft.slug} onChange={(event) => update("slug", event.target.value)} placeholder="Generated from product name" className={fieldClass} />
          </FormField>
          <FormField label="Short Description" className="sm:col-span-2">
            <input value={draft.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} className={fieldClass} />
          </FormField>
          <FormField label="Description" className="sm:col-span-2">
            <textarea value={draft.description} onChange={(event) => update("description", event.target.value)} className={textAreaClass} />
          </FormField>
        </div>
      </Section>

      <Section title="Catalog" description="Classification, shop ownership, and searchable tags.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Category" error={errors.categoryId}>
            <AdminSelect value={draft.categoryId} onChange={(value) => update("categoryId", value)} options={activeCategories.map((category) => ({ value: category.id, label: category.name }))} ariaLabel="Product category" buttonClassName="h-11" />
          </FormField>
          <FormField label="Shop">
            <input value={draft.shopName} onChange={(event) => update("shopName", event.target.value)} className={fieldClass} />
          </FormField>
          <FormField label="Tags" className="sm:col-span-2">
            <div className="flex gap-2">
              <input value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === ",") { event.preventDefault(); addTag(); } }} placeholder="Type a tag and press Enter" className={fieldClass} />
              <button type="button" onClick={() => addTag()} className="h-11 rounded-[30px] border border-[#E5E7EB] px-4 text-xs font-medium">Add</button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {draft.tags.map((tag) => <button key={tag} type="button" onClick={() => update("tags", draft.tags.filter((item) => item !== tag))} className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-[11px] text-brandRed">{tag}<X size={12} /></button>)}
            </div>
          </FormField>
        </div>
      </Section>

      <Section title="Pricing & Inventory" description="Product-level values apply when no variants are configured.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormField label="Regular Price" error={errors.price}><input type="number" min="0" step="0.01" value={draft.price} onChange={(event) => update("price", event.target.value)} className={fieldClass} /></FormField>
          <FormField label="Discount Price" error={errors.discountPrice}><input type="number" min="0" step="0.01" value={draft.discountPrice ?? ""} onChange={(event) => update("discountPrice", event.target.value)} className={fieldClass} /></FormField>
          <FormField label="SKU" error={errors.sku}><input value={draft.sku} onChange={(event) => update("sku", event.target.value.toUpperCase())} className={fieldClass} /></FormField>
          <FormField label="Low-stock Threshold" error={errors.lowStockThreshold}><input type="number" min="0" step="1" value={draft.lowStockThreshold} onChange={(event) => update("lowStockThreshold", event.target.value)} className={fieldClass} /></FormField>
          <FormField label={draft.variants.length ? `Stock (from variants: ${totalVariantStock})` : "Stock"} error={errors.stock} className="sm:col-span-2 lg:col-span-1"><input type="number" min="0" step="1" disabled={draft.variants.length > 0} value={draft.variants.length ? totalVariantStock : draft.stock} onChange={(event) => update("stock", event.target.value)} className={`${fieldClass} disabled:bg-slate-50 disabled:text-slate-400`} /></FormField>
        </div>
      </Section>

      <Section title="Product Images" description="Add multiple images, control their order, and select one primary image.">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://example.com/product.jpg" className={fieldClass} />
          <button type="button" onClick={() => addImage(imageUrl)} className="h-11 shrink-0 rounded-[30px] border border-[#E5E7EB] px-4 text-xs font-medium">Add URL</button>
          <label className="flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white"><ImagePlus size={15} /> Upload<input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => uploadImages(event.target.files)} /></label>
        </div>
        {errors.images && <p className="mt-2 text-[11px] text-brandRed">{errors.images}</p>}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {draft.images.map((image, index) => (
            <div key={image.id} className="overflow-hidden rounded-[24px] border border-[#F3E5E5] bg-[#FAF8F5]">
              <img src={image.url} alt={image.alt || draft.name} className="h-36 w-full object-cover" />
              <div className="flex items-center justify-between p-2">
                <button type="button" onClick={() => setPrimary(image.id)} aria-label="Set primary image" className={`rounded-full p-2 ${image.isPrimary ? "bg-brandRed text-white" : "bg-white text-slate-500"}`}><Star size={14} fill={image.isPrimary ? "currentColor" : "none"} /></button>
                <div className="flex gap-1"><button type="button" disabled={index === 0} onClick={() => moveImage(index, -1)} className="rounded-full bg-white p-2 disabled:opacity-30"><ArrowUp size={14} /></button><button type="button" disabled={index === draft.images.length - 1} onClick={() => moveImage(index, 1)} className="rounded-full bg-white p-2 disabled:opacity-30"><ArrowDown size={14} /></button><button type="button" onClick={() => removeImage(image.id)} className="rounded-full bg-white p-2 text-brandRed"><Trash2 size={14} /></button></div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Variants" description="Each variant has independent attributes, SKU, pricing, and inventory.">
        <div className="space-y-3">
          {draft.variants.map((variant, index) => (
            <div key={variant.id} className="rounded-[24px] border border-[#F3E5E5] bg-[#FAF8F5] p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {['Size', 'Color', 'Material'].map((attribute) => <FormField key={attribute} label={attribute}><input value={variant.attributes?.[attribute] ?? ""} onChange={(event) => updateVariant(index, { attributes: { ...variant.attributes, [attribute]: event.target.value } })} className={fieldClass} /></FormField>)}
                <FormField label="Variant SKU"><input value={variant.sku} onChange={(event) => updateVariant(index, { sku: event.target.value.toUpperCase() })} className={fieldClass} /></FormField>
                <FormField label="Price"><input type="number" min="0" value={variant.price} onChange={(event) => updateVariant(index, { price: event.target.value })} className={fieldClass} /></FormField>
                <FormField label="Discount Price"><input type="number" min="0" value={variant.discountPrice ?? ""} onChange={(event) => updateVariant(index, { discountPrice: event.target.value })} className={fieldClass} /></FormField>
                <FormField label="Stock"><input type="number" min="0" step="1" value={variant.stock} onChange={(event) => updateVariant(index, { stock: event.target.value })} className={fieldClass} /></FormField>
                <FormField label="Threshold"><input type="number" min="0" step="1" value={variant.lowStockThreshold} onChange={(event) => updateVariant(index, { lowStockThreshold: event.target.value })} className={fieldClass} /></FormField>
              </div>
              <button type="button" onClick={() => update("variants", draft.variants.filter((_, currentIndex) => currentIndex !== index))} className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-brandRed"><Trash2 size={13} /> Remove variant</button>
            </div>
          ))}
          {errors.variants && <p className="text-[11px] text-brandRed">{errors.variants}</p>}
          <button type="button" onClick={addVariant} className="inline-flex h-10 items-center gap-2 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium"><Plus size={14} /> Add Variant</button>
        </div>
      </Section>

      <Section title="Publishing" description="Approval decisions are recorded separately in the moderation queue.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Status"><AdminSelect value={draft.status} onChange={(value) => { update("status", value); if (value === "Pending Approval") update("approvalStatus", "Pending Approval"); }} options={statusOptions} ariaLabel="Product status" buttonClassName="h-11" /></FormField>
          <label className="flex min-h-11 items-center gap-3 rounded-[24px] border border-[#E5E7EB] px-4 text-xs text-slate-700"><input type="checkbox" checked={draft.featured} onChange={(event) => update("featured", event.target.checked)} className="h-4 w-4 accent-brandRed" /> Featured product</label>
        </div>
      </Section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="h-11 rounded-[30px] border border-[#E5E7EB] bg-white px-5 text-xs font-medium text-slate-700">Cancel</button>
        <button type="submit" className="h-11 rounded-[30px] bg-brandRed px-5 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark">{product ? "Save Product" : "Create Product"}</button>
      </div>
    </form>
  );
}
