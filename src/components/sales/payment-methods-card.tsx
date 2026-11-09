'use client';

import React from 'react';

interface PaymentMethodItem {
  name: string;
  percentage: number;
}

const paymentMethods: PaymentMethodItem[] = [
  { name: 'Credit / debit card', percentage: 68 },
  { name: 'Cash', percentage: 20 },
  { name: 'Gift cards', percentage: 8 },
  { name: 'Other', percentage: 4 },
];

export function PaymentMethodsCard() {
  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-6 mb-4 shadow-2xs">
      <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-4">
        Payment methods
      </h2>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.name} className="space-y-1.5">
            {/* Label & Percentage */}
            <div className="flex items-center justify-between text-xs text-[#8490A8]">
              <span className="font-medium text-[#8490A8]">{method.name}</span>
              <span className="font-semibold text-[#8490A8]">{method.percentage}%</span>
            </div>

            {/* Progress Track & Gradient Fill */}
            <div className="h-1.5 w-full bg-[#EEEAF3] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7652D6] via-[#A855F7] to-[#F472B6] transition-all duration-500 ease-out"
                style={{ width: `${method.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

