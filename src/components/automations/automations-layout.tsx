'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { AutomationsHeader } from './automations-header';
import { NoShowHeroCard } from './no-show-hero-card';
import { NoShowWorkflowCard } from './no-show-workflow-card';
import { WorkflowPerformanceCard } from './workflow-performance-card';
import { OtherJourneysCard } from './other-journeys-card';

export function AutomationsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F8FC] flex flex-col md:flex-row antialiased text-[#17213B]">
      {/* Fixed Left Sidebar with Automations active */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePath="Automations"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F8FC]">
        {/* Top Header */}
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Automations Main Content Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-12 max-w-7xl w-full mx-auto">
          {/* 1. Header (Automations + New automation button) */}
          <AutomationsHeader />

          {/* 2. Hero Banner: Turn missed appointments into new bookings */}
          <NoShowHeroCard />

          {/* 3. No-show recovery workflow 4-step vertical timeline */}
          <NoShowWorkflowCard />

          {/* 4. Workflow Performance Metrics */}
          <WorkflowPerformanceCard />

          {/* 5. Other Automated Journeys Card */}
          <OtherJourneysCard />
        </main>
      </div>
    </div>
  );
}

