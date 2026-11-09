'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';

export function BookingHeader() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://sereva.com/book/serene-studio');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl lg:text-[26px] font-bold text-[#17213B] tracking-tight">
          Online booking
        </h1>
        <p className="text-xs sm:text-[13px] text-[#8490A8] mt-1">
          Your always-open booking experience for clients.
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#6946C7] hover:bg-[#5b3cb2] text-white text-xs sm:text-[13px] font-semibold rounded-lg shadow-2xs transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Link copied!</span>
            </>
          ) : (
            <>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Copy booking link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

