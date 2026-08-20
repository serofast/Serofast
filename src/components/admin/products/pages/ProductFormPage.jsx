import { useNavigate, useParams } from "react-router-dom";
import { PageHeader, Toast } from "../../shared/ui";
import ProductForm from "../components/ProductForm";
import { useProducts } from "../hooks/useProducts";
import { productService } from "../services/productService";
import { useState } from "react";

export default function ProductFormPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product, products, categories } = useProducts(productId);
  const [toast, setToast] = useState("");
  const editing = Boolean(productId);

  if (editing && !product) {
    return <div className="rounded-[35px] border border-[#F3E5E5] bg-white p-8 text-center text-sm text-slate-500">Product not found.</div>;
  }

  function save(values) {
    const result = productService.save(values, productId ?? null);
    if (!result.data) return;
    setToast(editing ? "Product updated in the local Admin repository." : "Product created in the local Admin repository.");
    window.setTimeout(() => navigate(`/admin/products/${result.data.id}`), 350);
  }

  return (
    <div className="mx-auto max-w-6xl pb-8">
      <PageHeader title={editing ? `Edit ${product.name}` : "Create Product"} description="Changes are stored locally for this frontend phase and can later be moved behind an API without replacing this form." />
      <ProductForm product={product} categories={categories} products={products} onSave={save} onCancel={() => navigate(product ? `/admin/products/${product.id}` : "/admin/products")} />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
