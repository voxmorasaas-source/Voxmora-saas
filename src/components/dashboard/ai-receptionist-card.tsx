'use client';

import React, { useState } from 'react';
import { Bot, PhoneCall, CheckCircle2, Settings2, Sparkles, ArrowDown, ArrowUp } from 'lucide-react';

export function AIReceptionistCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-[#E9E5F0] rounded-[10px] p-4 sm:p-5 mb-3 shadow-2xs">
      {/* Header matching Screenshot 1 */}
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[#17213B] tracking-tight">
          AI receptionist · Mira
        </h3>

        {/* Black circular collapse/expand toggle button matching Screenshot 1 */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-7 h-7 rounded-full bg-[#17213B] text-white flex items-center justify-center hover:bg-[#2B354F] transition-colors shadow-2xs"
          aria-label={isExpanded ? 'Collapse card' : 'Expand card'}
        >
          {isExpanded ? (
            <ArrowUp className="w-3.5 h-3.5" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Preview row shown in Screenshot 1 */}
      <div className="mt-3.5 flex items-center justify-between p-3 rounded-lg bg-[#FAF7FD] border border-[#EFEBF6]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9E7DF6] to-[#C4B5FD] flex items-center justify-center text-white shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#17213B]">Mira Friendly</span>
              <span className="text-[10px] font-semibold text-[#13A58B] bg-[#E6F8F4] px-1.5 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-[11px] text-[#8490A8]">
              Automated receptionist answering calls and scheduling bookings
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-[#7652D6] hover:text-[#6540C3] transition-colors hidden sm:block"
        >
          {isExpanded ? 'Hide details' : 'View metrics'}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[#F4F1FA] space-y-4 animate-in fade-in-50 duration-200">
          {/* Call Handling Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#F8F6FF] rounded-lg p-3 border border-[#EAE6F2]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9995AA]">
                Calls Today
              </span>
              <p className="text-xl font-bold text-[#17213B] mt-0.5">38</p>
              <span className="text-[11px] text-[#77758C]">100% answered</span>
            </div>

            <div className="bg-[#F8F6FF] rounded-lg p-3 border border-[#EAE6F2]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9995AA]">
                AI Bookings
              </span>
              <p className="text-xl font-bold text-[#17213B] mt-0.5">12</p>
              <span className="text-[11px] text-[#13A58B] font-medium">50% of total bookings</span>
            </div>

            <div className="bg-[#F8F6FF] rounded-lg p-3 border border-[#EAE6F2]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9995AA]">
                Resolution Rate
              </span>
              <p className="text-xl font-bold text-[#17213B] mt-0.5">94.7%</p>
              <span className="text-[11px] text-[#77758C]">Autonomous resolution</span>
            </div>

            <div className="bg-[#F8F6FF] rounded-lg p-3 border border-[#EAE6F2]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9995AA]">
                Transfers to Staff
              </span>
              <p className="text-xl font-bold text-[#17213B] mt-0.5">2</p>
              <span className="text-[11px] text-[#77758C]">Human fallback active</span>
            </div>
          </div>

          {/* Live Activity & Action Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
            <div className="flex items-center gap-2 text-[#77758C]">
              <CheckCircle2 className="w-4 h-4 text-[#13A58B] shrink-0" />
              <span>
                <strong className="text-[#17213B] font-semibold">Latest call (4m ago):</strong>{' '}
                Appointment scheduled for Facial Consultation • Caller: (555) 234-8901
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#7048D8] bg-[#EDE5FF] hover:bg-[#E2D6FE] rounded-lg transition-colors"
              >
                <Settings2 className="w-3.5 h-3.5" />
                Configure
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#7652D6] hover:bg-[#6540C3] rounded-lg transition-colors shadow-2xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Test Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


