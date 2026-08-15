import { useState } from 'react';

export function useAdminUsers() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
