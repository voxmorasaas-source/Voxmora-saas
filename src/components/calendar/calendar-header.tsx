'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Filter,
  Users,
  CheckCircle,
} from 'lucide-react';
import { DEFAULT_STAFF, StaffOption } from './calendar-types';

export type CalendarViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';

interface CalendarHeaderProps {
  currentTitle: string;
  viewType: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onNewAppointment: () => void;
  selectedStaffId: string;
  onStaffChange: (staffId: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export function CalendarHeader({
  currentTitle,
  viewType,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onNewAppointment,
  selectedStaffId,
  onStaffChange,
  selectedStatus,
  onStatusChange,
}: CalendarHeaderProps) {
  return (
    <div className="space-y-4 mb-5">
      {/* Top row: Title and "+ New Appointment" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#17213B] tracking-tight">
            Appointment Calendar
          </h1>
          <p className="text-sm text-[#8490A8] mt-0.5">
            Manage your bookings, specialist schedules, and real-time studio availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onNewAppointment}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7652D6] hover:bg-[#6540C3] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New appointment</span>
          </button>
        </div>
      </div>

      {/* Second row: Navigation, View Toggle, and Filters */}
      <div className="bg-white border border-[#E9E5F0] rounded-xl p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Navigation and Current Date heading */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center border border-[#E5E0F0] rounded-lg overflow-hidden bg-white shadow-2xs">
            <button
              type="button"
              onClick={onPrev}
              title="Previous"
              className="p-1.5 text-[#858197] hover:text-[#17213B] hover:bg-[#FAF9FD] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-[#E5E0F0]" />
            <button
              type="button"
              onClick={onNext}
              title="Next"
              className="p-1.5 text-[#858197] hover:text-[#17213B] hover:bg-[#FAF9FD] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onToday}
            className="px-3 py-1.5 text-xs font-semibold text-[#17213B] bg-white border border-[#E5E0F0] rounded-lg hover:border-[#D8CFEE] hover:bg-[#FAF9FD] transition-colors shadow-2xs"
          >
            Today
          </button>

          <span className="text-sm sm:text-base font-bold text-[#17213B] tracking-tight ml-1 sm:ml-2">
            {currentTitle || 'Calendar'}
          </span>
        </div>

        {/* Right: Filters & View Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Staff Filter */}
          <div className="relative">
            <select
              value={selectedStaffId}
              onChange={(e) => onStaffChange(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs font-medium text-[#17213B] bg-[#FDFCFE] border border-[#E5E0F0] rounded-lg focus:outline-none focus:border-[#7652D6] appearance-none"
            >
              <option value="all">All Specialists</option>
              {DEFAULT_STAFF.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
            <Users className="w-3.5 h-3.5 text-[#858197] absolute left-2 top-2 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs font-medium text-[#17213B] bg-[#FDFCFE] border border-[#E5E0F0] rounded-lg focus:outline-none focus:border-[#7652D6] appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked in</option>
              <option value="in_progress">In progress</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No show</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-[#858197] absolute left-2 top-2 pointer-events-none" />
          </div>

          {/* View Switcher: Day, Week, Month */}
          <div className="flex items-center p-0.5 bg-[#F2EFF8] rounded-lg border border-[#E8E2F2]">
            <button
              type="button"
              onClick={() => onViewChange('timeGridDay')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewType === 'timeGridDay'
                  ? 'bg-white text-[#7652D6] shadow-2xs'
                  : 'text-[#858197] hover:text-[#17213B]'
              }`}
            >
              Day
            </button>
            <button
              type="button"
              onClick={() => onViewChange('timeGridWeek')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewType === 'timeGridWeek'
                  ? 'bg-white text-[#7652D6] shadow-2xs'
                  : 'text-[#858197] hover:text-[#17213B]'
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => onViewChange('dayGridMonth')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewType === 'dayGridMonth'
                  ? 'bg-white text-[#7652D6] shadow-2xs'
                  : 'text-[#858197] hover:text-[#17213B]'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

