'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/react/daygrid';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import interactionPlugin from '@fullcalendar/react/interaction';
import '@fullcalendar/react/skeleton.css';
import { toast } from 'sonner';
import {
  CalendarAppointment,
  STATUS_COLORS,
  DEFAULT_STAFF,
  DEFAULT_SERVICES,
} from './calendar-types';
import { CalendarHeader, CalendarViewType } from './calendar-header';
import { NewAppointmentModal } from './new-appointment-modal';
import { AppointmentDetailsModal } from './appointment-details-modal';
import { Bot, Globe, User, Clock, Scissors } from 'lucide-react';
import { parseISO, addMinutes, format } from 'date-fns';

export function CalendarView() {
  const calendarRef = useRef<any>(null);

  // View state
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [viewType, setViewType] = useState<CalendarViewType>('timeGridWeek');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Appointments data
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<string | undefined>();
  const [modalInitialStartTime, setModalInitialStartTime] = useState<string | undefined>();

  const [selectedAppointment, setSelectedAppointment] = useState<CalendarAppointment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Sync title from FullCalendar API
  const updateTitle = useCallback(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      setCurrentTitle(api.view.title);
    }
  }, []);

  // Fetch appointments from API
  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = `/api/appointments?_t=${Date.now()}`;
      if (selectedStaffId && selectedStaffId !== 'all') {
        url += `&staffId=${encodeURIComponent(selectedStaffId)}`;
      }
      if (selectedStatus && selectedStatus !== 'all') {
        url += `&status=${encodeURIComponent(selectedStatus)}`;
      }

      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppointments(data.data || []);
      } else {
        // Fallback to empty if not configured yet
        setAppointments([]);
      }
    } catch (err) {
      console.error('Error loading appointments:', err);
      toast.error('Failed to load appointments from server.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedStaffId, selectedStatus]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Initial title sync
  useEffect(() => {
    const timer = setTimeout(() => {
      updateTitle();
    }, 100);
    return () => clearTimeout(timer);
  }, [updateTitle, viewType]);

  // Navigation handlers
  const handlePrev = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
      updateTitle();
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
      updateTitle();
    }
  };

  const handleToday = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
      updateTitle();
    }
  };

  const handleViewChange = (newView: CalendarViewType) => {
    setViewType(newView);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(newView);
      updateTitle();
    }
  };

  // Convert appointments to FullCalendar format
  const fcEvents = useMemo(() => {
    return appointments.map((appt) => {
      const statusStyle = STATUS_COLORS[appt.status] || STATUS_COLORS.confirmed;
      return {
        id: appt.id,
        title: `${appt.client_name} - ${appt.service_name}`,
        start: appt.start_time,
        end: appt.end_time,
        backgroundColor: statusStyle.bg,
        borderColor: statusStyle.border,
        textColor: statusStyle.text,
        extendedProps: appt,
      };
    });
  }, [appointments]);

  // Handle Slot Selection / Click -> Open New Appointment Modal with prefilled date/time
  const handleDateSelect = (selectInfo: any) => {
    if (selectInfo?.view?.calendar) {
      selectInfo.view.calendar.unselect();
    }
    const startStr = selectInfo.startStr;
    if (startStr.includes('T')) {
      const [d, t] = startStr.split('T');
      setModalInitialDate(d);
      setModalInitialStartTime(t.slice(0, 5));
    } else {
      setModalInitialDate(startStr);
      setModalInitialStartTime('09:00');
    }
    setIsNewModalOpen(true);
  };

  // Handle Event Click -> Open Details Modal
  const handleEventClick = (clickInfo: any) => {
    const appt = clickInfo.event.extendedProps as CalendarAppointment;
    setSelectedAppointment(appt);
    setIsDetailsModalOpen(true);
  };

  // Drag and Drop Rescheduling
  const handleEventDrop = async (info: any) => {
    const { event, revert } = info;
    const apptId = event.id;
    const newStart = event.start?.toISOString();
    const newEnd = event.end
      ? event.end.toISOString()
      : addMinutes(parseISO(newStart), 60).toISOString();

    if (!newStart) {
      revert();
      return;
    }

    try {
      const res = await fetch(`/api/appointments/${apptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: newStart,
          endTime: newEnd,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Reschedule conflict or error');
      }

      toast.success('Appointment rescheduled successfully');
      setAppointments((prev) =>
        prev.map((a) => (a.id === apptId ? { ...a, ...data.data } : a))
      );
    } catch (err: any) {
      toast.error(err.message || 'Could not reschedule appointment. Time conflict.');
      revert();
    }
  };

  // Resize Duration
  const handleEventResize = async (info: any) => {
    const { event, revert } = info;
    const apptId = event.id;
    const newStart = event.start?.toISOString();
    const newEnd = event.end?.toISOString();

    if (!newStart || !newEnd) {
      revert();
      return;
    }

    try {
      const res = await fetch(`/api/appointments/${apptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: newStart,
          endTime: newEnd,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Duration resize error');
      }

      toast.success('Appointment duration updated');
      setAppointments((prev) =>
        prev.map((a) => (a.id === apptId ? { ...a, ...data.data } : a))
      );
    } catch (err: any) {
      toast.error(err.message || 'Could not resize appointment.');
      revert();
    }
  };

  // Custom Event Content Rendering
  const renderEventContent = (eventInfo: any) => {
    const appt = eventInfo.event.extendedProps as CalendarAppointment;
    const statusStyle = STATUS_COLORS[appt.status] || STATUS_COLORS.confirmed;

    return (
      <div
        className="h-full w-full p-1.5 flex flex-col justify-between overflow-hidden rounded-md border text-left cursor-pointer transition-shadow hover:shadow-md"
        style={{
          backgroundColor: statusStyle.bg,
          borderColor: statusStyle.border,
          color: statusStyle.text,
        }}
      >
        <div className="overflow-hidden">
          <div className="flex items-center justify-between gap-1 leading-tight">
            <span className="font-bold text-[11px] truncate">{appt.client_name}</span>
            {appt.booking_source === 'ai' && (
              <span title="Booked by Mira AI" className="shrink-0 text-[#7652D6]">
                <Bot className="w-3 h-3" />
              </span>
            )}
            {appt.booking_source === 'online' && (
              <span title="Booked Online" className="shrink-0 text-[#0284C7]">
                <Globe className="w-3 h-3" />
              </span>
            )}
          </div>
          <p className="text-[10px] font-medium opacity-90 truncate mt-0.5">
            {appt.service_name}
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] opacity-80 mt-1 pt-0.5 border-t border-black/5">
          <span>{eventInfo.timeText}</span>
          {appt.staff_name && (
            <span className="font-semibold truncate max-w-[50px]">{appt.staff_name.split(' ')[0]}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header with Controls & Filters */}
      <CalendarHeader
        currentTitle={currentTitle}
        viewType={viewType}
        onViewChange={handleViewChange}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onNewAppointment={() => {
          setModalInitialDate(new Date().toISOString().split('T')[0]);
          setModalInitialStartTime('09:00');
          setIsNewModalOpen(true);
        }}
        selectedStaffId={selectedStaffId}
        onStaffChange={setSelectedStaffId}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Main Calendar Card */}
      <div className="bg-white border border-[#E9E5F0] rounded-xl p-3 sm:p-5 shadow-2xs overflow-hidden relative">
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#E5E0F0] shadow-md text-xs font-semibold text-[#7652D6]">
              <div className="w-3.5 h-3.5 border-2 border-[#7652D6]/30 border-t-[#7652D6] rounded-full animate-spin" />
              <span>Updating calendar...</span>
            </div>
          </div>
        )}

        {/* FullCalendar Component */}
        <div className="sereva-fullcalendar min-h-[640px]">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={false}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            slotDuration="00:30:00"
            allDaySlot={false}
            nowIndicator={true}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={fcEvents}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            eventContent={renderEventContent}
            height="auto"
          />
        </div>

        {/* Calendar Legend Bar */}
        <div className="mt-4 pt-4 border-t border-[#F4F1FA] flex flex-wrap items-center justify-between gap-3 text-xs text-[#858197]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-[#17213B] text-[11px] uppercase tracking-wider">
              Status Legend:
            </span>
            {Object.entries(STATUS_COLORS).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border"
                  style={{ backgroundColor: val.bg, borderColor: val.border }}
                />
                <span className="text-[11px] font-medium text-[#17213B]">{val.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-medium text-[#858197]">💡 Tip: Click any time slot to schedule or drag to reschedule.</span>
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        initialDate={modalInitialDate}
        initialStartTime={modalInitialStartTime}
        onSuccess={(created) => {
          if (created && created.id) {
            setAppointments((prev) => [created, ...prev.filter((a) => a.id !== created.id)]);
          }
          fetchAppointments();
        }}
      />

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedAppointment(null);
        }}
        onUpdated={(updated) => {
          setAppointments((prev) =>
            prev.map((a) => (a.id === updated.id ? updated : a))
          );
          setSelectedAppointment(updated);

          // Synchronously move the event on FullCalendar immediately
          if (calendarRef.current) {
            const api = calendarRef.current.getApi();
            const event = api.getEventById(updated.id);
            if (event) {
              event.setDates(updated.start_time, updated.end_time);
              event.setExtendedProp('start_time', updated.start_time);
              event.setExtendedProp('end_time', updated.end_time);
              event.setExtendedProp('notes', updated.notes);
              event.setExtendedProp('staff_id', updated.staff_id);
              event.setExtendedProp('staff_name', updated.staff_name);
              event.setProp('title', `${updated.client_name} - ${updated.service_name}`);
            }
          }

          fetchAppointments();
        }}
        onDeleted={(deletedId) => {
          setAppointments((prev) => prev.filter((a) => a.id !== deletedId));
          setSelectedAppointment(null);
          fetchAppointments();
        }}
      />

      {/* Custom Styles for Sereva Calendar Palette */}
      <style jsx global>{`
        .sereva-fullcalendar .fc {
          font-family: inherit;
          --fc-border-color: #f1edf7;
          --fc-today-bg-color: #faf8ff;
          --fc-now-indicator-color: #7652d6;
        }
        .sereva-fullcalendar .fc-theme-standard th {
          background-color: #faf9fd;
          border-color: #e9e5f0;
          color: #17213b;
          font-size: 11px;
          font-weight: 700;
          padding: 8px 4px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .sereva-fullcalendar .fc-col-header-cell-cushion {
          color: #17213b;
          text-decoration: none;
        }
        .sereva-fullcalendar .fc-timegrid-slot-label {
          font-size: 11px;
          color: #858197;
          font-weight: 500;
        }
        .sereva-fullcalendar .fc-timegrid-slot {
          height: 38px !important;
          border-color: #f4f1fa !important;
        }
        .sereva-fullcalendar .fc-timegrid-slot:hover {
          background-color: #faf9fd;
        }
        .sereva-fullcalendar .fc-event {
          border-radius: 8px !important;
          border: none !important;
          background: transparent !important;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }
        .sereva-fullcalendar .fc-daygrid-day-number {
          font-size: 11px;
          color: #17213b;
          font-weight: 600;
          padding: 4px 6px;
        }
        .sereva-fullcalendar .fc-day-today {
          background-color: #f9f7fe !important;
        }
        .sereva-fullcalendar .fc-highlight {
          background-color: rgba(118, 82, 214, 0.08) !important;
        }
      `}</style>
    </div>
  );
}

