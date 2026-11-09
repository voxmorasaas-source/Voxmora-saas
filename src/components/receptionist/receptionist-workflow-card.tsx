'use client';

import React from 'react';

const workflowSteps = [
  {
    step: '01 · Understand',
    description: 'Customer explains their preferred service and time.',
  },
  {
    step: '02 · Check availability',
    description: 'Mira checks staff, treatment duration and live calendar.',
  },
  {
    step: '03 · Confirm & book',
    description: 'Appointment is saved and confirmation SMS is sent.',
  },
];

export function ReceptionistWorkflowCard() {
  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-6 mb-8 shadow-2xs">
      <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-4">
        How Mira handles a booking
      </h2>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {workflowSteps.map((item) => (
          <div
            key={item.step}
            className="bg-[#FAF8FE] border border-[#EDE5FC] rounded-lg p-4"
          >
            <p className="text-xs font-bold text-[#6946C7] mb-2">{item.step}</p>
            <p className="text-[11px] text-[#8490A8] leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

