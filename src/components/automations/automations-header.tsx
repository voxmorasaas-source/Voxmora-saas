'use client';

import React, { useState } from 'react';
import { Plus, Sparkles, X, Zap } from 'lucide-react';

export function AutomationsHeader() {
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      setModalOpen(false);
    }, 1500);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-[26px] font-bold text-[#17213B] tracking-tight">
            Automations
          </h1>
          <p className="text-xs sm:text-[13px] text-[#8490A8] mt-1">
            Create thoughtful customer journeys that run automatically.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#6946C7] hover:bg-[#5b3cb2] text-white text-xs sm:text-[13px] font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New automation</span>
          </button>
        </div>
      </div>

      {/* New Automation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17213B]/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl border border-[#EAE8F2] p-5 max-w-sm w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EDE5FF] flex items-center justify-center text-[#7048D8]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#17213B]">
                    New Automated Journey
                  </h3>
                  <p className="text-[11px] text-[#8490A8]">
                    Configure an AI-driven sequence
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#8490A8] hover:text-[#17213B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-[#17213B] mb-1">
                  Journey Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. VIP Win-back Sequence"
                  required
                  className="w-full bg-white border border-[#E9E7F0] rounded-lg px-3 py-2 text-xs text-[#17213B] focus:border-[#7652D6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#17213B] mb-1">
                  Trigger Event
                </label>
                <select className="w-full bg-white border border-[#E9E7F0] rounded-lg px-3 py-2 text-xs text-[#17213B] focus:border-[#7652D6] focus:outline-none">
                  <option>Client missed an appointment</option>
                  <option>No booking in 60 days</option>
                  <option>Appointment completed</option>
                  <option>New client registered</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-[#66708A] hover:bg-[#F4F1FA] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2 bg-[#6946C7] hover:bg-[#5b3cb2] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{creating ? 'Creating...' : 'Create journey'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

