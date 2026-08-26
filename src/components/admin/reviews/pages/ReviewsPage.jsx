import { useState, useEffect } from "react";
import ResourcePage from "../../shared/resource/ResourcePage";
import { fetchAdminReviews, subscribeToAdminTableChanges } from "../../../../lib/supabase";

const columns = [
  { key: "id", label: "Review ID" },
  { key: "rating", label: "Rating" },
  { key: "review", label: "Feedback" },
  { key: "customer", label: "Customer" },
  { key: "product", label: "Product" },
  { key: "shop", label: "Shop" },
  { key: "status", label: "Status" },
  { key: "date", label: "Submitted" },
];

export default function ReviewsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadReviews() {
    try {
      const data = await fetchAdminReviews();
      if (Array.isArray(data)) {
        const mapped = data.map((r) => ({
          id: r.id,
          rating: `${r.rating || 5} / 5.0`,
          review: r.review_text || "No review text provided.",
          customer: r.profiles?.full_name || r.profiles?.email || "Customer",
          product: r.product_name || r.products?.name || "Marketplace Product",
          shop: r.shops?.name || "Campus Vendor",
          status: r.status || "Published",
          date: new Date(r.created_at || Date.now()).toLocaleDateString("en-IN"),
        }));
        setRows(mapped);
      } else {
        setRows([]);
      }
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
    const unsubscribe = subscribeToAdminTableChanges("reviews", () => loadReviews());
    return () => unsubscribe();
  }, []);

  return (
    <ResourcePage
      title="Customer Reviews & Ratings"
      description="Live product feedback, buyer ratings, and review moderation from Supabase."
      seed={rows}
      columns={columns}
      emptyTitle={loading ? "Loading customer reviews..." : "No reviews found in database"}
      emptyDescription="When customers submit verified reviews on orders, they will appear here for moderation."
    />
  );
}
