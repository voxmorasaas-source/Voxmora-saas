import React from 'react';

export interface StatCardProps {
  title: string;
  value: string;
  supportingText: string;
  prefix?: string;
}

export function StatCard({
  title,
  value,
  supportingText,
  prefix = '↑',
}: StatCardProps) {
  return (
    <div className="bg-white border border-[#E9E5F0] rounded-[10px] p-4.5 hover:border-[#D8CFEE] transition-colors flex flex-col justify-between shadow-2xs">
      <div>
        <p className="text-[10px] uppercase tracking-wider font-semibold text-[#8490A8]">
          {title}
        </p>
        <p className="text-2xl lg:text-[26px] font-bold text-[#17213B] tracking-tight my-1">
          {value}
        </p>
      </div>
      <div className="flex items-center gap-1 text-xs font-medium text-[#13A58B] mt-1">
        <span>{prefix}</span>
        <span>{supportingText}</span>
      </div>
    </div>
  );
}


