import ResourcePage from '../../shared/resource/ResourcePage';
import { returns as seed } from '../../shared/adminData';

const columns = [{ key: 'id', label: 'ID' }, { key: 'order', label: 'Order' }, { key: 'customer', label: 'customer' }, { key: 'shop', label: 'Shop' }, { key: 'product', label: 'Product' }, { key: 'reason', label: 'Reason' }, { key: 'refund', label: 'Refund' }, { key: 'status', label: 'Status' }];

export default function ReturnsPage() {
  return (
    <ResourcePage
      title="Returns"
      description="Review return requests, reasons, evidence and refund amounts."
      seed={seed}
      columns={columns}
      viewPath={(row) => `/admin/returns/${encodeURIComponent(row.id)}`}
    />
  );
}
