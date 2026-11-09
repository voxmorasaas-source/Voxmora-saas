'use client';

import React from 'react';

interface ReportStat {
  label: string;
  value: string;
  subtitle: string;
}

const reportsStatsData: ReportStat[] = [
  {
    label: 'GROSS REVENUE',
    value: '$42,850',
    subtitle: 'This month',
  },
  {
    label: 'TOTAL BOOKINGS',
    value: '486',
    subtitle: 'This month',
  },
  {
    label: 'NO-SHOW RATE',
    value: '6.4%',
    subtitle: '↓ 2.1%',
  },
  {
    label: 'CLIENT RETENTION',
    value: '72%',
    subtitle: '↑ 4.2%',
  },
];

export function ReportsStatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
      {reportsStatsData.map((stat) => (
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

