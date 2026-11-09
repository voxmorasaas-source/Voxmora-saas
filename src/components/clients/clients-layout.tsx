'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ClientsHeader } from './clients-header';
import { ClientStatsGrid } from './client-stats-grid';
import { ClientDirectoryTable } from './client-directory-table';

export function ClientsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F8FC] flex flex-col md:flex-row antialiased text-[#17213B]">
      {/* Fixed Left Sidebar with Clients active */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePath="Clients"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F8FC]">
        {/* Top Header */}
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Clients Page Main Content Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-12 max-w-7xl w-full mx-auto">
          {/* 1. Clients Page Header */}
          <ClientsHeader />

          {/* 2. 2-Column Grid with 4 Client Statistic Cards */}
          <ClientStatsGrid />

          {/* 3. Client Directory Table */}
          <ClientDirectoryTable />
        </main>
      </div>
    </div>
  );
}

