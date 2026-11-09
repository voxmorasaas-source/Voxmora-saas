'use client';

import React from 'react';

export type StaffTabType = 'team' | 'services' | 'shifts';

interface StaffFilterTabsProps {
  activeTab: StaffTabType;
  onTabChange: (tab: StaffTabType) => void;
}

export function StaffFilterTabs({
  activeTab,
  onTabChange,
}: StaffFilterTabsProps) {
  return (
    <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => onTabChange('team')}
        className={`px-3.5 py-1 text-xs rounded-full font-semibold transition-colors shrink-0 ${
          activeTab === 'team'
            ? 'bg-[#F0EAFE] text-[#6946C7]'
            : 'bg-white border border-[#EAE8F2] text-[#8490A8] hover:border-[#D8CFEE] hover:text-[#17213B]'
        }`}
      >
        Team members
      </button>

      <button
        type="button"
        onClick={() => onTabChange('services')}
        className={`px-3.5 py-1 text-xs rounded-full font-medium transition-colors shrink-0 ${
          activeTab === 'services'
            ? 'bg-[#F0EAFE] text-[#6946C7] font-semibold'
            : 'bg-white border border-[#EAE8F2] text-[#8490A8] hover:border-[#D8CFEE] hover:text-[#17213B]'
        }`}
      >
        Services
      </button>

      <button
        type="button"
        onClick={() => onTabChange('shifts')}
        className={`px-3.5 py-1 text-xs rounded-full font-medium transition-colors shrink-0 ${
          activeTab === 'shifts'
            ? 'bg-[#F0EAFE] text-[#6946C7] font-semibold'
            : 'bg-white border border-[#EAE8F2] text-[#8490A8] hover:border-[#D8CFEE] hover:text-[#17213B]'
        }`}
      >
        Shifts & availability
      </button>
    </div>
  );
}

