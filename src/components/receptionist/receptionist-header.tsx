'use client';

import React, { useState } from 'react';
import { Play, PhoneCall, X, Sparkles } from 'lucide-react';

export function ReceptionistHeader() {
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [calling, setCalling] = useState(false);

  const startTestCall = () => {
    setCalling(true);
    setTimeout(() => {
      setCalling(false);
      setTestModalOpen(false);
    }, 3000);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-[26px] font-bold text-[#17213B] tracking-tight">
            Mira AI receptionist
          </h1>
          <p className="text-xs sm:text-[13px] text-[#8490A8] mt-1">
            Your AI front desk, available around the clock.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setTestModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#FAF8FF] border border-[#EAE8F2] text-[#17213B] text-xs sm:text-[13px] font-semibold rounded-lg shadow-2xs hover:border-[#D8CFEE] transition-colors"
          >
            <Play className="w-3 h-3 fill-[#17213B] text-[#17213B]" />
            <span>Test a call</span>
          </button>
        </div>
      </div>

      {/* Test Call Modal */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17213B]/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl border border-[#EAE8F2] p-5 max-w-sm w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EDE5FF] flex items-center justify-center text-[#7048D8]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#17213B]">
                    Test Mira AI
                  </h3>
                  <p className="text-[11px] text-[#8490A8]">
                    Simulate an incoming phone call
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="text-[#8490A8] hover:text-[#17213B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#FAF7FD] border border-[#EFEBF6] rounded-lg p-3 text-xs text-[#8490A8] mb-4">
              <p className="font-semibold text-[#17213B] mb-1">
                Virtual Number: +1 (415) 555-0198
              </p>
              <p>
                Testing will initiate an interactive voice session in your browser using the configured greeting and services.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold text-[#66708A] hover:bg-[#F4F1FA] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={startTestCall}
                disabled={calling}
                className="flex-1 py-2 bg-[#6946C7] hover:bg-[#5b3cb2] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{calling ? 'Connecting...' : 'Call now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

