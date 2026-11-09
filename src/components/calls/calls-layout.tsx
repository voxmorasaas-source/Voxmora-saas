'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { CallsHeader } from './calls-header';
import { CallsStatsGrid } from './calls-stats-grid';
import { CallsLogTable } from './calls-log-table';
import { LatestCallSummaryCard } from './latest-call-summary-card';
import { CallActivityCard } from './call-activity-card';

export function CallsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F8FC] flex flex-col md:flex-row antialiased text-[#17213B]">
      {/* Fixed Left Sidebar with Calls & messages active */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePath="Calls & messages"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F8FC]">
        {/* Top Header */}
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Calls & Conversations Main Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-12 max-w-7xl w-full mx-auto">
          {/* 1. Header (Title, Subtitle, Simulate AI Call Button) */}
          <CallsHeader />

          {/* 2. 4 Call Statistics Cards (2x2 Grid) */}
          <CallsStatsGrid />

          {/* 3. Calls Log Table with Filter Tabs */}
          <CallsLogTable />

          {/* 4. Latest Call Summary Card */}
          <LatestCallSummaryCard />

          {/* 5. Call Activity Progress Bars */}
          <CallActivityCard />
        </main>
      </div>
    </div>
  );
}

