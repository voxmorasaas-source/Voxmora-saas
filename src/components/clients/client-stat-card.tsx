import React from 'react';

export interface ClientStatCardProps {
  label: string;
  value: string;
  supportingText: string;
  hasArrow?: boolean;
}

export function ClientStatCard({
  label,
  value,
  supportingText,
  hasArrow = true,
}: ClientStatCardProps) {
  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[9px] p-4 flex flex-col justify-between shadow-2xs hover:border-[#D8CFEE] transition-colors">
      <div>
        <p className="text-[10px] uppercase font-semibold text-[#8490A8] tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-bold text-[#17213B] tracking-tight my-1">
          {value}
        </p>
      </div>
      <div className="flex items-center gap-1 text-xs font-medium text-[#2FAE85] mt-0.5">
        {hasArrow && <span>↑</span>}
        <span>{supportingText}</span>
      </div>
    </div>
  );
}


