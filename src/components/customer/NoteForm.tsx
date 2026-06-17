import { useState } from 'react';
import { Send, FileText, AlertCircle } from 'lucide-react';
import { useNoteForm } from '../../hooks/useNoteForm';

interface NoteFormProps {
  customerId: string;
  onSuccess?: () => void;
}

export function NoteForm({ customerId, onSuccess }: NoteFormProps) {
  const [focused, setFocused] = useState(false);
  const { content, error, loading, maxLength, charCount, handleChange, insertTemplate, handleSubmit } = useNoteForm({
    customerId,
    onSuccess,
  });

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  return (
    <form
      onSubmit={onFormSubmit}
      className="card p-6 relative overflow-hidden transition-all duration-300"
      style={{
        boxShadow: focused ? '0 20px 40px -20px rgba(30, 58, 95, 0.15)' : undefined,
        borderColor: focused ? 'rgba(30, 58, 95, 0.2)' : undefined,
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-primary-700 to-accent-500 opacity-0 transition-opacity duration-300" style={{ opacity: focused ? 1 : 0 }} />

      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-800 to-primary-950 flex items-center justify-center shadow-md">
          <FileText className="w-5 h-5 text-white" strokeWidth={2.2} />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-slate-900">添加跟进备注</h3>
          <p className="text-xs text-slate-500 font-medium">记录本次沟通的关键信息</p>
        </div>
      </div>

      <div className="relative mb-3">
        <textarea
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="例如：电话沟通后客户对方案比较感兴趣，约定下周三面谈。客户关注点集中在价格和交付周期..."
          rows={4}
          className="input-field resize-none !py-3.5 leading-relaxed"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
            charCount > maxLength * 0.85
              ? 'bg-status-quoted/15 text-status-quoted'
              : charCount > 0
                ? 'bg-primary-50 text-primary-700'
                : 'bg-slate-50 text-slate-400'
          }`}>
            {charCount}/{maxLength}
          </span>
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 mb-3 text-xs text-status-lost font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {['电话沟通', '面谈拜访', '发送方案', '客户回访', '报价跟进'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => insertTemplate(t)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 hover:bg-primary-50 hover:text-primary-700 transition-colors border border-slate-200 hover:border-primary-200"
            >
              + {t}
            </button>
          ))}
        </div>
        <button type="submit" className="btn-accent" disabled={loading || content.trim().length < 2}>
          <Send className="w-4.5 h-4.5" strokeWidth={2.2} />
          保存备注
        </button>
      </div>
    </form>
  );
}
