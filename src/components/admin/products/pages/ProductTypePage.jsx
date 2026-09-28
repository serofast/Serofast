import { ArrowLeft, ArrowRight, Boxes, PackagePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, PageHeader } from "../../shared/ui";

const optionClass =
  "group flex h-full flex-col rounded-[28px] border border-[#F3E5E5] bg-white p-6 text-left shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all hover:-translate-y-1 hover:border-brandRed/40 hover:shadow-[0_12px_28px_rgba(211,47,47,0.12)] sm:p-7";

export default function ProductTypePage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-10">
      <button
        type="button"
        onClick={() => navigate("/admin/products")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-brandRed"
      >
        <ArrowLeft size={14} /> Back to Products
      </button>

      <PageHeader
        title="What would you like to add?"
        description="Choose the catalog format that best matches the offer you want to publish."
      />

      <div className="grid gap-5 md:grid-cols-2">
        <button type="button" className={optionClass} onClick={() => navigate("/admin/products/new/single")}>
          <div className="flex items-start justify-between gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-brandRed">
              <PackagePlus size={23} />
            </div>
            <ArrowRight size={19} className="mt-1 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-brandRed" />
          </div>
          <h2 className="mt-6 text-lg font-semibold text-slate-900">Add a single product</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Create one catalog item with its images, specifications, pricing, placement and warehouse stock.
          </p>
          <span className="mt-6 inline-flex w-fit rounded-full bg-rose-50 px-3 py-1 text-[10px] font-semibold text-brandRed">
            Standard catalog item
          </span>
        </button>

        <button type="button" className={optionClass} onClick={() => navigate("/admin/products/new/combo")}>
          <div className="flex items-start justify-between gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-brandRed">
              <Boxes size={23} />
            </div>
            <ArrowRight size={19} className="mt-1 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-brandRed" />
          </div>
          <h2 className="mt-6 text-lg font-semibold text-slate-900">Add a combo product</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Bundle existing catalog products into one offer with a special price, savings message and combo stock.
          </p>
          <span className="mt-6 inline-flex w-fit rounded-full bg-rose-50 px-3 py-1 text-[10px] font-semibold text-brandRed">
            Multi-item offer
          </span>
        </button>
      </div>

      <Card className="border border-[#F3E5E5] bg-rose-50/40 p-5 shadow-none">
        <p className="text-xs leading-relaxed text-slate-600">
          Combo offers use products already available in the warehouse catalog. The offer is saved through the same product API and appears in the regular catalog for inventory and pricing management.
        </p>
      </Card>
    </div>
  );
}
