'use client';

import { X } from 'lucide-react';

interface DisruptionBannerProps {
  city: string;
  triggerType: string;
  value: number;
  onClaim: () => void;
  onClose?: () => void;
}

export default function DisruptionBanner({ city, triggerType, value, onClaim, onClose }: DisruptionBannerProps) {
  return (
    <div className="mb-8 rounded-[1.75rem] border border-red-100 bg-red-50 p-6 text-slate-950 shadow-sm md:flex md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        <div className="mt-1 rounded-3xl bg-red-600/10 px-3 py-2 text-red-700 font-bold">⚠️</div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-700">Disruption Active</p>
          <h2 className="mt-2 text-xl font-semibold">Heavy {triggerType} detected in {city}</h2>
          <p className="mt-1 text-sm text-slate-600">Live alert threshold crossed with a reading of {value}.</p>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3 md:mt-0 md:flex-row md:items-center">
        <button onClick={onClaim} className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
          Claim Now
        </button>
        {onClose ? (
          <button onClick={onClose} className="rounded-xl border border-red-200 bg-white px-6 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50">
            Dismiss
          </button>
        ) : null}
      </div>
    </div>
  );
}
