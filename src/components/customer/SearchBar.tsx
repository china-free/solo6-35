import { Search, X, Filter } from 'lucide-react';
import { STATUS_CONFIG, STATUS_ORDER } from '../../config/statusConfig';
import type { CustomerStatus } from '../../types';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  statusFilter: CustomerStatus | 'all';
  onStatusFilterChange: (s: CustomerStatus | 'all') => void;
  resultCount: number;
}

export function SearchBar({ query, onQueryChange, statusFilter, onStatusFilterChange, resultCount }: SearchBarProps) {
  const filters = [
    { key: 'all', label: '全部' },
    ...STATUS_ORDER.map((s) => ({
      key: s,
      label: STATUS_CONFIG[s].label,
      color: STATUS_CONFIG[s].color,
    })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2} />
          <input
            type="text"
            placeholder="搜索客户名称..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="input-field pl-12 pr-12"
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" strokeWidth={2.5} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200">
            <Filter className="w-4 h-4 text-slate-500" strokeWidth={2} />
            <span className="text-sm font-semibold text-slate-700">{resultCount}</span>
            <span className="text-sm text-slate-500">位客户</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = statusFilter === f.key;
          const style = isActive
            ? 'filter-tag-active'
            : 'filter-tag-inactive';
          return (
            <button
              key={f.key}
              onClick={() => onStatusFilterChange(f.key as CustomerStatus | 'all')}
              className={`filter-tag ${style}`}
            >
              {'color' in f && (
                <span
                  className="w-2 h-2 rounded-full mr-1.5"
                  style={{ background: isActive ? 'white' : f.color }}
                />
              )}
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
