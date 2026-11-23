'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Scissors,
  DollarSign,
  Phone,
  Mail,
  Bot,
  Globe,
  FileText,
  Trash2,
  Edit2,
  CheckCircle,
  PlayCircle,
  CheckCheck,
  UserX,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  CalendarAppointment,
  AppointmentStatus,
  STATUS_COLORS,
  DEFAULT_STAFF,
} from './calendar-types';
import { format, parseISO } from 'date-fns';

interface AppointmentDetailsModalProps {
  appointment: CalendarAppointment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updated: CalendarAppointment) => void;
  onDeleted: (appointmentId: string) => void;
}

export function AppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
  onUpdated,
  onDeleted,
}: AppointmentDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit form state
  const [editDate, setEditDate] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editDuration, setEditDuration] = useState(60);
  const [editStaffId, setEditStaffId] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Prevent background scrolling and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !appointment) return null;

  const statusConfig = STATUS_COLORS[appointment.status] || STATUS_COLORS.confirmed;

  let formattedDate = '';
  let formattedTime = '';
  try {
    const start = parseISO(appointment.start_time);
    const end = parseISO(appointment.end_time);
    formattedDate = format(start, 'EEEE, MMMM d, yyyy');
    formattedTime = `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
  } catch (e) {
    formattedDate = appointment.start_time;
  }

  const startEditMode = () => {
    try {
      const start = parseISO(appointment.start_time);
      setEditDate(format(start, 'yyyy-MM-dd'));
      setEditStartTime(format(start, 'HH:mm'));
      setEditDuration(appointment.duration_minutes || 60);
      setEditStaffId(appointment.staff_id || DEFAULT_STAFF[0].id);
      setEditNotes(appointment.notes || '');
      setIsEditing(true);
    } catch {
      setIsEditing(true);
    }
  };

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update status');
      }
      toast.success(`Appointment marked as ${STATUS_COLORS[newStatus]?.label || newStatus}`);
      onUpdated(data.data);
    } catch (err: any) {
      toast.error(err.message || 'Status update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to cancel appointment');
      }
      toast.success('Appointment cancelled');
      onDeleted(appointment.id);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Cancellation failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const [h, m] = editStartTime.split(':').map(Number);
      const startDateTime = new Date(`${editDate}T00:00:00`);
      startDateTime.setHours(h, m, 0, 0);

      const endDateTime = new Date(startDateTime.getTime() + editDuration * 60 * 1000);
      const selectedStaff = DEFAULT_STAFF.find((s) => s.id === editStaffId);

      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          durationMinutes: editDuration,
          staffId: editStaffId,
          staffName: selectedStaff ? selectedStaff.name : appointment.staff_name,
          notes: editNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to reschedule appointment');
      }

      toast.success('Appointment updated successfully');
      onUpdated(data.data);
      setIsEditing(false);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#17213B]/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative bg-white rounded-2xl border border-[#E9E5F0] w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header - Fixed at top, never cut off */}
        <div className="shrink-0 px-6 py-4 bg-[#FAF9FD] border-b border-[#F0ECF8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold border shadow-2xs"
              style={{
                backgroundColor: statusConfig.bg,
                color: statusConfig.text,
                borderColor: statusConfig.border,
              }}
            >
              {statusConfig.label}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#858197]">
              {appointment.booking_source === 'ai' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EDE5FF] text-[#7048D8] font-medium text-[11px]">
                  <Bot className="w-3 h-3" /> Mira AI
                </span>
              )}
              {appointment.booking_source === 'online' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7] font-medium text-[11px]">
                  <Globe className="w-3 h-3" /> Online Web
                </span>
              )}
              {appointment.booking_source === 'manual' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] font-medium text-[11px]">
                  Manual
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#858197] hover:text-[#17213B] hover:bg-[#EFEBF7] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSaveEdit} className="p-5 sm:p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#17213B]">Reschedule or Edit Appointment</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17213B] mb-1">Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs text-[#17213B] bg-white border border-[#E5E0F0] rounded-lg focus:outline-none focus:border-[#7652D6]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17213B] mb-1">Start Time</label>
                  <input
                    type="time"
                    step="900"
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs text-[#17213B] bg-white border border-[#E5E0F0] rounded-lg focus:outline-none focus:border-[#7652D6]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17213B] mb-1">Specialist</label>
                  <select
                    value={editStaffId}
                    onChange={(e) => setEditStaffId(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs text-[#17213B] bg-white border border-[#E5E0F0] rounded-lg focus:outline-none focus:border-[#7652D6]"
                  >
                    {DEFAULT_STAFF.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17213B] mb-1">Duration</label>
                  <select
                    value={editDuration}
                    onChange={(e) => setEditDuration(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs text-[#17213B] bg-white border border-[#E5E0F0] rounded-lg focus:outline-none focus:border-[#7652D6]"
                  >
                    <option value={30}>30 mins</option>
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins (1 hr)</option>
                    <option value={75}>75 mins</option>
                    <option value={90}>90 mins</option>
                    <option value={120}>120 mins</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17213B] mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-2.5 text-xs text-[#17213B] bg-white border border-[#E5E0F0] rounded-lg focus:outline-none focus:border-[#7652D6] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F0ECF8]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-[#77758C] bg-white border border-[#E5E0F0] rounded-lg hover:border-[#D8CFEE] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#7652D6] hover:bg-[#6540C3] rounded-lg shadow-2xs disabled:opacity-60 cursor-pointer"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            /* View Details */
            <div className="p-5 sm:p-6 space-y-4">
              {/* Client Info Card */}
              <div className="flex items-start justify-between bg-[#FAF9FD] border border-[#EFEBF6] rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#EAE2FB] text-[#7652D6] font-bold text-sm flex items-center justify-center shadow-2xs">
                    {appointment.client_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#17213B]">{appointment.client_name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#858197] mt-0.5">
                      {appointment.client_phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {appointment.client_phone}
                        </span>
                      )}
                      {appointment.client_email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {appointment.client_email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[#17213B]">
                    ${(appointment.price_cents / 100).toFixed(2)}
                  </span>
                  <p className="text-[11px] text-[#858197]">{appointment.duration_minutes} min</p>
                </div>
              </div>

              {/* Service & Staff Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-[#EFEBF6] rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#858197] block mb-1">
                    Service
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#17213B]">
                    <Scissors className="w-3.5 h-3.5 text-[#7652D6]" />
                    <span>{appointment.service_name}</span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#EFEBF6] rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#858197] block mb-1">
                    Specialist
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#17213B]">
                    <User className="w-3.5 h-3.5 text-[#7652D6]" />
                    <span>{appointment.staff_name || 'Assigned Staff'}</span>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="p-3.5 bg-white border border-[#EFEBF6] rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-[#17213B]">
                  <Calendar className="w-3.5 h-3.5 text-[#7652D6]" />
                  <span className="font-semibold">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#858197]">
                  <Clock className="w-3.5 h-3.5 text-[#7652D6]" />
                  <span>{formattedTime}</span>
                </div>
              </div>

              {/* Notes if any */}
              {appointment.notes && (
                <div className="p-3 bg-[#FAF9FD] border border-[#EFEBF6] rounded-xl text-xs text-[#17213B]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#858197] block mb-1">
                    Notes
                  </span>
                  <p className="text-xs text-[#686777] italic">{appointment.notes}</p>
                </div>
              )}

              {/* Bland AI Call Follow-up indicator if triggered */}
              {appointment.follow_up_status && (
                <div className="p-3 bg-[#F0E9FF] border border-[#D8CFEE] rounded-xl flex items-center justify-between text-xs text-[#7652D6]">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <span>AI Follow-Up: <strong>{appointment.follow_up_status}</strong></span>
                  </div>
                  {appointment.bland_call_id && (
                    <span className="text-[10px] bg-white/70 px-2 py-0.5 rounded font-mono">
                      ID: {appointment.bland_call_id.slice(0, 8)}...
                    </span>
                  )}
                </div>
              )}

              {/* Status Transition Action Buttons */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#858197] block mb-2">
                  Update Status
                </span>
                <div className="flex flex-wrap gap-2">
                  {appointment.status !== 'checked_in' && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange('checked_in')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#E6F7F1] text-[#13A58B] hover:bg-[#D1F0E6] transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Check In</span>
                    </button>
                  )}

                  {appointment.status !== 'in_progress' && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange('in_progress')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#E8F1FE] text-[#2563EB] hover:bg-[#DBEAFE] transition-colors cursor-pointer"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>In Progress</span>
                    </button>
                  )}

                  {appointment.status !== 'completed' && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange('completed')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB] transition-colors cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  )}

                  {appointment.status !== 'no_show' && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleStatusChange('no_show')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FDF2F8] text-[#BE185D] hover:bg-[#FCE7F3] transition-colors cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>No Show</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Actions: Edit & Cancel */}
              <div className="pt-3 border-t border-[#F0ECF8] flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleCancelAppointment}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#DC2626] hover:text-[#B91C1C] hover:bg-[#FEE2E2] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Cancel Appointment</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={startEditMode}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#17213B] bg-white border border-[#E5E0F0] hover:border-[#D8CFEE] px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#7652D6]" />
                    <span>Reschedule / Edit</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
