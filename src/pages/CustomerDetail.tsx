import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  User,
  Phone,
  Calendar,
  Edit3,
  Trash2,
  Clock,
  Activity,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { STATUS_CONFIG, STATUS_ORDER } from '../config/statusConfig';
import {
  useCustomerDetail,
  useCustomerActions,
  useShouldFollowUp,
} from '../store/selectors';
import { FollowupTimeline } from '../components/customer/FollowupTimeline';
import { NoteForm } from '../components/customer/NoteForm';
import { CustomerModal } from '../components/customer/CustomerModal';
import { formatDateTime } from '../utils/helpers';
import type { CustomerStatus } from '../types';

export function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const detail = useCustomerDetail(id);
  const { deleteCustomer, changeCustomerStatus } = useCustomerActions();
  const followUp = useShouldFollowUp(id);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  if (!detail) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Building2 className="w-10 h-10 text-slate-400" strokeWidth={1.8} />
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-800 mb-2">客户不存在</h2>
        <p className="text-slate-500 mb-6 text-sm font-medium">该客户可能已被删除或ID不正确</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          <ArrowLeft className="w-4.5 h-4.5" strokeWidth={2.2} />
          返回客户列表
        </button>
      </div>
    );
  }

  const { customer, notes, noteCount } = detail;
  const config = STATUS_CONFIG[customer.status];

  const handleDeleteCustomer = () => {
    if (window.confirm(`确定要删除客户「${customer.name}」吗？相关跟进记录也会一并删除。`)) {
      deleteCustomer(customer.id);
      navigate('/');
    }
  };

  const handleChangeStatus = (status: CustomerStatus) => {
    changeCustomerStatus(customer.id, status);
    setStatusDropdownOpen(false);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary-800 transition-colors group"
        style={{ animation: 'fadeInUp 0.4s ease-out' }}
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={2.5} />
        返回客户列表
      </button>

      <div
        className="card p-7 relative overflow-hidden grain-overlay"
        style={{ animation: 'fadeInUp 0.5s ease-out 0.05s both' }}
      >
        <div
          className="absolute top-0 left-0 w-full h-2"
          style={{ background: `linear-gradient(to right, ${config.color}, ${config.color}80)` }}
        />
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.05] -translate-y-1/3 translate-x-1/4"
          style={{ background: config.color }}
        />

        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-7">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)`,
                }}
              >
                <Building2 className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-serif text-3xl font-bold text-slate-900 break-words">
                  {customer.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span
                    className="status-tag text-[14px] px-4 py-1.5 shadow-sm"
                    style={{ background: config.bgColor, color: config.color }}
                  >
                    <Activity className="w-3.5 h-3.5 mr-1.5 inline" strokeWidth={2.5} />
                    {config.label}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                    创建于 {formatDateTime(customer.createdAt)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                    更新于 {formatDateTime(customer.updatedAt)}
                  </span>
                </div>

                {followUp.needFollow && followUp.reason && (
                  <div className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-status-quoted/10 border border-status-quoted/20">
                    <AlertTriangle className="w-4 h-4 text-status-quoted shrink-0" strokeWidth={2.2} />
                    <span className="text-sm font-semibold text-status-quoted">{followUp.reason}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => setEditModalOpen(true)}
                className="btn-secondary"
              >
                <Edit3 className="w-4.5 h-4.5" strokeWidth={2.2} />
                编辑信息
              </button>
              <button onClick={handleDeleteCustomer} className="btn-danger">
                <Trash2 className="w-4.5 h-4.5" strokeWidth={2.2} />
                删除
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-7 border-t border-slate-100">
            <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                <User className="w-4 h-4" strokeWidth={2.2} />
                联系人
              </div>
              <p className="font-serif text-xl font-bold text-slate-900">{customer.contact}</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                <Phone className="w-4 h-4" strokeWidth={2.2} />
                联系电话
              </div>
              <p className="font-serif text-xl font-bold text-slate-900 tracking-wide">
                {customer.phone}
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                <Activity className="w-4 h-4" strokeWidth={2.2} />
                跟进次数
              </div>
              <p className="font-serif text-xl font-bold text-slate-900">{noteCount} 次</p>
            </div>

            <div className="relative">
              <div className="rounded-2xl p-5 border border-slate-100" style={{ background: config.bgColor }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: config.color }}>
                    <Activity className="w-4 h-4" strokeWidth={2.2} />
                    变更状态
                  </div>
                </div>
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white text-left font-semibold shadow-sm border hover:shadow-md transition-all"
                  style={{ color: config.color, borderColor: `${config.color}30` }}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: config.color }} />
                    {config.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                </button>

                {statusDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setStatusDropdownOpen(false)}
                    />
                    <div
                      className="absolute right-0 top-full mt-2 w-full z-20 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2 animate-scale-in"
                    >
                      {STATUS_ORDER.map((s) => {
                        const cfg = STATUS_CONFIG[s];
                        const selected = s === customer.status;
                        return (
                          <button
                            key={s}
                            onClick={() => handleChangeStatus(s)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                              selected ? 'bg-slate-50' : 'hover:bg-slate-50'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0"
                              style={{ background: cfg.color }}
                            />
                            <span className="font-bold text-slate-800 flex-1">{cfg.label}</span>
                            {selected && (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: cfg.bgColor, color: cfg.color }}>
                                当前
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        style={{ animation: 'fadeInUp 0.5s ease-out 0.1s both' }}
      >
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full" style={{ background: config.color }} />
              跟进记录时间线
              <span className="text-sm font-normal text-slate-500 ml-2">
                ({noteCount} 条记录)
              </span>
            </h2>
            <FollowupTimeline notes={notes} statusColor={config.color} />
          </div>
        </div>

        <div>
          <h2 className="font-serif text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 rounded-full bg-accent-500" />
            新增跟进
          </h2>
          <NoteForm customerId={customer.id} />
        </div>
      </div>

      <CustomerModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialData={customer}
      />
    </div>
  );
}
