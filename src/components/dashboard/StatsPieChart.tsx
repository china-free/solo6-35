import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useStatistics } from '../../store/selectors';

export function StatsPieChart() {
  const { pieData, total } = useStatistics();

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-sm font-bold"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white rounded-xl shadow-xl border border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
            <p className="font-bold text-slate-800 text-sm">{d.name}</p>
          </div>
          <p className="text-xs text-slate-500">
            共 <span className="font-bold text-slate-900 text-base">{d.value}</span> 位客户
            <span className="text-slate-400 mx-1">·</span>
            占比 {pct}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
          <span className="text-xs text-slate-600 font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full h-full min-h-[320px]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[58%] text-center pointer-events-none z-10">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">客户总数</p>
        <p className="font-serif text-4xl font-bold text-primary-900 mt-1">{total}</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="45%"
            innerRadius={75}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
            animationBegin={100}
            animationDuration={1000}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="white"
                strokeWidth={3}
                className="cursor-pointer transition-all duration-300 hover:opacity-90"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Legend content={<CustomLegend />} verticalAlign="bottom" height={40} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
