import { useEffect, useState } from 'react';
import { Users, Phone, FileText, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import { useStatistics } from '../../store/selectors';

const STATUS_ICONS = {
  pending: Users,
  contacted: Phone,
  quoted: FileText,
  closed: CheckCircle2,
  lost: XCircle,
};

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplay(0);
      return;
    }
    const duration = 800;
    const startTime = performance.now();
    const startValue = 0;

    let frame: number;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startValue + (value - startValue) * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{display}</>;
}

export function StatsCards() {
  const statistics = useStatistics();

  const totalCard = {
    label: '客户总数',
    value: statistics.total,
    color: '#1e3a5f',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-100',
    icon: Users,
  };

  return (
    <div className="space-y-4">
      <div
        className={`card grain-overlay overflow-hidden p-5 ${totalCard.bgColor} border ${totalCard.borderColor} relative`}
        style={{ animation: 'fadeInUp 0.5s ease-out 0.1s both' }}
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: totalCard.color }}
          >
            <totalCard.icon className="w-5.5 h-5.5 text-white" strokeWidth={2.2} />
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/70 backdrop-blur text-primary-700">
            <ArrowUpRight className="w-3.5 h-3.5" />
            全部
          </div>
        </div>
        <p className="text-sm text-slate-600 font-medium mb-1">{totalCard.label}</p>
        <div className="flex items-end gap-2">
          <span className="font-serif text-4xl font-bold tracking-tight" style={{ color: totalCard.color }}>
            <AnimatedNumber value={totalCard.value} />
          </span>
          <span className="text-sm text-slate-500 mb-1.5 font-medium">位客户</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statistics.byStatus.map((item, idx) => {
          const Icon = STATUS_ICONS[item.status];
          return (
            <div
              key={item.status}
              className="card grain-overlay overflow-hidden p-4 relative"
              style={{
                animation: `fadeInUp 0.4s ease-out ${0.2 + idx * 0.08}s both`,
                borderColor: `${item.color}15`,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: `${item.color}15` }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color: item.color }} strokeWidth={2.2} />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${item.color}15`, color: item.color }}>
                  {item.percent}%
                </span>
              </div>
              <p className="text-[13px] text-slate-500 font-medium mb-0.5">{item.label}</p>
              <span className="font-serif text-2xl font-bold" style={{ color: item.color }}>
                <AnimatedNumber value={item.count} />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
