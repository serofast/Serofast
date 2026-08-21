import ResourcePage from '../../shared/resource/ResourcePage';
import { refunds as seed } from '../../shared/adminData';

const columns = [{ key: 'id', label: 'ID' }, { key: 'order', label: 'Order' }, { key: 'customer', label: 'customer' }, { key: 'shop', label: 'Shop' }, { key: 'amount', label: 'Amount' }, { key: 'reason', label: 'Reason' }, { key: 'status', label: 'Status' }];

export default function RefundsPage() {
  return (
    <ResourcePage
      title="Refunds"
      description="Review customer refund requests and resolution status."
      seed={seed}
      columns={columns}
      viewPath={(row) => `/admin/finance/refunds/${encodeURIComponent(row.id)}`}
      routeParam="refundId"
      basePath="/admin/finance/refunds"
    />
  );
}
