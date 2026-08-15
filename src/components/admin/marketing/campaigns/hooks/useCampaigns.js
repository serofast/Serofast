import { useState } from 'react';

export function useCampaigns() {
  const [loading, setLoading] = useState(false);
  return { loading, setLoading };
}
