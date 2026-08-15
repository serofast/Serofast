import { useState } from 'react';

export function useReturns() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
