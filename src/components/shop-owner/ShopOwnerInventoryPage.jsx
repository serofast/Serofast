import { useState, useEffect } from "react";
import { Plus, Search, Edit3, CheckCircle2, XCircle, X, Package, Loader2, ShoppingCart, Eye, Trash2 } from "lucide-react";
import { initialSellerProducts } from "../../data/sellerData";
import { fetchWarehouseProducts } from "../../lib/supabase";
import { AppFormCard, AppFormField, AppFormButton } from "../reusable/form";
import { AppMetricCard } from "../reusable";

export default function ShopOwnerInventoryPage() {
  const [products, setProducts] = useState(initialSellerProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // View, Edit, and Delete modal states
  const [productToView, setProductToView] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Warehouse selection state
  const [warehouseProducts, setWarehouseProducts] = useState([]);
  const [loadingWarehouse, setLoadingWarehouse] = useState(false);
  const [selectedWarehouseIds, setSelectedWarehouseIds] = useState([]);

  useEffect(() => {
    if (isModalOpen) {
      (async () => {
        setLoadingWarehouse(true);
        const data = await fetchWarehouseProducts();
        setWarehouseProducts(data);
        setLoadingWarehouse(false);
      })();
    }
  }, [isModalOpen]);

  const toggleStockStatus = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === "In Stock" ? "Out of Stock" : "In Stock",
              stock: p.status === "In Stock" ? 0 : (p.stock > 0 ? p.stock : 10),
            }
          : p
      )
    );
  };

  const handleOpenEdit = (product) => {
    setProductToEdit({ ...product });
    setProductToView(null);
  };

  const handleSaveEdit = (e) => {
    if (e) e.preventDefault();
    if (!productToEdit) return;

    const updatedPrice = Number(productToEdit.price) || 0;
    const updatedOriginalPrice = Number(productToEdit.originalPrice) || 0;
    const updatedStock = Number(productToEdit.stock) || 0;

    const updatedProduct = {
      ...productToEdit,
      price: updatedPrice,
      originalPrice: updatedOriginalPrice,
      stock: updatedStock,
      status: updatedStock > 0 ? productToEdit.status : "Out of Stock",
    };

    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setProductToEdit(null);
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
    if (productToEdit?.id === id) setProductToEdit(null);
    if (productToView?.id === id) setProductToView(null);
  };

  const toggleWarehouseSelection = (id) => {
    setSelectedWarehouseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddWarehouseProductsToShop = () => {
    if (selectedWarehouseIds.length === 0) return;

    const selectedItems = warehouseProducts.filter((wp) =>
      selectedWarehouseIds.includes(wp.id)
    );

    const newShopProducts = selectedItems.map((item) => ({
      id: `prod-${item.id || Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: item.title || item.name || "Warehouse Product",
      category: item.category || "Fashion",
      price: item.price || 799,
      originalPrice: item.original_price || (item.price ? item.price + 400 : 1199),
      stock: 10,
      status: "In Stock",
      salesCount: 0,
      image:
        item.image_urls?.[0] ||
        item.image ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",
    }));

    setProducts((prev) => [...newShopProducts, ...prev]);
    setIsModalOpen(false);
    setSelectedWarehouseIds([]);
  };

  // KPI Metrics Calculation
  const inStockCount = products.filter((p) => p.status === "In Stock").length;
  const soldOutCount = products.filter((p) => p.status === "Out of Stock").length;
  const totalUnitsSold = products.reduce((acc, p) => acc + (p.salesCount || 0), 0);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === "In Stock") return p.status === "In Stock";
    if (activeFilter === "Sold Out") return p.status === "Out of Stock";
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
            Products &amp; Inventory
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Manage your store catalog, pricing &amp; stock status from SeroFast Warehouse.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex h-12 items-center justify-center gap-2 rounded-[30px] bg-brandRed px-5 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer w-full sm:w-auto"
        >
          <Plus size={16} />
          <span>Add Product from Warehouse</span>
        </button>
      </div>

      {/* Quick Status KPI Summary Bar using Reusable AppMetricCard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <AppMetricCard
          title="Total Listed"
          value={products.length}
          subtitle="Active Products"
          icon={Package}
          active={activeFilter === "All"}
          onClick={() => setActiveFilter("All")}
        />

        <AppMetricCard
          title="In Stock"
          value={inStockCount}
          subtitle="Ready for Order"
          icon={CheckCircle2}
          active={activeFilter === "In Stock"}
          onClick={() => setActiveFilter("In Stock")}
        />

        <AppMetricCard
          title="Sold Out"
          value={soldOutCount}
          subtitle="Out of Stock"
          icon={XCircle}
          active={activeFilter === "Sold Out"}
          onClick={() => setActiveFilter("Sold Out")}
        />

        <AppMetricCard
          title="Units Sold"
          value={totalUnitsSold}
          subtitle="Lifetime Sales"
          icon={ShoppingCart}
        />
      </div>

      {/* Quick Filter Pill Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100">
        <button
          type="button"
          onClick={() => setActiveFilter("All")}
          className={`h-9 rounded-[30px] px-4 text-xs font-normal shrink-0 transition-all cursor-pointer ${
            activeFilter === "All"
              ? "bg-brandRed text-white font-medium shadow-xs"
              : "bg-white text-slate-600 border border-[#E5E7EB]"
          }`}
        >
          All ({products.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("In Stock")}
          className={`h-9 rounded-[30px] px-4 text-xs font-normal shrink-0 transition-all cursor-pointer ${
            activeFilter === "In Stock"
              ? "bg-brandRed text-white font-medium shadow-xs"
              : "bg-white text-slate-600 border border-[#E5E7EB]"
          }`}
        >
          In Stock ({inStockCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("Sold Out")}
          className={`h-9 rounded-[30px] px-4 text-xs font-normal shrink-0 transition-all cursor-pointer ${
            activeFilter === "Sold Out"
              ? "bg-brandRed text-white font-medium shadow-xs"
              : "bg-white text-slate-600 border border-[#E5E7EB]"
          }`}
        >
          Sold Out ({soldOutCount})
        </button>
      </div>

      {/* Search Bar */}
      <AppFormField
        icon={Search}
        value={searchQuery}
        onChange={(val) => setSearchQuery(val)}
        placeholder="Search store products by name..."
      />

      {/* Mobile Card Stack */}
      <div className="space-y-3 sm:hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-[28px] border border-[#F3E5E5] text-slate-400">
            <Package size={32} className="mx-auto mb-2" />
            <span className="text-xs font-normal">No products matching current filter.</span>
          </div>
        ) : (
          filteredProducts.map((prod) => (
            <div key={prod.id} className="rounded-[28px] bg-white border border-[#F3E5E5] p-4 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="h-14 w-14 rounded-[18px] object-cover border border-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-normal text-slate-900 block text-xs truncate">{prod.name}</span>
                  <span className="text-[10px] text-slate-400 block font-normal">Category: {prod.category}</span>
                  <span className="text-sm font-normal text-brandRed mt-0.5 block">₹{prod.price}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                <button
                  type="button"
                  onClick={() => toggleStockStatus(prod.id)}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-normal cursor-pointer transition ${
                    prod.status === "In Stock"
                      ? "bg-rose-50 text-brandRed border border-rose-100"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {prod.status === "In Stock" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  <span>{prod.status} ({prod.stock})</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setProductToView(prod)}
                    className="p-1.5 rounded-full text-slate-500 hover:text-brandRed hover:bg-rose-50 transition cursor-pointer"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(prod)}
                    className="p-1.5 rounded-full text-slate-500 hover:text-brandRed hover:bg-rose-50 transition cursor-pointer"
                    title="Edit Product"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(prod.id)}
                    className="p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Product Table */}
      <div className="hidden sm:block overflow-hidden rounded-[35px] bg-white border border-[#F3E5E5] shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-[#FAF8F5] font-normal text-slate-600">
              <tr>
                <th className="px-5 py-3.5 font-normal">Product</th>
                <th className="px-5 py-3.5 font-normal">Category</th>
                <th className="px-5 py-3.5 font-normal">Price</th>
                <th className="px-5 py-3.5 font-normal">Stock Status</th>
                <th className="px-5 py-3.5 font-normal">Sales</th>
                <th className="px-5 py-3.5 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
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
                        <span className="font-normal text-slate-900 block text-xs">{prod.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">ID: {prod.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-normal">{prod.category}</td>
                  <td className="px-5 py-3.5 font-normal text-brandRed text-sm">₹{prod.price}</td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleStockStatus(prod.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-normal cursor-pointer transition ${
                        prod.status === "In Stock"
                          ? "bg-rose-50 text-brandRed border border-rose-100"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {prod.status === "In Stock" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      <span>{prod.status} ({prod.stock})</span>
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-normal">{prod.salesCount} sold</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setProductToView(prod)}
                        className="rounded-full p-2 text-slate-500 hover:text-brandRed hover:bg-rose-50 transition cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(prod)}
                        className="rounded-full p-2 text-slate-500 hover:text-brandRed hover:bg-rose-50 transition cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(prod.id)}
                        className="rounded-full p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warehouse Product Selector Mobile App Bottom Sheet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in font-sans font-sansation">
          <div className="w-full max-w-2xl max-h-[88vh] rounded-[32px] sm:rounded-[35px] bg-white border border-[#F3E5E5] p-5 sm:p-7 shadow-[0_20px_50px_rgba(211,47,47,0.25)] flex flex-col space-y-3 relative animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-normal text-brandRed tracking-tight">Select Warehouse Products</h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">Pick dresses/items from Admin Warehouse to stock in your shop.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Selection Status */}
            <div className="flex items-center justify-between rounded-[20px] bg-[#FAF8F5] px-4 py-2.5 border border-[#F3E5E5] shrink-0">
              <span className="text-xs font-normal text-slate-700">Selected Products</span>
              <span className="text-xs font-medium text-brandRed">
                {selectedWarehouseIds.length} Selected
              </span>
            </div>

            {/* Warehouse Products Grid View */}
            <div className="flex-1 overflow-y-auto pr-1 py-1">
              {loadingWarehouse ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                  <Loader2 size={32} className="animate-spin text-brandRed" />
                  <span className="text-xs font-normal">Loading warehouse products...</span>
                </div>
              ) : warehouseProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
                  <Package size={36} />
                  <span className="text-xs font-normal">No warehouse products found.</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {warehouseProducts.map((p) => {
                    const isChecked = selectedWarehouseIds.includes(p.id);
                    const imgUrl =
                      p.image_urls?.[0] ||
                      p.image ||
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80";

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleWarehouseSelection(p.id)}
                        className={`relative rounded-[24px] border-2 p-2.5 text-left transition-all active:scale-[0.97] cursor-pointer ${
                          isChecked
                            ? "border-brandRed bg-rose-50/40 shadow-xs"
                            : "border-[#E5E7EB] bg-white hover:border-slate-300"
                        }`}
                      >
                        {isChecked && (
                          <div className="absolute top-2 right-2 z-10">
                            <CheckCircle2 size={20} className="text-brandRed drop-shadow-sm" fill="white" />
                          </div>
                        )}

                        <img
                          src={imgUrl}
                          alt={p.title || p.name}
                          className="w-full aspect-square rounded-[18px] object-cover bg-slate-100"
                        />

                        <div className="mt-2 space-y-0.5">
                          <h4 className="text-xs font-normal text-slate-900 leading-tight line-clamp-2">
                            {p.title || p.name}
                          </h4>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-normal text-brandRed">₹{p.price}</span>
                            {p.original_price && p.original_price > p.price && (
                              <span className="text-[10px] text-slate-400 line-through font-normal">
                                ₹{p.original_price}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-12 rounded-[30px] border border-[#E5E7EB] bg-white text-xs font-normal text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <AppFormButton
                type="button"
                onClick={handleAddWarehouseProductsToShop}
                disabled={selectedWarehouseIds.length === 0}
                className="flex-1"
              >
                Add {selectedWarehouseIds.length} Selected to Shop
              </AppFormButton>
            </div>
          </div>
        </div>
      )}

      {/* View Product Details Modal */}
      {productToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in font-sans font-sansation">
          <div className="w-full max-w-lg max-h-[88vh] rounded-[32px] sm:rounded-[35px] bg-white border border-[#F3E5E5] p-5 sm:p-7 shadow-[0_20px_50px_rgba(211,47,47,0.25)] flex flex-col space-y-4 relative animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-normal text-brandRed tracking-tight">Product Details</h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">ID: {productToView.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setProductToView(null)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start bg-[#FAF8F5] p-4 rounded-[24px] border border-[#F3E5E5]">
                <img
                  src={productToView.image}
                  alt={productToView.name}
                  className="w-28 h-28 rounded-[20px] object-cover border border-slate-200 shrink-0"
                />
                <div className="space-y-1.5 text-center sm:text-left flex-1">
                  <h4 className="text-sm font-semibold text-slate-900 leading-snug">{productToView.name}</h4>
                  <span className="inline-block bg-white text-slate-600 px-3 py-0.5 rounded-full text-[11px] border border-slate-200">
                    Category: {productToView.category}
                  </span>
                  <div className="flex items-baseline justify-center sm:justify-start gap-2 pt-1">
                    <span className="text-lg font-semibold text-brandRed">₹{productToView.price}</span>
                    {productToView.originalPrice && productToView.originalPrice > productToView.price && (
                      <span className="text-xs text-slate-400 line-through">₹{productToView.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-[18px] border border-slate-100">
                  <span className="text-slate-400 block text-[11px] mb-1">Stock Status</span>
                  <span className={`inline-flex items-center gap-1 font-medium ${productToView.status === "In Stock" ? "text-emerald-600" : "text-rose-600"}`}>
                    {productToView.status === "In Stock" ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {productToView.status} ({productToView.stock} units)
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-[18px] border border-slate-100">
                  <span className="text-slate-400 block text-[11px] mb-1">Lifetime Sales</span>
                  <span className="font-semibold text-slate-800 text-sm">{productToView.salesCount || 0} Sold</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(productToView.id)}
                className="px-4 h-11 rounded-[30px] border border-rose-200 bg-rose-50 text-xs font-medium text-red-600 hover:bg-rose-100 transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={15} />
                <span>Delete</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenEdit(productToView)}
                className="flex-1 h-11 rounded-[30px] bg-brandRed text-xs font-semibold text-white hover:bg-brandRedDark transition cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(211,47,47,0.3)]"
              >
                <Edit3 size={15} />
                <span>Edit Product</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Dialog Modal */}
      {productToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in font-sans font-sansation">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-lg max-h-[88vh] rounded-[32px] sm:rounded-[35px] bg-white border border-[#F3E5E5] p-5 sm:p-7 shadow-[0_20px_50px_rgba(211,47,47,0.25)] flex flex-col space-y-4 relative animate-scale-up"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div>
                <h3 className="text-lg font-normal text-brandRed tracking-tight">Edit Product</h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">Modify inventory details for ID: {productToEdit.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setProductToEdit(null)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-normal text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={productToEdit.name}
                  onChange={(e) => setProductToEdit({ ...productToEdit, name: e.target.value })}
                  className="w-full h-10 rounded-[14px] border border-[#E5E7EB] px-3 text-xs font-normal focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                />
              </div>

              {/* Category & Stock Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-normal text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={productToEdit.category}
                    onChange={(e) => setProductToEdit({ ...productToEdit, category: e.target.value })}
                    className="w-full h-10 rounded-[14px] border border-[#E5E7EB] px-3 text-xs font-normal focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-slate-700 mb-1">Stock Status</label>
                  <select
                    value={productToEdit.status}
                    onChange={(e) => setProductToEdit({ ...productToEdit, status: e.target.value })}
                    className="w-full h-10 rounded-[14px] border border-[#E5E7EB] px-3 text-xs font-normal focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none bg-white"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Price, MRP Price, Stock Qty */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-normal text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productToEdit.price}
                    onChange={(e) => setProductToEdit({ ...productToEdit, price: e.target.value })}
                    className="w-full h-10 rounded-[14px] border border-[#E5E7EB] px-3 text-xs font-normal focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-slate-700 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={productToEdit.originalPrice || ""}
                    onChange={(e) => setProductToEdit({ ...productToEdit, originalPrice: e.target.value })}
                    className="w-full h-10 rounded-[14px] border border-[#E5E7EB] px-3 text-xs font-normal focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-slate-700 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={productToEdit.stock}
                    onChange={(e) => setProductToEdit({ ...productToEdit, stock: e.target.value })}
                    className="w-full h-10 rounded-[14px] border border-[#E5E7EB] px-3 text-xs font-normal focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                  />
                </div>
              </div>

              {/* Image URL & Thumbnail Preview */}
              <div>
                <label className="block text-xs font-normal text-slate-700 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={productToEdit.image || ""}
                    onChange={(e) => setProductToEdit({ ...productToEdit, image: e.target.value })}
                    className="flex-1 h-10 rounded-[14px] border border-[#E5E7EB] px-3 text-xs font-normal focus:border-brandRed focus:ring-1 focus:ring-brandRed outline-none"
                  />
                  {productToEdit.image && (
                    <img
                      src={productToEdit.image}
                      alt="Preview"
                      className="w-10 h-10 rounded-[12px] object-cover border border-slate-200 shrink-0"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-3 border-t border-slate-100 flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(productToEdit.id)}
                className="px-3 h-11 rounded-[30px] border border-rose-200 bg-rose-50 text-xs font-medium text-red-600 hover:bg-rose-100 transition cursor-pointer flex items-center gap-1"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
              <button
                type="button"
                onClick={() => setProductToEdit(null)}
                className="flex-1 h-11 rounded-[30px] border border-[#E5E7EB] bg-white text-xs font-normal text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-11 rounded-[30px] bg-brandRed text-xs font-semibold text-white hover:bg-brandRedDark transition cursor-pointer shadow-[0_4px_12px_rgba(211,47,47,0.3)]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in font-sans font-sansation">
          <div className="w-full max-w-sm rounded-[30px] bg-white border border-[#F3E5E5] p-5 sm:p-6 shadow-[0_20px_50px_rgba(211,47,47,0.25)] text-center space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-brandRed flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div>
              <h4 className="text-base font-semibold text-slate-900">Delete Product?</h4>
              <p className="text-xs text-slate-500 font-normal mt-1">
                Are you sure you want to remove this product from your inventory? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 h-10 rounded-[25px] border border-[#E5E7EB] text-xs font-normal text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="flex-1 h-10 rounded-[25px] bg-red-600 text-xs font-semibold text-white hover:bg-red-700 transition cursor-pointer shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
