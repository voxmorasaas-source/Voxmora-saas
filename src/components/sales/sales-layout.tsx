'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { SalesHeader } from './sales-header';
import { SalesStatsGrid } from './sales-stats-grid';
import { SalesOverviewChart } from './sales-overview-chart';
import { PaymentMethodsCard } from './payment-methods-card';
import { RecentTransactionsTable } from './recent-transactions-table';

export function SalesLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F8FC] flex flex-col md:flex-row antialiased text-[#17213B]">
      {/* Fixed Left Sidebar with Sales & payments active */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePath="Sales & payments"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F8FC]">
        {/* Top Header */}
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Sales & Payments Main Content Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-12 max-w-7xl w-full mx-auto">
          {/* 1. Header (Sales & payments + New checkout button) */}
          <SalesHeader />

          {/* 2. 4 Statistics Cards (2x2 Grid) */}
          <SalesStatsGrid />

          {/* 3. Sales Overview Chart */}
          <SalesOverviewChart />

          {/* 4. Payment Methods Card */}
          <PaymentMethodsCard />

          {/* 5. Recent Transactions Table */}
          <RecentTransactionsTable />
        </main>
      </div>
    </div>
  );
}

