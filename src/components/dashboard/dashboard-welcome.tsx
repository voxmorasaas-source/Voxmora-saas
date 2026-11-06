import React from 'react';
import { Plus, Sparkles } from 'lucide-react';

export function DashboardWelcome() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl lg:text-[26px] font-bold text-[#17213B] tracking-tight flex items-center gap-2">
          <span>Good morning, there!</span>
          <span className="text-xl" role="img" aria-label="sparkles">✨</span>
        </h1>
        <p className="text-sm text-[#77758C] mt-1">
          Here's what's happening at your business today.
        </p>
      </div>

      <div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7652D6] hover:bg-[#6540C3] text-white text-[13px] font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New appointment</span>
        </button>
      </div>
    </div>
  );
}

