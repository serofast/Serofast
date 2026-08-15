import { useState } from 'react';

export function useOrders() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
