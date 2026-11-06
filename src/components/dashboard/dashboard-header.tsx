'use client';

import React from 'react';
import { Search, Bell, HelpCircle, Menu } from 'lucide-react';

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-[#EEEAF4] px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left Search Bar & Mobile Trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-[#77758C] hover:bg-[#F8F6FF] hover:text-[#17213B] transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#9995AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-[#F8F6FF] border border-[#EAE6F2] rounded-lg pl-9 pr-14 py-2 text-[13px] text-[#17213B] placeholder:text-[#9995AA] focus:outline-none focus:border-[#7652D6] focus:bg-white transition-all"
          />
          <span className="hidden sm:inline-flex items-center absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-[#9995AA] bg-white border border-[#EAE6F2] px-1.5 py-0.5 rounded shadow-2xs">
            ⌘ K
          </span>
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-4">
        {/* Help Link */}
        <a
          href="#help"
          className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-[#77758C] hover:text-[#17213B] transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-[#9995AA]" />
          <span>Help</span>
        </a>

        {/* Notifications Icon with Badge */}
        <button
          type="button"
          className="relative p-2 rounded-lg text-[#77758C] hover:bg-[#F8F6FF] hover:text-[#17213B] transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7652D6] rounded-full ring-2 ring-white"></span>
        </button>

        {/* Divider */}
        <div className="h-5 w-[1px] bg-[#EEEAF4]" />

        {/* Circular User Avatar with Initials */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#EDE5FF] border border-[#D8CFEE] text-[#7048D8] font-bold text-xs flex items-center justify-center shadow-2xs">
            JM
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-[#17213B] leading-tight">Jenil M.</p>
            <p className="text-[10px] text-[#77758C] leading-none">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

