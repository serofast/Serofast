import { useEffect, useMemo, useState } from "react";

function compareValues(leftValue, rightValue) {
  const left = leftValue ?? "";
  const right = rightValue ?? "";

  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function useResourceList(seed = [], { initialPageSize = 5 } = {}) {
  const [rows, setRows] = useState(() => [...seed]);
  const [search, setSearchState] = useState("");
  const [status, setStatusState] = useState("");
  const [quickFilter, setQuickFilterState] = useState(null);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setRows([...seed]);
  }, [seed]);

  const statuses = useMemo(
    () => [...new Set(rows.map((row) => row.status).filter(Boolean))],
    [rows],
  );

  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const matchingRows = rows.filter((row) => {
      const matchesSearch =
        !normalizedSearch ||
        (row.searchText
          ? String(row.searchText).toLowerCase().includes(normalizedSearch)
          : Object.values(row).some(
              (value) =>
                typeof value !== "object" &&
                String(value ?? "").toLowerCase().includes(normalizedSearch),
            ));
      const matchesStatus = !status || row.status === status;
      const matchesQuickFilter = !quickFilter || quickFilter(row);

      return matchesSearch && matchesStatus && matchesQuickFilter;
    });

    if (!sortKey) {
      return matchingRows;
    }

    return [...matchingRows].sort((left, right) => {
      const result = compareValues(left[sortKey], right[sortKey]);
      return sortDirection === "asc" ? result : -result;
    });
  }, [quickFilter, rows, search, sortDirection, sortKey, status]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, pageSize, safePage]);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  function setSearch(value) {
    setSearchState(value);
    setPage(1);
  }

  function setStatus(value) {
    setStatusState(value);
    setQuickFilterState(null);
    setPage(1);
  }

  function setQuickFilter(predicate) {
    setStatusState("");
    setQuickFilterState(() => predicate ?? null);
    setPage(1);
  }

  function changeSort(key) {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  }

  function changePageSize(value) {
    setPageSize(Number(value));
    setPage(1);
  }

  function updateRow(id, patch) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  }

  function createRow(record) {
    setRows((current) => [record, ...current]);
    setPage(1);
  }

  function removeRows(ids) {
    const idSet = new Set(ids);
    setRows((current) => current.filter((row) => !idSet.has(row.id)));
    setSelectedIds([]);
  }

  function updateRows(ids, patch) {
    const idSet = new Set(ids);
    setRows((current) =>
      current.map((row) => (idSet.has(row.id) ? { ...row, ...patch } : row)),
    );
    setSelectedIds([]);
  }

  function reorderRow(id, direction) {
    setRows((current) => {
      const index = current.findIndex((row) => row.id === id);
      const target = index + direction;

      if (index < 0 || target < 0 || target >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function toggleSelected(id) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  }

  function toggleVisibleRows() {
    const visibleIds = visibleRows.map((row) => row.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));

    setSelectedIds((current) =>
      allSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : [...new Set([...current, ...visibleIds])],
    );
  }

  function clearFilters() {
    setSearchState("");
    setStatusState("");
    setQuickFilterState(null);
    setSortKey("");
    setSortDirection("asc");
    setPage(1);
  }

  function retry() {
    setError(null);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 250);
  }

  return {
    rows,
    filteredRows,
    visibleRows,
    totalCount: filteredRows.length,
    search,
    setSearch,
    status,
    setStatus,
    quickFilter,
    setQuickFilter,
    statuses,
    sortKey,
    sortDirection,
    changeSort,
    page: safePage,
    setPage,
    pageSize,
    changePageSize,
    pageCount,
    selectedIds,
    setSelectedIds,
    toggleSelected,
    toggleVisibleRows,
    updateRow,
    updateRows,
    reorderRow,
    createRow,
    removeRows,
    clearFilters,
    loading,
    error,
    retry,
    setError,
  };
}
