import ResourcePage from '../../shared/resource/ResourcePage';
import { shops as seed } from '../../shared/adminData';

const columns = [{ key: 'shop', label: 'Shop' }, { key: 'owner', label: 'Owner' }, { key: 'category', label: 'Category' }, { key: 'products', label: 'Products' }, { key: 'orders', label: 'Orders' }, { key: 'revenue', label: 'Revenue' }, { key: 'rating', label: 'Rating' }, { key: 'status', label: 'Status' }, { key: 'joined', label: 'Joined' }];

export default function ShopsPage() {
  return (
    <ResourcePage
      title="Shops"
      description="Manage marketplace sellers, verification, status and performance."
      seed={seed}
      columns={columns}
    />
  );
}
