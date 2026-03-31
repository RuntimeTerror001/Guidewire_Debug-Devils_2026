export default function RiskBadge({ level }) {
  const styles = {
    low: 'bg-green-100 text-green-800 border border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    high: 'bg-red-100 text-red-800 border border-red-300',
  };

  const icons = {
    low: '✓',
    medium: '!',
    high: '⚠️',
  };

  return (
    <span className={`px-3 py-1 rounded-full font-semibold text-sm ${styles[level]}`}>
      {icons[level]} {level.toUpperCase()}
    </span>
  );
}
