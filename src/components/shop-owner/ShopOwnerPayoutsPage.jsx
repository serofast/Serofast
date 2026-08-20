import { useState } from "react";
import {
  CheckCircle2,
  Building2,
  ShieldCheck,
  Wallet,
  Landmark,
  Save,
  ArrowUpRight,
  Clock,
  Sparkles,
  Eye,
  FileText,
  Download,
  X,
} from "lucide-react";
import { initialSellerPayouts } from "../../data/sellerData";
import { AppFormCard, AppFormField, AppFormButton } from "../reusable/form";

export default function ShopOwnerPayoutsPage() {
  const [payouts] = useState(initialSellerPayouts);
  const [upiVpa, setUpiVpa] = useState("urbanstyles@hdfcbank");
  const [accountName, setAccountName] = useState("Urban Styles Retail LLP");
  const [bankAccount, setBankAccount] = useState("•••• •••• 9842");
  const [ifscCode, setIfscCode] = useState("HDFC0000240");
  const [saved, setSaved] = useState(false);

  // Settlement detail view modal state
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [receiptDownloaded, setReceiptDownloaded] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDownloadReceipt = (payoutId) => {
    setReceiptDownloaded(true);
    setTimeout(() => setReceiptDownloaded(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
            Payouts &amp; Settlements
          </h1> 
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-[#F3E5E5] px-3.5 py-1.5 text-xs font-normal text-brandRed self-start sm:self-auto">
          <ShieldCheck size={15} className="text-brandRed" />
          <span>Verified Merchant Account</span>
        </span>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Available Balance */}
        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">Available Balance</span>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 text-brandRed">
              <Wallet size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-medium tracking-tight text-brandRed">₹4,497</div>
            <p className="text-[11px] text-slate-500 font-normal mt-1 flex items-center gap-1">
              <Clock size={12} className="text-brandRed" /> Auto-Settling Daily at 11:00 PM
            </p>
          </div>
        </div>

        {/* Card 2: Lifetime Settled */}
        <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">Lifetime Settled</span>
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 text-brandRed">
              <Landmark size={20} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-medium tracking-tight text-slate-900">₹11,487</div>
            <span className="inline-flex items-center gap-1 text-xs text-brandRed font-normal mt-1">
              <CheckCircle2 size={13} /> 100% Direct Retained
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
              ₹50 One-Time Setup • Zero Hidden Charges
            </p>
          </div>
        </div>
      </div>

      {/* Settlement Account Settings Form */}
      <AppFormCard className="max-w-full" title="Bank &amp; UPI Settlement Settings" subtitle="Configure where customer payments are deposited automatically">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppFormField
              label="Business / Registered Account Name"
              icon={Building2}
              value={accountName}
              onChange={(val) => setAccountName(val)}
              placeholder="e.g. Urban Styles Retail LLP"
            />

            <AppFormField
              label="Instant UPI VPA Handle"
              icon={Wallet}
              value={upiVpa}
              onChange={(val) => setUpiVpa(val)}
              placeholder="yourname@upi / phone@paytm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppFormField
              label="Bank Account Number"
              icon={Landmark}
              value={bankAccount}
              onChange={(val) => setBankAccount(val)}
              placeholder="•••• •••• •••• 9842"
            />

            <AppFormField
              label="IFSC Code"
              value={ifscCode}
              onChange={(val) => setIfscCode(val)}
              placeholder="HDFC0000240"
            />
          </div>

          <div className="pt-2">
            <AppFormButton type="submit" icon={Save}>
              {saved ? "Settlement Details Saved! ✓" : "Update Settlement Account"}
            </AppFormButton>
          </div>
        </form>
      </AppFormCard>

      {/* Mobile Responsive Settlement History */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-normal text-brandRed tracking-tight">
            Settlement History
          </h3>
          <span className="text-xs text-slate-400 font-normal">
            Last 30 Days
          </span>
        </div>

        {/* Mobile View (< sm viewports) */}
        <div className="space-y-3 sm:hidden">
          {payouts.map((p) => (
            <div
              key={p.id}
              className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-normal text-slate-900">{p.id}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-100 px-3 py-0.5 text-[10px] font-normal text-brandRed">
                  <CheckCircle2 size={12} /> {p.status}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div>
                  <span className="text-xs font-normal text-slate-800 block">{p.date}</span>
                  <span className="text-[11px] text-slate-400 font-normal block mt-0.5">{p.method}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-medium text-brandRed leading-none block">₹{p.amount}</span>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedPayout(p)}
                      className="p-1 rounded-full text-slate-500 hover:text-brandRed hover:bg-rose-50 transition cursor-pointer"
                      title="View Settlement Details"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadReceipt(p.id)}
                      className="p-1 rounded-full text-slate-500 hover:text-brandRed hover:bg-rose-50 transition cursor-pointer"
                      title="Download Receipt"
                    >
                      <FileText size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View (>= sm viewports) */}
        <div className="hidden sm:block overflow-hidden rounded-[35px] bg-white border border-[#F3E5E5] shadow-[-4px_5px_10px_rgba(211,47,47,0.24),-7px_8px_18px_rgba(211,47,47,0.12)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-[#FAF8F5] font-normal text-slate-600">
                <tr>
                  <th className="px-5 py-4 font-normal">Settlement ID</th>
                  <th className="px-5 py-4 font-normal">Date &amp; Time</th>
                  <th className="px-5 py-4 font-normal">Amount</th>
                  <th className="px-5 py-4 font-normal">Transfer Method</th>
                  <th className="px-5 py-4 font-normal">Status</th>
                  <th className="px-5 py-4 text-right font-normal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4 font-mono text-slate-900 font-normal">{p.id}</td>
                    <td className="px-5 py-4 text-slate-600 font-normal">{p.date}</td>
                    <td className="px-5 py-4 font-medium text-brandRed text-sm">₹{p.amount}</td>
                    <td className="px-5 py-4 text-slate-600 font-normal">{p.method}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-100 px-3 py-1 text-[11px] font-normal text-brandRed">
                        <CheckCircle2 size={12} /> {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedPayout(p)}
                          className="rounded-full p-2 text-slate-500 hover:text-brandRed hover:bg-rose-50 transition cursor-pointer"
                          title="View Settlement Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadReceipt(p.id)}
                          className="rounded-full p-2 text-slate-500 hover:text-brandRed hover:bg-rose-50 transition cursor-pointer"
                          title="Download Receipt"
                        >
                          <FileText size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Settlement Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in font-sans font-sansation">
          <div className="w-full max-w-md max-h-[88vh] rounded-[32px] sm:rounded-[35px] bg-white border border-[#F3E5E5] p-5 sm:p-7 shadow-[0_20px_50px_rgba(211,47,47,0.25)] flex flex-col space-y-4 relative animate-scale-up">

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-normal text-brandRed tracking-tight">Settlement Details</h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">Reference ID: {selectedPayout.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayout(null)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-[#FAF8F5] p-4 rounded-[22px] border border-[#F3E5E5] text-center space-y-1">
                <span className="text-slate-400 block text-[11px]">Total Net Payout</span>
                <span className="text-2xl font-bold text-brandRed block">₹{selectedPayout.amount}</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium pt-1">
                  <CheckCircle2 size={13} /> {selectedPayout.status} & Direct Settled
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-[16px] border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Settlement Date</span>
                  <span className="font-semibold text-slate-800 text-xs block mt-0.5">{selectedPayout.date}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-[16px] border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Orders Included</span>
                  <span className="font-semibold text-slate-800 text-xs block mt-0.5">{selectedPayout.ordersCount || 3} Orders</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-[18px] border border-slate-100 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Transfer Destination:</span>
                  <span className="font-semibold text-slate-900">{selectedPayout.method}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>UPI VPA Handle:</span>
                  <span className="font-mono text-slate-800">{upiVpa}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SeroFast Platform Fee:</span>
                  <span className="font-semibold text-brandRed">₹0 (0% Free)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedPayout(null)}
                className="flex-1 h-11 rounded-[30px] border border-[#E5E7EB] bg-white text-xs font-normal text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleDownloadReceipt(selectedPayout.id)}
                className="flex-1 h-11 rounded-[30px] bg-brandRed text-xs font-semibold text-white hover:bg-brandRedDark transition cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(211,47,47,0.3)]"
              >
                <Download size={15} />
                <span>Receipt PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {receiptDownloaded && (
        <div className="fixed bottom-6 right-6 z-50 rounded-[20px] bg-slate-900 text-white px-4 py-3 text-xs font-normal shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Settlement receipt generated &amp; downloaded!</span>
        </div>
      )}
    </div>
  );
}
