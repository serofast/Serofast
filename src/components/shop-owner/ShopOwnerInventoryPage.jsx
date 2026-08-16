import { useState } from "react";
import { Plus, Search, Edit3, CheckCircle2, XCircle, X, Package } from "lucide-react";
import { initialSellerProducts } from "../../data/sellerData";
import { AppFormCard, AppFormField, AppFormSelect, AppFormButton } from "../reusable/form";

const categoryOptions = ["Fashion", "Footwear", "Accessories", "Electronics", "Beauty", "Stationery"];

export default function ShopOwnerInventoryPage() {
  const [products, setProducts] = useState(initialSellerProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Fashion");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("10");
  const [newProdImage, setNewProdImage] = useState("");

  const toggleStockStatus = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === "In Stock" ? "Out of Stock" : "In Stock",
              stock: p.status === "In Stock" ? 0 : 10,
            }
          : p
      )
    );
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const newProduct = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice),
      originalPrice: Number(newProdPrice) + 400,
      stock: Number(newProdStock),
      status: Number(newProdStock) > 0 ? "In Stock" : "Out of Stock",
      salesCount: 0,
      image: newProdImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",
    };

    setProducts([newProduct, ...products]);
    setIsModalOpen(false);
    setNewProdName("");
    setNewProdPrice("");
    setNewProdImage("");
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-brandRed tracking-tight">
            Products &amp; Inventory
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Manage your store catalog, pricing &amp; stock status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex h-12 items-center justify-center gap-2 rounded-[30px] bg-brandRed px-5 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer w-full sm:w-auto"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Pill Search Input */}
      <AppFormField
        icon={Search}
        value={searchQuery}
        onChange={(val) => setSearchQuery(val)}
        placeholder="Search store products by name..."
      />

      {/* Mobile Card Stack */}
      <div className="space-y-3 sm:hidden">
        {filteredProducts.map((prod) => (
          <div key={prod.id} className="rounded-[28px] bg-white border border-[#F3E5E5] p-4 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={prod.image}
                alt={prod.name}
                className="h-14 w-14 rounded-[18px] object-cover border border-slate-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="font-bold text-slate-900 block text-xs truncate">{prod.name}</span>
                <span className="text-[10px] text-slate-400 block font-normal">Category: {prod.category}</span>
                <span className="text-sm font-bold text-brandRed mt-0.5 block">₹{prod.price}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
              <button
                type="button"
                onClick={() => toggleStockStatus(prod.id)}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold cursor-pointer transition ${
                  prod.status === "In Stock"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-rose-50 text-rose-700 border border-rose-100"
                }`}
              >
                {prod.status === "In Stock" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                <span>{prod.status} ({prod.stock})</span>
              </button>

              <span className="text-[11px] text-slate-500 font-normal">{prod.salesCount} sold</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Product Table */}
      <div className="hidden sm:block overflow-hidden rounded-[35px] bg-white border border-[#F3E5E5] shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-[#FAF8F5] font-semibold text-slate-600">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Stock Status</th>
                <th className="px-5 py-3.5">Sales</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="h-10 w-10 rounded-[14px] object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">{prod.name}</span>
                        <span className="text-[10px] text-slate-400">ID: {prod.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{prod.category}</td>
                  <td className="px-5 py-3.5 font-bold text-brandRed text-sm">₹{prod.price}</td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleStockStatus(prod.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold cursor-pointer transition ${
                        prod.status === "In Stock"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}
                    >
                      {prod.status === "In Stock" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      <span>{prod.status} ({prod.stock})</span>
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{prod.salesCount} sold</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => toggleStockStatus(prod.id)}
                      className="rounded-full p-1.5 text-slate-400 hover:text-brandRed transition cursor-pointer"
                      title="Toggle Stock"
                    >
                      <Edit3 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal Container */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in font-sans font-sansation">
          <AppFormCard className="relative max-w-md w-full" title="Add Product to Catalog">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleAddProduct} className="space-y-4 text-left">
              <AppFormField
                label="Product Title"
                required
                value={newProdName}
                onChange={(val) => setNewProdName(val)}
                placeholder="e.g. Polo Campus T-Shirt"
              />

              <div className="grid grid-cols-2 gap-3">
                <AppFormSelect
                  label="Category"
                  value={newProdCategory}
                  onChange={(val) => setNewProdCategory(val)}
                  options={categoryOptions}
                />

                <AppFormField
                  label="Price (₹)"
                  type="number"
                  required
                  value={newProdPrice}
                  onChange={(val) => setNewProdPrice(val)}
                  placeholder="799"
                />
              </div>

              <AppFormField
                label="Image URL"
                type="url"
                value={newProdImage}
                onChange={(val) => setNewProdImage(val)}
                placeholder="https://..."
              />

              <div className="pt-2">
                <AppFormButton type="submit">
                  Save Product
                </AppFormButton>
              </div>
            </form>
          </AppFormCard>
        </div>
      )}
    </div>
  );
}
