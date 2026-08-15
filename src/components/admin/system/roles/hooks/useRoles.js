import { useState } from 'react';

export function useRoles() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
