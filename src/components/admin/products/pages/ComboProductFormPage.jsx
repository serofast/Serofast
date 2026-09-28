import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader, Toast } from "../../shared/ui";
import ProductForm from "../components/ProductForm";
import { useProducts } from "../hooks/useProducts";
import { saveAdminWarehouseProduct } from "../../../../services/adminSupabaseService";

export default function ComboProductFormPage() {
  const navigate = useNavigate();
  const { products, categories, reload } = useProducts();
  const [toast, setToast] = useState("");
  const [formKey, setFormKey] = useState(1);

  async function save(values, addAnother = false) {
    try {
      const selectedProducts = values.comboProductIds
        .map((id) => products.find((product) => product.id === id))
        .filter(Boolean);
      const category = categories.find((item) => item.id === values.categoryId);
      const combinedValue = Number(values.cut_price) || 0;
      const comboPrice = Number(values.store_price) || 0;
      const componentSummary = selectedProducts
        .map((product) => {
          const price = Number(product.store_price ?? product.retail_price ?? product.price) || 0;
          return `- ${product.name} (₹${price.toLocaleString("en-IN")})`;
        })
        .join("\n");
      const description = [
        values.description?.trim(),
        "",
        `Combo offer: ${values.comboLabel?.trim() || "Combo Offer"}`,
        `Includes ${selectedProducts.length} products:`,
        componentSummary,
        `Combined value: ₹${combinedValue.toLocaleString("en-IN")}`,
        `Combo price: ₹${comboPrice.toLocaleString("en-IN")}`,
        `Customer savings: ₹${Math.max(0, combinedValue - comboPrice).toLocaleString("en-IN")}`,
        values.offerStarts ? `Offer starts: ${values.offerStarts}` : "",
        values.offerEnds ? `Offer ends: ${values.offerEnds}` : "",
      ].filter(Boolean).join("\n");

      const saved = await saveAdminWarehouseProduct({
        title: values.name,
        name: values.name,
        category: category?.name || values.categoryId || "General",
        categoryName: category?.name || values.categoryId || "General",
        material: values.material || "Combo offer",
        fit: values.fit || "",
        care: values.care || "",
        occation: values.occation || "",
        sizes: values.sizes || [],
        store_price: comboPrice,
        "Price(will be cutted)": combinedValue,
        cut_price: combinedValue,
        base_price: comboPrice,
        retail_price: combinedValue,
        warehouse_stock: Number(values.stock),
        sku: values.sku || `SF-CMB-${Date.now().toString(36).toUpperCase()}`,
        description,
        image_url: values.images?.find((image) => image.isPrimary)?.url || values.images?.[0]?.url || "",
        images: values.images || [],
        sections: values.sections || ["Explore Products"],
      });

      if (!saved) {
        setToast("Failed to save combo product in Supabase. Please verify your table schema.");
        return;
      }

      if (reload) await reload();
      if (addAnother) {
        setToast("Combo product created successfully! Ready to add another combo.");
        setFormKey((current) => current + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setToast("Combo product successfully created in warehouse catalog.");
      window.setTimeout(() => navigate(saved.id ? `/admin/products/${saved.id}` : "/admin/products"), 400);
    } catch (error) {
      setToast(error?.message || "Error saving combo product to Supabase.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl pb-10">
      <button
        type="button"
        onClick={() => navigate("/admin/products/new")}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-brandRed"
      >
        <ArrowLeft size={14} /> Back to Product Type
      </button>
      <PageHeader
        title="Add Combo Product"
        description="Create a complete multi-item offer with the same images, catalog details, placement, specifications, pricing and inventory workflow as a single product."
      />
      <ProductForm
        key={formKey}
        comboMode
        categories={categories}
        products={products}
        onSave={save}
        onCancel={() => navigate("/admin/products/new")}
      />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
