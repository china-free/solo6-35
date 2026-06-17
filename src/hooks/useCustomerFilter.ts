import { useState, useMemo } from 'react';
import type { CustomerStatus } from '../types';
import { useFilteredCustomers, useStatistics } from '../store/selectors';

export function useCustomerFilter() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'updatedAt'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const customers = useFilteredCustomers({ query, status: statusFilter, sortBy, sortOrder });
  const statistics = useStatistics();

  const resultCount = useMemo(() => customers.length, [customers.length]);

  const clearFilters = () => {
    setQuery('');
    setStatusFilter('all');
  };

  const setQueryDebounced = (value: string) => {
    setQuery(value);
  };

  return {
    query,
    setQuery: setQueryDebounced,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    customers,
    statistics,
    resultCount,
    clearFilters,
    hasActiveFilters: query !== '' || statusFilter !== 'all',
  };
}
