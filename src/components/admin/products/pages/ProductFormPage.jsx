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
      const saved = await saveAdminWarehouseProduct({
        id: productId,
        title: values.name,
        category: values.categoryName || values.categoryId || "General",
        base_price: Number(values.price) || 0,
        retail_price: Number(values.discountPrice || values.price) || 0,
        warehouse_stock: Number(values.stock) || 0,
        sku: values.sku,
        description: values.description,
        image_url: values.images && values.images[0]?.url,
      });

      setToast(
        editing
          ? "Product successfully updated in Supabase."
          : "Product successfully created in Supabase."
      );
      if (reload) await reload();
      window.setTimeout(() => {
        navigate(saved?.id ? `/admin/products/${saved.id}` : "/admin/products");
      }, 350);
    } catch (e) {
      setToast("Error saving product to Supabase.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl pb-8">
      <PageHeader
        title={editing ? `Edit ${product.name}` : "Create Product"}
        description="Marketplace catalog records are persisted directly to Supabase warehouse products."
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
