import { useState, useEffect, useRef } from "react";
import { Plus, Search, Edit3, CheckCircle2, XCircle, X, Package, Loader2, ShoppingCart, Eye, Trash2 } from "lucide-react";
import { initialSellerProducts } from "../../data/sellerData";
import { fetchWarehouseProducts } from "../../lib/supabase";
import { AppFormField } from "../reusable/form";
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
  const [warehouseSearchQuery, setWarehouseSearchQuery] = useState("");
  const [sheetHeight, setSheetHeight] = useState(120);
  const [isSheetDragging, setIsSheetDragging] = useState(false);
  const dragState = useRef(null);
  const sheetHeightRef = useRef(120);
  const suppressClickRef = useRef(false);

  // A readable peek with the handle and complete selector header visible.
  const peekHeight = 120;
  const getExpandedHeight = () => Math.round(window.innerHeight * 0.92);
  const updateSheetHeight = (height) => {
    sheetHeightRef.current = height;
    setSheetHeight(height);
  };

  const closeSheet = () => {
    setIsModalOpen(false);
    setSelectedWarehouseIds([]);
  };

  useEffect(() => {
    if (isModalOpen) {
      updateSheetHeight(getExpandedHeight());
      setWarehouseSearchQuery("");
      (async () => {
        setLoadingWarehouse(true);
        try {
          const data = await fetchWarehouseProducts();
          setWarehouseProducts(data);
        } finally {
          setLoadingWarehouse(false);
        }
      })();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleResize = () => updateSheetHeight(Math.min(sheetHeightRef.current, getExpandedHeight()));
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("resize", handleResize);
    };
  }, [isModalOpen]);

  const handleSheetPointerDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragState.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startHeight: sheetHeightRef.current,
      startTime: performance.now(),
      hasMoved: false,
    };
    setIsSheetDragging(true);
  };

  const handleSheetPointerMove = (event) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const movedBy = drag.startY - event.clientY;
    if (Math.abs(movedBy) > 3) drag.hasMoved = true;
    const nextHeight = Math.max(peekHeight, Math.min(getExpandedHeight(), drag.startHeight + movedBy));
    updateSheetHeight(nextHeight);
  };

  const handleSheetPointerEnd = (event) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const elapsed = Math.max(performance.now() - drag.startTime, 1);
    const velocity = ((event.clientY - drag.startY) / elapsed) * 1000;
    const expandedHeight = getExpandedHeight();
    const midpoint = (peekHeight + expandedHeight) / 2;
    const shouldExpand = velocity < -400 || sheetHeightRef.current >= midpoint;

    dragState.current = null;
    setIsSheetDragging(false);
    updateSheetHeight(shouldExpand ? expandedHeight : peekHeight);

    if (drag.hasMoved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }

  };

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

  const filteredWarehouseProducts = warehouseProducts.filter((product) => {
    const searchableText = `${product.title || product.name || ""} ${product.category || ""}`;
    return searchableText.toLowerCase().includes(warehouseSearchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          Products &amp; Inventory
        </h1>
       
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

      {/* Add Product Button */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex h-11 items-center justify-center gap-2 rounded-[30px] bg-brandRed px-5 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer w-full"
      >
        <Plus size={16} />
        <span>Add Product from Warehouse</span>
      </button>

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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs animate-fade-in font-sans font-sansation">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Select warehouse products"
            onPointerDown={handleSheetPointerDown}
            onPointerMove={handleSheetPointerMove}
            onPointerUp={handleSheetPointerEnd}
            onPointerCancel={handleSheetPointerEnd}
            onClickCapture={(event) => {
              if (!suppressClickRef.current) return;
              event.preventDefault();
              event.stopPropagation();
            }}
            style={{
              height: `${sheetHeight}px`,
              // Keep touch input with the sheet so every downward drag reaches snap logic.
              touchAction: "none",
            }}
            className={`absolute inset-x-0 bottom-0 mx-auto w-full max-w-2xl overflow-hidden rounded-t-[35px] bg-white border border-[#F3E5E5] p-5 sm:p-7 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] flex flex-col space-y-3 select-none cursor-grab active:cursor-grabbing ${
              isSheetDragging ? "" : "transition-[height] duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
            }`}
          >
            {/* Mobile Bottom Sheet Drag Handle */}
            <div className="w-10 h-1.5 rounded-full bg-slate-200 mx-auto shrink-0" />
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div>
                <h3 className="text-lg font-normal text-brandRed tracking-tight">Select Warehouse Products</h3>
              </div>
              <button
                type="button"
                onClick={closeSheet}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <AppFormField
                icon={Search}
                value={warehouseSearchQuery}
                onChange={setWarehouseSearchQuery}
                placeholder="Search warehouse products..."
                className="flex-1"
              />
              {selectedWarehouseIds.length > 0 && (
                <span
                  aria-label={`${selectedWarehouseIds.length} products selected`}
                  title={`${selectedWarehouseIds.length} products selected`}
                  className="grid h-8 min-w-8 place-items-center rounded-full bg-brandRed px-2 text-xs font-semibold text-white shadow-[0_3px_8px_rgba(211,47,47,0.28)]"
                >
                  {selectedWarehouseIds.length}
                </span>
              )}
            </div>

            {/* Warehouse Products Grid View */}
            <div data-sheet-scroll className="flex-1 overflow-y-auto pr-1 pt-1 pb-24 scrollbar-none">
              {loadingWarehouse ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                  <Loader2 size={32} className="animate-spin text-brandRed" />
                  <span className="text-xs font-normal">Loading warehouse products...</span>
                </div>
              ) : filteredWarehouseProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
                  <Package size={36} />
                  <span className="text-xs font-normal">
                    {warehouseProducts.length === 0 ? "No warehouse products found." : "No products match your search."}
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredWarehouseProducts.map((p) => {
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
                        className={`relative overflow-hidden rounded-[26px] border-2 bg-white text-left shadow-[0_8px_20px_rgba(15,23,42,0.06)] transition-all active:scale-[0.97] cursor-pointer ${
                          isChecked
                            ? "border-brandRed ring-2 ring-rose-100"
                            : "border-transparent hover:border-slate-200"
                        }`}
                      >
                        {isChecked && (
                          <div className="absolute top-3 right-3 z-10 grid h-7 w-7 place-items-center rounded-full bg-white shadow-sm">
                            <CheckCircle2 size={18} className="text-brandRed" fill="white" />
                          </div>
                        )}

                        <img
                          src={imgUrl}
                          alt={p.title || p.name}
                          className="w-full aspect-square object-cover bg-slate-100"
                        />

                        <div className="space-y-3 p-4">
                          <h4 className="min-h-10 text-base font-semibold text-slate-900 leading-snug line-clamp-2">
                            {p.title || p.name}
                          </h4>
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="text-2xl font-semibold tracking-tight text-slate-900">₹{p.price}</span>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                Save
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
