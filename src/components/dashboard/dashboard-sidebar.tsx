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
        <div className="flex-1 overflow-y-auto">
          {/* Top Brand Section */}
          <div className="flex items-center justify-between pb-6 pt-1 px-2 border-b border-[#EAE6F2]/60 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[7px] bg-[#7652D6] flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-base font-bold text-[#17213B] tracking-tight">
                Qallivra
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
          <nav className="space-y-5 pt-2">
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

        {/* Bottom Profile / Quick Info Card */}
        <div className="pt-3 border-t border-[#EAE6F2]/60 mt-2 px-1">
          <div className="bg-white border border-[#EAE6F2] rounded-xl p-2.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EDE5FF] text-[#7048D8] font-bold text-xs flex items-center justify-center">
                JM
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-xs font-semibold text-[#17213B] truncate leading-tight">
                  Glow MedSpa
                </p>
                <p className="text-[10px] text-[#9995AA] truncate leading-none">
                  Starter Plan
                </p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#13A58B]" title="System Online" />
          </div>
        </div>
      </aside>
    </>
  );
}

