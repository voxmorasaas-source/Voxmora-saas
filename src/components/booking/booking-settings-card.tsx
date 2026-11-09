'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface SettingItem {
  id: string;
  title: string;
  description: string;
  defaultChecked: boolean;
}

const initialSettings: SettingItem[] = [
  {
    id: 'online-booking',
    title: 'Online booking',
    description: 'Accept bookings 24/7',
    defaultChecked: true,
  },
  {
    id: 'require-deposit',
    title: 'Require deposit',
    description: 'Collect a deposit to confirm',
    defaultChecked: true,
  },
  {
    id: 'allow-cancellations',
    title: 'Allow cancellations',
    description: 'Clients can cancel online',
    defaultChecked: true,
  },
  {
    id: 'staff-selection',
    title: 'Staff selection',
    description: 'Let clients choose a specialist',
    defaultChecked: false,
  },
  {
    id: 'waitlist',
    title: 'Waitlist',
    description: 'Offer slots when cancellations occur',
    defaultChecked: true,
  },
];

export function BookingSettingsCard() {
  const [settings, setSettings] = useState<Record<string, boolean>>(() =>
    initialSettings.reduce(
      (acc, item) => ({ ...acc, [item.id]: item.defaultChecked }),
      {}
    )
  );

  const [copied, setCopied] = useState(false);

  const toggleSetting = (id: string) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://sereva.com/book/serene-studio');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-6 mb-4 shadow-2xs">
      <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-3">
        Booking settings
      </h2>

      {/* 5 Toggle Settings */}
      <div className="divide-y divide-[#F4F1FA]">
        {initialSettings.map((item) => {
          const isChecked = settings[item.id];

          return (
            <div
              key={item.id}
              className="flex items-center justify-between py-3.5 first:pt-2 last:pb-3"
            >
              <div>
                <p className="text-xs sm:text-[13px] font-medium text-[#17213B]">
                  {item.title}
                </p>
                <p className="text-[11px] text-[#8490A8] mt-0.5">
                  {item.description}
                </p>
              </div>

              {/* iOS-Style Pill Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isChecked}
                onClick={() => toggleSetting(item.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#7652D6]/20 ${
                  isChecked ? 'bg-[#6946C7]' : 'bg-[#DCD9E6]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    isChecked ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Booking Link Info Box */}
      <div className="mt-4 p-3 sm:p-3.5 rounded-lg bg-[#FAF7FD] border border-[#EFEBF6] flex items-center justify-between gap-3">
        <p className="text-xs text-[#8490A8]">
          <span>Your booking link: </span>
          <span className="font-semibold text-[#17213B]">
            sereva.com/book/serene-studio
          </span>
        </p>

        <button
          type="button"
          onClick={handleCopyLink}
          className="text-[#8490A8] hover:text-[#6946C7] p-1 rounded transition-colors"
          title="Copy link"
          aria-label="Copy booking link"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#13A58B]" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

