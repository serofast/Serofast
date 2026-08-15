import { useState } from 'react';

export function useReviews() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
