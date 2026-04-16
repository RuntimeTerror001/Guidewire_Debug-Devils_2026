interface FraudBadgeProps {
  status: 'CLEAN' | 'SUSPICIOUS' | 'BLOCKED';
  flags?: string[];
}

const styleMap = {
  CLEAN: 'bg-slate-100 text-slate-700',
  SUSPICIOUS: 'bg-amber-100 text-amber-800',
  BLOCKED: 'bg-red-100 text-red-700',
};

const labelMap = {
  CLEAN: '✓ Clean',
  SUSPICIOUS: '⚠ Review',
  BLOCKED: '🚫 Blocked',
};

export default function FraudBadge({ status, flags = [] }: FraudBadgeProps) {
  return (
    <div className={`inline-flex flex-col gap-1 rounded-full px-3 py-2 text-xs font-semibold ${styleMap[status]}`} title={flags.join(', ')}>
      <span>{labelMap[status]}</span>
      {flags.length > 0 ? <span className="text-[10px] text-slate-500">{flags.join(', ')}</span> : null}
    </div>
  );
}
