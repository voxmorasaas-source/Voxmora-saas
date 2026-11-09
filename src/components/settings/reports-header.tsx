'use client';

import React, { useState } from 'react';
import { ArrowDown, Check } from 'lucide-react';

export function ReportsHeader() {
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExported(true);
      setTimeout(() => setExported(false), 2000);
    }, 1200);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl lg:text-[26px] font-bold text-[#17213B] tracking-tight">
          Reports & settings
        </h1>
        <p className="text-xs sm:text-[13px] text-[#8490A8] mt-1">
          Understand your business and customize your studio.
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#FAF8FF] border border-[#EAE8F2] text-[#17213B] text-xs sm:text-[13px] font-semibold rounded-lg shadow-2xs hover:border-[#D8CFEE] transition-colors"
        >
          {exported ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#13A58B]" />
              <span>Report exported</span>
            </>
          ) : (
            <>
              <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{exporting ? 'Exporting...' : 'Export report'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

