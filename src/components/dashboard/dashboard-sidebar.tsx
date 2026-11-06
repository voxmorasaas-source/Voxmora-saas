'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  LayoutDashboard,
  Calendar,
  Users,
  Globe,
  Bot,
  PhoneCall,
  Zap,
  CreditCard,
  Briefcase,
  Settings,
  ChevronDown,
  ArrowRight,
  X,
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activePath?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: 'new' | 'count';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    title: 'WORKSPACE',
    items: [
      { label: 'Dashboard', href: '#dashboard', icon: LayoutDashboard },
      { label: 'Calendar', href: '#calendar', icon: Calendar },
      { label: 'Clients', href: '#clients', icon: Users },
      { label: 'Online Booking', href: '#booking', icon: Globe },
    ],
  },
  {
    title: 'AI RECEPTIONIST',
    items: [
      {
        label: 'AI Receptionist',
        href: '#receptionist',
        icon: Bot,
        badge: 'NEW',
        badgeType: 'new',
      },
      {
        label: 'Calls & Messages',
        href: '#calls',
        icon: PhoneCall,
        badge: '3',
        badgeType: 'count',
      },
      { label: 'Automations', href: '#automations', icon: Zap },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { label: 'Sales & Payments', href: '#sales', icon: CreditCard },
      { label: 'Staff & Services', href: '#staff', icon: Briefcase },
      { label: 'Reports & Settings', href: '#settings', icon: Settings },
    ],
  },
];

export function DashboardSidebar({
  isOpen = false,
  onClose,
  activePath = 'Dashboard',
}: DashboardSidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#17213B]/30 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-10 h-screen w-[250px] min-w-[250px] bg-[#F8F6FF] border-r border-[#EAE6F2] p-4 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-xl md:shadow-none' : '-translate-x-full'
        }`}
      >
        {/* Top Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto pr-0.5">
          {/* Top Brand Section */}
          <div className="flex items-center justify-between pb-5 pt-1 px-2 border-b border-[#EAE6F2]/60 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[7px] bg-[#7652D6] flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-base font-bold text-[#17213B] tracking-tight">
                sereva
              </span>
            </div>

            {/* Mobile Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="md:hidden p-1.5 rounded-lg text-[#77758C] hover:bg-[#EDE5FF] hover:text-[#17213B] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Navigation Sections */}
          <nav className="space-y-4 pt-1">
            {navigationSections.map((section) => (
              <div key={section.title}>
                {/* Uppercase Section Header */}
                <h4 className="px-3 pb-1 text-[9px] font-bold uppercase tracking-wider text-[#9995AA]">
                  {section.title}
                </h4>

                {/* Items */}
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = activePath === item.label;
                    const Icon = item.icon;

                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          onClick={() => onClose?.()}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                            isActive
                              ? 'bg-[#EDE5FF] text-[#7048D8] font-semibold'
                              : 'text-[#77758C] hover:bg-[#F2EDFD] hover:text-[#17213B]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                isActive ? 'text-[#7048D8]' : 'text-[#77758C]'
                              }`}
                            />
                            <span>{item.label}</span>
                          </div>

                          {/* Badges */}
                          {item.badge && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                item.badgeType === 'new'
                                  ? 'bg-[#7652D6] text-white'
                                  : 'bg-[#EDE5FF] text-[#7048D8]'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Sidebar Content (Screenshot 2: Promotional Card & User Profile) */}
        <div className="mt-auto pt-3 shrink-0">
          {/* A. AI Receptionist Promotional Card */}
          <div className="bg-[#F5E9FF] border border-[#EBD5FF] rounded-[10px] p-3 mb-3 shadow-2xs">
            <div className="flex items-center gap-1.5 mb-1 text-[#17213B]">
              <Sparkles className="w-3.5 h-3.5 text-[#7652D6] fill-[#7652D6]" />
              <h5 className="text-xs font-bold tracking-tight">
                Meet your AI receptionist
              </h5>
            </div>
            <p className="text-[11px] text-[#858197] leading-snug mb-2.5">
              Never miss a booking, even after hours.
            </p>
            <button
              type="button"
              className="w-full py-1.5 px-3 bg-white border border-[#E0C6FC] rounded-lg text-xs font-semibold text-[#7652D6] hover:bg-[#FAF5FF] transition-colors inline-flex items-center justify-center gap-1 shadow-2xs"
            >
              <span>Explore Mira AI</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* B. User Profile Section */}
          <div className="pt-2.5 border-t border-[#EAE6F2]/70 flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EDE5FF] border border-[#D8CFEE] text-[#7048D8] font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
                SC
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-xs font-bold text-[#17213B] truncate leading-tight">
                  Sophie Carter
                </p>
                <p className="text-[10px] text-[#858197] truncate leading-none mt-0.5">
                  Studio owner
                </p>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#9995AA] shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
}
