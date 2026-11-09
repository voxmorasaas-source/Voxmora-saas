'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StaffHeader } from './staff-header';
import { StaffFilterTabs, StaffTabType } from './staff-filter-tabs';
import { StaffMembersGrid } from './staff-members-grid';
import { ServiceCatalogTable } from './service-catalog-table';

export function StaffLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<StaffTabType>('team');

  return (
    <div className="min-h-screen bg-[#F8F8FC] flex flex-col md:flex-row antialiased text-[#17213B]">
      {/* Fixed Left Sidebar with Staff & services active */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePath="Staff & services"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F8FC]">
        {/* Top Header */}
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Staff & Services Main Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-12 max-w-7xl w-full mx-auto">
          {/* 1. Header (Staff & services + Add team member button) */}
          <StaffHeader />

          {/* 2. Pill Filter Tabs (Team members, Services, Shifts & availability) */}
          <StaffFilterTabs
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
          />

          {/* 3. 3 Staff Member Cards (Shown on 'team' and 'shifts') */}
          {activeTab !== 'services' && <StaffMembersGrid />}

          {/* 4. Service Catalog Table (Shown on 'services' and 'team') */}
          {activeTab !== 'shifts' && <ServiceCatalogTable />}
        </main>
      </div>
    </div>
  );
}

