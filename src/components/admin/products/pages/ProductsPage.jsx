import ResourcePage from '../../shared/resource/ResourcePage';
import { products as seed } from '../../shared/adminData';

const columns = [{ key: 'product', label: 'Product' }, { key: 'shop', label: 'Shop' }, { key: 'category', label: 'Category' }, { key: 'price', label: 'Price' }, { key: 'stock', label: 'Stock' }, { key: 'status', label: 'Status' }, { key: 'rating', label: 'Rating' }, { key: 'created', label: 'Created' }];

export default function ProductsPage() {
  return (
    <ResourcePage
      title="Products"
      description="Manage the global marketplace catalog and moderation queue."
      seed={seed}
      columns={columns}
    />
  );
}
