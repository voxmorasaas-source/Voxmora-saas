import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AppointmentStatusBadge, AppointmentStatus } from './appointment-status-badge';

interface AppointmentRow {
  id: string;
  client: string;
  service: string;
  staff: string;
  time: string;
  amount: string;
  status: AppointmentStatus;
}

const appointmentsData: AppointmentRow[] = [
  {
    id: '1',
    client: 'Emma Wilson',
    service: 'Signature Facial',
    staff: 'Sophie',
    time: '09:00 AM',
    amount: '$95',
    status: 'Confirmed',
  },
  {
    id: '2',
    client: 'Olivia Brown',
    service: 'Deep Tissue Massage',
    staff: 'Mia',
    time: '10:00 AM',
    amount: '$120',
    status: 'Checked in',
  },
  {
    id: '3',
    client: 'Ava Martinez',
    service: 'Hydrating Facial',
    staff: 'Sophie',
    time: '11:00 AM',
    amount: '$85',
    status: 'Confirmed',
  },
  {
    id: '4',
    client: 'Isabella Lee',
    service: 'Body Treatment',
    staff: 'Chloe',
    time: '01:00 PM',
    amount: '$150',
    status: 'Confirmed',
  },
  {
    id: '5',
    client: 'Mia Johnson',
    service: 'Manicure & Pedicure',
    staff: 'Mia',
    time: '02:00 PM',
    amount: '$75',
    status: 'Pending',
  },
];

export function TodaysAppointments() {
  return (
    <div className="bg-white border border-[#E9E5F0] rounded-xl p-4 sm:p-5 mb-3 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight">
          Today's appointments
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#77758C] bg-white border border-[#E9E5F0] rounded-lg hover:border-[#D8CFEE] hover:text-[#17213B] transition-colors"
        >
          <span>View calendar</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#858197]" />
        </button>
      </div>

      {/* Table Container with Horizontal Scroll for Mobile */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[680px] px-4 sm:px-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F4F1FA] text-[10px] uppercase tracking-wider font-semibold text-[#858197]">
                <th className="pb-3 font-semibold">CLIENT</th>
                <th className="pb-3 font-semibold">SERVICE</th>
                <th className="pb-3 font-semibold">STAFF</th>
                <th className="pb-3 font-semibold">TIME</th>
                <th className="pb-3 font-semibold">AMOUNT</th>
                <th className="pb-3 font-semibold">STATUS</th>
                <th className="pb-3 font-semibold text-right"><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F1FA] text-xs">
              {appointmentsData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#FAF9FD] transition-colors group"
                >
                  <td className="py-3 font-semibold text-[#17213B]">
                    {row.client}
                  </td>
                  <td className="py-3 text-[#858197]">{row.service}</td>
                  <td className="py-3 text-[#858197]">{row.staff}</td>
                  <td className="py-3 text-[#858197]">{row.time}</td>
                  <td className="py-3 font-semibold text-[#17213B]">
                    {row.amount}
                  </td>
                  <td className="py-3">
                    <AppointmentStatusBadge status={row.status} />
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      className="px-2.5 py-1 text-[11px] font-medium text-[#77758C] bg-white border border-[#E9E5F0] rounded-md hover:border-[#D8CFEE] hover:text-[#17213B] transition-colors shadow-2xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

