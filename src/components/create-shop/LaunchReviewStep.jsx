import { useState } from "react";
import {
  ArrowLeft,
  Rocket,
  MapPin,
  CheckCircle2,
  Store,
  Sparkles,
  ShieldCheck,
  Printer,
  Download,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  openPrintableInvoice,
  downloadInvoiceHtml,
  generateInvoiceData,
  OFFICIAL_SUPPORT_EMAIL,
} from "../../services/invoiceService";

export default function LaunchReviewStep({ form, onBack, onLaunch }) {
  const [submitting, setSubmitting] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [launchError, setLaunchError] = useState("");
  const navigate = useNavigate();

  const isPaid = Boolean(form.is_paid && form.payment_id);

  const getInvoiceData = () => {
    if (form.invoice_data) return form.invoice_data;
    return generateInvoiceData({
      paymentId: form.payment_id,
      orderId: form.payment_order_id,
      shopName: form.shopName,
      ownerName: form.ownerName,
      email: form.email,
      phone: form.phone,
      category: form.category,
      address: form.address || form.city,
      amount: 50,
    });
  };

  const handleCreate = async () => {
    if (!isPaid) {
      setLaunchError("Store activation payment of ₹50 is required before launching your shop.");
      return;
    }

    setSubmitting(true);
    setLaunchError("");
    try {
      await onLaunch();
      setLaunched(true);
    } catch (err) {
      setLaunchError(err?.message || "Failed to create shop. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintInvoice = () => {
    const inv = getInvoiceData();
    openPrintableInvoice(inv);
  };

  const handleDownloadInvoice = () => {
    const inv = getInvoiceData();
    downloadInvoiceHtml(inv);
  };

  const coverUrl =
    form.cover ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80";
  const logoUrl =
    form.logo ||
    "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&q=80";

  if (launched) {
    return (
      <div className="py-10 space-y-7 text-center font-sans max-w-md mx-auto animate-fade-in">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 size={44} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Your shop is live!</h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 font-normal max-w-xs mx-auto">
            <strong className="text-slate-900">{form.shopName || "Your Shop"}</strong> is now
            registered on SeroFast and verified in the database.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-left space-y-2.5 text-xs font-medium">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Store</span>
            <span className="text-slate-900 font-bold">{form.shopName || "My Shop"}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Owner</span>
            <span className="text-slate-900 font-semibold">{form.ownerName || "—"}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Phone</span>
            <span className="text-slate-900 font-semibold">{form.phone || "—"}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Category</span>
            <span className="text-slate-900 font-semibold">{form.category || "Fashion"}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Products</span>
            <span className="text-brandRed font-bold">{form.selectedProducts?.length || 0} selected</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-500">Activation Status</span>
            <span className="text-emerald-600 font-bold">✓ Paid (₹50) &amp; Verified</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/shop-owner/dashboard")}
          className="min-h-[56px] w-full flex items-center justify-center gap-2.5 rounded-2xl bg-brandRed px-6 text-sm font-bold text-white shadow-lg shadow-brandRed/20 hover:bg-brandRedDark transition cursor-pointer"
        >
          <Store size={18} /> Go to Seller Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7 font-sans w-full max-w-full lg:max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-600">
          <Sparkles size={22} />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Review &amp; launch</h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Preview how your shop will appear to campus customers.
          </p>
        </div>
      </div>

      {launchError && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-brandRed">
          <AlertCircle size={18} className="shrink-0" />
          <span>{launchError}</span>
        </div>
      )}

      {/* Verified Activation Status Banner */}
      {isPaid ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-950 block">
                ₹50 Onboarding Fee Verified (ID: {form.payment_id})
              </span>
              <span className="text-[11px] text-emerald-700 block">
                Official tax invoice issued from {OFFICIAL_SUPPORT_EMAIL} to {form.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrintInvoice}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
            >
              <Printer size={13} />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer"
            >
              <Download size={13} />
              <span>Download</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-brandRed">
          <AlertCircle size={18} className="shrink-0" />
          <span>Activation fee unpaid. Please return to Step 4 to complete payment.</span>
        </div>
      )}

      {/* Live Preview Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-md">
        <div className="relative h-40 sm:h-48 w-full bg-slate-100">
          <img src={coverUrl} alt="Cover" className="h-full w-full object-cover" />
          <div className="absolute -bottom-7 left-5 h-16 w-16 rounded-2xl border-[3px] border-white bg-white shadow-lg overflow-hidden">
            <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="pt-10 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">{form.shopName || "Your Shop"}</h3>
            <span className="rounded-full bg-brandRed/10 px-2.5 py-0.5 text-[10px] font-bold text-brandRed">
              {form.category || "Fashion"}
            </span>
          </div>
          {form.tagline && <p className="text-xs font-medium text-slate-600">{form.tagline}</p>}
          <p className="text-xs text-slate-500 font-normal leading-relaxed">
            {form.description || "Your store description will appear here."}
          </p>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-100 text-[11px]">
            {form.city ? (
              <span className="flex items-center gap-1 text-slate-500">
                <MapPin size={12} className="text-brandRed" /> {form.city}
              </span>
            ) : form.address ? (
              <span className="flex items-center gap-1 text-slate-500">
                <MapPin size={12} className="text-brandRed" /> {form.address}
              </span>
            ) : null}
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 size={12} /> Verified Seller
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[52px] flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={submitting || !isPaid}
          className="min-h-[56px] flex-1 sm:flex-initial flex items-center justify-center gap-2.5 rounded-2xl bg-brandRed px-8 text-sm font-bold text-white shadow-lg shadow-brandRed/20 hover:bg-brandRedDark active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
        >
          <Rocket size={18} />
          {submitting ? "Creating shop..." : "Create My Shop"}
        </button>
      </div>
    </div>
  );
}
