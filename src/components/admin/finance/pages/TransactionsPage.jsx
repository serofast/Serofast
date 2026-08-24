import { useState, useEffect } from "react";
import ResourcePage from "../../shared/resource/ResourcePage";
import { transactions as seed } from "../../shared/adminData";
import {
  fetchAdminTransactionsList,
  subscribeAdminRealtime,
} from "../../../../services/adminSupabaseService";

const columns = [
  { key: "id", label: "ID" },
  { key: "type", label: "Type" },
  { key: "order", label: "Order" },
  { key: "user", label: "User" },
  { key: "amount", label: "Amount" },
  { key: "fee", label: "Fee" },
  { key: "net", label: "Net" },
  { key: "status", label: "Status" },
];

export default function TransactionsPage() {
  const [rows, setRows] = useState(seed);

  useEffect(() => {
    async function loadTransactions() {
      const data = await fetchAdminTransactionsList();
      if (data && data.length > 0) {
        const mapped = data.map((t) => ({
          id: t.transaction_number || t.id,
          type: t.type,
          order: t.orders?.order_number || t.order_id || "Direct Settlement",
          user: t.profiles?.full_name || t.shops?.name || "Marketplace User",
          amount: `₹${t.gross_amount || 0}`,
          fee: `₹${t.platform_fee || 0}`,
          net: `₹${t.net_amount || 0}`,
          status: t.status,
        }));
        setRows(mapped);
      } else {
        setRows(seed);
      }
    }

    loadTransactions();
    const unsub = subscribeAdminRealtime("transactions", () => loadTransactions());
    return () => unsub();
  }, []);

  return (
    <ResourcePage
      title="Transactions Ledger"
      description="Review platform transactions, gross marketplace settlement, platform fees, and merchant net payouts."
      seed={rows}
      columns={columns}
    />
  );
}
