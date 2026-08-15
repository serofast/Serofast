import ResourcePage from '../../shared/resource/ResourcePage';
import { inventory as seed } from '../../shared/adminData';

const columns = [{ key: 'id', label: 'ID' }, { key: 'product', label: 'Product' }, { key: 'shop', label: 'Shop' }, { key: 'stock', label: 'Stock' }, { key: 'threshold', label: 'Threshold' }, { key: 'velocity', label: 'Velocity' }, { key: 'status', label: 'Status' }];

export default function InventoryPage() {
  return (
    <ResourcePage
      title="Inventory"
      description="Monitor marketplace-wide stock health, low stock and out of stock items."
      seed={seed}
      columns={columns}
    />
  );
}
