import { Users, PieChart, Settings, HelpCircle, RotateCcw, BarChart3 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCustomerStore } from '../../store/useCustomerStore';

interface SidebarProps {
  onReset?: () => void;
}

export function Sidebar({ onReset }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const resetData = useCustomerStore((s) => s.resetData);

  const handleReset = () => {
    if (window.confirm('确定要重置所有数据吗？此操作不可撤销。')) {
      resetData();
      onReset?.();
    }
  };

  const navItems = [
    {
      label: '客户管理',
      icon: Users,
      path: '/',
      active: location.pathname === '/' || location.pathname.startsWith('/customer'),
    },
    {
      label: '数据统计',
      icon: PieChart,
      path: '/',
      active: false,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-primary-900 via-primary-800 to-primary-950 text-white flex flex-col shadow-2xl z-20">
      <div className="p-6 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center shadow-inner">
            <BarChart3 className="w-6 h-6 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-wide">客户跟进</h1>
            <p className="text-xs text-white/60 mt-0.5 font-medium">管理平台</p>
          </div>
        </div>
      </div>

      <div className="px-4 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40 px-2 mb-3">主导航</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full sidebar-link ${item.active ? 'sidebar-link-active' : ''}`}
            >
              <item.icon className="w-5 h-5" strokeWidth={2} />
              <span className="text-[15px]">{item.label}</span>
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-500 shadow-md" />}
            </button>
          ))}
        </nav>
      </div>

      <div className="px-4 py-5 border-t border-white/10">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40 px-2 mb-3">系统</p>
        <div className="space-y-1">
          <button
            onClick={handleReset}
            className="w-full sidebar-link text-white/60 hover:text-white/90"
          >
            <RotateCcw className="w-5 h-5" strokeWidth={2} />
            <span className="text-[15px]">重置数据</span>
          </button>
          <button className="w-full sidebar-link text-white/60 hover:text-white/90">
            <Settings className="w-5 h-5" strokeWidth={2} />
            <span className="text-[15px]">设置</span>
          </button>
          <button className="w-full sidebar-link text-white/60 hover:text-white/90">
            <HelpCircle className="w-5 h-5" strokeWidth={2} />
            <span className="text-[15px]">帮助中心</span>
          </button>
        </div>
      </div>

      <div className="p-5 border-t border-white/10">
        <div className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-4">
          <p className="text-xs text-white/60 font-medium mb-1">今日提示</p>
          <p className="text-[13px] text-white/85 leading-relaxed">及时更新客户跟进状态，让销售数据更准确 🎯</p>
        </div>
      </div>
    </aside>
  );
}
