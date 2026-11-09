'use client';

import React from 'react';

interface JourneyItem {
  title: string;
  description: string;
  status: 'Active' | 'Paused';
}

const otherJourneys: JourneyItem[] = [
  {
    title: 'Appointment reminders',
    description: 'SMS 24 hours and 2 hours before',
    status: 'Active',
  },
  {
    title: 'Post-visit feedback',
    description: 'Ask for a review after checkout',
    status: 'Active',
  },
  {
    title: 'Rebooking reminder',
    description: 'Reach out after 30 days',
    status: 'Active',
  },
  {
    title: 'Birthday messages',
    description: 'Send a personalized birthday offer',
    status: 'Paused',
  },
];

export function OtherJourneysCard() {
  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-5 sm:p-6 mb-8 shadow-2xs">
      <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-4">
        Other automated journeys
      </h2>

      <div className="divide-y divide-[#F4F1FA]">
        {otherJourneys.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between py-3.5 first:pt-1 last:pb-3"
          >
            <div>
              <p className="text-xs sm:text-[13px] font-medium text-[#17213B]">
                {item.title}
              </p>
              <p className="text-[11px] text-[#8490A8] mt-0.5">
                {item.description}
              </p>
            </div>

            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                item.status === 'Active'
                  ? 'bg-[#EAF7F0] text-[#2FAE85]'
                  : 'bg-[#FEF4E8] text-[#D97706]'
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

