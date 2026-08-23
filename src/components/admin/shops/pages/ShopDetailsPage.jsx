import { useState, useEffect } from "react";
import { Banknote, PackageSearch, ShieldCheck, ShoppingBag, Eye, FileText } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  Card,
  ConfirmDialog,
  PageHeader,
  StatusBadge,
  Tabs,
  Toast,
} from "../../shared/ui";
import { fetchAdminShopDetails, updateShopStatusInSupabase } from "../../../../lib/supabase";

const tabs = [
  "Overview",
  "Products",
  "Orders",
  "Customers",
  "Analytics",
  "Earnings",
  "Withdrawals",
  "Verification",
  "Documents",
  "Settings",
];

export default function ShopDetailsPage() {
  const { shopId } = useParams();
  const [shop, setShop] = useState({
    id: shopId,
    shop: "Loading Shop...",
    owner: "Shop Owner",
    email: "",
    phone: "",
    category: "Fashion",
    products: 0,
    orders: 0,
    revenue: "₹0",
    rating: "4.8",
    status: "Active",
    joined: "Recently",
  });
  const [activeTab, setActiveTab] = useState("Overview");
  const [pendingStatus, setPendingStatus] = useState(null);
  const [reason, setReason] = useState("");
  const [toast, setToast] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const verificationStatus = shop.status === "Pending" ? "Pending" : "Verified";

  useEffect(() => {
    async function loadShop() {
      if (!shopId) return;
      const data = await fetchAdminShopDetails(shopId);
      if (data) {
        setShop({
          id: data.id,
          shop: data.name || "Untitled Shop",
          owner: data.owner_name || data.shop_owners?.full_name || "Shop Owner",
          email: data.owner_email || data.shop_owners?.email || "",
          phone: data.owner_phone || data.shop_owners?.phone || "",
          category: data.category_id || "Fashion",
          products: 0,
          orders: 0,
          revenue: "₹0",
          rating: String(data.rating || "4.8"),
          status: data.status === "active" ? "Active" : data.status === "pending_review" ? "Pending" : "Active",
          joined: new Date(data.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
          cover_url: data.cover_url,
          avatar_url: data.avatar_url,
        });
      }
    }
    loadShop();
  }, [shopId]);

  async function confirmStatus() {
    const newStatus = pendingStatus === "Active" ? "active" : pendingStatus.toLowerCase();
    await updateShopStatusInSupabase(shop.id, newStatus);
    setShop((current) => ({ ...current, status: pendingStatus }));
    setToast(`${shop.shop} marked ${pendingStatus.toLowerCase()}.`);
    setPendingStatus(null);
    setReason("");
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
            {shop.shop}
          </h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Shop profile, marketplace performance, verification, documents, and seller operations.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {shop.status === "Pending" && (
          <button
            type="button"
            onClick={() => setPendingStatus("Active")}
            className="flex h-10 items-center justify-center gap-1.5 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer"
          >
            Approve Shop
          </button>
        )}
        <button
          type="button"
          onClick={() => setPendingStatus(shop.status === "Suspended" ? "Active" : "Suspended")}
          className="flex h-10 items-center justify-center gap-1.5 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium text-slate-700 hover:border-slate-300 transition cursor-pointer"
        >
          {shop.status === "Suspended" ? "Reactivate" : "Suspend"}
        </button>
        <button
          type="button"
          onClick={() => {
            setShop((current) => ({ ...current, trusted: !current.trusted }));
            setToast(shop.trusted ? "Trusted seller mark removed." : "Shop marked as trusted.");
          }}
          className="flex h-10 items-center justify-center gap-1.5 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium text-slate-700 hover:border-slate-300 transition cursor-pointer"
        >
          {shop.trusted ? "Remove Trusted" : "Mark Trusted"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric icon={PackageSearch} label="Products" value={shop.products} />
        <Metric icon={ShoppingBag} label="Orders" value={shop.orders} />
        <Metric icon={Banknote} label="Revenue" value={shop.revenue} />
        <Metric icon={ShieldCheck} label="Verification" value={verificationStatus} badge />
      </div>

      <Card className="min-w-0 overflow-hidden">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="p-5 sm:p-6">
          {activeTab === "Overview" && <Overview shop={shop} />}
          {activeTab === "Verification" && <Verification status={verificationStatus} />}
          {activeTab === "Documents" && <Documents />}
          {!['Overview', 'Verification', 'Documents'].includes(activeTab) && (
            <LinkedModule tab={activeTab} shop={shop} />
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={Boolean(pendingStatus)}
        title={`${pendingStatus === "Active" ? "Activate" : "Suspend"} shop`}
        description={`${shop.shop} will be marked ${pendingStatus?.toLowerCase() ?? ""}.`}
        confirmLabel="Confirm status change"
        tone={pendingStatus === "Active" ? "success" : "danger"}
        onConfirm={confirmStatus}
        onClose={() => setPendingStatus(null)}
      >
        {pendingStatus === "Suspended" && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-700">Internal reason</span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              className="w-full rounded-[20px] border border-[#E5E7EB] p-3 text-sm outline-none focus:border-brandRed"
            />
          </label>
        )}
      </ConfirmDialog>
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function Metric({ icon: Icon, label, value, badge = false }) {
  return (
    <div className="rounded-[28px] bg-white border border-[#F3E5E5] p-5 shadow-[-4px_5px_10px_rgba(211,47,47,0.18)] min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-2xl bg-rose-50 text-brandRed">
          <Icon size={16} />
        </div>
      </div>
      <div className="mt-2 text-2xl font-normal text-slate-900">
        {badge ? <StatusBadge value={value} /> : value}
      </div>
    </div>
  );
}

function Overview({ shop }) {
  const details = [
    ["Owner", shop.owner],
    ["Category", shop.category],
    ["Joined", shop.joined],
    ["Rating", `★ ${shop.rating}`],
    ["Status", shop.status],
    ["Customer count", Math.round(shop.orders * 0.72)],
  ];

  return (
    <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
      {details.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-xs">
          <span className="text-slate-500 font-normal">{label}</span>
          <span className="text-right font-medium text-slate-900">{value}</span>
        </div>
      ))}
    </div>
  );
}

function Verification({ status }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {["Identity", "Business", "Bank", "Phone", "Email"].map((item, index) => (
        <div key={item} className="rounded-[24px] border border-[#F3E5E5] bg-[#FAF8F5] p-4">
          <p className="mb-2 text-xs font-medium text-slate-700">{item}</p>
          <StatusBadge value={index === 2 && status === "Pending" ? "Pending" : "Verified"} />
        </div>
      ))}
    </div>
  );
}

function Documents() {
  const [selectedDoc, setSelectedDoc] = useState(null);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[600px] text-left text-xs">
        <thead>
          <tr className="text-slate-500 border-b border-slate-100">
            <th className="pb-3 font-normal">Document</th>
            <th className="pb-3 font-normal">Uploaded</th>
            <th className="pb-3 font-normal">Status</th>
            <th className="pb-3 font-normal text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {["Identity proof", "Business registration", "Bank proof"].map((document) => (
            <tr key={document} className="hover:bg-slate-50/50">
              <td className="py-4 font-medium text-slate-900">{document}</td>
              <td className="py-4 text-slate-600 font-normal">12 Aug 2026</td>
              <td className="py-4"><StatusBadge value="Verified" /></td>
              <td className="py-4 text-right">
                <button
                  type="button"
                  onClick={() => setSelectedDoc(document)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-brandRed hover:underline cursor-pointer"
                >
                  <Eye size={14} /> View Document
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in font-sans font-sansation">
          <div className="w-full max-w-md rounded-[30px] bg-white border border-[#F3E5E5] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-semibold text-slate-900">{selectedDoc}</h4>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <div className="bg-[#FAF8F5] p-6 rounded-[20px] border border-[#F3E5E5] text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-brandRed flex items-center justify-center mx-auto">
                <FileText size={24} />
              </div>
              <p className="text-xs font-semibold text-slate-800">{selectedDoc} (PDF Preview)</p>
              <p className="text-[11px] text-slate-500 font-normal">
                Status: Verified · Uploaded on 12 Aug 2026
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDoc(null)}
              className="w-full h-10 rounded-[25px] bg-brandRed text-xs font-semibold text-white shadow-sm cursor-pointer"
            >
              Close Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LinkedModule({ tab, shop }) {
  return (
    <div className="rounded-[24px] bg-[#FAF8F5] p-5 border border-[#F3E5E5]">
      <h3 className="text-sm font-medium text-slate-800">{tab}</h3>
      <p className="mt-2 text-xs text-slate-500 font-normal">
        {tab} for {shop.shop} is represented by the corresponding Admin module.
        Backend-linked shop-specific records will replace this Phase 4 summary.
      </p>
    </div>
  );
}
