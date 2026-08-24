import { useEffect, useMemo, useState } from "react";
import { Archive, CheckCircle2, Eye, Pencil, Send, Star } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AdminSelect,
  BulkActionBar,
  ConfirmDialog,
  FilterBar,
  PageHeader,
  StatGrid,
  StatusBadge,
  StatusCard,
  Toast,
} from "../../shared/ui";
import ResourceTable from "../../shared/resource/ResourceTable";
import { useResourceList } from "../../shared/resource/useResourceList";
import { useProducts } from "../hooks/useProducts";
import { productService } from "../services/productService";
import { discountPercentage } from "../validation/productValidation";
import { fetchAdminWarehouseProducts, subscribeToAdminTableChanges } from "../../../../lib/supabase";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products, categories } = useProducts();
  const [dbProducts, setDbProducts] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [pendingArchive, setPendingArchive] = useState([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadWarehouse() {
      const data = await fetchAdminWarehouseProducts();
      if (data) {
        const mapped = data.map((p) => ({
          id: p.id,
          name: p.title || p.name || "Warehouse Item",
          sku: p.sku || `SKU-${p.id.slice(0, 6)}`,
          shopName: "Central Warehouse",
          categoryName: p.category || "General",
          price: Number(p.retail_price || p.base_price) || 299,
          discountPrice: null,
          stock: Number(p.warehouse_stock) || 50,
          lowStockThreshold: 10,
          status: "Active",
          approvalStatus: "Approved",
          featured: false,
          tags: [p.category?.toLowerCase() || "warehouse"],
          images: [{ url: p.image_url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80" }],
          variants: [],
          createdAt: p.created_at || new Date().toISOString(),
        }));
        setDbProducts(mapped);
      }
    }

    loadWarehouse();
    const unsubscribe = subscribeToAdminTableChanges("warehouse_products", () => {
      loadWarehouse();
    });

    return () => unsubscribe();
  }, []);

  const rows = useMemo(
    () => products
      .filter((product) => !categoryId || product.categoryId === categoryId)
      .map((product) => ({
        ...product,
        product: product.name,
        shop: product.shopName,
        category: product.categoryName,
        priceDisplay: product.discountPrice ? `${currency.format(product.discountPrice)} sale` : currency.format(product.price),
        inventoryStatus: product.stock === 0 ? "Out of Stock" : product.stock <= product.lowStockThreshold ? "Low Stock" : "In Stock",
        created: new Date(product.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        searchText: [product.name, product.sku, product.shopName, product.categoryName, ...(product.tags || []), ...((product.variants || []).map((variant) => variant.sku))].join(" "),
      })),
    [categoryId, products],
  );
  const resource = useResourceList(rows);

  useEffect(() => {
    resource.setSearch(searchParams.get("search") ?? "");
    resource.setStatus(searchParams.get("status") ?? "");
    // Keep links from dashboard and search analytics in sync with this table.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const columns = [
    { key: "product", label: "Product", minWidth: 230, render: (row) => <div className="flex items-center gap-3"><img src={row.images[0]?.url} alt="" className="h-10 w-10 rounded-xl object-cover" /><div className="min-w-0"><p className="truncate font-medium text-slate-900">{row.name}</p><p className="text-[10px] text-slate-400">{row.sku}</p></div></div> },
    { key: "shop", label: "Shop" },
    { key: "category", label: "Category" },
    { key: "priceDisplay", label: "Price", render: (row) => <div><span className="font-medium text-slate-800">{row.discountPrice ? currency.format(row.discountPrice) : currency.format(row.price)}</span>{row.discountPrice && <><span className="ml-1 text-[10px] text-slate-400 line-through">{currency.format(row.price)}</span><span className="block text-[10px] text-brandRed">{discountPercentage(row.price, row.discountPrice)}% off</span></>}</div> },
    { key: "stock", label: "Stock" },
    { key: "inventoryStatus", label: "Stock Level", render: (row) => <StatusBadge value={row.inventoryStatus} /> },
    { key: "status", label: "Status" },
    { key: "featured", label: "Featured", render: (row) => row.featured ? <span className="inline-flex items-center gap-1 text-brandRed"><Star size={13} fill="currentColor" /> Featured</span> : "No" },
    { key: "createdAt", label: "Created", render: (row) => row.created },
  ];

  function rowActions(row) {
    return [
      { label: "View Product", shortLabel: "View", icon: Eye, tone: "primary", onClick: () => navigate(`/admin/products/${row.id}`) },
      { label: "Edit Product", shortLabel: "Edit", icon: Pencil, onClick: () => navigate(`/admin/products/${row.id}/edit`) },
      { label: row.featured ? "Remove Featured" : "Mark Featured", shortLabel: row.featured ? "Unfeature" : "Feature", icon: Star, onClick: () => { productService.updateMany([row.id], { featured: !row.featured }); setToast(row.featured ? "Product removed from featured." : "Product marked featured."); } },
      { label: "Archive Product", shortLabel: "Archive", icon: Archive, tone: "danger", hidden: row.status === "Archived", onClick: () => setPendingArchive([row.id]) },
    ];
  }

  function bulkPatch(patch, message) {
    productService.updateMany(resource.selectedIds, patch);
    resource.setSelectedIds([]);
    setToast(message);
  }

  function confirmArchive() {
    productService.updateMany(pendingArchive, { status: "Archived", archivedAt: new Date().toISOString() });
    resource.setSelectedIds([]);
    setToast(`${pendingArchive.length} product${pendingArchive.length === 1 ? "" : "s"} archived.`);
    setPendingArchive([]);
  }

  return (
    <div className="min-w-0">
      <PageHeader title="Products" description="Manage central catalog products, stock levels, pricing, variants, and media in Supabase." action="Create Product" onAction={() => navigate("/admin/products/new")} />

      <StatGrid className="mb-5">
        <StatusCard label="Total Products" value={products.length} tone="blue" description="All local catalog records" onClick={() => { resource.clearFilters(); setCategoryId(""); }} />
        <StatusCard label="Active" value={products.filter((product) => product.status === "Active").length} tone="green" onClick={() => resource.setStatus("Active")} />
        <StatusCard label="Low Stock" value={products.filter((product) => product.stock > 0 && product.stock <= product.lowStockThreshold).length} tone="amber" onClick={() => resource.setQuickFilter((product) => product.stock > 0 && product.stock <= product.lowStockThreshold)} />
        <StatusCard label="Out of Stock" value={products.filter((product) => product.stock === 0).length} tone="rose" onClick={() => resource.setQuickFilter((product) => product.stock === 0)} />
        <StatusCard label="Pending Approval" value={products.filter((product) => product.approvalStatus === "Pending Approval").length} tone="amber" onClick={() => resource.setQuickFilter((product) => product.approvalStatus === "Pending Approval")} />
      </StatGrid>

      <div className="mb-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
        <FilterBar value={resource.search} setValue={resource.setSearch} placeholder="Search products, SKU, tags, variants, shops..." status={resource.status} setStatus={resource.setStatus} options={resource.statuses} onClear={() => { resource.clearFilters(); setCategoryId(""); }} />
        <AdminSelect value={categoryId} onChange={setCategoryId} options={[{ value: "", label: "All categories" }, ...categories.map((category) => ({ value: category.id, label: category.name }))]} ariaLabel="Filter by category" buttonClassName="h-[54px]" />
      </div>

      <BulkActionBar count={resource.selectedIds.length} actions={[
        { label: "Feature", tone: "success", onClick: () => bulkPatch({ featured: true }, "Selected products marked featured.") },
        { label: "Unfeature", onClick: () => bulkPatch({ featured: false }, "Selected products removed from featured.") },
        { label: "Submit", onClick: () => { productService.submitForApproval(resource.selectedIds); resource.setSelectedIds([]); setToast("Eligible products submitted for approval."); } },
        { label: "Archive", tone: "danger", onClick: () => setPendingArchive(resource.selectedIds) },
      ]} onClear={() => resource.setSelectedIds([])} />

      <ResourceTable columns={columns} rows={resource.visibleRows} rowActions={rowActions} onView={(row) => navigate(`/admin/products/${row.id}`)} sortKey={resource.sortKey} sortDirection={resource.sortDirection} onSort={resource.changeSort} selectedIds={resource.selectedIds} onToggleSelected={resource.toggleSelected} onToggleAll={resource.toggleVisibleRows} page={resource.page} pageCount={resource.pageCount} pageSize={resource.pageSize} totalCount={resource.totalCount} onPageChange={resource.setPage} onPageSizeChange={resource.changePageSize} onClearFilters={() => { resource.clearFilters(); setCategoryId(""); }} loading={resource.loading} error={resource.error} onRetry={resource.retry} emptyTitle={resource.search ? "No products match your search" : "No products found"} />

      <ConfirmDialog open={pendingArchive.length > 0} title="Archive Product?" description="Selected products will no longer appear as active products. Their inventory, variants, reviews, and order references will be preserved." confirmLabel="Archive Product" tone="danger" onConfirm={confirmArchive} onClose={() => setPendingArchive([])} />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
