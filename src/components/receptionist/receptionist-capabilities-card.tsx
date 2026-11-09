'use client';

import React from 'react';

interface CapabilityItem {
  title: string;
  subtitle: string;
  status: string;
}

const capabilities: CapabilityItem[] = [
  {
    title: 'Answer incoming calls',
    subtitle: '24/7 phone answering',
    status: 'Enabled',
  },
  {
    title: 'Book appointments',
    subtitle: 'Live calendar availability',
    status: 'Enabled',
  },
  {
    title: 'Reschedule & cancel',
    subtitle: 'Manage existing bookings',
    status: 'Enabled',
  },
  {
    title: 'Answer service questions',
    subtitle: 'Use your business knowledge',
    status: 'Enabled',
  },
  {
    title: 'Send SMS confirmations',
    subtitle: 'After every booking',
    status: 'Enabled',
  },
  {
    title: 'Handle after-hours calls',
    subtitle: 'No missed opportunities',
    status: 'Enabled',
  },
];

export function ReceptionistCapabilitiesCard() {
  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-6 mb-4 shadow-2xs">
      <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-3">
        What Mira can do
      </h2>

      {/* Capabilities List */}
      <div className="divide-y divide-[#F4F1FA]">
        {capabilities.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between py-3 first:pt-1 last:pb-3"
          >
            <div>
              <p className="text-xs sm:text-[13px] font-medium text-[#17213B]">
                {item.title}
              </p>
              <p className="text-[11px] text-[#8490A8] mt-0.5">
                {item.subtitle}
              </p>
            </div>

            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF7F0] text-[#2FAE85]">
              {item.status}
            </span>
          </div>
        ))}
      </div>

      {/* Live Calendar Safety Note */}
      <div className="mt-4 p-3 sm:p-3.5 rounded-lg bg-[#FAF7FD] border border-[#EFEBF6]">
        <p className="text-xs text-[#6946C7] font-normal leading-relaxed">
          Mira checks your live calendar before confirming any appointment, preventing double bookings.
        </p>
      </div>
    </div>
  );
}

