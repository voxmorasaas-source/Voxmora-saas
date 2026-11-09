'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts';

const trendData = [
  { day: 'Mon', revenue: 2800 },
  { day: 'Tue', revenue: 5200 },
  { day: 'Wed', revenue: 4100 },
  { day: 'Thu', revenue: 6400 },
  { day: 'Fri', revenue: 4900 },
  { day: 'Sat', revenue: 7800 },
  { day: 'Sun', revenue: 6800 },
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

export function RevenueTrendChart() {
  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-5 mb-4 shadow-2xs">
      <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-2">
        Revenue trend
      </h2>

      {/* Metric Highlight */}
      <div className="mb-3">
        <span className="text-2xl lg:text-[28px] font-bold text-[#17213B] tracking-tight">
          $42,850
        </span>
      </div>

      {/* Bar Chart */}
      <div className="w-full h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={trendData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="trendPurpleGradient" x1="0" y1="0" x2="0" y2="1">
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
              fill="url(#trendPurpleGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

