import React from 'react';
import { Plus, Check, DollarSign } from 'lucide-react';

interface ActivityItem {
  id: string;
  icon: 'plus' | 'payment' | 'check';
  text: string;
  time: string;
}

const activities: ActivityItem[] = [
  {
    id: '1',
    icon: 'plus',
    text: 'Mira AI booked a Signature Facial for Emma Wilson',
    time: '10 min ago',
  },
  {
    id: '2',
    icon: 'payment',
    text: 'Payment received from Olivia Brown',
    time: '32 min ago',
  },
  {
    id: '3',
    icon: 'check',
    text: 'Follow-up call completed with an absent client',
    time: '1 hr ago',
  },
];

export function RecentActivity() {
  return (
    <div className="bg-white border border-[#E9E5F0] rounded-xl p-4 sm:p-5 mb-3 shadow-2xs">
      <h2 className="text-[15px] font-bold text-[#17213B] tracking-tight mb-3">
        Recent activity
      </h2>

      <div className="space-y-2.5">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-2.5 text-xs text-[#858197] py-1"
          >
            {/* Small Muted Icon */}
            <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[#858197]">
              {activity.icon === 'plus' && <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
              {activity.icon === 'payment' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              {activity.icon === 'check' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
            </div>

            {/* Description & Inline Timestamp */}
            <div className="flex-1 truncate">
              <span className="text-[#858197]">{activity.text}</span>
              <span className="text-[#9995AA] ml-1.5 font-normal">· {activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

