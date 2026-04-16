interface RiskBadgeProps {
  label: 'Low' | 'Medium' | 'High';
  score: number;
}

const variant = {
  Low: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-red-100 text-red-700',
};

export default function RiskBadge({ label, score }: RiskBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold ${variant[label]}`}>
      <span>{score.toFixed(2)}</span>
      <span>{label}</span>
    </div>
  );
}
