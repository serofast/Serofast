import { useState, useEffect } from 'react';
import ResourcePage from '../../shared/resource/ResourcePage';
import { reviews as fallbackRows } from '../../shared/adminData';
import { fetchAdminReviews, subscribeToAdminTableChanges } from '../../../../lib/supabase';

const columns = [{ key: 'id', label: 'ID' }, { key: 'rating', label: 'Rating' }, { key: 'review', label: 'Review' }, { key: 'customer', label: 'Customer' }, { key: 'product', label: 'Product' }, { key: 'shop', label: 'Shop' }, { key: 'status', label: 'Status' }, { key: 'date', label: 'Date' }];

export default function ReviewsPage() {
  const [rows, setRows] = useState(fallbackRows);

  useEffect(() => {
    async function loadReviews() {
      const data = await fetchAdminReviews();
      if (data?.length) {
        const mapped = data.map((r) => ({
          id: r.id,
          rating: `${r.rating || 5} / 5.0`,
          review: r.review_text || 'No review text provided.',
          customer: r.profiles?.full_name || r.profiles?.email || 'Customer',
          product: r.product_name || r.products?.name || 'Marketplace Product',
          shop: r.shops?.name || 'Store',
          status: r.status || 'Published',
          date: new Date(r.created_at).toLocaleDateString('en-IN'),
        }));
        setRows(mapped);
      } else {
        setRows(fallbackRows);
      }
    }

    loadReviews();
    const unsubscribe = subscribeToAdminTableChanges('reviews', () => loadReviews());
    return () => unsubscribe();
  }, []);

  return (
    <ResourcePage
      title="Reviews"
      description="Moderate marketplace reviews, ratings and reported content."
      seed={rows}
      columns={columns}
    />
  );
}
