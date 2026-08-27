import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  Wallet,
  CreditCard,
  TrendingUp,
  Package,
  AlertCircle,
  RefreshCw,
  X,
  Send,
  Lock,
  Receipt,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { AppSuccessModal } from "../reusable";
import { humanizeError } from "../../utils/humanizer";
import {
  fetchOwnerUpiId,
  updateOwnerUpiId,
  fetchShopPayoutStats,
  requestShopWithdrawal,
  subscribeToShopPayouts,
} from "../../lib/supabase";

export default function ShopOwnerPayoutsPage() {
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeOwnerId, setActiveOwnerId] = useState(null);
  const [activeShopId, setActiveShopId] = useState(null);

  // Stats & Payout state
  const [stats, setStats] = useState({
    totalSalesAmount: 0,
    completedOrdersCount: 0,
    totalDressesSold: 0,
    ratePerDress: 30,
    totalEarnings: 0,
    totalWithdrawn: 0,
    availableAmount: 0,
    minWithdrawal: 100,
    canWithdraw: false,
    withdrawals: [],
  });

  // Withdrawal Modal State
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawUpi, setWithdrawUpi] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccessData, setWithdrawSuccessData] = useState(null);

  // Load active owner and shop
  useEffect(() => {
    let oId = null;
    let sId = null;

    try {
      const storedOwner = localStorage.getItem("serofast_current_owner");
      if (storedOwner) {
        const parsedOwner = JSON.parse(storedOwner);
        oId = parsedOwner.id;
        if (parsedOwner.upi_id) setUpiId(parsedOwner.upi_id);
      }

      const storedShop = localStorage.getItem("serofast_active_shop");
      if (storedShop) {
        const shopObj = JSON.parse(storedShop);
        sId = shopObj.id;
      }
    } catch (e) {
      console.warn("Error reading storage:", e);
    }

    setActiveOwnerId(oId);
    setActiveShopId(sId);
  }, []);

  // Fetch stats and UPI
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      let oId = activeOwnerId;
      let sId = activeShopId;

      if (!oId || !sId) {
        const storedOwner = localStorage.getItem("serofast_current_owner");
        if (storedOwner) oId = JSON.parse(storedOwner).id;
        const storedShop = localStorage.getItem("serofast_active_shop");
        if (storedShop) sId = JSON.parse(storedShop).id;
      }

      // Fetch UPI from database if available
      if (oId) {
        const fetchedUpi = await fetchOwnerUpiId(oId);
        if (fetchedUpi) setUpiId(fetchedUpi);
      }

      // Fetch Real-time Payout Stats
      const data = await fetchShopPayoutStats(sId, oId);
      setStats(data);
    } catch (e) {
      console.warn("Error loading payout data:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeOwnerId, activeShopId]);

  useEffect(() => {
    loadData();

    // Subscribe to real-time updates on orders and withdrawals
    const unsubscribe = subscribeToShopPayouts(activeShopId, activeOwnerId, () => {
      loadData(true);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [loadData, activeShopId, activeOwnerId]);

  // Open Withdraw Modal
  const handleOpenWithdrawModal = () => {
    if (stats.availableAmount < stats.minWithdrawal) {
      alert(`Minimum withdrawal amount is ₹${stats.minWithdrawal}. You currently have ₹${stats.availableAmount}.`);
      return;
    }
    setWithdrawAmount(String(stats.availableAmount));
    setWithdrawUpi(upiId.trim());
    setWithdrawError("");
    setWithdrawModalOpen(true);
  };

  // Submit Withdrawal to Razorpay & Supabase
  const handleConfirmWithdraw = async (e) => {
    e.preventDefault();
    setWithdrawError("");

    const numAmount = Number(withdrawAmount);
    if (!numAmount || isNaN(numAmount)) {
      setWithdrawError("Please enter a valid withdrawal amount.");
      return;
    }
    if (numAmount < stats.minWithdrawal) {
      setWithdrawError(`Minimum withdrawal amount is ₹${stats.minWithdrawal}.`);
      return;
    }
    if (numAmount > stats.availableAmount) {
      setWithdrawError(`Amount exceeds your available balance of ₹${stats.availableAmount}.`);
      return;
    }
    if (!withdrawUpi.trim()) {
      setWithdrawError("Please provide a valid UPI ID for the transfer.");
      return;
    }

    setWithdrawing(true);
    try {
      // Execute withdrawal to Supabase withdrawals table with real-time notification
      const result = await requestShopWithdrawal({
        shopId: activeShopId,
        ownerId: activeOwnerId,
        amount: numAmount,
        upiId: withdrawUpi.trim(),
        payoutMethod: "Razorpay Instant UPI",
      });

      // Update UPI in profile
      setUpiId(withdrawUpi.trim());
      await updateOwnerUpiId(activeOwnerId, withdrawUpi.trim());

      setWithdrawModalOpen(false);
      setWithdrawSuccessData({
        amount: numAmount,
        payoutNumber: result.payoutNumber,
        transactionRef: result.transactionRef,
        upiId: withdrawUpi.trim(),
        date: result.date,
      });

      // Re-fetch latest stats
      await loadData(true);
    } catch (err) {
      setWithdrawError(humanizeError(err, "We couldn't process your withdrawal right now. Please double-check your UPI ID and try again."));
    } finally {
      setWithdrawing(false);
    }
  };

  // Progress percentage toward min withdrawal threshold (100)
  const progressPercent = Math.min(
    100,
    Math.round((stats.availableAmount / stats.minWithdrawal) * 100)
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation w-full pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
            Payouts &amp; Earnings
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Real-time sales revenue, dress commission (₹30/dress), and instant Razorpay UPI payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            title="Refresh Live Data"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin text-brandRed" : "text-slate-500"} />
            <span>{refreshing ? "Syncing..." : "Sync Live"}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-[#F3E5E5] px-3.5 py-1.5 text-xs font-normal text-brandRed">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Real-Time Connected</span>
          </span>
        </div>
      </div>

      {/* Top 4 KPI Metrics Grid */}
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Metric 1: Total Completed Sales */}
        <div className="rounded-[30px] bg-white border border-[#F3E5E5] p-4 sm:p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.16)] flex flex-col justify-between space-y-3 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider truncate">
              Total Completed Sales
            </span>
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-rose-50 text-brandRed shrink-0">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-normal text-slate-900 tracking-tight truncate">
              ₹{stats.totalSalesAmount.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-slate-500 font-normal mt-1 flex items-center gap-1 truncate">
              <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
              <span>{stats.completedOrdersCount} orders delivered</span>
            </p>
          </div>
        </div>

        {/* Metric 2: Total Dresses Sold */}
        <div className="rounded-[30px] bg-white border border-[#F3E5E5] p-4 sm:p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.16)] flex flex-col justify-between space-y-3 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider truncate">
              Dresses Sold
            </span>
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-blue-50 text-blue-600 shrink-0">
              <Package size={18} />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-normal text-slate-900 tracking-tight truncate">
              {stats.totalDressesSold} <span className="text-xs font-normal text-slate-500">Units</span>
            </div>
            <p className="text-[11px] text-brandRed font-medium mt-1 truncate">
              ₹30 earned per dress
            </p>
          </div>
        </div>

        {/* Metric 3: Total Accumulated Earnings */}
        <div className="rounded-[30px] bg-white border border-[#F3E5E5] p-4 sm:p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.16)] flex flex-col justify-between space-y-3 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider truncate">
              Total Earnings
            </span>
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-rose-50 text-brandRed shrink-0">
              <Wallet size={18} />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight truncate">
              ₹{stats.totalEarnings.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-slate-500 font-normal mt-1 truncate">
              ({stats.totalDressesSold} × ₹30 per unit)
            </p>
          </div>
        </div>

        {/* Metric 4: Available for Withdrawal */}
        <div className="rounded-[30px] bg-gradient-to-br from-brandRed to-red-600 text-white p-4 sm:p-5 shadow-[0_10px_24px_rgba(211,47,47,0.3)] flex flex-col justify-between space-y-3 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-white/90 uppercase tracking-wider truncate">
              Available to Withdraw
            </span>
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white/20 text-white backdrop-blur-xs shrink-0">
              <Wallet size={18} />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-normal text-white tracking-tight truncate">
              ₹{stats.availableAmount.toLocaleString("en-IN")}
            </div>
            <p className="text-[11px] text-white/85 font-normal mt-1 flex items-center justify-between gap-1">
              <span className="truncate">Withdrawn: ₹{stats.totalWithdrawn.toLocaleString("en-IN")}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold shrink-0">
                Min ₹100
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Withdrawal Action & Threshold Card */}
      <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.2),-7px_8px_18px_rgba(211,47,47,0.1)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">
                Razorpay Direct UPI Withdrawal
              </h3>
              {stats.canWithdraw ? (
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  Ready to Withdraw
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                  Threshold Progress: {progressPercent}%
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Each dress sold earns you <strong className="text-slate-800">₹30</strong>. Once your balance reaches <strong className="text-slate-800">₹100</strong>, you can transfer it instantly to your account via Razorpay UPI.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenWithdrawModal}
              disabled={!stats.canWithdraw}
              className={`h-12 px-6 rounded-[30px] text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                stats.canWithdraw
                  ? "bg-brandRed text-white hover:bg-brandRedDark active:scale-95 shadow-brandRed/25"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              <CreditCard size={16} />
              <span>Withdraw ₹{stats.availableAmount} via Razorpay</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>

        {/* Threshold Progress Bar (when balance < 100) */}
        {!stats.canWithdraw && (
          <div className="rounded-[22px] bg-slate-50 border border-slate-100 p-4 space-y-2 text-xs">
            <div className="flex justify-between items-center text-[11px] font-medium text-slate-600">
              <span>Current Available Balance: <strong className="text-brandRed">₹{stats.availableAmount}</strong></span>
              <span>Minimum Payout Target: <strong>₹{stats.minWithdrawal}</strong></span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-brandRed transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              You need <strong className="text-slate-800">₹{Math.max(0, stats.minWithdrawal - stats.availableAmount)}</strong> more ({Math.ceil(Math.max(0, stats.minWithdrawal - stats.availableAmount) / 30)} more dress sales) to unlock your first Razorpay withdrawal.
            </p>
          </div>
        )}
      </div>

      {/* Withdrawal History & Payouts Table */}
      <div className="rounded-[35px] bg-white border border-[#F3E5E5] p-6 shadow-[-4px_5px_10px_rgba(211,47,47,0.2),-7px_8px_18px_rgba(211,47,47,0.1)] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Withdrawal History</h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Live settlement records connected to database
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {stats.withdrawals.length} Settlements
          </span>
        </div>

        {stats.withdrawals.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-slate-200 rounded-[24px] bg-[#FAF8F5]">
            <Receipt className="mx-auto text-slate-300 mb-2" size={34} />
            <p className="text-xs font-medium text-slate-600">No Withdrawals Yet</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto font-normal">
              Once you reach ₹100 from dress sales and request a withdrawal, your settlement transactions and Razorpay receipt IDs will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3">Payout ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Method</th>
                  <th className="py-3 px-3">Beneficiary UPI</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Transaction Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {stats.withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-3 font-mono font-medium text-slate-900">{w.payoutNumber}</td>
                    <td className="py-3.5 px-3 text-slate-500">{w.date}</td>
                    <td className="py-3.5 px-3 font-bold text-brandRed text-sm">₹{w.amount.toLocaleString("en-IN")}</td>
                    <td className="py-3.5 px-3 text-slate-600">{w.method}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-800">{w.upiId}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          w.status === "Completed" || w.status === "Processed"
                            ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                            : w.status === "Processing"
                            ? "bg-blue-50 border border-blue-200 text-blue-700"
                            : w.status === "Pending"
                            ? "bg-amber-50 border border-amber-200 text-amber-800"
                            : "bg-rose-50 border border-rose-200 text-rose-700"
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-400">
                      {w.transactionRef || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Razorpay Integration Info Banner */}
      <div className="rounded-[28px] bg-blue-50/60 border border-blue-100 p-5 space-y-2 text-xs text-blue-900 font-sans font-sansation">
        <div className="flex items-center gap-2 font-semibold text-blue-900 text-sm">
          <CreditCard size={18} className="text-blue-600" />
          <span>Razorpay Payouts Direct Settlement</span>
        </div>
        <p className="text-blue-700/90 leading-relaxed font-normal">
          All dress earnings (₹30 per item) are credited directly to your available balance. When withdrawing, funds are transferred instantly through Razorpay Payouts with 0% platform fee.
        </p>
      </div>

      {/* WITHDRAWAL MODAL */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in font-sans font-sansation">
          <div className="w-full max-w-md rounded-[32px] bg-white border border-[#F3E5E5] p-6 shadow-[0_20px_50px_rgba(211,47,47,0.25)] flex flex-col space-y-4 relative animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 text-brandRed">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Withdraw via Razorpay</h3>
                  <p className="text-xs text-slate-500 font-normal">Instant direct transfer to your UPI ID</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWithdrawModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {withdrawError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
                <AlertCircle size={16} className="shrink-0" />
                <span>{withdrawError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmWithdraw} className="space-y-4 text-xs">
              {/* Available Balance Display */}
              <div className="rounded-2xl bg-[#FAF8F5] p-4 border border-[#F3E5E5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Available Balance
                  </span>
                  <span className="text-xl font-bold text-brandRed">
                    ₹{stats.availableAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(String(stats.availableAmount))}
                  className="rounded-full bg-rose-100 text-brandRed px-3 py-1 text-xs font-bold hover:bg-rose-200 transition cursor-pointer"
                >
                  Use Max
                </button>
              </div>

              {/* Amount Input */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Withdrawal Amount (₹)</label>
                <input
                  type="number"
                  min="100"
                  max={stats.availableAmount}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount (min ₹100)"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-bold text-slate-900 outline-none focus:border-brandRed focus:bg-white focus:ring-2 focus:ring-brandRed/10 transition"
                  required
                />
                <div className="flex gap-2 pt-1">
                  {[100, 300, 500, stats.availableAmount].filter((v, i, a) => v <= stats.availableAmount && a.indexOf(v) === i).map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWithdrawAmount(String(amt))}
                      className="rounded-xl border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-brandRed hover:text-brandRed transition cursor-pointer"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination UPI ID */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Beneficiary UPI ID</label>
                <input
                  type="text"
                  value={withdrawUpi}
                  onChange={(e) => setWithdrawUpi(e.target.value)}
                  placeholder="e.g. phone@upi / yourname@okaxis / store@paytm"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-900 outline-none focus:border-brandRed focus:bg-white focus:ring-2 focus:ring-brandRed/10 transition"
                  required
                />
              </div>

              {/* Security note */}
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-normal">
                <Lock size={14} className="text-slate-400 shrink-0" />
                <span>Protected by Razorpay 256-Bit Gateway | 0% Transfer Fee</span>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setWithdrawModalOpen(false)}
                  className="flex-1 h-12 rounded-[30px] border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={withdrawing}
                  className="flex-1 h-12 rounded-[30px] bg-brandRed text-xs font-bold text-white shadow-md shadow-brandRed/25 hover:bg-brandRedDark transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {withdrawing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Processing Transfer...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Confirm &amp; Withdraw</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WITHDRAWAL SUCCESS MODAL */}
      {withdrawSuccessData && (
        <AppSuccessModal
          isOpen={Boolean(withdrawSuccessData)}
          onClose={() => setWithdrawSuccessData(null)}
          title="Withdrawal Successful!"
          message={`₹${withdrawSuccessData.amount.toLocaleString("en-IN")} has been dispatched to ${withdrawSuccessData.upiId} via Razorpay Payouts. Reference ID: ${withdrawSuccessData.transactionRef}.`}
          primaryActionLabel="Done"
          onPrimaryAction={() => setWithdrawSuccessData(null)}
        />
      )}
    </div>
  );
}

