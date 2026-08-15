import ResourcePage from '../../shared/resource/ResourcePage';
import { reviews as seed } from '../../shared/adminData';

const columns = [{ key: 'id', label: 'ID' }, { key: 'rating', label: 'Rating' }, { key: 'review', label: 'Review' }, { key: 'customer', label: 'customer' }, { key: 'product', label: 'Product' }, { key: 'shop', label: 'Shop' }, { key: 'status', label: 'Status' }];

export default function ReviewsPage() {
  return (
    <ResourcePage
      title="Reviews"
      description="Moderate marketplace reviews, ratings and reported content."
      seed={seed}
      columns={columns}
    />
  );
}
