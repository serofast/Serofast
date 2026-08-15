import { useState } from 'react';

export function useBanners() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
