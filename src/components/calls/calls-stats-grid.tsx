'use client';

import React from 'react';

interface CallStat {
  label: string;
  value: string;
  subtitle: string;
}

const callStats: CallStat[] = [
  {
    label: 'TOTAL CALLS',
    value: '38',
    subtitle: 'Today',
  },
  {
    label: 'AI ANSWERED',
    value: '36',
    subtitle: '94.7% answer rate',
  },
  {
    label: 'BOOKED FROM CALLS',
    value: '12',
    subtitle: 'Today',
  },
  {
    label: 'CALLBACKS REQUIRED',
    value: '2',
    subtitle: 'Needs attention',
  },
];

export function CallsStatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
      {callStats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-4.5 shadow-2xs hover:border-[#D8CFEE] transition-colors"
        >
          <p className="text-[10px] uppercase font-semibold text-[#8490A8] tracking-wider">
            {stat.label}
          </p>
          <p className="text-2xl lg:text-[26px] font-bold text-[#17213B] tracking-tight my-1">
            {stat.value}
          </p>
          <p className="text-xs font-medium text-[#2FAE85]">{stat.subtitle}</p>
        </div>
      ))}
    </div>
  );
}

