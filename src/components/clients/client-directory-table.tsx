import React from 'react';
import { Search } from 'lucide-react';
import { ClientSegmentBadge, ClientSegment } from './client-segment-badge';

interface ClientDirectoryRow {
  id: string;
  client: string;
  email: string;
  visits: number;
  lifetimeSpend: string;
  segment: ClientSegment;
}

const clientDirectoryData: ClientDirectoryRow[] = [
  {
    id: '1',
    client: 'Emma Wilson',
    email: 'emma@email.com',
    visits: 12,
    lifetimeSpend: '$NaN',
    segment: 'VIP',
  },
  {
    id: '2',
    client: 'Olivia Brown',
    email: 'olivia@email.com',
    visits: 8,
    lifetimeSpend: '$360',
    segment: 'Regular',
  },
  {
    id: '3',
    client: 'Ava Martinez',
    email: 'ava@email.com',
    visits: 6,
    lifetimeSpend: '$550',
    segment: 'Regular',
  },
  {
    id: '4',
    client: 'Isabella Lee',
    email: 'isabella@email.com',
    visits: 4,
    lifetimeSpend: '$420',
    segment: 'New',
  },
  {
    id: '5',
    client: 'Mia Johnson',
    email: 'mia@email.com',
    visits: 15,
    lifetimeSpend: '$NaN',
    segment: 'VIP',
  },
  {
    id: '6',
    client: 'Charlotte Davis',
    email: 'charlotte@email.com',
    visits: 3,
    lifetimeSpend: '$270',
    segment: 'New',
  },
];

export function ClientDirectoryTable() {
  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[9px] p-4 sm:p-5 mb-8 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight">
          Client directory
        </h2>

        {/* Search input: Search clients... */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full bg-white border border-[#E9E7F0] rounded-lg px-3 py-1.5 text-xs text-[#17213B] placeholder:text-[#8490A8] focus:outline-none focus:border-[#7554D6] transition-colors"
          />
        </div>
      </div>

      {/* Table Container with Horizontal Scroll for Mobile */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[640px] px-4 sm:px-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F4F1FA] text-[10px] uppercase tracking-wider font-semibold text-[#8490A8]">
                <th className="pb-3 font-semibold">CLIENT</th>
                <th className="pb-3 font-semibold">EMAIL</th>
                <th className="pb-3 font-semibold">VISITS</th>
                <th className="pb-3 font-semibold">LIFETIME SPEND</th>
                <th className="pb-3 font-semibold">SEGMENT</th>
                <th className="pb-3 font-semibold text-right"><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F1FA] text-xs">
              {clientDirectoryData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#FAF9FD] transition-colors group"
                >
                  <td className="py-3 font-medium text-[#17213B]">
                    {row.client}
                  </td>
                  <td className="py-3 text-[#8490A8]">{row.email}</td>
                  <td className="py-3 text-[#8490A8]">{row.visits}</td>
                  <td className="py-3 text-[#8490A8] font-medium">{row.lifetimeSpend}</td>
                  <td className="py-3">
                    <ClientSegmentBadge segment={row.segment} />
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      className="px-2.5 py-1 text-[11px] font-medium text-[#17213B] bg-white border border-[#E9E7F0] rounded-md hover:border-[#D8CFEE] transition-colors shadow-2xs"
                    >
                      Profile
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

