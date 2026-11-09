import React from 'react';
import { ClientStatCard } from './client-stat-card';

const clientStats = [
  {
    label: 'TOTAL CLIENTS',
    value: '1,284',
    supportingText: '8.2% this month',
    hasArrow: true,
  },
  {
    label: 'RETURNING CLIENTS',
    value: '72%',
    supportingText: '4.1%',
    hasArrow: true,
  },
  {
    label: 'AVERAGE LIFETIME VALUE',
    value: '$428',
    supportingText: '9.5%',
    hasArrow: true,
  },
  {
    label: 'BIRTHDAYS THIS WEEK',
    value: '6',
    supportingText: 'Upcoming',
    hasArrow: false,
  },
];

export function ClientStatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
      {clientStats.map((stat) => (
        <ClientStatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          supportingText={stat.supportingText}
          hasArrow={stat.hasArrow}
        />
      ))}
    </div>
  );
}

