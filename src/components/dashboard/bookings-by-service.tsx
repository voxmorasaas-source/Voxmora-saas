import React from 'react';

interface ServiceBooking {
  name: string;
  percentage: number;
}

const servicesData: ServiceBooking[] = [
  { name: 'Facials', percentage: 68 },
  { name: 'Massage', percentage: 52 },
  { name: 'Nail care', percentage: 40 },
  { name: 'Body treatments', percentage: 30 },
];

export function BookingsByService() {
  return (
    <div className="bg-white border border-[#E9E5F0] rounded-xl p-4 sm:p-5 mb-8 shadow-2xs">
      <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-4">
        Bookings by service
      </h2>

      <div className="space-y-4">
        {servicesData.map((service) => (
          <div key={service.name} className="space-y-1.5">
            {/* Label and Percentage */}
            <div className="flex items-center justify-between text-xs text-[#858197]">
              <span className="font-medium text-[#858197]">{service.name}</span>
              <span className="font-semibold text-[#858197]">{service.percentage}%</span>
            </div>

            {/* Progress Track & Gradient Fill */}
            <div className="h-1.5 w-full bg-[#EEEAF3] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7652D6] via-[#A855F7] to-[#F472B6] transition-all duration-500 ease-out"
                style={{ width: `${service.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

