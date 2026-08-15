import { useState } from 'react';

export function useSupport() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
