'use client';

import React from 'react';

interface SalesStat {
  label: string;
  value: string;
  subtitle: string;
}

const salesStatsData: SalesStat[] = [
  {
    label: "TODAY'S SALES",
    value: '$2,840',
    subtitle: '↑ 12.8%',
  },
  {
    label: 'TRANSACTIONS',
    value: '32',
    subtitle: 'Today',
  },
  {
    label: 'AVERAGE TICKET',
    value: '$88.75',
    subtitle: '↑ 6.2%',
  },
  {
    label: 'OUTSTANDING',
    value: '$340',
    subtitle: '4 invoices',
  },
];

export function SalesStatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
      {salesStatsData.map((stat) => (
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

