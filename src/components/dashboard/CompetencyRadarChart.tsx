'use client';

import { useResultsStore } from '@/store/useResultsStore';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function CompetencyRadarChart() {
  const scores = useResultsStore((state) => state.competencyScores);
  
  const data = [
    { subject: 'Strategy', A: scores.strategy, fullMark: 100 },
    { subject: 'Technical', A: scores.technical, fullMark: 100 },
    { subject: 'Leadership', A: scores.leadership, fullMark: 100 },
    { subject: 'Communication', A: scores.communication, fullMark: 100 },
    { subject: 'Problem Solving', A: scores.problemSolving, fullMark: 100 },
  ];

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Radar name="Candidate" dataKey="A" stroke="#ffffff" strokeWidth={2} fill="#ffffff" fillOpacity={0.2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
