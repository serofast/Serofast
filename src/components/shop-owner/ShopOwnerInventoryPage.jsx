import { useState } from "react";
import { Plus, Search, Edit3, CheckCircle2, XCircle, X } from "lucide-react";
import { initialSellerProducts } from "../../data/sellerData";

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
    <div className="space-y-5 sm:space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Products &amp; Inventory</h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">Manage catalog &amp; availability.</p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-brandRed px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition cursor-pointer w-full sm:w-auto"
        >
          <Plus size={14} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="flex min-h-[44px] items-center rounded-xl border border-slate-200/80 bg-white px-3.5 shadow-2xs">
        <Search size={16} className="text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full border-0 bg-transparent px-2.5 text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Mobile Product Card Stack (< sm viewports) */}
      <div className="space-y-3 sm:hidden">
        {filteredProducts.map((prod) => (
          <div key={prod.id} className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={prod.image}
                alt={prod.name}
                className="h-12 w-12 rounded-lg object-cover border border-slate-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-slate-900 block text-xs truncate">{prod.name}</span>
                <span className="text-[10px] text-slate-400 block font-normal">Category: {prod.category}</span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block">₹{prod.price}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
              <button
                type="button"
                onClick={() => toggleStockStatus(prod.id)}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium cursor-pointer transition ${
                  prod.status === "In Stock"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {prod.status === "In Stock" ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                <span>{prod.status} ({prod.stock})</span>
              </button>

              <span className="text-[11px] text-slate-500 font-normal">{prod.salesCount} sold</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Product Table (>= sm viewports) */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock Status</th>
                <th className="px-4 py-3">Sales</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="h-9 w-9 rounded-lg object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 block text-xs">{prod.name}</span>
                        <span className="text-[10px] text-slate-400">ID: {prod.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{prod.category}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">₹{prod.price}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleStockStatus(prod.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium cursor-pointer transition ${
                        prod.status === "In Stock"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {prod.status === "In Stock" ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                      <span>{prod.status} ({prod.stock})</span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{prod.salesCount} sold</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleStockStatus(prod.id)}
                      className="rounded p-1 text-slate-400 hover:text-slate-700 transition"
                      title="Toggle Stock"
                    >
                      <Edit3 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900">Add Product</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-700">Title</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Polo Shirt"
                  className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 outline-none focus:border-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 outline-none focus:border-slate-400"
                  >
                    <option>Fashion</option>
                    <option>Footwear</option>
                    <option>Accessories</option>
                    <option>Electronics</option>
                    <option>Beauty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="799"
                    className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700">Image URL</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 outline-none focus:border-slate-400"
                />
              </div>

              <button
                type="submit"
                className="min-h-[44px] w-full rounded-xl bg-brandRed py-2.5 text-xs font-semibold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition cursor-pointer"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
