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
  const editing = Boolean(productId);

  if (editing && !product) {
    return (
      <div className="rounded-[35px] border border-[#F3E5E5] bg-white p-8 text-center text-sm text-slate-500">
        Product not found.
      </div>
    );
  }

  async function save(values) {
    try {
      const matchedCategory = categories.find((c) => c.id === values.categoryId);
      const categoryName = matchedCategory?.name || values.categoryId || "General";
      const primaryImage =
        values.images?.find((img) => img.isPrimary)?.url || values.images?.[0]?.url || "";

      const saved = await saveAdminWarehouseProduct({
        id: productId,
        title: values.name,
        name: values.name,
        category: categoryName,
        categoryName,
        base_price: Number(values.price) || 0,
        retail_price: Number(values.discountPrice || values.price) || 0,
        warehouse_stock: Number(values.stock) >= 0 ? Number(values.stock) : 1,
        sku: `SF-${Date.now().toString(36).toUpperCase()}`,
        description: values.description || "",
        image_url: primaryImage,
        images: values.images || [],
        sections: values.sections || ["Explore Products"],
      });

      setToast(
        editing
          ? "Product successfully updated."
          : "Product successfully created."
      );
      if (reload) await reload();
      window.setTimeout(() => {
        navigate(saved?.id ? `/admin/products/${saved.id}` : "/admin/products");
      }, 350);
    } catch (e) {
      setToast("Error saving product.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl pb-10">
      <PageHeader
        title={editing ? `Edit ${product.name}` : "Add New Product"}
        description="Add product images, details, store placement, and inventory."
      />
      <ProductForm
        product={product}
        categories={categories}
        products={products}
        onSave={save}
        onCancel={() => navigate(product ? `/admin/products/${product.id}` : "/admin/products")}
      />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
