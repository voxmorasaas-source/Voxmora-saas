'use client';

import React, { useState } from 'react';

const workflowSteps = [
  {
    step: 1,
    title: 'Appointment marked as no-show',
    description: 'Staff marks the client absent in calendar.',
  },
  {
    step: 2,
    title: 'Wait 15 minutes',
    description: 'Allow time for the customer to arrive.',
  },
  {
    step: 3,
    title: 'Mira makes a follow-up call',
    description: "AI calls the client and checks if they'd like to reschedule.",
  },
  {
    step: 4,
    title: 'Rebook or notify staff',
    description: 'Books a new slot or creates a callback task.',
  },
];

export function NoShowWorkflowCard() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-5 sm:p-6 mb-4 shadow-2xs">
      <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-5">
        No-show recovery workflow
      </h2>

      {/* Vertical Step Timeline */}
      <div className="space-y-1">
        {workflowSteps.map((item, index) => {
          const isLast = index === workflowSteps.length - 1;

          return (
            <div key={item.step} className="flex items-start gap-4">
              {/* Circle Node & Connecting Line */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EDE5FF] text-[#6946C7] font-bold text-xs flex items-center justify-center shrink-0">
                  {item.step}
                </div>

                {!isLast && (
                  <div className="w-[2px] h-6 bg-[#D8CFEE] my-1" />
                )}
              </div>

              {/* Step Content */}
              <div className="pt-0.5 pb-2">
                <p className="text-xs sm:text-[13px] font-medium text-[#17213B]">
                  {item.title}
                </p>
                <p className="text-[11px] text-[#8490A8] mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Enable Workflow Toggle */}
      <div className="border-t border-[#F4F1FA] pt-4 mt-5 flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-[13px] font-medium text-[#17213B]">
            Enable workflow
          </p>
          <p className="text-[11px] text-[#8490A8] mt-0.5">
            Automatic AI recovery calls
          </p>
        </div>

        {/* Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled(!enabled)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#7652D6]/20 ${
            enabled ? 'bg-[#6946C7]' : 'bg-[#DCD9E6]'
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
              enabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

