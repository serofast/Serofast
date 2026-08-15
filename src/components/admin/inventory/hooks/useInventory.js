import { useState } from 'react';

export function useInventory() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
