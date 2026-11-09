'use client';

import React, { useState } from 'react';
import { ArrowRight, X, Check } from 'lucide-react';

interface SettingCategory {
  id: string;
  title: string;
  subtitle: string;
}

const settingCategories: SettingCategory[] = [
  {
    id: 'business-profile',
    title: 'Business profile',
    subtitle: 'Studio name, address, contact information',
  },
  {
    id: 'opening-hours',
    title: 'Opening hours',
    subtitle: 'Set your weekly availability',
  },
  {
    id: 'locations',
    title: 'Locations',
    subtitle: 'Manage your studio locations',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Email, SMS and push preferences',
  },
  {
    id: 'integrations',
    title: 'Integrations',
    subtitle: 'Payments, calendar, phone and marketing',
  },
  {
    id: 'team-permissions',
    title: 'Team permissions',
    subtitle: 'Roles and access controls',
  },
  {
    id: 'ai-receptionist',
    title: 'AI receptionist',
    subtitle: 'Phone number, knowledge base and voice',
  },
];

export function StudioSettingsCard() {
  const [selectedSetting, setSelectedSetting] = useState<SettingCategory | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSelectedSetting(null);
    }, 1000);
  };

  return (
    <>
      <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-6 mb-8 shadow-2xs">
        <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-4">
          Studio settings
        </h2>

        {/* 7 Setting Rows */}
        <div className="divide-y divide-[#F4F1FA]">
          {settingCategories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedSetting(item)}
              className="w-full flex items-center justify-between py-3.5 first:pt-1 last:pb-2 text-left hover:bg-[#FAF9FD] px-2 -mx-2 rounded-lg transition-colors group"
            >
              <div>
                <p className="text-xs sm:text-[13px] font-medium text-[#17213B] group-hover:text-[#6946C7] transition-colors">
                  {item.title}
                </p>
                <p className="text-[11px] text-[#8490A8] mt-0.5">
                  {item.subtitle}
                </p>
              </div>

              <ArrowRight className="w-4 h-4 text-[#8490A8] group-hover:text-[#6946C7] transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Setting Drawer/Modal */}
      {selectedSetting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17213B]/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl border border-[#EAE8F2] p-5 max-w-sm w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#17213B]">
                  {selectedSetting.title}
                </h3>
                <p className="text-[11px] text-[#8490A8]">
                  {selectedSetting.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSetting(null)}
                className="text-[#8490A8] hover:text-[#17213B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#17213B] mb-1">
                  Studio Name
                </label>
                <input
                  type="text"
                  defaultValue="Sereva Spa & Wellness"
                  className="w-full bg-white border border-[#E9E7F0] rounded-lg px-3 py-2 text-xs text-[#17213B] focus:border-[#7652D6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#17213B] mb-1">
                  Primary Contact Email
                </label>
                <input
                  type="email"
                  defaultValue="sophie@sereva.com"
                  className="w-full bg-white border border-[#E9E7F0] rounded-lg px-3 py-2 text-xs text-[#17213B] focus:border-[#7652D6] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSetting(null)}
                  className="flex-1 py-2 text-xs font-semibold text-[#66708A] hover:bg-[#F4F1FA] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#6946C7] hover:bg-[#5b3cb2] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {saved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <span>Save changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

