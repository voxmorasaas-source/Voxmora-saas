'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ReportsHeader } from './reports-header';
import { ReportsStatsGrid } from './reports-stats-grid';
import { RevenueTrendChart } from './revenue-trend-chart';
import { BookingChannelsCard } from './booking-channels-card';
import { StudioSettingsCard } from './studio-settings-card';

export function SettingsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F8FC] flex flex-col md:flex-row antialiased text-[#17213B]">
      {/* Fixed Left Sidebar with Reports & settings active */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePath="Reports & settings"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F8FC]">
        {/* Top Header */}
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Reports & Settings Main Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-12 max-w-7xl w-full mx-auto">
          {/* 1. Header (Reports & settings + Export report button) */}
          <ReportsHeader />

          {/* 2. 4 Statistics Cards (2x2 Grid) */}
          <ReportsStatsGrid />

          {/* 3. Revenue Trend Bar Chart */}
          <RevenueTrendChart />

          {/* 4. Booking Channels Progress Bars */}
          <BookingChannelsCard />

          {/* 5. Studio Settings 7 Navigation Rows */}
          <StudioSettingsCard />
        </main>
      </div>
    </div>
  );
}

