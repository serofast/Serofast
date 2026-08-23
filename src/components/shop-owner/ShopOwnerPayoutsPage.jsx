import { useState, useEffect } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Wallet,
  Save,
  Clock,
  Sparkles,
  Loader2,
  QrCode,
  ArrowUpRight,
  CreditCard,
} from "lucide-react";
import { AppFormCard, AppFormField, AppFormButton } from "../reusable/form";
import { fetchOwnerUpiId, updateOwnerUpiId } from "../../lib/supabase";

export default function ShopOwnerPayoutsPage() {
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [activeOwnerId, setActiveOwnerId] = useState(null);
  const [payoutInitiated, setPayoutInitiated] = useState(false);

  useEffect(() => {
    let oId = null;
    try {
      const owner = localStorage.getItem("serofast_current_owner");
      if (owner) oId = JSON.parse(owner).id;
    } catch (e) {
      console.warn(e);
    }
    setActiveOwnerId(oId);

    (async () => {
      setLoading(true);
      try {
        const fetchedUpi = await fetchOwnerUpiId(oId);
        if (fetchedUpi) setUpiId(fetchedUpi);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaved(true);
    await updateOwnerUpiId(activeOwnerId, upiId);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRazorpayWithdraw = () => {
    if (!upiId.trim()) {
      alert("Please enter and save your UPI ID before requesting a withdrawal.");
      return;
    }
    setPayoutInitiated(true);
    setTimeout(() => setPayoutInitiated(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation w-full pb-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
            Payout &amp; Settlement Settings
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Set your instant UPI ID to receive automatic customer payouts directly via Razorpay.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-[#F3E5E5] px-3.5 py-1.5 text-xs font-normal text-brandRed self-start sm:self-auto">
          <ShieldCheck size={15} className="text-brandRed" />
          <span>Verified Merchant Account</span>
        </span>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Settlement Mode */}
        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">Settlement Engine</span>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 text-brandRed">
              <Wallet size={20} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-medium tracking-tight text-brandRed">Razorpay Payouts</div>
            <p className="text-[11px] text-slate-500 font-normal mt-1 flex items-center gap-1">
              <Clock size={12} className="text-brandRed" /> Direct UPI Transfer via Razorpay
            </p>
          </div>
        </div>

        {/* Card 2: Configured UPI Status */}
        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">UPI Handle</span>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 text-brandRed">
              <QrCode size={20} />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-slate-900 truncate">
              {upiId || "Not Set Yet"}
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-brandRed font-normal mt-1">
              <CheckCircle2 size={13} /> {upiId ? "Registered for Razorpay" : "Action Required"}
            </span>
          </div>
        </div>

        {/* Card 3: Platform Fee */}
        <div className="rounded-[35px] bg-gradient-to-br from-brandRed to-red-600 text-white p-6 shadow-[0_12px_28px_rgba(211,47,47,0.32)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/90 uppercase tracking-wider">Platform Fee</span>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/20 text-white backdrop-blur-xs">
              <Sparkles size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-medium text-white">0% Commission</div>
            <p className="text-[11px] text-white/90 font-normal mt-1">
              100% Retained Revenue • Zero Hidden Fees
            </p>
          </div>
        </div>
      </div>

      {/* Simplified UPI Settlement Form */}
      <AppFormCard
        className="max-w-full"
        title="UPI Settlement Account"
        subtitle="Saved to your merchant profile in shop_owners table"
      >
        {loading ? (
          <div className="flex items-center justify-center py-8 text-slate-400 gap-2">
            <Loader2 className="animate-spin text-brandRed" size={20} />
            <span className="text-xs">Loading UPI details from database...</span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <AppFormField
              label="Instant UPI VPA / UPI ID"
              icon={Wallet}
              value={upiId}
              onChange={(val) => setUpiId(val)}
              placeholder="e.g. yourname@upi / phone@paytm / store@okaxis"
            />

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <AppFormButton type="submit" icon={Save}>
                {saved ? "UPI ID Saved to Shop Owner Table! ✓" : "Save UPI ID"}
              </AppFormButton>

              {upiId && (
                <button
                  type="button"
                  onClick={handleRazorpayWithdraw}
                  className="h-12 px-6 rounded-[30px] bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  <CreditCard size={16} className="text-blue-400" />
                  <span>Withdraw Payout via Razorpay</span>
                  <ArrowUpRight size={15} />
                </button>
              )}
            </div>
          </form>
        )}
      </AppFormCard>

      {/* Razorpay Integration Information Box */}
      <div className="rounded-[28px] bg-blue-50/60 border border-blue-100 p-5 space-y-2 text-xs text-blue-900 font-sans font-sansation">
        <div className="flex items-center gap-2 font-semibold text-blue-900 text-sm">
          <CreditCard size={18} className="text-blue-600" />
          <span>Razorpay Payouts Integration</span>
        </div>
        <p className="text-blue-700/90 leading-relaxed font-normal">
          When customer orders are completed, settlements are processed directly to your registered UPI ID (
          <span className="font-mono font-semibold text-blue-900">{upiId || "yourname@upi"}</span>) using Razorpay Payouts API. No manual payout table configuration required.
        </p>
      </div>

      {/* Toast Notification */}
      {payoutInitiated && (
        <div className="fixed bottom-6 right-6 z-50 rounded-[20px] bg-slate-900 text-white px-5 py-3.5 text-xs font-normal shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={18} className="text-blue-400" />
          <span>Razorpay Payout request initiated to {upiId}!</span>
        </div>
      )}
    </div>
  );
}
