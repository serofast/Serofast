import ResourcePage from '../../shared/resource/ResourcePage';
import { deliveryRows as seed } from '../../shared/adminData';

const columns = [{ key: 'id', label: 'ID' }, { key: 'order', label: 'Order' }, { key: 'shop', label: 'Shop' }, { key: 'customer', label: 'customer' }, { key: 'courier', label: 'Courier' }, { key: 'tracking', label: 'Tracking' }, { key: 'status', label: 'Status' }];

export default function ShipmentsPage() {
  return (
    <ResourcePage
      title="Delivery"
      description="Track marketplace shipments and courier progress."
      seed={seed}
      columns={columns}
    />
  );
}
