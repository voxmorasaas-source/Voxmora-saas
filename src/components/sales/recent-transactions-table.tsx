'use client';

import React from 'react';

interface TransactionRow {
  id: string;
  transaction: string;
  client: string;
  date: string;
  method: string;
  amount: string;
  status: 'Paid' | 'Refunded';
}

const transactionsData: TransactionRow[] = [
  {
    id: '1',
    transaction: '#SR-2048',
    client: 'Emma Wilson',
    date: 'Nov 2, 2026',
    method: 'Visa ···· 4242',
    amount: '$95',
    status: 'Paid',
  },
  {
    id: '2',
    transaction: '#SR-2047',
    client: 'Olivia Brown',
    date: 'Nov 2, 2026',
    method: 'Mastercard ···· 1188',
    amount: '$120',
    status: 'Paid',
  },
  {
    id: '3',
    transaction: '#SR-2046',
    client: 'Ava Martinez',
    date: 'Nov 2, 2026',
    method: 'Cash',
    amount: '$85',
    status: 'Paid',
  },
  {
    id: '4',
    transaction: '#SR-2045',
    client: 'Isabella Lee',
    date: 'Nov 1, 2026',
    method: 'Visa ···· 4242',
    amount: '$150',
    status: 'Paid',
  },
  {
    id: '5',
    transaction: '#SR-2044',
    client: 'Mia Johnson',
    date: 'Nov 1, 2026',
    method: 'Gift card',
    amount: '$75',
    status: 'Refunded',
  },
];

export function RecentTransactionsTable() {
  return (
    <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-5 mb-8 shadow-2xs">
      <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-4">
        Recent transactions
      </h2>

      {/* Table Container with Horizontal Scroll for Mobile */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[620px] px-4 sm:px-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F4F1FA] text-[10px] uppercase tracking-wider font-semibold text-[#8490A8]">
                <th className="pb-3 font-semibold">TRANSACTION</th>
                <th className="pb-3 font-semibold">CLIENT</th>
                <th className="pb-3 font-semibold">DATE</th>
                <th className="pb-3 font-semibold">METHOD</th>
                <th className="pb-3 font-semibold">AMOUNT</th>
                <th className="pb-3 font-semibold">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F1FA] text-xs">
              {transactionsData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#FAF9FD] transition-colors group"
                >
                  <td className="py-3 text-[#8490A8] font-medium">
                    {row.transaction}
                  </td>
                  <td className="py-3 font-semibold text-[#17213B]">
                    {row.client}
                  </td>
                  <td className="py-3 text-[#8490A8]">{row.date}</td>
                  <td className="py-3 text-[#8490A8]">{row.method}</td>
                  <td className="py-3 font-semibold text-[#17213B]">
                    {row.amount}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        row.status === 'Paid'
                          ? 'bg-[#EAF7F0] text-[#2FAE85]'
                          : 'bg-[#FEF4E8] text-[#D97706]'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

