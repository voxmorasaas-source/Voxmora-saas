'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';
import { DashboardWelcome } from './dashboard-welcome';
import { StatsGrid } from './stats-grid';
import { RevenueOverview } from './revenue-overview';
import { AIReceptionistCard } from './ai-receptionist-card';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row antialiased text-[#17213B]">
      {/* Fixed Left Sidebar (250px) */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePath="Dashboard"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Header (64px) */}
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Dashboard Content Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-12 max-w-7xl w-full mx-auto">
          {/* Welcome Header */}
          <DashboardWelcome />

          {/* 4 Statistics Cards */}
          <StatsGrid />

          {/* Revenue Overview Recharts Card */}
          <RevenueOverview />

          {/* AI Receptionist Mira Card */}
          <AIReceptionistCard />
        </main>
      </div>
    </div>
  );
}

