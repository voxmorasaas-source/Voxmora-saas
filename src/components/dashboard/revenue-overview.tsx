import React from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { RevenueChart } from './revenue-chart';

export function RevenueOverview() {
  return (
    <div className="bg-white border border-[#E9E5F0] rounded-xl p-4 sm:p-5 mb-3 shadow-2xs">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-[#17213B] tracking-tight">
          Revenue overview
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#77758C] bg-[#F8F6FF] border border-[#EAE6F2] rounded-lg hover:border-[#D8CFEE] hover:text-[#17213B] transition-colors"
        >
          <span>This week</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#9995AA]" />
        </button>
      </div>

      {/* Revenue Metric Row */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-2xl lg:text-[28px] font-bold text-[#17213B] tracking-tight">
          $18,420
        </span>
        <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#13A58B] bg-[#E6F8F4] px-2 py-0.5 rounded-full">
          <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
          <span>16.4%</span>
        </div>
      </div>

      {/* Chart */}
      <RevenueChart />
    </div>
  );
}

