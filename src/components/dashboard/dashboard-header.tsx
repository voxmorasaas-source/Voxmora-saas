'use client';

import React from 'react';
import { Search, Sparkles, HelpCircle, Menu } from 'lucide-react';

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  return (
    <header className="h-[56px] bg-white border-b border-[#EAE8F2] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left Search Bar & Mobile Trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-sm sm:max-w-md">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded-lg text-[#66708A] hover:bg-[#F8F6FF] hover:text-[#17213B] transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-[#8490A8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-white border border-[#EAE8F2] rounded-lg pl-8 pr-12 py-1.5 text-xs text-[#17213B] placeholder:text-[#8490A8] focus:outline-none focus:border-[#7652D6] transition-all"
          />
          <span className="hidden sm:inline-flex items-center absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-[#8490A8]">
            ⌘ K
          </span>
        </div>
      </div>

      {/* Right User Actions (Screenshot 1 & 3: [ ⬡ 3 ]  Help  (SC)) */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Outlined Notification/Reward Pill [ ⬡ 3 ] */}
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#EAE8F2] bg-white hover:bg-[#FAF8FF] text-xs font-semibold text-[#7652D6] transition-colors shadow-2xs"
          aria-label="3 notifications"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#7652D6] fill-[#7652D6]" />
          <span>3</span>
        </button>

        {/* Help Link */}
        <a
          href="#help"
          className="text-xs font-medium text-[#66708A] hover:text-[#17213B] transition-colors"
        >
          Help
        </a>

        {/* Circular User Avatar with Initials SC */}
        <div
          className="w-7 h-7 rounded-full bg-[#EDE5FF] text-[#7048D8] font-bold text-[11px] flex items-center justify-center shadow-2xs cursor-pointer hover:ring-2 hover:ring-[#7652D6]/20 transition-all"
          title="Sophie Carter"
        >
          SC
        </div>
      </div>
    </header>
  );
}


