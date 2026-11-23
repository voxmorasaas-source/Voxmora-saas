'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Menu, LogOut, Settings, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/auth/use-auth';

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const { profile, isAuthenticated, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-[56px] bg-white border-b border-[#EAE8F2] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left Search Bar & Mobile Trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-sm sm:max-w-md">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded-lg text-[#66708A] hover:bg-[#F8F6FF] hover:text-[#17213B] transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-[#8490A8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-white border border-[#EAE8F2] rounded-lg pl-8 pr-12 py-1.5 text-xs text-[#17213B] placeholder:text-[#8490A8] focus:outline-none focus:border-[#7652D6] transition-all"
          />
          <span className="hidden sm:inline-flex items-center absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-medium text-[#8490A8]">
            ⌘ K
          </span>
        </div>
      </div>

      {/* Right User Actions (Notification Pill [ ⬡ 3 ]  Help  (Avatar)) */}
      <div className="flex items-center gap-3 sm:gap-4 relative" ref={menuRef}>
        {/* Outlined Notification/Reward Pill [ ⬡ 3 ] */}
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#EAE8F2] bg-white hover:bg-[#FAF8FF] text-xs font-semibold text-[#7652D6] transition-colors shadow-2xs"
          aria-label="3 notifications"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#7652D6] fill-[#7652D6]" />
          <span>3</span>
        </button>

        {/* Help Link */}
        <Link
          href="#help"
          className="text-xs font-medium text-[#66708A] hover:text-[#17213B] transition-colors"
        >
          Help
        </Link>

        {/* Circular User Avatar with Initials */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-7 h-7 rounded-full bg-[#EDE5FF] text-[#7048D8] font-bold text-[11px] flex items-center justify-center shadow-2xs cursor-pointer hover:ring-2 hover:ring-[#7652D6]/20 transition-all focus:outline-none"
          title={profile.fullName}
          aria-label="User menu"
        >
          {profile.initials}
        </button>

        {/* Header User Dropdown */}
        {menuOpen && (
          <div className="absolute right-0 top-10 w-48 bg-white rounded-xl border border-[#EAE8F2] shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-2.5 py-2 border-b border-[#F4F1FA]">
              <p className="text-xs font-bold text-[#17213B] truncate">
                {profile.fullName}
              </p>
              {profile.email && (
                <p className="text-[11px] text-[#858197] truncate mt-0.5">
                  {profile.email}
                </p>
              )}
            </div>

            <div className="py-1">
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#66708A] hover:text-[#17213B] hover:bg-[#FAF9FD] rounded-lg transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Studio settings</span>
              </Link>

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={async () => {
                    setMenuOpen(false);
                    await signOut();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#D32F2F] hover:bg-[#FFF2F2] rounded-lg transition-colors text-left font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[#7652D6] hover:bg-[#F2EDFD] rounded-lg transition-colors font-medium"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign in</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
