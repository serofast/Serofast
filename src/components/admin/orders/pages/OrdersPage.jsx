import ResourcePage from '../../shared/resource/ResourcePage';
import { orders as seed } from '../../shared/adminData';

const columns = [{ key: 'id', label: 'ID' }, { key: 'customer', label: 'customer' }, { key: 'shop', label: 'Shop' }, { key: 'items', label: 'Items' }, { key: 'amount', label: 'Amount' }, { key: 'payment', label: 'Payment' }, { key: 'status', label: 'Status' }, { key: 'date', label: 'Date' }];

export default function OrdersPage() {
  return (
    <ResourcePage
      title="Orders"
      description="Monitor orders from placement through delivery, return and refund."
      seed={seed}
      columns={columns}
    />
  );
}
