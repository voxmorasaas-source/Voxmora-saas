import React from 'react';
import { Bot, PhoneCall, CheckCircle2, PhoneForwarded, Settings2, Sparkles } from 'lucide-react';

export function AIReceptionistCard() {
  return (
    <div className="bg-white border border-[#EAE6F2] rounded-xl p-5 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F4F1FA]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE5FF] border border-[#D8CFEE] flex items-center justify-center text-[#7048D8] shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#17213B] tracking-tight">
                AI receptionist · Mira
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#EDE5FF] text-[#7048D8] px-2 py-0.5 rounded-full">
                <Sparkles className="w-2.5 h-2.5" />
                Live
              </span>
            </div>
            <p className="text-xs text-[#77758C] mt-0.5">
              Handling incoming calls, booking appointments, and answering business FAQs.
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="inline-flex items-center gap-2 bg-[#E6F8F4] text-[#13A58B] px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#13A58B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#13A58B]"></span>
          </span>
          Active & taking calls
        </div>
      </div>

      {/* Call Handling Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 border-b border-[#F4F1FA]">
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
      <div className="pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
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
            Configure Agent
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#7652D6] hover:bg-[#6540C3] rounded-lg transition-colors shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Test Call
          </button>
        </div>
      </div>
    </div>
  );
}

