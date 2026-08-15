import { useState } from 'react';

export function useRisk() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
