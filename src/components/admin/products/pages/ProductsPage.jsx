import { useEffect, useMemo, useState } from "react";
import { Archive, Eye, Pencil, Star } from "lucide-react";
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
  const [categoryId, setCategoryId] = useState("");
  const [pendingArchive, setPendingArchive] = useState([]);
  const [toast, setToast] = useState("");

  const rows = useMemo(
    () =>
      products
        .filter((product) => !categoryId || product.categoryId === categoryId)
        .map((product) => {
          const primaryImg = product.images?.[0]?.url;
          const sections = product.sections || ["Explore Products"];
          return {
            ...product,
            product: product.name,
            placement: sections.join(", "),
            category: product.categoryName || product.category || "General",
            priceDisplay: product.discountPrice
              ? `${currency.format(product.discountPrice)} sale`
              : currency.format(product.price || 0),
            inventoryStatus: product.stock === 0 ? "Out of Stock" : "In Stock",
            created: new Date(product.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            searchText: [
              product.name,
              product.categoryName,
              ...(product.sections || []),
              ...(product.tags || []),
            ].join(" "),
            primaryImg,
          };
        }),
    [categoryId, products]
  );
  const resource = useResourceList(rows);

  useEffect(() => {
    resource.setSearch(searchParams.get("search") ?? "");
    resource.setStatus(searchParams.get("status") ?? "");
  }, [searchParams]);

  const columns = [
    {
      key: "product",
      label: "Product",
      minWidth: 240,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.primaryImg ? (
            <img src={row.primaryImg} alt="" className="h-10 w-10 rounded-xl object-cover bg-slate-50" />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
              No img
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{row.name}</p>
            <p className="text-[10px] text-slate-400">{row.category}</p>
          </div>
        </div>
      ),
    },
    { key: "placement", label: "Placement / Section" },
    { key: "category", label: "Category" },
    {
      key: "priceDisplay",
      label: "Price",
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800">
            {row.discountPrice ? currency.format(row.discountPrice) : currency.format(row.price || 0)}
          </span>
          {row.discountPrice && (
            <>
              <span className="ml-1 text-[10px] text-slate-400 line-through">
                {currency.format(row.price)}
              </span>
              <span className="block text-[10px] font-semibold text-brandRed">
                {discountPercentage(row.price, row.discountPrice)}% off
              </span>
            </>
          )}
        </div>
      ),
    },
    { key: "stock", label: "Stock" },
    {
      key: "inventoryStatus",
      label: "Stock Status",
      render: (row) => <StatusBadge value={row.inventoryStatus} />,
    },
    { key: "status", label: "Status" },
    {
      key: "featured",
      label: "Featured",
      render: (row) =>
        row.featured ? (
          <span className="inline-flex items-center gap-1 font-semibold text-brandRed">
            <Star size={13} fill="currentColor" /> Featured
          </span>
        ) : (
          "—"
        ),
    },
    { key: "createdAt", label: "Created", render: (row) => row.created },
  ];

  function rowActions(row) {
    return [
      {
        label: "View Product",
        shortLabel: "View",
        icon: Eye,
        tone: "primary",
        onClick: () => navigate(`/admin/products/${row.id}`),
      },
      {
        label: "Edit Product",
        shortLabel: "Edit",
        icon: Pencil,
        onClick: () => navigate(`/admin/products/${row.id}/edit`),
      },
      {
        label: row.featured ? "Remove Featured" : "Mark Featured",
        shortLabel: row.featured ? "Unfeature" : "Feature",
        icon: Star,
        onClick: () => {
          productService.updateMany([row.id], { featured: !row.featured });
          setToast(row.featured ? "Product unfeatured." : "Product marked featured.");
        },
      },
      {
        label: "Archive Product",
        shortLabel: "Archive",
        icon: Archive,
        tone: "danger",
        hidden: row.status === "Archived",
        onClick: () => setPendingArchive([row.id]),
      },
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
      <PageHeader
        title="Products"
        description="Manage catalog products, carousel images, store section placement, and single-stock inventory."
        action="Add Product"
        onAction={() => navigate("/admin/products/new")}
      />

      <StatGrid className="mb-5">
        <StatusCard
          label="Total Products"
          value={products.length}
          tone="blue"
          description="All catalog products"
          onClick={() => {
            resource.clearFilters();
            setCategoryId("");
          }}
        />
        <StatusCard
          label="Active (Live)"
          value={products.filter((p) => p.status === "Active").length}
          tone="green"
          onClick={() => resource.setStatus("Active")}
        />
        <StatusCard
          label="In Stock"
          value={products.filter((p) => p.stock > 0).length}
          tone="emerald"
          onClick={() => resource.setQuickFilter((p) => p.stock > 0)}
        />
        <StatusCard
          label="Sold Out (Hidden)"
          value={products.filter((p) => p.stock === 0).length}
          tone="rose"
          onClick={() => resource.setQuickFilter((p) => p.stock === 0)}
        />
      </StatGrid>

      <div className="mb-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
        <FilterBar
          value={resource.search}
          setValue={resource.setSearch}
          placeholder="Search products, category, placement sections..."
          status={resource.status}
          setStatus={resource.setStatus}
          options={resource.statuses}
          onClear={() => {
            resource.clearFilters();
            setCategoryId("");
          }}
        />
        <AdminSelect
          value={categoryId}
          onChange={setCategoryId}
          options={[
            { value: "", label: "All categories" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
          ariaLabel="Filter by category"
          buttonClassName="h-[54px]"
        />
      </div>

      <BulkActionBar
        count={resource.selectedIds.length}
        actions={[
          {
            label: "Feature",
            tone: "success",
            onClick: () => bulkPatch({ featured: true }, "Selected products marked featured."),
          },
          {
            label: "Unfeature",
            onClick: () => bulkPatch({ featured: false }, "Selected products unfeatured."),
          },
          {
            label: "Archive",
            tone: "danger",
            onClick: () => setPendingArchive(resource.selectedIds),
          },
        ]}
        onClear={() => resource.setSelectedIds([])}
      />

      <ResourceTable
        columns={columns}
        rows={resource.visibleRows}
        rowActions={rowActions}
        onView={(row) => navigate(`/admin/products/${row.id}`)}
        sortKey={resource.sortKey}
        sortDirection={resource.sortDirection}
        onSort={resource.changeSort}
        selectedIds={resource.selectedIds}
        onToggleSelected={resource.toggleSelected}
        onToggleAll={resource.toggleVisibleRows}
        page={resource.page}
        pageCount={resource.pageCount}
        pageSize={resource.pageSize}
        totalCount={resource.totalCount}
        onPageChange={resource.setPage}
        onPageSizeChange={resource.changePageSize}
        onClearFilters={() => {
          resource.clearFilters();
          setCategoryId("");
        }}
        loading={resource.loading}
        error={resource.error}
        onRetry={resource.retry}
        emptyTitle={resource.search ? "No products match your search" : "No products found"}
      />

      <ConfirmDialog
        open={pendingArchive.length > 0}
        title="Archive Product?"
        description="Selected products will no longer appear as active."
        confirmLabel="Archive Product"
        tone="danger"
        onConfirm={confirmArchive}
        onClose={() => setPendingArchive([])}
      />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
