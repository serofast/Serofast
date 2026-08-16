import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  ConfirmDialog,
  PageHeader,
  StatusBadge,
  Tabs,
  Toast,
} from "../../shared/ui";
import { customers } from "../../shared/adminData";

const tabs = ["Overview", "Orders", "Returns", "Reviews", "Wishlist", "Addresses", "Support", "Activity"];

export default function CustomerDetailsPage() {
  const { customerId } = useParams();
  const source = customers.find((item) => item.id === customerId) ?? customers[0];
  const [customer, setCustomer] = useState(source);
  const [activeTab, setActiveTab] = useState("Overview");
  const [pendingStatus, setPendingStatus] = useState(null);
  const [toast, setToast] = useState("");

  function confirmStatus() {
    setCustomer((current) => ({ ...current, status: pendingStatus }));
    setToast(`Customer marked ${pendingStatus.toLowerCase()}.`);
    setPendingStatus(null);
  }

  return (
    <div>
      <PageHeader
        title={customer.name}
        description="Customer profile, account state, orders, returns, support, and activity."
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPendingStatus(customer.status === "Blocked" ? "Active" : "Blocked")}
          className="min-h-10 rounded-lg bg-brandRed px-4 text-sm font-semibold text-white"
        >
          {customer.status === "Blocked" ? "Unblock" : "Block Customer"}
        </button>
        <button
          type="button"
          onClick={() => setToast("Frontend reset-access request prepared. Backend delivery is pending.")}
          className="min-h-10 rounded-lg border border-lightBorder px-4 text-sm font-semibold"
        >
          Reset Access
        </button>
      </div>

      <Card className="overflow-hidden">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="p-5 sm:p-6">
          {activeTab === "Overview" ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Detail label="Email" value={customer.email} />
              <Detail label="Orders" value={customer.orders} />
              <Detail label="Total spent" value={customer.spent} />
              <div>
                <p className="text-xs text-textMuted">Status</p>
                <div className="mt-1"><StatusBadge value={customer.status} /></div>
              </div>
              <Detail label="Average order" value={`₹${Math.round(Number(String(customer.spent).replace(/[^\d]/g, "")) / customer.orders).toLocaleString()}`} />
              <Detail label="Returns" value={customer.returns} />
              <Detail label="Phone" value="+91 ••••• 4821" />
              <Detail label="Joined" value="12 Jan 2026" />
            </div>
          ) : (
            <div className="rounded-xl bg-lightBackground p-5">
              <h2 className="font-semibold">{activeTab}</h2>
              <p className="mt-2 text-sm text-textSecondary">
                This frontend panel is ready for customer-linked {activeTab.toLowerCase()} data from the service layer.
              </p>
            </div>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={Boolean(pendingStatus)}
        title={`${pendingStatus === "Blocked" ? "Block" : "Unblock"} customer`}
        description={`${customer.name} will be marked ${pendingStatus?.toLowerCase() ?? ""}.`}
        confirmLabel="Confirm account change"
        tone={pendingStatus === "Blocked" ? "danger" : "success"}
        onConfirm={confirmStatus}
        onClose={() => setPendingStatus(null)}
      />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-textMuted">{label}</p>
      <p className="mt-1 break-words font-semibold">{value}</p>
    </div>
  );
}
