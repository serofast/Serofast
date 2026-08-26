import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, PageHeader, SearchBar } from "../../shared/ui";
import { topSearches, zeroSearches } from "../../shared/adminData";

export default function SearchAnalyticsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);
  const filteredTopSearches = useMemo(
    () =>
      topSearches.filter(([term]) =>
        term.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query],
  );

  return (
    <div>
      <PageHeader
        title="Search Analytics"
        description="Understand shopper searches, conversions, and catalog gaps."
      />

      <div className="mb-5 max-w-xl">
        <SearchBar
          value={query}
          setValue={setQuery}
          placeholder="Filter search terms..."
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Top searches</h2>
          <div className="mt-5 space-y-5">
            {filteredTopSearches.map(([term, count, score], index) => {
              const clicks = Math.round(count * 0.62);
              const conversions = Math.round(clicks * 0.08);

              return (
                <div key={term}>
                  <div className="flex items-start justify-between gap-4 text-sm">
                    <span>{index + 1}. {term}</span>
                    <span className="text-right">
                      <b>{count.toLocaleString()}</b>
                      <span className="block text-xs text-textMuted">
                        {clicks} clicks · {conversions} conversions
                      </span>
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-brandRed"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Searches with no results</h2>
          <div className="mt-5 space-y-3">
            {zeroSearches.map(([term, count]) => (
              <div
                key={term}
                className="flex flex-col gap-3 rounded-xl border border-lightBorder p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <span className="text-sm text-textSecondary">{term}</span>
                  <b className="ml-2 rounded-full bg-rose-50 px-2.5 py-1 text-xs text-rose-700">
                    {count}
                  </b>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/products?search=${encodeURIComponent(term)}`)}
                  className="min-h-10 rounded-lg border border-lightBorder px-3 text-xs font-semibold hover:border-brandRed hover:text-brandRed"
                >
                  Review catalog gap
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
