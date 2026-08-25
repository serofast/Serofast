import { useNavigate, useParams } from "react-router-dom";
import { PageHeader, Toast } from "../../shared/ui";
import ProductForm from "../components/ProductForm";
import { useProducts } from "../hooks/useProducts";
import { saveAdminWarehouseProduct } from "../../../../services/adminSupabaseService";
import { useState } from "react";

export default function ProductFormPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product, products, categories, reload } = useProducts(productId);
  const [toast, setToast] = useState("");
  const [formKey, setFormKey] = useState(1);
  const editing = Boolean(productId);

  if (editing && !product) {
    return (
      <div className="rounded-[35px] border border-[#F3E5E5] bg-white p-8 text-center text-sm text-slate-500">
        Product not found.
      </div>
    );
  }

  async function save(values, addAnother = false) {
    try {
      const matchedCategory = categories.find((c) => c.id === values.categoryId);
      const categoryName = matchedCategory?.name || values.categoryId || "General";
      const primaryImage =
        values.images?.find((img) => img.isPrimary)?.url || values.images?.[0]?.url || "";

      const storePrice = Number(values.store_price ?? values.retail_price ?? values.price) || 0;
      const cutPrice = Number(values.cut_price ?? values["Price(will be cutted)"] ?? values.base_price ?? storePrice) || storePrice;

      const saved = await saveAdminWarehouseProduct({
        id: productId,
        title: values.name,
        name: values.name,
        category: categoryName,
        categoryName,
        material: values.material || "",
        fit: values.fit || "",
        care: values.care || "",
        sizes: values.sizes || [],
        store_price: storePrice,
        "Price(will be cutted)": cutPrice,
        cut_price: cutPrice,
        base_price: storePrice,
        retail_price: cutPrice,
        warehouse_stock: Number(values.stock) >= 0 ? Number(values.stock) : 1,
        sku: `SF-${Date.now().toString(36).toUpperCase()}`,
        description: values.description || "",
        image_url: primaryImage,
        images: values.images || [],
        sections: values.sections || ["Explore Products"],
      });

      if (!saved) {
        setToast("Failed to save product in Supabase. Please verify your table schema.");
        return;
      }

      if (reload) await reload();

      if (addAnother && !editing) {
        setToast("Product created successfully! Ready to add next product.");
        setFormKey((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setToast(
          editing
            ? "Product successfully updated in warehouse catalog."
            : "Product successfully created in warehouse catalog."
        );
        window.setTimeout(() => {
          navigate(saved?.id ? `/admin/products/${saved.id}` : "/admin/products");
        }, 400);
      }
    } catch (e) {
      setToast(e?.message || "Error saving product to Supabase.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl pb-10">
      <PageHeader
        title={editing ? `Edit ${product.name}` : "Add New Product"}
        description="Add product carousel images, specifications, placement, base MRP and retail selling price."
      />
      <ProductForm
        key={formKey}
        product={editing ? product : null}
        categories={categories}
        products={products}
        onSave={save}
        onCancel={() => navigate(product ? `/admin/products/${product.id}` : "/admin/products")}
      />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
