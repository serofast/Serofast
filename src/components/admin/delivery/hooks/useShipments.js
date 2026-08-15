import { useState } from 'react';

export function useShipments() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
