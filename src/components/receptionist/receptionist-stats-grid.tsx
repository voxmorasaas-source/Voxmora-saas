'use client';

import React from 'react';

interface ReceptionistStat {
  title: string;
  value: string;
  subtitle: string;
}

const statsData: ReceptionistStat[] = [
  {
    title: 'CALLS ANSWERED',
    value: '38',
    subtitle: 'Today',
  },
  {
    title: 'APPOINTMENTS BOOKED',
    value: '12',
    subtitle: 'Through Mira',
  },
  {
    title: 'MISSED CALLS',
    value: '0',
    subtitle: 'Today',
  },
  {
    title: 'AVG. CALL DURATION',
    value: '2:18',
    subtitle: 'Minutes',
  },
];

export function ReceptionistStatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
      {statsData.map((stat) => (
        <div
          key={stat.title}
          className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-4.5 shadow-2xs hover:border-[#D8CFEE] transition-colors"
        >
          <p className="text-[10px] uppercase font-semibold text-[#8490A8] tracking-wider">
            {stat.title}
          </p>
          <p className="text-2xl lg:text-[26px] font-bold text-[#17213B] tracking-tight my-1">
            {stat.value}
          </p>
          <p className="text-xs text-[#8490A8]">{stat.subtitle}</p>
        </div>
      ))}
    </div>
  );
}

