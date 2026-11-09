'use client';

import React from 'react';

const popularServices = [
  { name: 'Signature Facial', price: '$95' },
  { name: 'Deep Tissue Massage', price: '$120' },
  { name: 'Hydrating Facial', price: '$85' },
];

export function BookingWebsiteCard() {
  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-6 mb-4 shadow-2xs">
      <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-4">
        Your booking website
      </h2>

      {/* Website Live Preview Mockup */}
      <div className="border border-[#EFEBF6] rounded-[10px] overflow-hidden">
        {/* Hero Section of the Website */}
        <div className="bg-[#F7F2FD] py-8 px-4 text-center border-b border-[#EFEBF6]/70">
          <p className="text-[11px] font-semibold tracking-[0.35em] text-[#8490A8] uppercase mb-3">
            S E R E V A
          </p>

          <h3 className="text-xl sm:text-[22px] font-semibold text-[#17213B] tracking-tight mb-1.5">
            A moment just for you.
          </h3>

          <p className="text-xs text-[#8490A8] mb-4">
            Your wellness journey starts here.
          </p>

          <button
            type="button"
            className="px-4 py-2 bg-[#6946C7] hover:bg-[#5b3cb2] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            Book an appointment
          </button>
        </div>

        {/* Popular Services Section */}
        <div className="bg-white p-4 sm:p-5">
          <h4 className="text-xs sm:text-[13px] font-bold text-[#17213B] mb-3">
            Popular services
          </h4>

          <div className="divide-y divide-[#F4F1FA]">
            {popularServices.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between py-2.5 text-xs text-[#8490A8]"
              >
                <span>{service.name}</span>
                <span>{service.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

