'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export function ReceptionistHeroCard() {
  const [isActive, setIsActive] = useState(true);

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
          <span>YOUR AI RECEPTIONIST</span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight my-2">
          Meet Mira.
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-[13px] text-[#E0D7F7] max-w-xl leading-relaxed mb-4">
          A warm, intelligent voice that answers every call, books appointments, and makes sure no opportunity slips away.
        </p>

        {/* Active Toggle & Connected Phone Line */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/20 ${
                isActive ? 'bg-[#7652D6]' : 'bg-white/30'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  isActive ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>

            <span className="text-xs font-semibold text-white">
              {isActive
                ? 'Mira is active and answering calls'
                : 'Mira is paused (calls forwarding to staff)'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#C4B5E8] pl-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? 'bg-[#13A58B]' : 'bg-[#9995AA]'
              }`}
            />
            <span>
              Connected · <strong className="text-white font-medium">+1 (415) 555-0198</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

