'use client';

import React, { useState } from 'react';

type CallCategory = 'all' | 'incoming' | 'outgoing' | 'missed';

interface CallRecord {
  id: string;
  contact: string;
  callType: string;
  category: 'incoming' | 'outgoing' | 'missed';
  outcome: string;
  time: string;
  status: 'Completed' | 'Reviewed' | 'Follow-up' | 'Missed';
}

const callRecords: CallRecord[] = [
  {
    id: '1',
    contact: 'Emma Wilson',
    callType: 'Incoming · 2m 14s',
    category: 'incoming',
    outcome: 'Booked appointment',
    time: 'Today, 10:42 AM',
    status: 'Completed',
  },
  {
    id: '2',
    contact: 'Unknown caller',
    callType: 'Incoming · 1m 02s',
    category: 'incoming',
    outcome: 'Asked about pricing',
    time: 'Today, 10:18 AM',
    status: 'Reviewed',
  },
  {
    id: '3',
    contact: 'Olivia Brown',
    callType: 'Outgoing · 1m 48s',
    category: 'outgoing',
    outcome: 'No-show recovery',
    time: 'Today, 09:35 AM',
    status: 'Follow-up',
  },
  {
    id: '4',
    contact: 'Sophia Miller',
    callType: 'Missed call',
    category: 'missed',
    outcome: 'Needs callback',
    time: 'Yesterday, 04:22 PM',
    status: 'Missed',
  },
  {
    id: '5',
    contact: 'Ava Martinez',
    callType: 'Incoming · 3m 12s',
    category: 'incoming',
    outcome: 'Rescheduled',
    time: 'Yesterday, 03:10 PM',
    status: 'Completed',
  },
];

function CallStatusBadge({ status }: { status: CallRecord['status'] }) {
  switch (status) {
    case 'Completed':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF7F0] text-[#2FAE85]">
          Completed
        </span>
      );
    case 'Reviewed':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF3FE] text-[#3B82F6]">
          Reviewed
        </span>
      );
    case 'Follow-up':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEF4E8] text-[#D97706]">
          Follow-up
        </span>
      );
    case 'Missed':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FDEEED] text-[#E11D48]">
          Missed
        </span>
      );
    default:
      return null;
  }
}

export function CallsLogTable() {
  const [activeTab, setActiveTab] = useState<CallCategory>('all');

  const filteredRecords =
    activeTab === 'all'
      ? callRecords
      : callRecords.filter((record) => record.category === activeTab);

  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-5 mb-4 shadow-2xs">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1 text-xs rounded-full font-semibold transition-colors shrink-0 ${
            activeTab === 'all'
              ? 'bg-[#F0EAFE] text-[#6946C7]'
              : 'bg-white border border-[#EAE8F2] text-[#8490A8] hover:border-[#D8CFEE] hover:text-[#17213B]'
          }`}
        >
          All calls
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('incoming')}
          className={`px-3.5 py-1 text-xs rounded-full font-medium transition-colors shrink-0 ${
            activeTab === 'incoming'
              ? 'bg-[#F0EAFE] text-[#6946C7] font-semibold'
              : 'bg-white border border-[#EAE8F2] text-[#8490A8] hover:border-[#D8CFEE] hover:text-[#17213B]'
          }`}
        >
          Incoming
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('outgoing')}
          className={`px-3.5 py-1 text-xs rounded-full font-medium transition-colors shrink-0 ${
            activeTab === 'outgoing'
              ? 'bg-[#F0EAFE] text-[#6946C7] font-semibold'
              : 'bg-white border border-[#EAE8F2] text-[#8490A8] hover:border-[#D8CFEE] hover:text-[#17213B]'
          }`}
        >
          Outgoing
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('missed')}
          className={`px-3.5 py-1 text-xs rounded-full font-medium transition-colors shrink-0 ${
            activeTab === 'missed'
              ? 'bg-[#F0EAFE] text-[#6946C7] font-semibold'
              : 'bg-white border border-[#EAE8F2] text-[#8490A8] hover:border-[#D8CFEE] hover:text-[#17213B]'
          }`}
        >
          Missed
        </button>
      </div>

      {/* Table Container with Horizontal Scroll for Mobile */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[620px] px-4 sm:px-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F4F1FA] text-[10px] uppercase tracking-wider font-semibold text-[#8490A8]">
                <th className="pb-3 font-semibold">CONTACT</th>
                <th className="pb-3 font-semibold">CALL TYPE</th>
                <th className="pb-3 font-semibold">OUTCOME</th>
                <th className="pb-3 font-semibold">TIME</th>
                <th className="pb-3 font-semibold">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F1FA] text-xs">
              {filteredRecords.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#FAF9FD] transition-colors group"
                >
                  <td className="py-3 font-semibold text-[#17213B]">
                    {row.contact}
                  </td>
                  <td className="py-3 text-[#8490A8]">{row.callType}</td>
                  <td className="py-3 text-[#17213B] font-normal">{row.outcome}</td>
                  <td className="py-3 text-[#8490A8]">{row.time}</td>
                  <td className="py-3">
                    <CallStatusBadge status={row.status} />
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

