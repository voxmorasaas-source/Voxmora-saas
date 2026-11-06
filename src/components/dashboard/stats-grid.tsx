import React from 'react';
import { StatCard } from './stat-card';

const statsData = [
  {
    title: "TODAY'S REVENUE",
    value: "$2,840",
    supportingText: "12.8% vs last week",
  },
  {
    title: "APPOINTMENTS",
    value: "24",
    supportingText: "4 new bookings",
  },
  {
    title: "NEW CLIENTS",
    value: "8",
    supportingText: "18% this month",
  },
  {
    title: "AI BOOKINGS",
    value: "12",
    supportingText: "50% of today's bookings",
  },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3">
      {statsData.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          supportingText={stat.supportingText}
        />
      ))}
    </div>
  );
}

