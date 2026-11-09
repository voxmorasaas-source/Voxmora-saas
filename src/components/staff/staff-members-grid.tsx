'use client';

import React, { useState } from 'react';
import { X, Calendar, Mail, Phone } from 'lucide-react';

interface StaffMember {
  id: string;
  initials: string;
  name: string;
  role: string;
  appointments: number;
  utilization: number;
  email: string;
  phone: string;
}

const staffMembers: StaffMember[] = [
  {
    id: '1',
    initials: 'SC',
    name: 'Sophie Carter',
    role: 'Senior Esthetician',
    appointments: 32,
    utilization: 92,
    email: 'sophie@sereva.com',
    phone: '+1 (415) 555-0142',
  },
  {
    id: '2',
    initials: 'MC',
    name: 'Mia Chen',
    role: 'Massage Therapist',
    appointments: 28,
    utilization: 88,
    email: 'mia@sereva.com',
    phone: '+1 (415) 555-0189',
  },
  {
    id: '3',
    initials: 'CW',
    name: 'Chloe Williams',
    role: 'Nail Specialist',
    appointments: 24,
    utilization: 95,
    email: 'chloe@sereva.com',
    phone: '+1 (415) 555-0177',
  },
];

export function StaffMembersGrid() {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {staffMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-[#E9E7F0] rounded-[10px] p-4.5 shadow-2xs hover:border-[#D8CFEE] transition-colors flex flex-col justify-between"
          >
            <div>
              {/* Top Avatar & Name Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#EDE5FF] text-[#7048D8] font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {member.initials}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs sm:text-[13px] font-bold text-[#17213B] leading-tight truncate">
                    {member.name}
                  </p>
                  <p className="text-[11px] text-[#8490A8] truncate mt-0.5">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Appointments & Utilization Metrics */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#8490A8]">
                  <span>{member.appointments} appointments</span>
                  <span>{member.utilization}% utilization</span>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-[#EEEAF3] rounded-full overflow-hidden mb-3.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7652D6] via-[#A855F7] to-[#F472B6] transition-all duration-500 ease-out"
                    style={{ width: `${member.utilization}%` }}
                  />
                </div>
              </div>
            </div>

            {/* View Profile Action */}
            <button
              type="button"
              onClick={() => setSelectedStaff(member)}
              className="w-full py-1.5 text-xs font-semibold text-[#17213B] bg-white border border-[#EAE8F2] rounded-lg shadow-2xs hover:border-[#D8CFEE] transition-colors text-center"
            >
              View profile
            </button>
          </div>
        ))}
      </div>

      {/* Staff Profile Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17213B]/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl border border-[#EAE8F2] p-5 max-w-sm w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EDE5FF] text-[#7048D8] font-bold text-xs flex items-center justify-center shadow-2xs">
                  {selectedStaff.initials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#17213B]">
                    {selectedStaff.name}
                  </h3>
                  <p className="text-[11px] text-[#8490A8]">
                    {selectedStaff.role}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStaff(null)}
                className="text-[#8490A8] hover:text-[#17213B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[#17213B] bg-[#FAF7FD] border border-[#EFEBF6] rounded-lg p-3.5 mb-4">
              <div className="flex items-center gap-2 text-[#66708A]">
                <Mail className="w-3.5 h-3.5" />
                <span>{selectedStaff.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[#66708A]">
                <Phone className="w-3.5 h-3.5" />
                <span>{selectedStaff.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-[#66708A]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Available Mon, Tue, Thu, Fri (9:00 AM - 5:00 PM)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedStaff(null)}
              className="w-full py-2 bg-[#6946C7] hover:bg-[#5b3cb2] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

