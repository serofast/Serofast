import { useState, useEffect } from "react";
import ResourcePage from "../../shared/resource/ResourcePage";
import {
  fetchAdminTransactionsList,
  subscribeAdminRealtime,
} from "../../../../services/adminSupabaseService";

const columns = [
  { key: "id", label: "Transaction ID" },
  { key: "type", label: "Type" },
  { key: "order", label: "Order" },
  { key: "user", label: "Entity / User" },
  { key: "amount", label: "Gross" },
  { key: "fee", label: "Fee" },
  { key: "net", label: "Net Payout" },
  { key: "status", label: "Status" },
];

export default function TransactionsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTransactions() {
    try {
      const data = await fetchAdminTransactionsList();
      if (Array.isArray(data)) {
        const mapped = data.map((t) => ({
          id: t.transaction_number || t.id,
          type: t.type || "Order Payment",
          order: t.orders?.order_number || t.order_id || "Direct Settlement",
          user: t.profiles?.full_name || t.shops?.name || "Marketplace User",
          amount: `₹${t.gross_amount || 0}`,
          fee: `₹${t.platform_fee || 0}`,
          net: `₹${t.net_amount || 0}`,
          status: t.status || "Success",
        }));
        setRows(mapped);
      } else {
        setRows([]);
      }
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
    const unsub = subscribeAdminRealtime("transactions", () => loadTransactions());
    return () => unsub();
  }, []);

  return (
    <ResourcePage
      title="Transactions Ledger"
      description="Live platform transaction history, gross customer payments, fee cuts, and merchant net settlements."
      seed={rows}
      columns={columns}
      emptyTitle={loading ? "Loading transactions..." : "No transactions recorded yet"}
      emptyDescription="Platform orders and payouts will automatically populate the financial ledger."
    />
  );
}
