'use client';

import React, { useState } from 'react';
import { Plus, User, X, Check } from 'lucide-react';

export function StaffHeader() {
  const [modalOpen, setModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [done, setDone] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setTimeout(() => {
      setAdding(false);
      setDone(true);
      setTimeout(() => {
        setDone(false);
        setModalOpen(false);
      }, 1200);
    }, 1200);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-[26px] font-bold text-[#17213B] tracking-tight">
            Staff & services
          </h1>
          <p className="text-xs sm:text-[13px] text-[#8490A8] mt-1">
            Manage your team, services and studio availability.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#6946C7] hover:bg-[#5b3cb2] text-white text-xs sm:text-[13px] font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add team member</span>
          </button>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17213B]/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl border border-[#EAE8F2] p-5 max-w-sm w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EDE5FF] flex items-center justify-center text-[#7048D8]">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#17213B]">
                    Add Team Member
                  </h3>
                  <p className="text-[11px] text-[#8490A8]">
                    Invite a provider or specialist
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

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#17213B] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mia Chen"
                  required
                  className="w-full bg-white border border-[#E9E7F0] rounded-lg px-3 py-2 text-xs text-[#17213B] focus:border-[#7652D6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#17213B] mb-1">
                  Role / Specialization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Massage Therapist"
                  required
                  className="w-full bg-white border border-[#E9E7F0] rounded-lg px-3 py-2 text-xs text-[#17213B] focus:border-[#7652D6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#17213B] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  required
                  className="w-full bg-white border border-[#E9E7F0] rounded-lg px-3 py-2 text-xs text-[#17213B] focus:border-[#7652D6] focus:outline-none"
                />
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
                  disabled={adding || done}
                  className="flex-1 py-2 bg-[#6946C7] hover:bg-[#5b3cb2] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                >
                  {done ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <span>{adding ? 'Adding...' : 'Add specialist'}</span>
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

