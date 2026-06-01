import { GlassCard } from '@/components/ui/GlassCard';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | ReactNode;
  subtitle?: string | ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  valueSuffix?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ title, value, subtitle, icon, action, valueSuffix }: StatCardProps) {
  return (
    <GlassCard className="p-5 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-semibold tracking-wider text-white/50 uppercase">{title}</h3>
        {icon && <div className="text-white/40">{icon}</div>}
      </div>
      <div>
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
          {valueSuffix && <span className="text-lg font-medium text-white/50">{valueSuffix}</span>}
        </div>
        {subtitle && (
          <div className="mt-2 text-sm text-white/60">
            {subtitle}
          </div>
        )}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </GlassCard>
  );
}
