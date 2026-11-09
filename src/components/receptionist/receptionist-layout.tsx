'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ReceptionistHeader } from './receptionist-header';
import { ReceptionistHeroCard } from './receptionist-hero-card';
import { ReceptionistStatsGrid } from './receptionist-stats-grid';
import { ReceptionistConfigCard } from './receptionist-config-card';
import { ReceptionistCapabilitiesCard } from './receptionist-capabilities-card';
import { ReceptionistWorkflowCard } from './receptionist-workflow-card';

export function ReceptionistLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F8FC] flex flex-col md:flex-row antialiased text-[#17213B]">
      {/* Fixed Left Sidebar with AI receptionist active */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePath="AI receptionist"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F8FC]">
        {/* Top Header */}
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(true)} />

        {/* AI Receptionist Page Main Content Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-12 max-w-7xl w-full mx-auto">
          {/* 1. Header (Mira AI receptionist + Test a call button) */}
          <ReceptionistHeader />

          {/* 2. Meet Mira Hero Card with Active Toggle & Status */}
          <ReceptionistHeroCard />

          {/* 3. 4 Statistics Cards (2x2 Grid) */}
          <ReceptionistStatsGrid />

          {/* 4. Receptionist Configuration Card */}
          <ReceptionistConfigCard />

          {/* 5. What Mira Can Do (Capabilities Card) */}
          <ReceptionistCapabilitiesCard />

          {/* 6. How Mira Handles a Booking (3-Step Workflow) */}
          <ReceptionistWorkflowCard />
        </main>
      </div>
    </div>
  );
}

