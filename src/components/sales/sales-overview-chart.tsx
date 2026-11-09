'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts';

const weeklySalesData = [
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

export function SalesOverviewChart() {
  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-5 mb-4 shadow-2xs">
      <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-3">
        Sales overview
      </h2>

      {/* Revenue Metric Row */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl lg:text-[28px] font-bold text-[#17213B] tracking-tight">
          $18,420
        </span>
        <span className="text-xs font-semibold text-[#13A58B]">
          ↑ 16.4%
        </span>
      </div>

      {/* Bar Chart */}
      <div className="w-full h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeklySalesData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesPurpleGradient" x1="0" y1="0" x2="0" y2="1">
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
              fill="url(#salesPurpleGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

