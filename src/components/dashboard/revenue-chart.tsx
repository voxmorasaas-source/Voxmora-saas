'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts';

const weeklyData = [
  { day: 'Mon', revenue: 2100 },
  { day: 'Tue', revenue: 2840 },
  { day: 'Wed', revenue: 2450 },
  { day: 'Thu', revenue: 3200 },
  { day: 'Fri', revenue: 2700 },
  { day: 'Sat', revenue: 3800 },
  { day: 'Sun', revenue: 3300 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#17213B] text-white text-xs rounded-lg px-2.5 py-1.5 shadow-md">
        <p className="font-medium text-[#9995AA]">{label}</p>
        <p className="font-bold text-white text-sm">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

export function RevenueChart() {
  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={weeklyData}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="purpleBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9E7DF6" />
              <stop offset="100%" stopColor="#D8C8FD" />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            axisLine={{ stroke: '#EAE6F2' }}
            tickLine={false}
            tick={{ fill: '#8490A8', fontSize: 11, fontWeight: 500 }}
            dy={8}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(240, 234, 254, 0.4)', radius: 6 }}
          />
          <Bar
            dataKey="revenue"
            fill="url(#purpleBarGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={38}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


