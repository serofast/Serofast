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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Products &amp; Inventory</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage your digital storefront catalog &amp; stock availability.</p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-brandRed px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-xs">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search product by name or category..."
          className="w-full border-0 bg-transparent px-3 text-xs text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/80 font-bold uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Selling Price</th>
                <th className="px-5 py-3.5">Stock Status</th>
                <th className="px-5 py-3.5">Total Sales</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="h-11 w-11 rounded-xl object-cover border border-slate-100 shadow-2xs"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">{prod.name}</span>
                        <span className="text-[11px] text-slate-400">ID: {prod.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 font-semibold">{prod.category}</td>
                  <td className="px-5 py-4 font-extrabold text-slate-900">
                    ₹{prod.price} <span className="text-[11px] font-normal text-slate-400 line-through">₹{prod.originalPrice}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => toggleStockStatus(prod.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold cursor-pointer transition ${
                        prod.status === "In Stock"
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                      }`}
                    >
                      {prod.status === "In Stock" ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                      <span>{prod.status} ({prod.stock})</span>
                    </button>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{prod.salesCount} sold</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleStockStatus(prod.id)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                      title="Toggle Stock"
                    >
                      <Edit3 size={16} />
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
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Add Product to Store</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Cotton Polo Shirt"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 outline-none focus:border-brandRed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 outline-none focus:border-brandRed"
                  >
                    <option>Fashion</option>
                    <option>Footwear</option>
                    <option>Accessories</option>
                    <option>Electronics</option>
                    <option>Beauty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="e.g. 799"
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 outline-none focus:border-brandRed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Image URL (Optional)</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 outline-none focus:border-brandRed"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-brandRed py-3 text-xs font-bold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition"
              >
                Save &amp; Publish Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
