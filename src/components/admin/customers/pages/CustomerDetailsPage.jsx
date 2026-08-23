import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  ConfirmDialog,
  PageHeader,
  StatusBadge,
  Tabs,
  Toast,
} from "../../shared/ui";
import { fetchAdminCustomerDetails } from "../../../../lib/supabase";

const tabs = ["Overview", "Orders", "Returns", "Reviews", "Wishlist", "Addresses", "Support", "Activity"];

export default function CustomerDetailsPage() {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState({
    id: customerId,
    name: "Customer Profile",
    email: "",
    phone: "",
    orders: 0,
    spent: "₹0",
    avgOrder: "₹0",
    returns: 0,
    status: "Active",
    joined: "Recently",
  });
  const [activeTab, setActiveTab] = useState("Overview");
  const [pendingStatus, setPendingStatus] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadCustomer() {
      if (!customerId) return;
      const data = await fetchAdminCustomerDetails(customerId);
      if (data) {
        setCustomer({
          id: data.id,
          name: data.full_name || "Registered Customer",
          email: data.email || "",
          phone: data.phone || "",
          orders: data.orders?.length || 0,
          spent: `₹${(data.orders || []).reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0).toLocaleString("en-IN")}`,
          avgOrder: "₹0",
          returns: 0,
          status: "Active",
          joined: new Date(data.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        });
      }
    }
    loadCustomer();
  }, [customerId]);

  function confirmStatus() {
    setCustomer((current) => ({ ...current, status: pendingStatus }));
    setToast(`Customer marked ${pendingStatus.toLowerCase()}.`);
    setPendingStatus(null);
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans font-sansation max-w-5xl mx-auto pb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-normal text-brandRed tracking-tight">
          {customer.name}
        </h1>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Customer profile, account state, orders, returns, support, and activity.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPendingStatus(customer.status === "Blocked" ? "Active" : "Blocked")}
          className="flex h-10 items-center justify-center gap-1.5 rounded-[30px] bg-brandRed px-4 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(211,47,47,0.35)] hover:bg-brandRedDark transition cursor-pointer"
        >
          {customer.status === "Blocked" ? "Unblock" : "Block Customer"}
        </button>
        <button
          type="button"
          onClick={() => setToast("Frontend reset-access request prepared. Backend delivery is pending.")}
          className="flex h-10 items-center justify-center gap-1.5 rounded-[30px] border border-[#E5E7EB] bg-white px-4 text-xs font-medium text-slate-700 hover:border-slate-300 transition cursor-pointer"
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
                <p className="text-[11px] text-slate-500 font-normal">Status</p>
                <div className="mt-1"><StatusBadge value={customer.status} /></div>
              </div>
              <Detail label="Average order" value={`₹${Math.round(Number(String(customer.spent).replace(/[^\d]/g, "")) / customer.orders).toLocaleString()}`} />
              <Detail label="Returns" value={customer.returns} />
              <Detail label="Phone" value="+91 ••••• 4821" />
              <Detail label="Joined" value="12 Jan 2026" />
            </div>
          ) : (
            <div className="rounded-[24px] bg-[#FAF8F5] p-5 border border-[#F3E5E5]">
              <h3 className="text-xs font-medium text-slate-800">{activeTab}</h3>
              <p className="mt-2 text-[11px] text-slate-500 font-normal">
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
      <p className="text-[11px] text-slate-500 font-normal">{label}</p>
      <p className="mt-1 break-words text-xs font-medium text-slate-900">{value}</p>
    </div>
  );
}
