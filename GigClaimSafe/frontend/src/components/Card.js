export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 transition-shadow hover:shadow-lg ${className}`}>
      {children}
    </div>
  );
}
