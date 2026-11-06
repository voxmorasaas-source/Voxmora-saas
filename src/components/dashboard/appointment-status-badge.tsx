import React from 'react';

export type AppointmentStatus = 'Confirmed' | 'Checked in' | 'Pending';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  const styles: Record<AppointmentStatus, { bg: string; text: string }> = {
    Confirmed: {
      bg: 'bg-[#F0E9FF]',
      text: 'text-[#7652D6]',
    },
    'Checked in': {
      bg: 'bg-[#E6F7F1]',
      text: 'text-[#13A58B]',
    },
    Pending: {
      bg: 'bg-[#FFF3E6]',
      text: 'text-[#D88935]',
    },
  };

  const current = styles[status] || styles.Confirmed;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${current.bg} ${current.text}`}
    >
      {status}
    </span>
  );
}

