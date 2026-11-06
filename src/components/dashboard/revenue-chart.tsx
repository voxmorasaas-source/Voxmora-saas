'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const weeklyData = [
  { day: 'Mon', revenue: 2100 },
  { day: 'Tue', revenue: 2840 },
  { day: 'Wed', revenue: 2450 },
  { day: 'Thu', revenue: 3200 },
  { day: 'Fri', revenue: 3800 },
  { day: 'Sat', revenue: 2650 },
  { day: 'Sun', revenue: 1380 },
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
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={weeklyData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="purpleBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7652D6" />
              <stop offset="100%" stopColor="#C4B5FD" />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="#F4F1FA"
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9995AA', fontSize: 12, fontWeight: 500 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9995AA', fontSize: 11 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(237, 229, 255, 0.4)', radius: 6 }}
          />
          <Bar
            dataKey="revenue"
            fill="url(#purpleBarGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={42}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

