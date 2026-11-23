'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

// Dynamically import CalendarView with ssr: false to guarantee clean client-only mounting of FullCalendar
const CalendarView = dynamic(
  () => import('./calendar-view').then((mod) => mod.CalendarView),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white border border-[#E9E5F0] rounded-xl p-8 shadow-2xs flex flex-col items-center justify-center min-h-[640px]">
        <div className="flex items-center gap-2.5 text-xs font-semibold text-[#7652D6]">
          <div className="w-4 h-4 border-2 border-[#7652D6]/30 border-t-[#7652D6] rounded-full animate-spin" />
          <span>Loading appointment calendar...</span>
        </div>
      </div>
    ),
  }
);

export function CalendarLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F8FC] flex flex-col md:flex-row antialiased text-[#17213B]">
      {/* Fixed Left Sidebar with Calendar active */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePath="Calendar"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F8FC]">
        {/* Top Header */}
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Calendar Page Main Content Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-12 max-w-7xl w-full mx-auto">
          <CalendarView />
        </main>
      </div>
    </div>
  );
}

