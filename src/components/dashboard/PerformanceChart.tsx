'use client';

import { useAnalyticsStore } from '@/store/useAnalyticsStore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';

export function PerformanceChart() {
  const data = useAnalyticsStore((state) => state.performanceTrajectory);

  return (
    <GlassCard className="p-6 h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Performance Trajectory</h3>
        <div className="flex space-x-2 text-xs font-medium text-white/50">
          <button className="px-3 py-1 rounded-full bg-white/10 text-white">1M</button>
          <button className="px-3 py-1 rounded-full hover:text-white transition-colors">3M</button>
          <button className="px-3 py-1 rounded-full hover:text-white transition-colors">ALL</button>
        </div>
      </div>
      <div className="flex-1 w-full min-h-0 flex items-center justify-center relative">
        {data.length === 0 ? (
          <div className="text-white/50 text-sm">No analytics data available.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10,10,10,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#ffffff" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
                activeDot={{ r: 6, fill: '#fff', stroke: '#000', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </GlassCard>
  );
}
