import React from 'react';

export type ClientSegment = 'VIP' | 'Regular' | 'New';

interface ClientSegmentBadgeProps {
  segment: ClientSegment;
}

export function ClientSegmentBadge({ segment }: ClientSegmentBadgeProps) {
  const styles: Record<ClientSegment, { bg: string; text: string }> = {
    VIP: {
      bg: 'bg-[#E7F7F0]',
      text: 'text-[#2FAE85]',
    },
    Regular: {
      bg: 'bg-[#F0EAFE]',
      text: 'text-[#6946C7]',
    },
    New: {
      bg: 'bg-[#F0EAFE]',
      text: 'text-[#6946C7]',
    },
  };

  const current = styles[segment] || styles.Regular;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${current.bg} ${current.text}`}
    >
      {segment}
    </span>
  );
}

