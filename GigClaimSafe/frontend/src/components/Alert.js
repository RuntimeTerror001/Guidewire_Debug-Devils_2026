export default function Alert({ type = 'info', message, children }) {
  const alertStyles = {
    success: 'bg-green-50 border border-green-200 text-green-700',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-700',
    danger: 'bg-red-50 border border-red-200 text-red-700',
    info: 'bg-blue-50 border border-blue-200 text-blue-700',
  };

  return (
    <div className={`px-4 py-3 rounded ${alertStyles[type]}`}>
      {message && <p>{message}</p>}
      {children}
    </div>
  );
}
