'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';
import { DashboardWelcome } from './dashboard-welcome';
import { StatsGrid } from './stats-grid';
import { RevenueOverview } from './revenue-overview';
import { AIReceptionistCard } from './ai-receptionist-card';
import { TodaysAppointments } from './todays-appointments';
import { RecentActivity } from './recent-activity';
import { BookingsByService } from './bookings-by-service';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col md:flex-row antialiased text-[#17213B]">
      {/* Fixed Left Sidebar (250px) */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePath="Dashboard"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F7FC]">
        {/* Top Header (64px) */}
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Dashboard Content Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-12 max-w-7xl w-full mx-auto">
          {/* 1. Welcome Header */}
          <DashboardWelcome />

          {/* 2. Statistics Cards */}
          <StatsGrid />

          {/* 3. Revenue Overview Recharts Card */}
          <RevenueOverview />

          {/* 4. AI Receptionist Mira Card */}
          <AIReceptionistCard />

          {/* 5. NEW: Today's Appointments */}
          <TodaysAppointments />

          {/* 6. NEW: Recent Activity */}
          <RecentActivity />

          {/* 7. NEW: Bookings By Service */}
          <BookingsByService />
        </main>
      </div>
    </div>
  );
}
