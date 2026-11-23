'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar as CalendarIcon, Clock, User, Scissors, DollarSign, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  DEFAULT_STAFF,
  DEFAULT_SERVICES,
  StaffOption,
  ServiceOption,
  CalendarAppointment,
} from './calendar-types';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newAppointment: CalendarAppointment) => void;
  initialDate?: string; // YYYY-MM-DD
  initialStartTime?: string; // HH:mm or ISO
}

interface ExistingClientOption {
  name: string;
  email: string;
  phone: string;
}

const DEFAULT_CLIENTS: ExistingClientOption[] = [
  { name: 'Emma Wilson', email: 'emma@email.com', phone: '+1 (415) 555-0192' },
  { name: 'Olivia Brown', email: 'olivia@email.com', phone: '+1 (415) 555-0183' },
  { name: 'Ava Martinez', email: 'ava@email.com', phone: '+1 (415) 555-0174' },
  { name: 'Isabella Lee', email: 'isabella@email.com', phone: '+1 (415) 555-0165' },
  { name: 'Mia Johnson', email: 'mia@email.com', phone: '+1 (415) 555-0156' },
  { name: 'Charlotte Davis', email: 'charlotte@email.com', phone: '+1 (415) 555-0147' },
];

export function NewAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
  initialDate,
  initialStartTime,
}: NewAppointmentModalProps) {
  // Form State
  const [clientSearch, setClientSearch] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isNewClient, setIsNewClient] = useState(false);
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(DEFAULT_SERVICES[0].id);
  const [selectedStaffId, setSelectedStaffId] = useState<string>(DEFAULT_STAFF[0].id);

  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('09:00');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [priceDollars, setPriceDollars] = useState<string>('95');
  const [notes, setNotes] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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

  // Initialize or reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const todayIso = new Date().toISOString().split('T')[0];
      setDate(initialDate || todayIso);

      if (initialStartTime) {
        // Normalize initialStartTime to HH:mm
        if (initialStartTime.includes('T')) {
          const d = new Date(initialStartTime);
          const hh = String(d.getHours()).padStart(2, '0');
          const mm = String(d.getMinutes()).padStart(2, '0');
          setStartTime(`${hh}:${mm}`);
        } else {
          setStartTime(initialStartTime.slice(0, 5));
        }
      } else {
        setStartTime('09:00');
      }

      const defaultService = DEFAULT_SERVICES[0];
      setSelectedServiceId(defaultService.id);
      setDurationMinutes(defaultService.durationMinutes);
      setPriceDollars((defaultService.priceCents / 100).toString());
      setSelectedStaffId(DEFAULT_STAFF[0].id);
      setClientSearch('');
      setClientName('');
      setClientPhone('');
      setClientEmail('');
      setIsNewClient(false);
      setNotes('');
      setValidationError(null);
    }
  }, [isOpen, initialDate, initialStartTime]);

  // When service changes, update duration and price
  const handleServiceChange = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const service = DEFAULT_SERVICES.find((s) => s.id === serviceId);
    if (service) {
      setDurationMinutes(service.durationMinutes);
      setPriceDollars((service.priceCents / 100).toString());
    }
  };

  // Calculate End Time display
  const calculatedEndTime = useMemo(() => {
    if (!startTime) return '';
    const [h, m] = startTime.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return '';
    const totalMinutes = h * 60 + m + (durationMinutes || 30);
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }, [startTime, durationMinutes]);

  // Client suggestions filter
  const filteredClients = useMemo(() => {
    if (!clientSearch.trim()) return DEFAULT_CLIENTS;
    const query = clientSearch.toLowerCase();
    return DEFAULT_CLIENTS.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.includes(query)
    );
  }, [clientSearch]);

  const selectClient = (client: ExistingClientOption) => {
    setClientName(client.name);
    setClientEmail(client.email);
    setClientPhone(client.phone);
    setClientSearch(client.name);
    setShowClientSuggestions(false);
    setIsNewClient(false);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const effectiveClientName = isNewClient ? clientName.trim() : clientSearch.trim() || clientName.trim();
    if (!effectiveClientName) {
      setValidationError('Please enter or select a client name.');
      return;
    }

    if (!date) {
      setValidationError('Please select an appointment date.');
      return;
    }

    if (!startTime) {
      setValidationError('Please select a start time.');
      return;
    }

    const selectedService = DEFAULT_SERVICES.find((s) => s.id === selectedServiceId);
    const selectedStaff = DEFAULT_STAFF.find((s) => s.id === selectedStaffId);

    // Build ISO timestamps
    const [startH, startM] = startTime.split(':').map(Number);
    const startDateTime = new Date(`${date}T00:00:00`);
    startDateTime.setHours(startH, startM, 0, 0);

    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60 * 1000);

    const priceCents = Math.round(parseFloat(priceDollars || '0') * 100);

    const payload = {
      clientName: effectiveClientName,
      clientPhone: clientPhone || undefined,
      clientEmail: clientEmail || undefined,
      serviceId: selectedServiceId,
      serviceName: selectedService ? selectedService.name : 'Salon Service',
      staffId: selectedStaffId,
      staffName: selectedStaff ? selectedStaff.name : undefined,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      durationMinutes,
      priceCents,
      notes: notes.trim() || undefined,
      bookingSource: 'manual' as const,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const errorMsg = result.error || 'Failed to schedule appointment. Please check availability.';
        setValidationError(errorMsg);
        toast.error(errorMsg);
        setIsSubmitting(false);
        return;
      }

      toast.success('Appointment booked successfully!');
      onSuccess(result.data);
      onClose();
    } catch (err: any) {
      const message = err.message || 'An unexpected error occurred.';
      setValidationError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
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
            <div className="w-8 h-8 rounded-lg bg-[#EAE2FB] text-[#7652D6] flex items-center justify-center shadow-2xs">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17213B]">New Appointment</h2>
              <p className="text-xs text-[#8490A8]">Book a client appointment with assigned specialist</p>
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {validationError && (
              <div className="p-3 bg-[#FFF1F2] border border-[#FDE2E4] rounded-lg flex items-start gap-2.5 text-xs text-[#E11D48]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Client Selector / Search */}
            <div className="relative">
              <label className="block text-xs font-semibold text-[#17213B] mb-1.5">
                Client Name <span className="text-[#E11D48]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search client name or email..."
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setClientName(e.target.value);
                    setShowClientSuggestions(true);
                  }}
                  onFocus={() => setShowClientSuggestions(true)}
                  className="w-full pl-9 pr-3 py-2 text-xs text-[#17213B] bg-white border border-[#E5E0F0] rounded-lg focus:outline-none focus:border-[#7652D6] focus:ring-1 focus:ring-[#7652D6]/20 transition-all placeholder:text-[#A1A1BA]"
                />
                <User className="w-4 h-4 text-[#858197] absolute left-2.5 top-2.5" />
              </div>

              {/* Client Suggestions Dropdown */}
              {showClientSuggestions && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-[#E9E5F0] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto divide-y divide-[#F4F1FA]">
                  {filteredClients.map((c) => (
                    <button
                      key={c.email}
                      type="button"
                      onClick={() => selectClient(c)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-[#FAF9FD] transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#17213B] group-hover:text-[#7652D6]">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-[#858197]">{c.email} • {c.phone}</p>
                      </div>
                      <span className="text-[10px] font-medium text-[#7652D6] bg-[#F0E9FF] px-2 py-0.5 rounded-full">
                        Select
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewClient(true);
                      setShowClientSuggestions(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#FAF9FD] text-[11px] font-semibold text-[#7652D6] transition-colors cursor-pointer"
                  >
                    + Add as new client
                  </button>
                </div>
              )}
            </div>

            {/* New Client Details (Optional if new) */}
            {(isNewClient || clientSearch) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#FAF9FD] border border-[#EFEBF6] rounded-xl">
                <div>
                  <label className="block text-[11px] font-medium text-[#686777] mb-1">
                    Client Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs text-[#17213B] bg-white border border-[#E5E0F0] rounded-md focus:outline-none focus:border-[#7652D6]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#686777] mb-1">
                    Client Email
                  </label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs text-[#17213B] bg-white border border-[#E5E0F0] rounded-md focus:outline-none focus:border-[#7652D6]"
                  />
                </div>
              </div>
            )}

            {/* Service & Staff Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17213B] mb-1.5">
                  Service <span className="text-[#E11D48]">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedServiceId}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs text-[#17213B] bg-white border border-[#E5E0F0] rounded-lg focus:outline-none focus:border-[#7652D6] appearance-none"
                  >
                    {DEFAULT_SERVICES.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.name} (${srv.priceCents / 100})
                      </option>
                    ))}
                  </select>
                  <Scissors className="w-3.5 h-3.5 text-[#858197] absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17213B] mb-1.5">
                  Staff Member <span className="text-[#E11D48]">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs text-[#17213B] bg-white border border-[#E5E0F0] rounded-lg focus:outline-none focus:border-[#7652D6] appearance-none"
                  >
                    {DEFAULT_STAFF.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} ({staff.role})
                      </option>
                    ))}
                  </select>
                  <User className="w-3.5 h-3.5 text-[#858197] absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Date & Start Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17213B] mb-1.5">
                  Date <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs text-[#17213B] bg-white border border-[#E5E0F0] rounded-lg focus:outline-none focus:border-[#7652D6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17213B] mb-1.5">
                  Start Time <span className="text-[#E11D48]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    step="900"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full pl-8 pr-2 py-2 text-xs text-[#17213B] bg-white border border-[#E5E0F0] rounded-lg focus:outline-none focus:border-[#7652D6]"
                  />
                  <Clock className="w-3.5 h-3.5 text-[#858197] absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17213B] mb-1.5">
                  End Time
                </label>
                <div className="px-2.5 py-2 text-xs text-[#858197] bg-[#F8F7FC] border border-[#EAE6F3] rounded-lg flex items-center justify-between">
                  <span>{calculatedEndTime || '--:--'}</span>
                  <span className="text-[10px] text-[#7652D6] font-semibold">{durationMinutes}m</span>
                </div>
              </div>
            </div>

            {/* Price & Duration Overrides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17213B] mb-1.5">
                  Price ($)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={priceDollars}
                    onChange={(e) => setPriceDollars(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs text-[#17213B] bg-white border border-[#E5E0F0] rounded-lg focus:outline-none focus:border-[#7652D6]"
                  />
                  <DollarSign className="w-3.5 h-3.5 text-[#858197] absolute left-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17213B] mb-1.5">
                  Duration (minutes)
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs text-[#17213B] bg-white border border-[#E5E0F0] rounded-lg focus:outline-none focus:border-[#7652D6]"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes (1 hr)</option>
                  <option value={75}>75 minutes</option>
                  <option value={90}>90 minutes (1.5 hr)</option>
                  <option value={120}>120 minutes (2 hrs)</option>
                </select>
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-semibold text-[#17213B] mb-1.5">
                Notes (optional)
              </label>
              <textarea
                rows={2}
                placeholder="Special requests, allergies, or client preferences..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 text-xs text-[#17213B] bg-white border border-[#E5E0F0] rounded-lg focus:outline-none focus:border-[#7652D6] resize-none placeholder:text-[#A1A1BA]"
              />
            </div>
          </div>

          {/* Footer Actions - Always docked at bottom */}
          <div className="shrink-0 px-6 py-3.5 bg-white border-t border-[#F0ECF8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-[#77758C] bg-white border border-[#E5E0F0] rounded-lg hover:border-[#D8CFEE] hover:text-[#17213B] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#7652D6] hover:bg-[#6540C3] rounded-lg shadow-2xs transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Checking & Booking...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
