'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export function NoShowHeroCard() {
  return (
    <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-r from-[#29204E] via-[#3E2768] to-[#8C4683] p-5 sm:p-7 text-white mb-4 shadow-sm">
      {/* Background Watermark Sparkle (right side) */}
      <div
        className="absolute -right-6 top-1/2 -translate-y-1/2 w-56 h-56 text-white/10 pointer-events-none flex items-center justify-center select-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50 0 C50 30, 70 50, 100 50 C70 50, 50 70, 50 100 C50 70, 30 50, 0 50 C30 50, 50 30, 50 0 Z" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Top Tag */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-[#D4C5F9] uppercase">
          <Sparkles className="w-3 h-3 fill-current" />
          <span>AUTOMATED CLIENT RECOVERY</span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight my-2.5 max-w-lg leading-tight">
          Turn missed appointments into new bookings.
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-[13px] text-[#E0D7F7] max-w-xl leading-relaxed mb-4">
          When a client doesn&apos;t show up, Sereva automatically triggers an AI follow-up call, understands what happened and offers to reschedule.
        </p>

        {/* Status and Metric Row */}
        <div className="flex items-center flex-wrap gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF7F0] text-[#13A58B]">
            Workflow active
          </span>
          <span className="text-xs text-[#E0D7F7] font-medium">
            12 recoveries this month
          </span>
        </div>
      </div>
    </div>
  );
}

