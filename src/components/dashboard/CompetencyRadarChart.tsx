'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface CompetencyRadarChartProps {
  scores: {
    technical: number;
    communication: number;
    behavioral: number;
    time_management: number;
    jd_match: number;
  }
}

export function CompetencyRadarChart({ scores }: CompetencyRadarChartProps) {
  
  const data = [
    { subject: 'Technical', A: scores.technical, fullMark: 100 },
    { subject: 'Communication', A: scores.communication, fullMark: 100 },
    { subject: 'Behavioral', A: scores.behavioral, fullMark: 100 },
    { subject: 'Time Mgmt', A: scores.time_management, fullMark: 100 },
    { subject: 'JD Match', A: scores.jd_match, fullMark: 100 },
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
