import { useState } from 'react';

export function useCoupons() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
