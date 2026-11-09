'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { BookingHeader } from './booking-header';
import { BookingWebsiteCard } from './booking-website-card';
import { BookingSettingsCard } from './booking-settings-card';
import { BookingPerformanceCard } from './booking-performance-card';

export function BookingLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F8FC] flex flex-col md:flex-row antialiased text-[#17213B]">
      {/* Fixed Left Sidebar with Online booking active */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePath="Online booking"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F8FC]">
        {/* Top Header */}
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Online Booking Page Main Content Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-12 max-w-7xl w-full mx-auto">
          {/* 1. Header (Title, Subtitle, Copy Booking Link Button) */}
          <BookingHeader />

          {/* 2. Your Booking Website Mockup Card */}
          <BookingWebsiteCard />

          {/* 3. Booking Settings Card with Toggles & Link */}
          <BookingSettingsCard />

          {/* 4. Booking Performance Metrics Card */}
          <BookingPerformanceCard />
        </main>
      </div>
    </div>
  );
}

