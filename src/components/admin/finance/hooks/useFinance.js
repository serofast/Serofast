import { useState } from 'react';

export function useFinance() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
