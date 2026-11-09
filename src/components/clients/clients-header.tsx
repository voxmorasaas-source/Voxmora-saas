import React from 'react';
import { Plus } from 'lucide-react';

export function ClientsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
      <div>
        <h1 className="text-2xl font-bold text-[#17213B] tracking-tight">
          Your clients
        </h1>
        <p className="text-sm text-[#8490A8] mt-0.5">
          Build lasting relationships with every visit.
        </p>
      </div>

      <div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7554D6] hover:bg-[#6540C3] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add client</span>
        </button>
      </div>
    </div>
  );
}

