import ResourcePage from '../../shared/resource/ResourcePage';
import { customers as seed } from '../../shared/adminData';

const columns = [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'orders', label: 'Orders' }, { key: 'spent', label: 'Total Spent' }, { key: 'avgOrder', label: 'Avg Order' }, { key: 'returns', label: 'Returns' }, { key: 'status', label: 'Status' }, { key: 'joined', label: 'Joined' }];

export default function CustomersPage() {
  return (
    <ResourcePage
      title="Customers"
      description="View customers, order history, account status and customer value."
      seed={seed}
      columns={columns}
    />
  );
}
