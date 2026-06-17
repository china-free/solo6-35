import { useState } from 'react';
import { Plus, Inbox } from 'lucide-react';
import { StatsPieChart } from '../components/dashboard/StatsPieChart';
import { StatsCards } from '../components/dashboard/StatsCards';
import { SearchBar } from '../components/customer/SearchBar';
import { CustomerCard } from '../components/customer/CustomerCard';
import { CustomerModal } from '../components/customer/CustomerModal';
import { useCustomerFilter } from '../hooks/useCustomerFilter';

export function CustomerList() {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    customers,
    resultCount,
    hasActiveFilters,
  } = useCustomerFilter();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
          <p className="text-sm font-semibold text-accent-500 uppercase tracking-wider mb-2">Dashboard</p>
          <h1 className="font-serif text-4xl font-bold text-slate-900 leading-tight">
            客户管理中心
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            系统化管理客户跟进，让每一位客户都不被遗漏
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-accent shadow-lg"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.15s both' }}
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          新增客户
        </button>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        style={{ animation: 'fadeInUp 0.5s ease-out 0.1s both' }}
      >
        <div className="lg:col-span-2 card p-6 grain-overlay gradient-mesh overflow-hidden relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-slate-900">客户状态分布</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">实时统计各跟进阶段的客户数量</p>
            </div>
          </div>
          <StatsPieChart />
        </div>
        <div>
          <div className="mb-3">
            <h2 className="font-serif text-xl font-bold text-slate-900">数据概览</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">关键指标一目了然</p>
          </div>
          <StatsCards />
        </div>
      </div>

      <div
        className="card p-5"
        style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}
      >
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          resultCount={resultCount}
        />
      </div>

      <div style={{ animation: 'fadeInUp 0.5s ease-out 0.25s both' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-slate-900">
            客户列表
            <span className="ml-2 text-sm font-medium text-slate-500">
              共 {resultCount} 位客户
            </span>
          </h2>
        </div>

        {resultCount === 0 ? (
          <div className="card p-16 text-center grain-overlay">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
              <Inbox className="w-10 h-10 text-slate-400" strokeWidth={1.8} />
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-700 mb-2">
              {hasActiveFilters ? '没有找到匹配的客户' : '还没有客户数据'}
            </h3>
            <p className="text-sm text-slate-500 font-medium mb-6 max-w-md mx-auto">
              {hasActiveFilters
                ? '尝试调整搜索关键词或筛选条件，看看有没有更多结果'
                : '点击右上角「新增客户」按钮，开始录入您的第一位客户'}
            </p>
            {!hasActiveFilters && (
              <button onClick={() => setModalOpen(true)} className="btn-primary">
                <Plus className="w-4.5 h-4.5" strokeWidth={2.2} />
                立即添加客户
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {customers.map((customer, idx) => (
              <CustomerCard key={customer.id} customer={customer} index={idx} />
            ))}
          </div>
        )}
      </div>

      <CustomerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
