import ResourcePage from '../../shared/resource/ResourcePage';
import { transactions as seed } from '../../shared/adminData';

const columns = [{ key: 'id', label: 'ID' }, { key: 'type', label: 'Type' }, { key: 'order', label: 'Order' }, { key: 'user', label: 'User' }, { key: 'amount', label: 'Amount' }, { key: 'fee', label: 'Fee' }, { key: 'net', label: 'Net' }, { key: 'status', label: 'Status' }];

export default function TransactionsPage() {
  return (
    <ResourcePage
      title="Transactions"
      description="Review platform transactions, fees and net settlements."
      seed={seed}
      columns={columns}
    />
  );
}
