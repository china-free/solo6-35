import { memo } from 'react';
import { Building2, User, Phone, ChevronRight, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Customer } from '../../types';
import { STATUS_CONFIG } from '../../config/statusConfig';
import { formatDateTime, getRelativeTime } from '../../utils/helpers';
import { useCustomerStore } from '../../store/useCustomerStore';

interface CustomerCardProps {
  customer: Customer;
  index: number;
}

export const CustomerCard = memo(function CustomerCard({ customer, index }: CustomerCardProps) {
  const navigate = useNavigate();
  const getNotesByCustomer = useCustomerStore((s) => s.getNotesByCustomer);
  const notes = getNotesByCustomer(customer.id);
  const config = STATUS_CONFIG[customer.status];

  return (
    <div
      onClick={() => navigate(`/customer/${customer.id}`)}
      className="card card-hover p-5 cursor-pointer grain-overlay group relative overflow-hidden"
      style={{
        animation: `fadeInUp 0.5s ease-out ${0.1 + index * 0.05}s both`,
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: config.color }}
      />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110"
            style={{ background: `${config.color}12` }}
          >
            <Building2 className="w-6 h-6" style={{ color: config.color }} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif font-bold text-[17px] text-slate-900 truncate group-hover:text-primary-800 transition-colors">
              {customer.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
              <span>更新于 {getRelativeTime(customer.updatedAt)}</span>
            </div>
          </div>
        </div>
        <span
          className="status-tag shrink-0 ml-3"
          style={{ background: config.bgColor, color: config.color }}
        >
          {config.label}
        </span>
      </div>

      <div className="space-y-2.5 mb-4">
        <div className="flex items-center gap-2 text-[14px]">
          <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
          </div>
          <span className="text-slate-500 font-medium">联系人</span>
          <span className="text-slate-900 font-semibold">{customer.contact}</span>
        </div>
        <div className="flex items-center gap-2 text-[14px]">
          <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
            <Phone className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
          </div>
          <span className="text-slate-500 font-medium">电话</span>
          <span className="text-slate-900 font-semibold tracking-wide">{customer.phone}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <MessageSquare className="w-3.5 h-3.5" strokeWidth={2} />
          <span>{notes.length} 条跟进记录</span>
          {notes.length > 0 && (
            <span className="text-slate-400 mx-1">·</span>
          )}
          {notes.length > 0 && (
            <span>最新 {formatDateTime(notes[0].createdAt).slice(5)}</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-primary-700 text-sm font-semibold group-hover:gap-2 transition-all">
          <span>查看详情</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
});
