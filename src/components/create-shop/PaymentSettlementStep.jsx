import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  Wallet,
  CheckCircle2,
  Lock,
  Receipt,
  Printer,
  Download,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { initiateOnboardingPayment } from "../../services/paymentService";
import {
  generateInvoiceData,
  sendInvoiceEmail,
  openPrintableInvoice,
  downloadInvoiceHtml,
  OFFICIAL_SUPPORT_EMAIL,
} from "../../services/invoiceService";

export default function PaymentSettlementStep({ form = {}, updateForm = () => {}, onNext, onBack }) {
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [invoice, setInvoice] = useState(null);

  const isPaid = Boolean(form.is_paid && form.payment_id);

  // Retrieve current logged in owner as fallback
  let storedOwner = null;
  try {
    const oStr = localStorage.getItem("serofast_current_owner");
    if (oStr) storedOwner = JSON.parse(oStr);
  } catch {}

  const effectiveShopName = form.shopName || "My Campus Shop";
  const effectiveOwnerName = form.ownerName || storedOwner?.full_name || storedOwner?.name || "Shop Owner";
  const effectiveEmail = form.email || storedOwner?.email || "owner@serofast.com";
  const effectivePhone = form.phone || storedOwner?.phone || "";
  const effectiveCategory = form.category || storedOwner?.category || "Fashion";
  const effectiveAddress = form.address || form.city || "";

  const getInvoiceData = () => {
    if (invoice) return invoice;
    if (form.invoice_data) return form.invoice_data;
    return generateInvoiceData({
      paymentId: form.payment_id || `pay_${Date.now().toString(36).toUpperCase()}`,
      orderId: form.payment_order_id || `ORD-${Date.now()}`,
      shopName: effectiveShopName,
      ownerName: effectiveOwnerName,
      email: effectiveEmail,
      phone: effectivePhone,
      category: effectiveCategory,
      address: effectiveAddress,
      amount: 50,
    });
  };

  const handlePayNow = async () => {
    setPaymentError("");
    setPaying(true);

    try {
      await initiateOnboardingPayment({
        shopName: effectiveShopName,
        ownerName: effectiveOwnerName,
        email: effectiveEmail,
        phone: effectivePhone || "9876543210",
        onSuccess: async (paymentResult) => {
          setPaying(false);

          // 1. Generate structured invoice with full account details
          const invData = generateInvoiceData({
            paymentId: paymentResult.paymentId,
            orderId: paymentResult.orderId,
            shopName: effectiveShopName,
            ownerName: effectiveOwnerName,
            email: effectiveEmail,
            phone: effectivePhone,
            category: effectiveCategory,
            address: effectiveAddress,
            amount: 50,
          });

          setInvoice(invData);

          // 2. Dispatch invoice record to Supabase & local storage
          await sendInvoiceEmail(invData);

          // 3. Update form state with verified payment & complete invoice
          updateForm({
            is_paid: true,
            payment_id: paymentResult.paymentId,
            payment_order_id: paymentResult.orderId,
            payment_status: "paid",
            onboarding_fee: 50,
            invoice_number: invData.invoiceNumber,
            invoice_data: invData,
            ownerName: effectiveOwnerName,
            email: effectiveEmail,
            phone: effectivePhone,
            shopName: effectiveShopName,
          });
        },
        onFailure: (err) => {
          setPaying(false);
          if (!err?.cancelled) {
            setPaymentError(err?.message || "Payment could not be processed. Please try again.");
          }
        },
      });
    } catch (e) {
      setPaying(false);
      setPaymentError(e?.message || "An unexpected error occurred during payment initialization.");
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

  return (
    <div className="space-y-7 font-sans w-full max-w-full lg:max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rose-100 text-brandRed">
          <Wallet size={22} />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Store Activation &amp; Onboarding Fee
          </h2>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            One-time ₹50 campus verification fee for lifetime store access with 0% commission.
          </p>
        </div>
      </div>

      {/* Main Activation Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm space-y-6">
        {/* Payment Error Alert */}
        {paymentError && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-brandRed">
            <AlertCircle size={18} className="shrink-0" />
            <span>{paymentError}</span>
          </div>
        )}

        {isPaid ? (
          /* SUCCESS STATE (VERIFIED RECEIPT) */
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    Payment Verified &amp; Store Activated!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    ₹50.00 successfully received via Razorpay
                  </p>
                </div>
              </div>

              <span className="self-start sm:self-auto rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-bold text-white uppercase tracking-wider">
                ✓ Verified
              </span>
            </div>

            {/* Account Details Summary */}
            <div className="rounded-xl bg-white/90 p-4 border border-emerald-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Store Name
                </span>
                <span className="font-bold text-slate-900 block truncate">
                  {effectiveShopName}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Owner Name
                </span>
                <span className="font-bold text-slate-900 block truncate">
                  {effectiveOwnerName}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Phone Number
                </span>
                <span className="font-mono text-slate-800 font-bold block truncate">
                  {effectivePhone || "—"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Payment ID
                </span>
                <span className="font-mono text-slate-800 font-bold block truncate">
                  {form.payment_id}
                </span>
              </div>
            </div>

            {/* Actions: Email Notice, Print, and Download */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-emerald-900">
                <Receipt size={16} className="text-emerald-700 shrink-0" />
                <span>
                  Official invoice issued from <strong>{OFFICIAL_SUPPORT_EMAIL}</strong> to{" "}
                  <strong>{effectiveEmail}</strong>.
                </span>
              </div>

              <div className="flex items-center gap-2 self-end lg:self-auto">
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600 bg-white px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition cursor-pointer shadow-xs"
                >
                  <Printer size={14} />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer shadow-sm shadow-emerald-600/20"
                >
                  <Download size={14} />
                  <span>Download Invoice</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* UNPAID STATE: PAYMENT PROMPT & RAZORPAY CTA */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: What you get */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-brandRed">
                <Sparkles size={13} />
                <span>One-Time Lifetime Store Activation</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  Activate your store on SeroFast Campus Marketplace
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  To maintain campus quality and prevent spam, we require a nominal ₹50 onboarding
                  fee. Once paid, you get lifetime merchant access with zero recurring charges.
                </p>
              </div>

              {/* Benefit Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-xs text-slate-700 font-medium">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span>0% Commission (Keep 100%)</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-xs text-slate-700 font-medium">
                  <Zap size={16} className="text-brandRed shrink-0" />
                  <span>Instant UPI Auto-Settlement</span>
                </div>
              </div>
            </div>

            {/* Right: Razorpay Fee Box */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border-2 border-brandRed/20 bg-gradient-to-b from-rose-50/70 to-white p-5 sm:p-6 text-center space-y-4 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Total Payable Amount
                </span>

                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹50</span>
                  <span className="text-xs text-slate-400 font-medium">/ lifetime</span>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <p className="flex items-center justify-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle2 size={12} /> Includes Platform GST &amp; Verification
                  </p>
                  <p>Tax invoice emailed from {OFFICIAL_SUPPORT_EMAIL}</p>
                </div>

                <button
                  type="button"
                  disabled={paying}
                  onClick={handlePayNow}
                  className="w-full min-h-[52px] flex items-center justify-center gap-2 rounded-2xl bg-brandRed px-5 text-sm font-bold text-white shadow-lg shadow-brandRed/25 hover:bg-brandRedDark active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
                >
                  {paying ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Opening Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Pay ₹50 with Razorpay</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                  <ShieldCheck size={13} className="text-slate-400" />
                  <span>256-Bit Encrypted Razorpay Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informational settlement flow */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            How earnings work after activation
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {[
              "1. Customer pays online on SeroFast",
              "2. Order delivered to hostel / room",
              "3. 100% funds credited directly to your UPI",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/70">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
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
          onClick={onNext}
          disabled={!isPaid}
          className={`min-h-[56px] flex-1 sm:flex-initial flex items-center justify-center gap-2.5 rounded-2xl px-7 text-sm font-bold transition cursor-pointer ${
            isPaid
              ? "bg-brandRed text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark active:scale-[0.98]"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          <span>Continue to Review &amp; Launch</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
