import { MessageSquare, Calendar } from 'lucide-react';
import type { FollowupNote } from '../../types';
import { formatDateTime, getRelativeTime } from '../../utils/helpers';

interface FollowupTimelineProps {
  notes: FollowupNote[];
  statusColor: string;
}

export function FollowupTimeline({ notes, statusColor }: FollowupTimelineProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-16 px-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-slate-400" strokeWidth={1.8} />
        </div>
        <h4 className="font-serif text-lg font-bold text-slate-700 mb-1">暂无跟进记录</h4>
        <p className="text-sm text-slate-500 font-medium">添加第一条跟进备注，开启客户跟进之旅</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6">
      <div
        className="absolute left-[7px] top-2 bottom-2 w-0.5 rounded-full"
        style={{
          background: `linear-gradient(to bottom, ${statusColor}40, ${statusColor}10)`,
        }}
      />

      <div className="space-y-5">
        {notes.map((note, idx) => (
          <div
            key={note.id}
            className="relative"
            style={{ animation: `fadeInUp 0.4s ease-out ${idx * 0.05}s both` }}
          >
            <div
              className="timeline-dot"
              style={{
                borderColor: statusColor,
                boxShadow: `0 0 0 4px ${statusColor}10`,
              }}
            />

            <div
              className="card p-5 ml-5 overflow-hidden relative"
              style={{
                borderLeft: `4px solid ${statusColor}`,
              }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2"
                style={{ background: statusColor }}
              />

              <div className="relative">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full">
                    <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                    {formatDateTime(note.createdAt)}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {getRelativeTime(note.createdAt)}
                  </span>
                </div>

                <p className="text-[15px] text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
