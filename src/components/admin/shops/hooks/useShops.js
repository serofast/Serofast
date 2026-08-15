import { useState } from 'react';

export function useShops() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
