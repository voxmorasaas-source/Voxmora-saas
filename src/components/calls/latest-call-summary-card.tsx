'use client';

import React, { useState } from 'react';
import { Sparkles, X, FileText } from 'lucide-react';

export function LatestCallSummaryCard() {
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  return (
    <>
      <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-6 mb-4 shadow-2xs">
        <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-3">
          Latest call summary
        </h2>

        {/* Call Summary Banner */}
        <div className="bg-[#FAF7FD] border border-[#EFEBF6] rounded-lg p-3.5 sm:p-4 mb-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#6946C7]">
            <Sparkles className="w-3.5 h-3.5 fill-[#6946C7]" />
            <span>Mira · Emma Wilson</span>
          </div>

          <p className="text-xs text-[#66708A] leading-relaxed mt-1.5">
            Customer called to book a signature facial. Mira checked availability, found a 10:30 AM opening with Sophie, and confirmed the booking. SMS confirmation sent.
          </p>
        </div>

        {/* Outcome and Duration Badges */}
        <div className="flex items-center gap-2 mb-3.5">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EAF7F0] text-[#2FAE85]">
            Appointment created
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0EAFE] text-[#6946C7]">
            2m 14s
          </span>
        </div>

        {/* View Transcript Button */}
        <div>
          <button
            type="button"
            onClick={() => setTranscriptOpen(true)}
            className="px-3.5 py-1.5 bg-white border border-[#EAE8F2] rounded-lg text-xs font-medium text-[#17213B] hover:border-[#D8CFEE] transition-colors shadow-2xs inline-flex items-center gap-1.5"
          >
            <span>View transcript</span>
          </button>
        </div>
      </div>

      {/* Transcript Modal */}
      {transcriptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17213B]/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl border border-[#EAE8F2] p-5 max-w-lg w-full shadow-xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4F1FA] mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EDE5FF] flex items-center justify-center text-[#7048D8]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#17213B]">
                    Call Transcript · Emma Wilson
                  </h3>
                  <p className="text-[11px] text-[#8490A8]">
                    Today, 10:42 AM · Duration: 2m 14s
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTranscriptOpen(false)}
                className="text-[#8490A8] hover:text-[#17213B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs leading-relaxed">
              <div className="bg-[#FAF7FD] p-2.5 rounded-lg border border-[#EFEBF6]">
                <p className="font-semibold text-[#6946C7] text-[11px] mb-0.5">
                  Mira (AI Receptionist):
                </p>
                <p className="text-[#17213B]">
                  &ldquo;Thank you for calling Sereva Spa. This is Mira, your virtual receptionist. How can I help you today?&rdquo;
                </p>
              </div>

              <div className="bg-[#F8F8FC] p-2.5 rounded-lg border border-[#EAE8F2]">
                <p className="font-semibold text-[#17213B] text-[11px] mb-0.5">
                  Emma Wilson:
                </p>
                <p className="text-[#66708A]">
                  &ldquo;Hi Mira, I&apos;d like to book a Signature Facial for this Thursday morning with Sophie if she has any openings.&rdquo;
                </p>
              </div>

              <div className="bg-[#FAF7FD] p-2.5 rounded-lg border border-[#EFEBF6]">
                <p className="font-semibold text-[#6946C7] text-[11px] mb-0.5">
                  Mira (AI Receptionist):
                </p>
                <p className="text-[#17213B]">
                  &ldquo;I found an opening with Sophie on Thursday at 10:30 AM for a 60-minute Signature Facial. Would that time work well for you, Emma?&rdquo;
                </p>
              </div>

              <div className="bg-[#F8F8FC] p-2.5 rounded-lg border border-[#EAE8F2]">
                <p className="font-semibold text-[#17213B] text-[11px] mb-0.5">
                  Emma Wilson:
                </p>
                <p className="text-[#66708A]">
                  &ldquo;Yes, 10:30 AM is perfect! Please book that for me.&rdquo;
                </p>
              </div>

              <div className="bg-[#FAF7FD] p-2.5 rounded-lg border border-[#EFEBF6]">
                <p className="font-semibold text-[#6946C7] text-[11px] mb-0.5">
                  Mira (AI Receptionist):
                </p>
                <p className="text-[#17213B]">
                  &ldquo;You are all confirmed for Thursday at 10:30 AM with Sophie. I just texted your confirmation and calendar invite. We look forward to seeing you!&rdquo;
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F4F1FA] mt-3 text-right">
              <button
                type="button"
                onClick={() => setTranscriptOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-[#66708A] hover:bg-[#F4F1FA] rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

