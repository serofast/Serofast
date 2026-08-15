import { useMemo, useState } from 'react';

export function useResourceList(seed = []) {
  const [rows, setRows] = useState(seed);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const statuses = useMemo(() => [...new Set(rows.map((row) => row.status).filter(Boolean))], [rows]);
  const filteredRows = useMemo(() => rows.filter((row) => {
    const matchesSearch = !search || JSON.stringify(row).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !status || row.status === status;
    return matchesSearch && matchesStatus;
  }), [rows, search, status]);

  function updateRow(id, patch) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, ...patch } : row));
  }

  return { rows, filteredRows, search, setSearch, status, setStatus, statuses, updateRow };
}
