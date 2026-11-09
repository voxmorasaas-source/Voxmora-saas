'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface ServiceItem {
  id: string;
  service: string;
  category: string;
  duration: string;
  price: string;
  status: 'Active' | 'Inactive';
}

const initialServices: ServiceItem[] = [
  {
    id: '1',
    service: 'Signature Facial',
    category: 'Facials',
    duration: '60 min',
    price: '$95',
    status: 'Active',
  },
  {
    id: '2',
    service: 'Deep Tissue Massage',
    category: 'Massage',
    duration: '60 min',
    price: '$120',
    status: 'Active',
  },
  {
    id: '3',
    service: 'Hydrating Facial',
    category: 'Facials',
    duration: '45 min',
    price: '$85',
    status: 'Active',
  },
  {
    id: '4',
    service: 'Body Treatment',
    category: 'Body',
    duration: '90 min',
    price: '$150',
    status: 'Active',
  },
  {
    id: '5',
    service: 'Manicure & Pedicure',
    category: 'Nails',
    duration: '75 min',
    price: '$75',
    status: 'Active',
  },
  {
    id: '6',
    service: 'Aromatherapy',
    category: 'Massage',
    duration: '60 min',
    price: '$110',
    status: 'Active',
  },
];

export function ServiceCatalogTable() {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setServices((prev) =>
      prev.map((s) => (s.id === editingService.id ? editingService : s))
    );
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setEditingService(null);
    }, 1000);
  };

  return (
    <>
      <div className="bg-white border border-[#E9E7F0] rounded-[10px] p-4 sm:p-5 mb-8 shadow-2xs">
        <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-4">
          Service catalog
        </h2>

        {/* Table Container with Horizontal Scroll for Mobile */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[620px] px-4 sm:px-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F4F1FA] text-[10px] uppercase tracking-wider font-semibold text-[#8490A8]">
                  <th className="pb-3 font-semibold">SERVICE</th>
                  <th className="pb-3 font-semibold">CATEGORY</th>
                  <th className="pb-3 font-semibold">DURATION</th>
                  <th className="pb-3 font-semibold">PRICE</th>
                  <th className="pb-3 font-semibold">STATUS</th>
                  <th className="pb-3 font-semibold text-right"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F1FA] text-xs">
                {services.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-[#FAF9FD] transition-colors group"
                  >
                    <td className="py-3 font-semibold text-[#17213B]">
                      {row.service}
                    </td>
                    <td className="py-3 text-[#8490A8]">{row.category}</td>
                    <td className="py-3 text-[#8490A8]">{row.duration}</td>
                    <td className="py-3 text-[#8490A8] font-medium">{row.price}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF7F0] text-[#2FAE85]">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setEditingService(row)}
                        className="px-3 py-1 bg-white border border-[#EAE8F2] rounded-md text-xs font-medium text-[#17213B] hover:border-[#D8CFEE] transition-colors shadow-2xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17213B]/40 backdrop-blur-2xs">
          <div className="bg-white rounded-xl border border-[#EAE8F2] p-5 max-w-sm w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#17213B]">
                Edit Service · {editingService.service}
              </h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="text-[#8490A8] hover:text-[#17213B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#17213B] mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  value={editingService.service}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      service: e.target.value,
                    })
                  }
                  required
                  className="w-full bg-white border border-[#E9E7F0] rounded-lg px-3 py-2 text-xs text-[#17213B] focus:border-[#7652D6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#17213B] mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingService.duration}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        duration: e.target.value,
                      })
                    }
                    required
                    className="w-full bg-white border border-[#E9E7F0] rounded-lg px-3 py-2 text-xs text-[#17213B] focus:border-[#7652D6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#17213B] mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        price: e.target.value,
                      })
                    }
                    required
                    className="w-full bg-white border border-[#E9E7F0] rounded-lg px-3 py-2 text-xs text-[#17213B] focus:border-[#7652D6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
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
                      <span>Updated</span>
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

