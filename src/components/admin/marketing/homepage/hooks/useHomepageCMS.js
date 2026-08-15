import { useState } from 'react';

export function useHomepageCMS() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
