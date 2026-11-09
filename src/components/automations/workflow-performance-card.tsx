'use client';

import React from 'react';

const performanceStats = [
  { value: '37.5%', label: 'Recovery rate' },
  { value: '$1,140', label: 'Recovered revenue' },
  { value: '15m', label: 'Call delay' },
];

export function WorkflowPerformanceCard() {
  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-5 sm:p-6 mb-4 shadow-2xs">
      <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-4">
        Workflow performance
      </h2>

      {/* Primary Highlight Metric */}
      <div>
        <p className="text-2xl sm:text-[26px] font-bold text-[#17213B] tracking-tight">
          12 <span className="text-lg sm:text-xl font-bold">appointments recovered</span>
        </p>
        <p className="text-xs text-[#8490A8] mt-1 mb-4">
          This month · 32 eligible no-shows
        </p>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-[#EEEAF3] rounded-full overflow-hidden mb-5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#7652D6] via-[#A855F7] to-[#F472B6] transition-all duration-500 ease-out"
          style={{ width: '37.5%' }}
        />
      </div>

      {/* 3 Metric Breakdown */}
      <div className="grid grid-cols-3 gap-4 pt-1 mb-4">
        {performanceStats.map((stat) => (
          <div key={stat.label}>
            <p className="text-base sm:text-lg font-bold text-[#17213B]">
              {stat.value}
            </p>
            <p className="text-[11px] text-[#8490A8] mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Safety Compliance Notice */}
      <div className="mt-4 p-3 sm:p-3.5 rounded-lg bg-[#FAF7FD] border border-[#EFEBF6]">
        <p className="text-xs text-[#6946C7] font-normal leading-relaxed">
          Calls are made only within your configured contact hours and according to customer communication preferences.
        </p>
      </div>
    </div>
  );
}

