import { useState } from "react";
import { Banknote, PackageSearch, ShieldCheck, ShoppingBag } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  Card,
  ConfirmDialog,
  PageHeader,
  StatusBadge,
  Tabs,
  Toast,
} from "../../shared/ui";
import { shops } from "../../shared/adminData";

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
  const sourceShop = shops.find((item) => item.id === shopId) ?? shops[0];
  const [shop, setShop] = useState(sourceShop);
  const [activeTab, setActiveTab] = useState("Overview");
  const [pendingStatus, setPendingStatus] = useState(null);
  const [reason, setReason] = useState("");
  const [toast, setToast] = useState("");
  const verificationStatus = shop.status === "Pending" ? "Pending" : "Verified";

  function confirmStatus() {
    setShop((current) => ({ ...current, status: pendingStatus }));
    setToast(`${shop.shop} marked ${pendingStatus.toLowerCase()}.`);
    setPendingStatus(null);
    setReason("");
  }

  return (
    <div>
      <PageHeader
        title={shop.shop}
        description="Shop profile, marketplace performance, verification, documents, and seller operations."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {shop.status === "Pending" && (
          <button
            type="button"
            onClick={() => setPendingStatus("Active")}
            className="min-h-10 rounded-lg bg-brandRed px-4 text-sm font-semibold text-white"
          >
            Approve Shop
          </button>
        )}
        <button
          type="button"
          onClick={() => setPendingStatus(shop.status === "Suspended" ? "Active" : "Suspended")}
          className="min-h-10 rounded-lg border border-lightBorder px-4 text-sm font-semibold"
        >
          {shop.status === "Suspended" ? "Reactivate" : "Suspend"}
        </button>
        <button
          type="button"
          onClick={() => {
            setShop((current) => ({ ...current, trusted: !current.trusted }));
            setToast(shop.trusted ? "Trusted seller mark removed." : "Shop marked as trusted.");
          }}
          className="min-h-10 rounded-lg border border-lightBorder px-4 text-sm font-semibold"
        >
          {shop.trusted ? "Remove Trusted" : "Mark Trusted"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={PackageSearch} label="Products" value={shop.products} />
        <Metric icon={ShoppingBag} label="Orders" value={shop.orders} />
        <Metric icon={Banknote} label="Revenue" value={shop.revenue} />
        <Metric icon={ShieldCheck} label="Verification" value={verificationStatus} badge />
      </div>

      <Card className="mt-6 min-w-0 overflow-hidden">
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
            <span className="mb-1.5 block text-sm font-semibold">Internal reason</span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-lightBorder p-3 text-sm"
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
    <Card className="p-5">
      <Icon className="text-brandRed" />
      <p className="mt-4 text-sm text-textSecondary">{label}</p>
      <div className="mt-1 text-2xl font-bold">
        {badge ? <StatusBadge value={value} /> : value}
      </div>
    </Card>
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
        <div key={label} className="flex justify-between gap-4 border-b border-lightBorder pb-3 text-sm">
          <span className="text-textMuted">{label}</span>
          <span className="text-right font-semibold">{value}</span>
        </div>
      ))}
    </div>
  );
}

function Verification({ status }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {["Identity", "Business", "Bank", "Phone", "Email"].map((item, index) => (
        <div key={item} className="rounded-xl border border-lightBorder p-4">
          <p className="mb-2 text-sm font-semibold">{item}</p>
          <StatusBadge value={index === 2 && status === "Pending" ? "Pending" : "Verified"} />
        </div>
      ))}
    </div>
  );
}

function Documents() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[600px] text-left text-sm">
        <thead>
          <tr className="text-xs uppercase text-textMuted">
            <th className="pb-3">Document</th>
            <th className="pb-3">Uploaded</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-lightBorder">
          {["Identity proof", "Business registration", "Bank proof"].map((document) => (
            <tr key={document}>
              <td className="py-4 font-semibold">{document}</td>
              <td className="py-4 text-textSecondary">12 Aug 2026</td>
              <td className="py-4"><StatusBadge value="Verified" /></td>
              <td className="py-4 text-xs font-semibold text-textSecondary">
                Metadata available
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LinkedModule({ tab, shop }) {
  return (
    <div className="rounded-xl bg-lightBackground p-5">
      <h3 className="font-semibold">{tab}</h3>
      <p className="mt-2 text-sm text-textSecondary">
        {tab} for {shop.shop} is represented by the corresponding Admin module.
        Backend-linked shop-specific records will replace this Phase 4 summary.
      </p>
    </div>
  );
}
