'use client';

import React from 'react';

const performanceMetrics = [
  {
    value: '342',
    label: 'Bookings this month',
  },
  {
    value: '68%',
    label: 'Slot conversion',
  },
  {
    value: '4.8/5',
    label: 'Client rating',
  },
];

export function BookingPerformanceCard() {
  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-6 mb-8 shadow-2xs">
      <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-4">
        Booking performance
      </h2>

      {/* 3 Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-1">
        {performanceMetrics.map((metric) => (
          <div key={metric.label}>
            <p className="text-2xl sm:text-[26px] font-bold text-[#17213B] tracking-tight">
              {metric.value}
            </p>
            <p className="text-[11px] sm:text-xs text-[#8490A8] mt-1">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

