import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string;
  supportingText: string;
  trendText?: string;
}

export function StatCard({ title, value, supportingText }: StatCardProps) {
  return (
    <div className="bg-white border border-[#EAE6F2] rounded-xl p-4.5 hover:border-[#D8CFEE] transition-colors flex flex-col justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-wider font-semibold text-[#9995AA]">
          {title}
        </p>
        <p className="text-2xl lg:text-[28px] font-bold text-[#17213B] tracking-tight my-1">
          {value}
        </p>
      </div>
      <div className="flex items-center gap-1 text-xs font-medium text-[#13A58B] mt-1">
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
        <span>{supportingText}</span>
      </div>
    </div>
  );
}

