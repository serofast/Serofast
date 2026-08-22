import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  X,
  Package,
  Loader2,
  ShoppingCart,
  Eye,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import { fetchWarehouseProducts, linkProductsToShop, fetchShopProducts } from "../../lib/supabase";
import { AppFormField } from "../reusable/form";
import { AppMetricCard } from "../reusable";

export default function ShopOwnerInventoryPage() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // View and Delete modal states
  const [productToView, setProductToView] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Warehouse selection state
  const [warehouseProducts, setWarehouseProducts] = useState([]);
  const [loadingWarehouse, setLoadingWarehouse] = useState(false);
  const [selectedWarehouseIds, setSelectedWarehouseIds] = useState([]);
  const [warehouseSearchQuery, setWarehouseSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  // Active shop context
  const [activeShopId, setActiveShopId] = useState(null);

  useEffect(() => {
    let sId = null;
    try {
      const active = localStorage.getItem("serofast_active_shop");
      if (active) sId = JSON.parse(active).id;
    } catch (e) {
      console.warn(e);
    }
    setActiveShopId(sId);

    (async () => {
      setLoadingProducts(true);
      try {
        if (sId) {
          const dbProducts = await fetchShopProducts(sId);
          setProducts(dbProducts || []);
        } else {
          setProducts([]);
        }
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, []);

  // Bottom Sheet drag state for mobile view
  const [sheetHeight, setSheetHeight] = useState(500);
  const [isSheetDragging, setIsSheetDragging] = useState(false);
  const dragState = useRef(null);
  const sheetHeightRef = useRef(500);
  const suppressClickRef = useRef(false);

  const peekHeight = 150;
  const getExpandedHeight = () => Math.round(window.innerHeight * 0.88);
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

  const moveRafId = useRef(null);

  useEffect(() => {
    if (!isModalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    let ticking = false;
    const handleResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateSheetHeight(Math.min(sheetHeightRef.current, getExpandedHeight()));
          ticking = false;
        });
        ticking = true;
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("resize", handleResize);
    };
  }, [isModalOpen]);

  const handleSheetPointerDown = (event) => {
    if (window.innerWidth >= 640) return;
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

    if (!moveRafId.current) {
      moveRafId.current = window.requestAnimationFrame(() => {
        updateSheetHeight(nextHeight);
        moveRafId.current = null;
      });
    }
  };

  const handleSheetPointerEnd = (event) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (moveRafId.current) {
      window.cancelAnimationFrame(moveRafId.current);
      moveRafId.current = null;
    }

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

  const handleDeleteProduct = (id) => {
    const target = products.find((p) => p.id === id);
    if (target?.isWarehouse) {
      alert("Warehouse Managed Product: Shop owners cannot delete catalog-managed warehouse items.");
      setDeleteConfirmId(null);
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
    if (productToView?.id === id) setProductToView(null);
  };

  const toggleWarehouseSelection = (id) => {
    setSelectedWarehouseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Minimal Product Addition
  const handleAddSelectedWarehouseProducts = async () => {
    if (selectedWarehouseIds.length === 0) return;

    const selectedItems = warehouseProducts.filter((wp) => selectedWarehouseIds.includes(wp.id));
    const newMappedProducts = selectedItems.map((item) => ({
      id: item.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      warehouseId: item.id,
      isWarehouse: true,
      name: item.title || item.name || "Warehouse Product",
      category: item.category || "General Catalog",
      price: Number(item.retail_price || item.price || item.base_price || 499),
      originalPrice: Number(item.base_price || item.original_price || 699),
      stock: 10,
      status: "In Stock",
      salesCount: 0,
      image:
        item.image_url ||
        item.image_urls?.[0] ||
        item.image ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80",
    }));

    if (activeShopId) {
      await linkProductsToShop(activeShopId, selectedWarehouseIds);
    }

    setProducts((prev) => [...newMappedProducts, ...prev]);
    const addedCount = selectedWarehouseIds.length;
    closeSheet();

    setToastMessage(`${addedCount} product${addedCount > 1 ? "s" : ""} added to shop inventory.`);
    setTimeout(() => setToastMessage(null), 3000);
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
        className="flex h-11 items-center justify-center gap-2 rounded-[30px] bg-brandRed px-5 text-xs font-semibold text-white shadow-sm hover:bg-brandRedDark transition cursor-pointer w-full"
      >
        <Plus size={16} />
        <span>Add Products from Warehouse Catalog</span>
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

      {/* Loading state */}
      {loadingProducts ? (
        <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
          <Loader2 className="animate-spin text-brandRed" size={24} />
          <span className="text-xs">Loading shop inventory from database...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="w-full rounded-[35px] bg-white border border-[#F3E5E5] p-10 text-center shadow-[-4px_5px_10px_rgba(211,47,47,0.24)] space-y-3">
          <Package className="mx-auto text-slate-300" size={42} />
          <div>
            <h4 className="text-base font-semibold text-slate-800">No Products Added Yet</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Add products from the warehouse catalog to display inventory for your campus store.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-brandRed px-4 py-2 text-xs font-semibold text-white hover:bg-brandRedDark transition cursor-pointer"
          >
            <Plus size={15} />
            <span>Browse Warehouse Catalog</span>
          </button>
        </div>
      ) : (
        <>
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
                    <div className="flex items-center gap-1.5">
                      <span className="font-normal text-slate-900 block text-xs truncate">{prod.name}</span>
                      {prod.isWarehouse && (
                        <span className="shrink-0 text-[9px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded-md">
                          Warehouse
                        </span>
                      )}
                    </div>
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
                      className="p-1.5 rounded-full text-slate-500 hover:text-brandRed hover:bg-rose-50 transition cursor-pointer flex items-center gap-1 text-xs"
                      title="View Details"
                    >
                      <Eye size={16} />
                      <span className="text-[10px] font-medium text-slate-400">View</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                    <th className="px-5 py-3.5 font-normal">Catalog Source</th>
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
                      <td className="px-5 py-3.5 text-slate-600 font-normal">
                        {prod.isWarehouse ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            Warehouse Catalog
                          </span>
                        ) : (
                          <span className="text-slate-500 font-normal">Direct Product</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setProductToView(prod)}
                            className="rounded-full p-2 text-slate-500 hover:text-brandRed hover:bg-rose-50 transition cursor-pointer flex items-center gap-1 text-xs"
                            title="View Details"
                          >
                            <Eye size={16} />
                            <span className="text-[11px]">View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Warehouse Product Selector Modal / Bottom Sheet */}
      {isModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSheet();
          }}
          className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-xs font-sans font-sansation flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in cursor-pointer"
        >
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
              height: window.innerWidth < 640 ? `${sheetHeight}px` : "auto",
            }}
            className={`w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-t-[32px] sm:rounded-[32px] bg-white border border-[#F3E5E5] p-4 sm:p-6 shadow-2xl flex flex-col space-y-3 cursor-default ${
              isSheetDragging ? "" : "transition-all duration-200 ease-out"
            }`}
          >
            {/* Drag Handle for Mobile */}
            <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto shrink-0 sm:hidden" />
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-normal text-brandRed tracking-tight">
                  Select Warehouse Products
                </h3>
                <p className="text-xs text-slate-500 font-normal">Browse catalog items to link to your shop</p>
              </div>
              <button
                type="button"
                onClick={closeSheet}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer shrink-0 no-btn-anim"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <AppFormField
                icon={Search}
                value={warehouseSearchQuery}
                onChange={setWarehouseSearchQuery}
                placeholder="Search warehouse catalog..."
                className="flex-1"
              />
              {selectedWarehouseIds.length > 0 && (
                <span className="grid h-8 min-w-8 place-items-center rounded-full bg-brandRed px-2 text-xs font-semibold text-white">
                  {selectedWarehouseIds.length}
                </span>
              )}
            </div>

            {/* Warehouse Products Grid View */}
            <div data-sheet-scroll className="flex-1 overflow-y-auto pr-1 pt-1 scrollbar-none max-h-[55vh]">
              {loadingWarehouse ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
                  <Loader2 size={24} className="animate-spin text-brandRed" />
                  <span className="text-xs font-normal">Loading warehouse catalog...</span>
                </div>
              ) : filteredWarehouseProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
                  <Package size={32} />
                  <span className="text-xs font-normal">
                    {warehouseProducts.length === 0 ? "No warehouse products found." : "No products match search."}
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {filteredWarehouseProducts.map((p) => {
                    const isChecked = selectedWarehouseIds.includes(p.id);
                    const imgUrl =
                      p.image_url ||
                      p.image_urls?.[0] ||
                      p.image ||
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80";

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleWarehouseSelection(p.id)}
                        className={`relative overflow-hidden rounded-[20px] border text-left transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                          isChecked
                            ? "border-brandRed bg-rose-50/20"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        {isChecked && (
                          <div className="absolute top-2 right-2 z-10 grid h-6 w-6 place-items-center rounded-full bg-brandRed shadow-xs">
                            <CheckCircle2 size={15} className="text-white" />
                          </div>
                        )}

                        <img
                          src={imgUrl}
                          alt={p.title || p.name}
                          className="w-full aspect-square object-cover bg-slate-50"
                        />

                        <div className="space-y-1 p-2.5">
                          <h4 className="text-xs font-medium text-slate-900 leading-snug line-clamp-2">
                            {p.title || p.name}
                          </h4>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs font-bold text-brandRed">
                              ₹{p.retail_price || p.price || p.base_price}
                            </span>
                            {p.base_price && p.base_price > p.price && (
                              <span className="text-[10px] text-slate-400 line-through font-normal">
                                ₹{p.base_price}
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

            {/* Dedicated Action Button Footer */}
            <div className="pt-3 pb-16 sm:pb-0 border-t border-slate-100 shrink-0 bg-white flex gap-2">
              <button
                type="button"
                onClick={closeSheet}
                className="flex-1 h-11 rounded-[30px] border border-[#E5E7EB] bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={selectedWarehouseIds.length === 0}
                onClick={handleAddSelectedWarehouseProducts}
                className={`flex-1 h-11 rounded-[30px] text-xs font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedWarehouseIds.length > 0
                    ? "bg-brandRed hover:bg-brandRedDark shadow-md active:scale-95"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Plus size={15} />
                <span>
                  {selectedWarehouseIds.length > 0
                    ? `Add ${selectedWarehouseIds.length} Product${selectedWarehouseIds.length > 1 ? "s" : ""}`
                    : "Select Products"}
                </span>
              </button>
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
              {productToView.isWarehouse && (
                <div className="flex items-center gap-2 p-3 rounded-[16px] bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                  <ShieldAlert size={16} className="text-amber-600 shrink-0" />
                  <span>Warehouse Catalog Managed: Read-only product for shop owners.</span>
                </div>
              )}

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
                onClick={() => setProductToView(null)}
                className="flex-1 h-11 rounded-[30px] border border-[#E5E7EB] bg-white text-xs font-normal text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-[70] rounded-[20px] bg-slate-900 text-white px-4 py-2.5 text-xs font-normal shadow-lg flex items-center gap-2 animate-fade-in font-sans font-sansation">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
