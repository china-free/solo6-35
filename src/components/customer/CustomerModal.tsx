import { useEffect } from 'react';
import { X, Building2, User, Phone, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import type { Customer } from '../../types';
import { STATUS_CONFIG, STATUS_ORDER } from '../../config/statusConfig';
import { useCustomerForm } from '../../hooks/useCustomerForm';

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Customer | null;
}

export function CustomerModal({ open, onClose, initialData }: CustomerModalProps) {
  const { form, errors, submitted, loading, setField, handleSubmit, reset } = useCustomerForm({
    initialData,
    onSuccess: () => {
      onClose();
      reset();
    },
  });

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  if (!open) return null;

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
      style={{ animation: 'fadeInUp 0.2s ease-out' }}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="relative bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 px-7 py-6 text-white overflow-hidden grain-overlay">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/15 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold">
                {initialData ? '编辑客户' : '新增客户'}
              </h2>
              <p className="text-white/70 text-sm mt-1 font-medium">
                {initialData ? '修改客户信息，保持数据最新' : '录入新客户，开启跟进之旅'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <form onSubmit={onFormSubmit} className="p-7 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
              <Building2 className="w-4 h-4 text-primary-700" strokeWidth={2} />
              客户名称 <span className="text-status-lost">*</span>
            </label>
            <input
              type="text"
              placeholder="如：北京鑫源科技有限公司"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              className={`input-field ${submitted && errors.name ? 'border-status-lost focus:border-status-lost focus:ring-status-lost/10' : ''}`}
            />
            {submitted && errors.name && (
              <p className="flex items-center gap-1 mt-1.5 text-xs text-status-lost font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
                <User className="w-4 h-4 text-primary-700" strokeWidth={2} />
                联系人 <span className="text-status-lost">*</span>
              </label>
              <input
                type="text"
                placeholder="如：张先生"
                value={form.contact}
                onChange={(e) => setField('contact', e.target.value)}
                className={`input-field ${submitted && errors.contact ? 'border-status-lost focus:border-status-lost focus:ring-status-lost/10' : ''}`}
              />
              {submitted && errors.contact && (
                <p className="flex items-center gap-1 mt-1.5 text-xs text-status-lost font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.contact}
                </p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
                <Phone className="w-4 h-4 text-primary-700" strokeWidth={2} />
                联系电话 <span className="text-status-lost">*</span>
              </label>
              <input
                type="tel"
                placeholder="如：13800138000 / 010-12345678"
                value={form.phone}
                maxLength={50}
                onChange={(e) => setField('phone', e.target.value)}
                className={`input-field ${submitted && errors.phone ? 'border-status-lost focus:border-status-lost focus:ring-status-lost/10' : ''}`}
              />
              <p className="text-[11px] text-slate-400 mt-1.5 font-medium leading-relaxed">
                支持多种格式：手机号、带区号座机（010-12345678）、400电话、带分机号（转/ext）等
              </p>
              {submitted && errors.phone && (
                <p className="flex items-center gap-1 mt-1.5 text-xs text-status-lost font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
              <Activity className="w-4 h-4 text-primary-700" strokeWidth={2} />
              跟进状态
            </label>
            <div className="grid grid-cols-5 gap-2">
              {STATUS_ORDER.map((s) => {
                const cfg = STATUS_CONFIG[s];
                const selected = form.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setField('status', s)}
                    className={`relative py-2.5 px-2 rounded-xl text-[12px] font-bold transition-all duration-200 border-2 ${
                      selected
                        ? 'shadow-md scale-[1.02]'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                    style={selected ? { background: cfg.bgColor, color: cfg.color, borderColor: cfg.color } : {}}
                  >
                    <span
                      className="block w-2.5 h-2.5 rounded-full mx-auto mb-1"
                      style={{ background: cfg.color }}
                    />
                    {cfg.label}
                    {selected && (
                      <CheckCircle
                        className="absolute top-1.5 right-1.5 w-3.5 h-3.5"
                        strokeWidth={3}
                        style={{ color: cfg.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="btn-secondary flex-1" disabled={loading}>
              取消
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              <CheckCircle className="w-4.5 h-4.5" strokeWidth={2.2} />
              {initialData ? '保存修改' : '确认添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
